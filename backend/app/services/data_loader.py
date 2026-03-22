from __future__ import annotations

from functools import lru_cache
from pathlib import Path
from typing import Any

import numpy as np
import pandas as pd

from app.core.config import CSV_PATH, DICTIONARY_PATH

COLUMNAS_DICCIONARIO = {
    'cod_rama': ('rama_id', 'rama'),
    'cod_disciplina': ('disciplina_id', 'disciplina'),
    'cod_titulo': ('tipo_titulo_id', 'tipo_titulo'),
    'cod_gestion': ('gestion_id', 'gestion'),
    'cod_genero': ('genero_id', 'genero'),
    'cod_region': ('region_id', 'region'),
    'cod_tamaño': ('tamaño_id', 'tamaño'),
    'cod_letra': ('letra_id', 'letra'),
}


class DataRepository:
    def __init__(self, csv_path: str | Path, dictionary_path: str | Path) -> None:
        self.csv_path = Path(csv_path)
        self.dictionary_path = Path(dictionary_path)
        self.df = self._load_dataset()

    def _load_dataset(self) -> pd.DataFrame:
        if not self.csv_path.exists():
            raise FileNotFoundError(f'No se encontró el archivo CSV en {self.csv_path}')
        if not self.dictionary_path.exists():
            raise FileNotFoundError(f'No se encontró el diccionario en {self.dictionary_path}')

        df = pd.read_csv(self.csv_path)
        dictionaries = self._load_dictionaries()
        df = self._enrich_dataset(df, dictionaries)

        # Strings normales — se usan en groupby, no pueden ser category
        cols_string = ['rama', 'disciplina', 'gestion', 'genero', 'region']
        for col in cols_string:
            if col in df.columns:
                df[col] = df[col].fillna('Sin dato')

        # Categoricas seguras — no se usan como clave de groupby
        cols_categoricas = ['tipo_titulo', 'tamaño', 'letra', 'tramo_edad_egreso']
        for col in cols_categoricas:
            if col in df.columns:
                df[col] = df[col].fillna('Sin dato').astype('category')

        # Enteros pequeños
        for col in ['rama_id', 'disciplina_id', 'gestion_id', 'genero_id', 'region_id',
                    'tipo_titulo_id', 'tamaño_id', 'letra_id', 'empleo_formal']:
            if col in df.columns:
                df[col] = pd.to_numeric(df[col], downcast='integer')

        # Años como int16
        for col in ['anio', 'anionac', 'anioegreso']:
            if col in df.columns:
                df[col] = df[col].astype('Int16')

        # Salario como float32
        if 'salario' in df.columns:
            df['salario'] = df['salario'].astype('float32')

        return df

    def _load_dictionaries(self) -> dict[str, pd.DataFrame]:
        excel = pd.ExcelFile(self.dictionary_path)
        return {sheet: pd.read_excel(excel, sheet_name=sheet) for sheet in excel.sheet_names}

    def _enrich_dataset(self, df: pd.DataFrame, dictionaries: dict[str, pd.DataFrame]) -> pd.DataFrame:
        for sheet_name, (id_column, label_column) in COLUMNAS_DICCIONARIO.items():
            if sheet_name not in dictionaries or id_column not in df.columns:
                continue
            table = dictionaries[sheet_name][[id_column, label_column]].drop_duplicates()
            df = df.merge(table, how='left', on=id_column)

        df['empleo_formal'] = df['salario'].notna().astype(int)
        df['edad'] = df['anio'] - df['anionac']
        df['edad_al_egreso'] = df['anioegreso'] - df['anionac']

        bins = [0, 24, 29, 34, 44, np.inf]
        labels = ['Hasta 24', '25-29', '30-34', '35-44', '45 o más']
        df['tramo_edad_egreso'] = pd.cut(
            df['edad_al_egreso'], bins=bins, labels=labels, include_lowest=True
        ).astype('string')

        return df

    def get_dataframe(self) -> pd.DataFrame:
        return self.df

    def get_metadata(self) -> dict[str, Any]:
        years = sorted(self.df['anio'].dropna().astype(int).unique().tolist())
        return {
            'registros': int(len(self.df)),
            'columnas': int(self.df.shape[1]),
            'anios': years,
            'anio_min': min(years),
            'anio_max': max(years),
            'disciplinas': int(self.df['disciplina'].nunique(dropna=True)),
            'ramas': int(self.df['rama'].nunique(dropna=True)),
            'regiones': int(self.df['region'].nunique(dropna=True)),
        }


@lru_cache
def get_repository() -> DataRepository:
    return DataRepository(CSV_PATH, DICTIONARY_PATH)
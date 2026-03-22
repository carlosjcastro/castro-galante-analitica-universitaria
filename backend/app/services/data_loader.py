from __future__ import annotations

from functools import lru_cache
from pathlib import Path
from typing import Any

import numpy as np
import pandas as pd

from app.core.config import CSV_PATH, DICTIONARY_PATH

COLUMNAS_DICCIONARIO = {
    "cod_rama": ("rama_id", "rama"),
    "cod_disciplina": ("disciplina_id", "disciplina"),
    "cod_titulo": ("tipo_titulo_id", "tipo_titulo"),
    "cod_gestion": ("gestion_id", "gestion"),
    "cod_genero": ("genero_id", "genero"),
    "cod_region": ("region_id", "region"),
}

COLUMNAS_NECESARIAS = [
    "id",
    "anio",
    "anionac",
    "anioegreso",
    "salario",
    "rama_id",
    "disciplina_id",
    "tipo_titulo_id",
    "gestion_id",
    "genero_id",
    "region_id",
]

DTYPES_CSV = {
    "id": "int32",
    "anio": "int16",
    "anionac": "int16",
    "anioegreso": "int16",
    "salario": "float32",
    "rama_id": "Int16",
    "disciplina_id": "Int32",
    "tipo_titulo_id": "Int16",
    "gestion_id": "Int16",
    "genero_id": "Int16",
    "region_id": "Int16",
}


class DataRepository:
    def __init__(self, csv_path: str | Path, dictionary_path: str | Path) -> None:
        self.csv_path = Path(csv_path)
        self.dictionary_path = Path(dictionary_path)
        self.df = self._load_dataset()

    def _load_dataset(self) -> pd.DataFrame:
        if not self.csv_path.exists():
            raise FileNotFoundError(f"No se encontró el archivo CSV en {self.csv_path}")
        if not self.dictionary_path.exists():
            raise FileNotFoundError(f"No se encontró el diccionario en {self.dictionary_path}")

        df = pd.read_csv(
            self.csv_path,
            usecols=lambda col: col in COLUMNAS_NECESARIAS,
            dtype=DTYPES_CSV,
        )

        dictionaries = self._load_dictionaries()
        df = self._enrich_dataset(df, dictionaries)

        columnas_categoricas = [
            "rama",
            "disciplina",
            "tipo_titulo",
            "gestion",
            "genero",
            "region",
            "tramo_edad_egreso",
        ]

        for columna in columnas_categoricas:
            if columna in df.columns:
                df[columna] = df[columna].fillna("Sin dato").astype("category")

        if "empleo_formal" in df.columns:
            df["empleo_formal"] = df["empleo_formal"].astype("int8")

        if "edad_al_egreso" in df.columns:
            df["edad_al_egreso"] = df["edad_al_egreso"].astype("float32")

        return df

    def _load_dictionaries(self) -> dict[str, pd.DataFrame]:
        required_sheets = list(COLUMNAS_DICCIONARIO.keys())
        excel = pd.ExcelFile(self.dictionary_path)

        dictionaries: dict[str, pd.DataFrame] = {}
        for sheet in required_sheets:
            if sheet not in excel.sheet_names:
                continue

            id_column, label_column = COLUMNAS_DICCIONARIO[sheet]
            table = pd.read_excel(
                excel,
                sheet_name=sheet,
                usecols=[id_column, label_column],
            ).drop_duplicates()

            dictionaries[sheet] = table

        return dictionaries

    def _enrich_dataset(
        self,
        df: pd.DataFrame,
        dictionaries: dict[str, pd.DataFrame],
    ) -> pd.DataFrame:
        result = df

        for sheet_name, (id_column, label_column) in COLUMNAS_DICCIONARIO.items():
            if sheet_name not in dictionaries or id_column not in result.columns:
                continue

            table = dictionaries[sheet_name]
            result = result.merge(table, how="left", on=id_column, copy=False)

        result["empleo_formal"] = result["salario"].notna().astype("int8")
        result["edad_al_egreso"] = (result["anioegreso"] - result["anionac"]).astype("float32")

        bins = [0, 24, 29, 34, 44, np.inf]
        labels = ["Hasta 24", "25-29", "30-34", "35-44", "45 o más"]

        result["tramo_edad_egreso"] = pd.cut(
            result["edad_al_egreso"],
            bins=bins,
            labels=labels,
            include_lowest=True,
        )

        return result

    def get_dataframe(self) -> pd.DataFrame:
        return self.df

    def get_metadata(self) -> dict[str, Any]:
        years = sorted(self.df["anio"].dropna().astype(int).unique().tolist())

        return {
            "registros": int(len(self.df)),
            "columnas": int(self.df.shape[1]),
            "anios": years,
            "anio_min": min(years),
            "anio_max": max(years),
            "disciplinas": int(self.df["disciplina"].nunique(dropna=True)),
            "ramas": int(self.df["rama"].nunique(dropna=True)),
            "regiones": int(self.df["region"].nunique(dropna=True)),
        }


@lru_cache(maxsize=1)
def get_repository() -> DataRepository:
    return DataRepository(CSV_PATH, DICTIONARY_PATH)
from __future__ import annotations

from pathlib import Path
from typing import Dict

import numpy as np
import pandas as pd


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


PALETA = {
    'azul': '#1d3557',
    'celeste': '#457b9d',
    'verde': '#2a9d8f',
    'arena': '#e9c46a',
    'naranja': '#f4a261',
    'rojo': '#e76f51',
    'gris': '#6c757d',
}


def cargar_dataset(ruta_csv: str | Path) -> pd.DataFrame:
    """Carga el dataset principal de Araucano."""
    ruta_csv = Path(ruta_csv)
    if not ruta_csv.exists():
        raise FileNotFoundError(f'No se encontro el archivo: {ruta_csv}')
    return pd.read_csv(ruta_csv)



def cargar_diccionarios(ruta_xlsx: str | Path) -> Dict[str, pd.DataFrame]:
    """Carga todas las hojas del diccionario en un diccionario de DataFrames."""
    ruta_xlsx = Path(ruta_xlsx)
    if not ruta_xlsx.exists():
        raise FileNotFoundError(f'No se encontro el archivo: {ruta_xlsx}')

    excel = pd.ExcelFile(ruta_xlsx)
    return {hoja: pd.read_excel(excel, sheet_name=hoja) for hoja in excel.sheet_names}



def enriquecer_dataset(df: pd.DataFrame, diccionarios: Dict[str, pd.DataFrame]) -> pd.DataFrame:
    """Agrega columnas descriptivas y variables derivadas utiles para el analisis."""
    resultado = df.copy()

    for hoja, (col_id, col_label) in COLUMNAS_DICCIONARIO.items():
        if hoja not in diccionarios or col_id not in resultado.columns:
            continue
        tabla = diccionarios[hoja][[col_id, col_label]].drop_duplicates()
        resultado = resultado.merge(tabla, how='left', on=col_id)

    resultado['empleo_formal'] = resultado['salario'].notna().astype(int)
    resultado['edad'] = resultado['anio'] - resultado['anionac']
    resultado['edad_al_egreso'] = resultado['anioegreso'] - resultado['anionac']

    bins = [0, 24, 29, 34, 44, np.inf]
    labels = ['Hasta 24', '25-29', '30-34', '35-44', '45 o mas']
    resultado['tramo_edad_egreso'] = pd.cut(
        resultado['edad_al_egreso'], bins=bins, labels=labels, include_lowest=True
    )

    return resultado



def porcentaje_faltantes(df: pd.DataFrame) -> pd.DataFrame:
    """Devuelve una tabla de porcentaje de faltantes por columna."""
    tabla = (
        df.isna()
        .mean()
        .mul(100)
        .sort_values(ascending=False)
        .rename('porcentaje_faltante')
        .reset_index()
    )
    tabla.columns = ['columna', 'porcentaje_faltante']
    return tabla



def formatear_pesos(valor: float | int | None) -> str:
    """Formatea numeros en pesos argentinos con separador local."""
    if pd.isna(valor):
        return 'Sin dato'
    return f"$ {valor:,.0f}".replace(',', 'X').replace('.', ',').replace('X', '.')



def tabla_resumen_2021(df: pd.DataFrame, grupo: str) -> pd.DataFrame:
    """Calcula graduados, tasa de empleo formal y salario mediano para 2021"""
    datos = df[df['anio'] == 2021].copy()
    tabla = (
        datos.groupby(grupo)
        .agg(
            graduados=('id', 'count'),
            tasa_empleo_formal=('empleo_formal', 'mean'),
            salario_mediano=('salario', 'median'),
        )
        .sort_values('tasa_empleo_formal', ascending=False)
    )
    return tabla



def construir_indice_oportunidad(df_2021: pd.DataFrame, minimo_graduados: int = 1000) -> pd.DataFrame:
    """Crea un indice compuesto que combina insercion laboral formal y salario mediano"""
    tabla = (
        df_2021.groupby('disciplina')
        .agg(
            graduados=('id', 'count'),
            tasa_empleo_formal=('empleo_formal', 'mean'),
            salario_mediano=('salario', 'median'),
            rama=('rama', 'first'),
        )
        .query('graduados >= @minimo_graduados')
        .copy()
    )

    for columna in ['tasa_empleo_formal', 'salario_mediano']:
        minimo = tabla[columna].min()
        maximo = tabla[columna].max()
        tabla[f'{columna}_normalizado'] = 100 * (tabla[columna] - minimo) / (maximo - minimo)

    tabla['indice_oportunidad'] = (
        0.55 * tabla['tasa_empleo_formal_normalizado']
        + 0.45 * tabla['salario_mediano_normalizado']
    )

    return tabla.sort_values('indice_oportunidad', ascending=False)

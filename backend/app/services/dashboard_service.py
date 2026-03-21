from __future__ import annotations

from typing import Iterable

import pandas as pd

from app.services.data_loader import get_repository


class DashboardService:
    def __init__(self) -> None:
        self.repository = get_repository()
        self.df = self.repository.get_dataframe()

    @staticmethod
    def _apply_list_filter(df: pd.DataFrame, column: str, values: list[int] | None) -> pd.DataFrame:
        if not values:
            return df
        return df[df[column].isin(values)]

    def filter_data(
        self,
        anios: list[int] | None = None,
        gestion_ids: list[int] | None = None,
        genero_ids: list[int] | None = None,
        region_ids: list[int] | None = None,
        disciplina_ids: list[int] | None = None,
        rama_ids: list[int] | None = None,
    ) -> pd.DataFrame:
        data = self.df.copy()
        data = self._apply_list_filter(data, 'anio', anios)
        data = self._apply_list_filter(data, 'gestion_id', gestion_ids)
        data = self._apply_list_filter(data, 'genero_id', genero_ids)
        data = self._apply_list_filter(data, 'region_id', region_ids)
        data = self._apply_list_filter(data, 'disciplina_id', disciplina_ids)
        data = self._apply_list_filter(data, 'rama_id', rama_ids)
        return data

    def get_filters(self) -> dict:
        return {
            'anios': sorted(self.df['anio'].dropna().astype(int).unique().tolist()),
            'gestiones': self._options('gestion_id', 'gestion'),
            'generos': self._options('genero_id', 'genero'),
            'regiones': self._options('region_id', 'region'),
            'disciplinas': self._options('disciplina_id', 'disciplina'),
            'ramas': self._options('rama_id', 'rama'),
        }

    def _options(self, id_column: str, label_column: str) -> list[dict]:
        table = (
            self.df[[id_column, label_column]]
            .dropna(subset=[id_column])
            .drop_duplicates()
            .sort_values(label_column)
        )
        return [
            {'id': int(row[id_column]), 'label': str(row[label_column])}
            for _, row in table.iterrows()
        ]

    def get_kpis(self, **filters) -> dict:
        data = self.filter_data(**filters)
        salarios_validos = data['salario'].dropna()
        return {
            'registros': int(len(data)),
            'graduados': int(data['id'].nunique()),
            'tasa_empleo_formal': round(float(data['empleo_formal'].mean() * 100), 2),
            'salario_promedio': round(float(salarios_validos.mean()), 2) if not salarios_validos.empty else None,
            'salario_mediano': round(float(salarios_validos.median()), 2) if not salarios_validos.empty else None,
            'edad_promedio_egreso': round(float(data['edad_al_egreso'].mean()), 2),
        }

    def get_yearly_evolution(self, **filters) -> list[dict]:
        data = self.filter_data(**filters)
        table = (
            data.groupby('anio', as_index=False)
            .agg(
                tasa_empleo_formal=('empleo_formal', lambda s: round(float(s.mean() * 100), 2)),
                salario_mediano=('salario', 'median'),
                graduados=('id', 'nunique'),
            )
            .sort_values('anio')
        )
        table['salario_mediano'] = table['salario_mediano'].round(2)
        return table.to_dict(orient='records')

    def get_management_summary(self, anio: int) -> list[dict]:
        data = self.filter_data(anios=[anio])
        table = (
            data.groupby('gestion', as_index=False)
            .agg(
                graduados=('id', 'nunique'),
                tasa_empleo_formal=('empleo_formal', lambda s: round(float(s.mean() * 100), 2)),
                salario_mediano=('salario', 'median'),
            )
            .sort_values('tasa_empleo_formal', ascending=False)
        )
        table['salario_mediano'] = table['salario_mediano'].round(2)
        return table.to_dict(orient='records')

    def get_gender_management_summary(self, anio: int) -> list[dict]:
        data = self.filter_data(anios=[anio])
        table = (
            data.groupby(['genero', 'gestion'], as_index=False)
            .agg(
                graduados=('id', 'nunique'),
                tasa_empleo_formal=('empleo_formal', lambda s: round(float(s.mean() * 100), 2)),
                salario_mediano=('salario', 'median'),
            )
            .sort_values(['genero', 'gestion'])
        )
        table['salario_mediano'] = table['salario_mediano'].round(2)
        return table.to_dict(orient='records')

    def get_region_employment(self, anio: int) -> list[dict]:
        data = self.filter_data(anios=[anio])
        table = (
            data.groupby('region', as_index=False)
            .agg(
                tasa_empleo_formal=('empleo_formal', lambda s: round(float(s.mean() * 100), 2)),
                graduados=('id', 'nunique'),
            )
            .sort_values('tasa_empleo_formal', ascending=False)
        )
        return table.to_dict(orient='records')

    def get_region_salary(self, anio: int) -> list[dict]:
        data = self.filter_data(anios=[anio]).dropna(subset=['salario'])
        table = (
            data.groupby('region', as_index=False)
            .agg(
                salario_mediano=('salario', 'median'),
                graduados=('id', 'nunique'),
            )
            .sort_values('salario_mediano', ascending=False)
        )
        table['salario_mediano'] = table['salario_mediano'].round(2)
        return table.to_dict(orient='records')

    def get_opportunity_index(self, anio: int, minimo_graduados: int = 1000) -> list[dict]:
        data = self.filter_data(anios=[anio])
        table = (
            data.groupby('disciplina')
            .agg(
                graduados=('id', 'nunique'),
                tasa_empleo_formal=('empleo_formal', 'mean'),
                salario_mediano=('salario', 'median'),
                rama=('rama', 'first'),
            )
            .query('graduados >= @minimo_graduados')
            .copy()
        )

        if table.empty:
            return []

        for column in ['tasa_empleo_formal', 'salario_mediano']:
            min_value = table[column].min()
            max_value = table[column].max()
            if pd.isna(min_value) or pd.isna(max_value) or min_value == max_value:
                table[f'{column}_normalizado'] = 100.0
            else:
                table[f'{column}_normalizado'] = 100 * (table[column] - min_value) / (max_value - min_value)

        table['indice_oportunidad'] = (
            0.55 * table['tasa_empleo_formal_normalizado']
            + 0.45 * table['salario_mediano_normalizado']
        )
        table['tasa_empleo_formal'] = (table['tasa_empleo_formal'] * 100).round(2)
        table['salario_mediano'] = table['salario_mediano'].round(2)
        table['indice_oportunidad'] = table['indice_oportunidad'].round(2)

        table = table.sort_values('indice_oportunidad', ascending=False).reset_index()
        return table.to_dict(orient='records')

    def get_scatter_disciplines(self, anio: int, minimo_graduados: int = 1000) -> list[dict]:
        data = self.filter_data(anios=[anio])
        table = (
            data.groupby('disciplina', as_index=False)
            .agg(
                graduados=('id', 'nunique'),
                tasa_empleo_formal=('empleo_formal', lambda s: round(float(s.mean() * 100), 2)),
                salario_mediano=('salario', 'median'),
                rama=('rama', 'first'),
            )
            .query('graduados >= @minimo_graduados')
            .sort_values('graduados', ascending=False)
        )
        table['salario_mediano'] = table['salario_mediano'].round(2)
        return table.to_dict(orient='records')

    def compare_disciplines(self, disciplina_ids: list[int]) -> list[dict]:
        if len(disciplina_ids) != 2:
            raise ValueError('Se deben enviar exactamente dos disciplinas para comparar.')

        data = self.filter_data(disciplina_ids=disciplina_ids)
        table = (
            data.groupby(['anio', 'disciplina'], as_index=False)
            .agg(
                graduados=('id', 'nunique'),
                tasa_empleo_formal=('empleo_formal', lambda s: round(float(s.mean() * 100), 2)),
                salario_mediano=('salario', 'median'),
            )
            .sort_values(['anio', 'disciplina'])
        )
        table['salario_mediano'] = table['salario_mediano'].round(2)
        return table.to_dict(orient='records')

from __future__ import annotations

from functools import lru_cache

from fastapi import APIRouter, HTTPException, Query

from app.services.dashboard_service import DashboardService

router = APIRouter(prefix="", tags=["dashboard"])


@lru_cache(maxsize=1)
def get_service() -> DashboardService:
    return DashboardService()


@router.get("/health")
def healthcheck() -> dict:
    return {"status": "ok"}


@router.get("/meta")
def get_meta() -> dict:
    return get_service().repository.get_metadata()


@router.get("/filters")
def get_filters() -> dict:
    return get_service().get_filters()


@router.get("/kpis")
def get_kpis(
    anios: list[int] | None = Query(default=None),
    gestion_ids: list[int] | None = Query(default=None),
    genero_ids: list[int] | None = Query(default=None),
    region_ids: list[int] | None = Query(default=None),
    disciplina_ids: list[int] | None = Query(default=None),
    rama_ids: list[int] | None = Query(default=None),
) -> dict:
    return get_service().get_kpis(
        anios=anios,
        gestion_ids=gestion_ids,
        genero_ids=genero_ids,
        region_ids=region_ids,
        disciplina_ids=disciplina_ids,
        rama_ids=rama_ids,
    )


@router.get("/charts/empleo-evolucion")
def get_yearly_evolution(
    gestion_ids: list[int] | None = Query(default=None),
    genero_ids: list[int] | None = Query(default=None),
    region_ids: list[int] | None = Query(default=None),
    disciplina_ids: list[int] | None = Query(default=None),
    rama_ids: list[int] | None = Query(default=None),
) -> list[dict]:
    return get_service().get_yearly_evolution(
        gestion_ids=gestion_ids,
        genero_ids=genero_ids,
        region_ids=region_ids,
        disciplina_ids=disciplina_ids,
        rama_ids=rama_ids,
    )


@router.get("/charts/gestion-resumen")
def get_management_summary(anio: int = 2021) -> list[dict]:
    return get_service().get_management_summary(anio=anio)


@router.get("/charts/genero-gestion")
def get_gender_management_summary(anio: int = 2021) -> list[dict]:
    return get_service().get_gender_management_summary(anio=anio)


@router.get("/charts/region-empleo")
def get_region_employment(anio: int = 2021) -> list[dict]:
    return get_service().get_region_employment(anio=anio)


@router.get("/charts/region-salario")
def get_region_salary(anio: int = 2021) -> list[dict]:
    return get_service().get_region_salary(anio=anio)


@router.get("/rankings/indice-oportunidad")
def get_opportunity_index(anio: int = 2021, minimo_graduados: int = 1000) -> list[dict]:
    return get_service().get_opportunity_index(anio=anio, minimo_graduados=minimo_graduados)


@router.get("/charts/scatter-disciplinas")
def get_scatter_disciplines(anio: int = 2021, minimo_graduados: int = 1000) -> list[dict]:
    return get_service().get_scatter_disciplines(anio=anio, minimo_graduados=minimo_graduados)


@router.get("/compare")
def compare_disciplines(disciplina_ids: list[int] = Query(...)) -> list[dict]:
    try:
        return get_service().compare_disciplines(disciplina_ids=disciplina_ids)
    except ValueError as error:
        raise HTTPException(status_code=400, detail=str(error)) from error
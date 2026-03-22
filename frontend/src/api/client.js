import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "",
  timeout: 30000,
});

export function buildParams(filters = {}) {
  const params = {};
  if (filters.anio) params.anios = Number(filters.anio);
  if (filters.gestionId) params.gestion_ids = Number(filters.gestionId);
  if (filters.generoId) params.genero_ids = Number(filters.generoId);
  if (filters.regionId) params.region_ids = Number(filters.regionId);
  if (filters.disciplinaId)
    params.disciplina_ids = Number(filters.disciplinaId);
  if (filters.ramaId) params.rama_ids = Number(filters.ramaId);
  return params;
}

function get(url, params, signal) {
  return api.get(url, { params, signal }).then((r) => r.data);
}

export const fetchMeta = (signal) => get("/api/v1/meta", {}, signal);
export const fetchFilters = (signal) => get("/api/v1/filters", {}, signal);

export const fetchKpis = (filters, signal) =>
  get("/api/v1/kpis", buildParams(filters), signal);
export const fetchYearlyEvolution = (filters, signal) =>
  get("/api/v1/charts/empleo-evolucion", buildParams(filters), signal);
export const fetchManagementSummary = (anio, signal) =>
  get("/api/v1/charts/gestion-resumen", { anio }, signal);
export const fetchGenderManagementSummary = (anio, signal) =>
  get("/api/v1/charts/genero-gestion", { anio }, signal);
export const fetchRegionEmployment = (anio, signal) =>
  get("/api/v1/charts/region-empleo", { anio }, signal);
export const fetchRegionSalary = (anio, signal) =>
  get("/api/v1/charts/region-salario", { anio }, signal);
export const fetchOpportunityIndex = (anio, minimo_graduados = 1000, signal) =>
  get(
    "/api/v1/rankings/indice-oportunidad",
    { anio, minimo_graduados },
    signal,
  );
export const fetchScatterDisciplines = (
  anio,
  minimo_graduados = 1000,
  signal,
) =>
  get("/api/v1/charts/scatter-disciplinas", { anio, minimo_graduados }, signal);

export function fetchCompare(disciplinaA, disciplinaB, signal) {
  const params = new URLSearchParams();
  params.append("disciplina_ids", disciplinaA);
  params.append("disciplina_ids", disciplinaB);
  return get(`/api/v1/compare?${params.toString()}`, {}, signal);
}

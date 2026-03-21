import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "",
  timeout: 90000,
});

export function buildParams(filters = {}) {
  const params = {};

  if (filters.anio) {
    params.anios = Number(filters.anio);
  }
  if (filters.gestionId) {
    params.gestion_ids = Number(filters.gestionId);
  }
  if (filters.generoId) {
    params.genero_ids = Number(filters.generoId);
  }
  if (filters.regionId) {
    params.region_ids = Number(filters.regionId);
  }
  if (filters.disciplinaId) {
    params.disciplina_ids = Number(filters.disciplinaId);
  }
  if (filters.ramaId) {
    params.rama_ids = Number(filters.ramaId);
  }

  return params;
}

export async function fetchMeta() {
  const { data } = await api.get("/api/v1/meta");
  return data;
}

export async function fetchFilters() {
  const { data } = await api.get("/api/v1/filters");
  return data;
}

export async function fetchKpis(filters) {
  const { data } = await api.get("/api/v1/kpis", {
    params: buildParams(filters),
  });
  return data;
}

export async function fetchYearlyEvolution(filters) {
  const { data } = await api.get("/api/v1/charts/empleo-evolucion", {
    params: buildParams(filters),
  });
  return data;
}

export async function fetchManagementSummary(anio) {
  const { data } = await api.get("/api/v1/charts/gestion-resumen", {
    params: { anio },
  });
  return data;
}

export async function fetchGenderManagementSummary(anio) {
  const { data } = await api.get("/api/v1/charts/genero-gestion", {
    params: { anio },
  });
  return data;
}

export async function fetchRegionEmployment(anio) {
  const { data } = await api.get("/api/v1/charts/region-empleo", {
    params: { anio },
  });
  return data;
}

export async function fetchRegionSalary(anio) {
  const { data } = await api.get("/api/v1/charts/region-salario", {
    params: { anio },
  });
  return data;
}

export async function fetchOpportunityIndex(anio, minimoGraduados = 1000) {
  const { data } = await api.get("/api/v1/rankings/indice-oportunidad", {
    params: { anio, minimo_graduados: minimoGraduados },
  });
  return data;
}

export async function fetchScatterDisciplines(anio, minimoGraduados = 1000) {
  const { data } = await api.get("/api/v1/charts/scatter-disciplinas", {
    params: { anio, minimo_graduados: minimoGraduados },
  });
  return data;
}

export async function fetchCompare(disciplinaA, disciplinaB) {
  const params = new URLSearchParams();
  params.append("disciplina_ids", disciplinaA);
  params.append("disciplina_ids", disciplinaB);
  const { data } = await api.get(`/api/v1/compare?${params.toString()}`);
  return data;
}

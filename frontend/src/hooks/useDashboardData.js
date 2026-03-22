import { useEffect, useMemo, useState } from "react";
import {
  fetchFilters,
  fetchGenderManagementSummary,
  fetchKpis,
  fetchManagementSummary,
  fetchMeta,
  fetchOpportunityIndex,
  fetchRegionEmployment,
  fetchRegionSalary,
  fetchScatterDisciplines,
  fetchYearlyEvolution,
} from "../api/client";

const initialFilters = {
  anio: "2021",
  gestionId: "",
  generoId: "",
  regionId: "",
  disciplinaId: "",
  ramaId: "",
};

const initialDashboard = {
  kpis: null,
  yearly: [],
  management: [],
  genderManagement: [],
  regionEmployment: [],
  regionSalary: [],
  opportunityIndex: [],
  scatter: [],
};

function ensureArray(value) {
  return Array.isArray(value) ? value : [];
}

export function useDashboardData() {
  const [meta, setMeta] = useState(null);
  const [filterOptions, setFilterOptions] = useState({
    anios: [],
    gestiones: [],
    generos: [],
    regiones: [],
    disciplinas: [],
    ramas: [],
  });
  const [filters, setFilters] = useState(initialFilters);
  const [dashboard, setDashboard] = useState(initialDashboard);
  const [baseLoading, setBaseLoading] = useState(true);
  const [dashboardLoading, setDashboardLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function loadBase() {
      try {
        setBaseLoading(true);
        setError("");

        const metaResponse = await fetchMeta();
        if (cancelled) return;
        setMeta(metaResponse);

        const filtersResponse = await fetchFilters();
        if (cancelled) return;

        setFilterOptions({
          anios: filtersResponse?.anios || [],
          gestiones: filtersResponse?.gestiones || [],
          generos: filtersResponse?.generos || [],
          regiones: filtersResponse?.regiones || [],
          disciplinas: filtersResponse?.disciplinas || [],
          ramas: filtersResponse?.ramas || [],
        });
      } catch (err) {
        if (!cancelled) {
          console.error("Error cargando metadatos iniciales:", err);
          setError("No se pudieron cargar los metadatos iniciales del proyecto.");
        }
      } finally {
        if (!cancelled) {
          setBaseLoading(false);
        }
      }
    }

    loadBase();

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    let cancelled = false;

    async function safeFetch(requestFn, fallback, label) {
      try {
        const response = await requestFn();
        return response;
      } catch (err) {
        console.error(`Error cargando ${label}:`, err);
        return fallback;
      }
    }

    async function loadDashboard() {
      try {
        setDashboardLoading(true);
        setError("");

        const selectedYear = Number(filters.anio || 2021);

        const kpis = await safeFetch(
          () => fetchKpis(filters),
          null,
          "KPIs",
        );
        if (cancelled) return;
        setDashboard((current) => ({
          ...current,
          kpis: kpis || null,
        }));

        const yearly = await safeFetch(
          () => fetchYearlyEvolution(filters),
          [],
          "evolución anual",
        );
        if (cancelled) return;
        setDashboard((current) => ({
          ...current,
          yearly: ensureArray(yearly),
        }));

        const management = await safeFetch(
          () => fetchManagementSummary(selectedYear),
          [],
          "resumen por gestión",
        );
        if (cancelled) return;
        setDashboard((current) => ({
          ...current,
          management: ensureArray(management),
        }));

        const genderManagement = await safeFetch(
          () => fetchGenderManagementSummary(selectedYear),
          [],
          "resumen por género y gestión",
        );
        if (cancelled) return;
        setDashboard((current) => ({
          ...current,
          genderManagement: ensureArray(genderManagement),
        }));

        const regionEmployment = await safeFetch(
          () => fetchRegionEmployment(selectedYear),
          [],
          "empleo por región",
        );
        if (cancelled) return;
        setDashboard((current) => ({
          ...current,
          regionEmployment: ensureArray(regionEmployment),
        }));

        const regionSalary = await safeFetch(
          () => fetchRegionSalary(selectedYear),
          [],
          "salario por región",
        );
        if (cancelled) return;
        setDashboard((current) => ({
          ...current,
          regionSalary: ensureArray(regionSalary),
        }));

        const opportunityIndex = await safeFetch(
          () => fetchOpportunityIndex(selectedYear),
          [],
          "índice de oportunidad",
        );
        if (cancelled) return;
        setDashboard((current) => ({
          ...current,
          opportunityIndex: ensureArray(opportunityIndex),
        }));

        const scatter = await safeFetch(
          () => fetchScatterDisciplines(selectedYear),
          [],
          "scatter de disciplinas",
        );
        if (cancelled) return;
        setDashboard((current) => ({
          ...current,
          scatter: ensureArray(scatter),
        }));
      } catch (err) {
        if (!cancelled) {
          console.error("Error cargando tablero:", err);
          setError("No se pudieron cargar los datos del tablero.");
          setDashboard(initialDashboard);
        }
      } finally {
        if (!cancelled) {
          setDashboardLoading(false);
        }
      }
    }

    loadDashboard();

    return () => {
      cancelled = true;
    };
  }, [
    filters.anio,
    filters.gestionId,
    filters.generoId,
    filters.regionId,
    filters.disciplinaId,
    filters.ramaId,
  ]);

  const loading = useMemo(
    () => baseLoading || dashboardLoading,
    [baseLoading, dashboardLoading],
  );

  return {
    meta,
    filterOptions,
    filters,
    setFilters,
    loading,
    error,
    dashboard,
  };
}
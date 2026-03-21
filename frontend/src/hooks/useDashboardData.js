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

        const [metaResponse, filtersResponse] = await Promise.all([
          fetchMeta(),
          fetchFilters(),
        ]);

        if (cancelled) return;

        setMeta(metaResponse);
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
          setError(
            "No se pudieron cargar los metadatos iniciales del proyecto.",
          );
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

    async function loadDashboard() {
      try {
        setDashboardLoading(true);
        setError("");

        const selectedYear = Number(filters.anio || 2021);

        const [
          kpis,
          yearly,
          management,
          genderManagement,
          regionEmployment,
          regionSalary,
          opportunityIndex,
          scatter,
        ] = await Promise.all([
          fetchKpis(filters),
          fetchYearlyEvolution(filters),
          fetchManagementSummary(selectedYear),
          fetchGenderManagementSummary(selectedYear),
          fetchRegionEmployment(selectedYear),
          fetchRegionSalary(selectedYear),
          fetchOpportunityIndex(selectedYear),
          fetchScatterDisciplines(selectedYear),
        ]);

        if (cancelled) return;

        setDashboard({
          kpis: kpis || null,
          yearly: Array.isArray(yearly) ? yearly : [],
          management: Array.isArray(management) ? management : [],
          genderManagement: Array.isArray(genderManagement)
            ? genderManagement
            : [],
          regionEmployment: Array.isArray(regionEmployment)
            ? regionEmployment
            : [],
          regionSalary: Array.isArray(regionSalary) ? regionSalary : [],
          opportunityIndex: Array.isArray(opportunityIndex)
            ? opportunityIndex
            : [],
          scatter: Array.isArray(scatter) ? scatter : [],
        });
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

import { useEffect, useMemo, useState } from "react";
import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { fetchCompare, fetchFilters } from "../api/client";
import ChartCard from "../components/charts/ChartCard";
import Loader from "../components/ui/Loader";
import { formatCurrency, formatPercent } from "../utils/format";

const selectClassName =
  "w-full border border-slate-200 bg-white px-4 py-3 text-sm text-slate-800 outline-none transition duration-200 hover:border-slate-300 focus:border-slate-400";

const axisTickStyle = { fill: "#64748b", fontSize: 12 };
const axisLineStyle = { stroke: "#cbd5e1" };
const gridStyle = { stroke: "#e2e8f0", strokeDasharray: "3 3" };

const tooltipStyle = {
  backgroundColor: "#ffffff",
  border: "1px solid #e2e8f0",
  borderRadius: "0px",
  boxShadow: "0 8px 24px rgba(15, 23, 42, 0.08)",
};

function SelectField({ label, description, value, onChange, options }) {
  return (
    <label className="flex flex-col gap-2.5">
      <div className="space-y-1">
        <span className="text-sm font-medium tracking-tight text-slate-800">
          {label}
        </span>
        {description ? (
          <p className="text-sm leading-6 text-slate-500">{description}</p>
        ) : null}
      </div>

      <select value={value} onChange={onChange} className={selectClassName}>
        {options.map((option) => (
          <option key={option.id} value={option.id}>
            {option.label}
          </option>
        ))}
      </select>
    </label>
  );
}

function CompareSummaryCard({ label, value }) {
  return (
    <div className="bg-slate-50 px-4 py-4">
      <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">
        {label}
      </p>
      <p className="mt-2 text-sm font-medium leading-6 text-slate-900">
        {value}
      </p>
    </div>
  );
}

function EducationalNote({ title, children }) {
  return (
    <div className="border-t border-slate-200 pt-4">
      <h3 className="text-sm font-semibold tracking-tight text-slate-900">
        {title}
      </h3>
      <div className="mt-2 text-sm leading-6 text-slate-600">{children}</div>
    </div>
  );
}

function InsightCard({ title, value, helper }) {
  return (
    <div className="border-t border-slate-200 pt-4">
      <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500">
        {title}
      </p>
      <p className="mt-2 text-base font-semibold tracking-tight text-slate-950">
        {value}
      </p>
      <p className="mt-2 text-sm leading-6 text-slate-600">{helper}</p>
    </div>
  );
}

export default function ComparePage() {
  const [disciplines, setDisciplines] = useState([]);
  const [disciplinaA, setDisciplinaA] = useState("");
  const [disciplinaB, setDisciplinaB] = useState("");
  const [loadingFilters, setLoadingFilters] = useState(true);
  const [loadingComparison, setLoadingComparison] = useState(false);
  const [error, setError] = useState("");
  const [data, setData] = useState([]);

  useEffect(() => {
    let cancelled = false;

    async function loadFilters() {
      try {
        setLoadingFilters(true);
        setError("");

        const response = await fetchFilters();
        const availableDisciplines = response?.disciplinas || [];

        if (cancelled) return;

        setDisciplines(availableDisciplines);

        if (availableDisciplines.length >= 2) {
          setDisciplinaA(String(availableDisciplines[0].id));
          setDisciplinaB(String(availableDisciplines[1].id));
        }
      } catch (err) {
        if (!cancelled) {
          setError("No se pudieron cargar las disciplinas disponibles.");
        }
      } finally {
        if (!cancelled) {
          setLoadingFilters(false);
        }
      }
    }

    loadFilters();

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    let cancelled = false;

    async function loadComparison() {
      if (!disciplinaA || !disciplinaB) {
        setData([]);
        setLoadingComparison(false);
        return;
      }

      if (String(disciplinaA) === String(disciplinaB)) {
        setData([]);
        setLoadingComparison(false);
        return;
      }

      try {
        setLoadingComparison(true);
        setError("");

        const response = await fetchCompare(
          Number(disciplinaA),
          Number(disciplinaB),
        );

        if (cancelled) return;

        setData(Array.isArray(response) ? response : []);
      } catch (err) {
        if (!cancelled) {
          setError("No se pudo construir la comparación seleccionada.");
          setData([]);
        }
      } finally {
        if (!cancelled) {
          setLoadingComparison(false);
        }
      }
    }

    loadComparison();

    return () => {
      cancelled = true;
    };
  }, [disciplinaA, disciplinaB]);

  const selectedDisciplineNames = useMemo(() => {
    const a =
      disciplines.find((item) => String(item.id) === String(disciplinaA))
        ?.label || "Disciplina A";

    const b =
      disciplines.find((item) => String(item.id) === String(disciplinaB))
        ?.label || "Disciplina B";

    return { a, b };
  }, [disciplinaA, disciplinaB, disciplines]);

  const groupedYears = useMemo(() => {
    const map = new Map();

    data.forEach((row) => {
      const current = map.get(row.anio) || { anio: row.anio };
      current[`${row.disciplina}_empleo`] = row.tasa_empleo_formal;
      current[`${row.disciplina}_salario`] = row.salario_mediano;
      map.set(row.anio, current);
    });

    return Array.from(map.values()).sort((a, b) => a.anio - b.anio);
  }, [data]);

  const sameDisciplineSelected =
    disciplinaA && disciplinaB && String(disciplinaA) === String(disciplinaB);

  const latestComparison = useMemo(() => {
    if (!data.length) return null;

    const latestYear = Math.max(...data.map((row) => Number(row.anio)));
    const rows = data.filter((row) => Number(row.anio) === latestYear);

    const rowA = rows.find(
      (row) => String(row.disciplina) === String(selectedDisciplineNames.a),
    );
    const rowB = rows.find(
      (row) => String(row.disciplina) === String(selectedDisciplineNames.b),
    );

    if (!rowA || !rowB) return null;

    const empleoWinner =
      rowA.tasa_empleo_formal > rowB.tasa_empleo_formal
        ? selectedDisciplineNames.a
        : rowB.tasa_empleo_formal > rowA.tasa_empleo_formal
          ? selectedDisciplineNames.b
          : "Empate técnico";

    const salarioWinner =
      rowA.salario_mediano > rowB.salario_mediano
        ? selectedDisciplineNames.a
        : rowB.salario_mediano > rowA.salario_mediano
          ? selectedDisciplineNames.b
          : "Empate técnico";

    return {
      anio: latestYear,
      empleoWinner,
      salarioWinner,
      empleoA: rowA.tasa_empleo_formal,
      empleoB: rowB.tasa_empleo_formal,
      salarioA: rowA.salario_mediano,
      salarioB: rowB.salario_mediano,
    };
  }, [data, selectedDisciplineNames]);

  const loading = loadingFilters || loadingComparison;

  return (
    <div className="space-y-10">
      <section className="grid gap-8 xl:grid-cols-[minmax(0,1.2fr)_420px] xl:items-start">
        <div className="space-y-6 border-t border-slate-300 pt-5">
          <div className="space-y-2">
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-500">
              Comparador analítico
            </p>

            <h2 className="text-2xl font-semibold tracking-tight text-slate-950 md:text-3xl">
              Comparación entre disciplinas
            </h2>

            <p className="max-w-3xl text-sm leading-7 text-slate-600 md:text-[15px]">
              Esta sección permite contrastar dos disciplinas para observar cómo
              evolucionan en el tiempo dos variables centrales del análisis:
              empleo formal y salario mediano.
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <SelectField
              label="Disciplina A"
              description="Seleccioná la primera disciplina que querés analizar."
              value={disciplinaA}
              onChange={(event) => setDisciplinaA(event.target.value)}
              options={disciplines}
            />

            <SelectField
              label="Disciplina B"
              description="Seleccioná la disciplina con la que querés comparar."
              value={disciplinaB}
              onChange={(event) => setDisciplinaB(event.target.value)}
              options={disciplines}
            />
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <CompareSummaryCard
              label="Disciplina seleccionada"
              value={selectedDisciplineNames.a}
            />
            <CompareSummaryCard
              label="Disciplina comparada"
              value={selectedDisciplineNames.b}
            />
          </div>

          {sameDisciplineSelected ? (
            <div className="border-t border-amber-300 bg-amber-50 px-4 py-4 text-sm leading-6 text-amber-800">
              Seleccioná dos disciplinas distintas para generar una comparación
              válida y poder interpretar diferencias reales.
            </div>
          ) : null}
        </div>

        <aside className="space-y-4 border-t border-slate-300 pt-5">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-500">
              Cómo leer esta comparación
            </p>
            <h3 className="mt-2 text-lg font-semibold tracking-tight text-slate-950">
              Guía de interpretación
            </h3>
          </div>

          <EducationalNote title="Empleo formal">
            Representa la proporción de graduados con inserción laboral formal
            observada. Un valor más alto indica mayor presencia en empleos
            registrados dentro del conjunto analizado.
          </EducationalNote>

          <EducationalNote title="Salario mediano">
            Es el valor salarial central del grupo. Se usa la mediana porque
            permite una lectura más estable frente a extremos o valores
            atípicos.
          </EducationalNote>

          <EducationalNote title="Lectura temporal">
            El eje horizontal muestra los años disponibles. La evolución permite
            ver si una disciplina mejora, se mantiene o pierde posición relativa
            en el período observado.
          </EducationalNote>
        </aside>
      </section>

      {error ? (
        <div className="border-t border-rose-300 bg-rose-50 px-5 py-4 text-sm leading-6 text-rose-700">
          {error}
        </div>
      ) : null}

      {loading ? (
        <Loader message="Armando la comparación de disciplinas..." />
      ) : (
        <>
          {latestComparison ? (
            <section className="grid gap-6 md:grid-cols-2">
              <InsightCard
                title={`Lectura destacada ${latestComparison.anio}`}
                value={latestComparison.empleoWinner}
                helper={`Presenta la mayor tasa de empleo formal en ${latestComparison.anio}. ${selectedDisciplineNames.a}: ${formatPercent(latestComparison.empleoA)}. ${selectedDisciplineNames.b}: ${formatPercent(latestComparison.empleoB)}.`}
              />

              <InsightCard
                title={`Salario mediano ${latestComparison.anio}`}
                value={latestComparison.salarioWinner}
                helper={`Presenta el mayor salario mediano observado en ${latestComparison.anio}. ${selectedDisciplineNames.a}: ${formatCurrency(latestComparison.salarioA)}. ${selectedDisciplineNames.b}: ${formatCurrency(latestComparison.salarioB)}.`}
              />
            </section>
          ) : null}

          <section className="space-y-5">
            <div className="space-y-2">
              <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-500">
                Resultados comparados
              </p>
              <h3 className="text-xl font-semibold tracking-tight text-slate-950">
                Evolución por disciplina
              </h3>
              <p className="max-w-3xl text-sm leading-6 text-slate-600">
                Lectura temporal del empleo formal y del salario mediano para
                las disciplinas elegidas.
              </p>
            </div>

            <div className="grid gap-8 xl:grid-cols-2">
              <ChartCard
                title="Comparación de empleo formal"
                description="La distancia entre líneas permite leer diferencias de inserción formal entre disciplinas a lo largo del tiempo."
              >
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={groupedYears}
                    margin={{ top: 8, right: 12, left: 0, bottom: 0 }}
                  >
                    <CartesianGrid {...gridStyle} />
                    <XAxis
                      dataKey="anio"
                      tick={axisTickStyle}
                      axisLine={axisLineStyle}
                      tickLine={axisLineStyle}
                    />
                    <YAxis
                      tick={axisTickStyle}
                      axisLine={axisLineStyle}
                      tickLine={axisLineStyle}
                    />
                    <Tooltip
                      contentStyle={tooltipStyle}
                      formatter={(value) => formatPercent(value)}
                    />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey={`${selectedDisciplineNames.a}_empleo`}
                      name={selectedDisciplineNames.a}
                      stroke="#0f172a"
                      strokeWidth={2.5}
                      dot={{ r: 3 }}
                      activeDot={{ r: 5 }}
                    />
                    <Line
                      type="monotone"
                      dataKey={`${selectedDisciplineNames.b}_empleo`}
                      name={selectedDisciplineNames.b}
                      stroke="#64748b"
                      strokeWidth={2.5}
                      dot={{ r: 3 }}
                      activeDot={{ r: 5 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </ChartCard>

              <ChartCard
                title="Comparación de salario mediano"
                description="Permite analizar diferencias de remuneración central entre las disciplinas seleccionadas."
              >
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={groupedYears}
                    margin={{ top: 8, right: 12, left: 0, bottom: 0 }}
                  >
                    <CartesianGrid {...gridStyle} />
                    <XAxis
                      dataKey="anio"
                      tick={axisTickStyle}
                      axisLine={axisLineStyle}
                      tickLine={axisLineStyle}
                    />
                    <YAxis
                      tick={axisTickStyle}
                      axisLine={axisLineStyle}
                      tickLine={axisLineStyle}
                    />
                    <Tooltip
                      contentStyle={tooltipStyle}
                      formatter={(value) => formatCurrency(value)}
                    />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey={`${selectedDisciplineNames.a}_salario`}
                      name={selectedDisciplineNames.a}
                      stroke="#0f172a"
                      strokeWidth={2.5}
                      dot={{ r: 3 }}
                      activeDot={{ r: 5 }}
                    />
                    <Line
                      type="monotone"
                      dataKey={`${selectedDisciplineNames.b}_salario`}
                      name={selectedDisciplineNames.b}
                      stroke="#64748b"
                      strokeWidth={2.5}
                      dot={{ r: 3 }}
                      activeDot={{ r: 5 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </ChartCard>
            </div>
          </section>
        </>
      )}
    </div>
  );
}

import {
  lazy,
  memo,
  Suspense,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Scatter,
  ScatterChart,
  Tooltip,
  XAxis,
  YAxis,
  ZAxis,
} from "recharts";
import { useDashboardData } from "../hooks/useDashboardData";
import { formatCurrency, formatPercent } from "../utils/format";

const FilterPanel = lazy(() => import("../components/dashboard/FilterPanel"));
const KPIGrid = lazy(() => import("../components/dashboard/KPIGrid"));
const OpportunityTable = lazy(
  () => import("../components/dashboard/OpportunityTable"),
);
const Loader = lazy(() => import("../components/ui/Loader"));

const SCATTER_COLORS = [
  "#0f172a",
  "#334155",
  "#475569",
  "#0369a1",
  "#0f766e",
  "#4338ca",
  "#854d0e",
];

const AXIS_TICK_STYLE = { fill: "#64748b", fontSize: 12 };
const AXIS_LINE_STYLE = { stroke: "#cbd5e1" };
const GRID_STYLE = { stroke: "#e2e8f0", strokeDasharray: "3 3" };
const TOOLTIP_STYLE = {
  backgroundColor: "#ffffff",
  border: "1px solid #e2e8f0",
  borderRadius: "4px",
  boxShadow: "0 8px 24px rgba(15, 23, 42, 0.08)",
};
const CHART_MARGIN_DEFAULT = { top: 8, right: 12, left: 0, bottom: 0 };
const CHART_MARGIN_VERTICAL = { top: 8, right: 12, left: 24, bottom: 0 };

const SECTION_ANIMATION_CLASS =
  "transition-all duration-700 ease-out will-change-transform";

const SuspenseFallbackBlock = memo(function SuspenseFallbackBlock({
  className = "",
}) {
  return (
    <div
      className={`min-h-[120px] border border-slate-200 bg-white ${className}`}
    />
  );
});

const ChartSkeleton = memo(function ChartSkeleton({ height = "h-[320px]" }) {
  return (
    <article className="border border-slate-300 bg-white">
      <div className="border-b border-slate-200 px-4 py-4">
        <div className="h-4 w-40 animate-pulse bg-slate-200" />
        <div className="mt-2 h-3 w-56 animate-pulse bg-slate-100" />
      </div>
      <div className={`px-3 py-3 md:px-4 md:py-4 ${height}`}>
        <div className="h-full w-full animate-pulse bg-slate-100" />
      </div>
    </article>
  );
});

const IntroMetric = memo(function IntroMetric({ label, value }) {
  return (
    <div className="border-r border-slate-200 px-4 py-3 last:border-r-0">
      <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-500">
        {label}
      </p>
      <p className="mt-1 text-sm font-semibold text-slate-950">{value}</p>
    </div>
  );
});

const DataRow = memo(function DataRow({ label, value }) {
  return (
    <div className="flex items-center justify-between gap-4 border-b border-slate-200 py-3 last:border-b-0">
      <dt className="text-sm text-slate-500">{label}</dt>
      <dd className="text-sm font-medium text-slate-900">{value}</dd>
    </div>
  );
});

const SectionHeader = memo(function SectionHeader({
  eyebrow,
  title,
  description,
}) {
  return (
    <div className="flex flex-col gap-2 border-b border-slate-200 pb-4 md:flex-row md:items-end md:justify-between">
      <div>
        <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-500">
          {eyebrow}
        </p>
        <h3 className="mt-1 text-xl font-semibold tracking-tight text-slate-950">
          {title}
        </h3>
      </div>
      <p className="max-w-2xl text-sm leading-6 text-slate-600">
        {description}
      </p>
    </div>
  );
});

const ChartPanel = memo(function ChartPanel({
  title,
  subtitle,
  children,
  height = "h-[320px]",
}) {
  return (
    <article className="border border-slate-300 bg-white">
      <div className="border-b border-slate-200 px-4 py-4">
        <h4 className="text-sm font-semibold tracking-tight text-slate-950">
          {title}
        </h4>
        <p className="mt-1 text-xs leading-5 text-slate-500">{subtitle}</p>
      </div>
      <div className={`px-3 py-3 md:px-4 md:py-4 ${height}`}>{children}</div>
    </article>
  );
});

function useInView({
  rootMargin = "160px 0px",
  threshold = 0.12,
  once = true,
} = {}) {
  const ref = useRef(null);
  const [isInView, setIsInView] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node || (once && isInView)) return undefined;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          if (once) observer.disconnect();
        } else if (!once) {
          setIsInView(false);
        }
      },
      { rootMargin, threshold },
    );

    observer.observe(node);

    return () => observer.disconnect();
  }, [isInView, once, rootMargin, threshold]);

  return { ref, isInView };
}

const LazySection = memo(function LazySection({
  children,
  className = "",
  fallback = null,
}) {
  const { ref, isInView } = useInView();

  return (
    <div
      ref={ref}
      className={[
        SECTION_ANIMATION_CLASS,
        isInView
          ? "translate-y-0 opacity-100"
          : "translate-y-4 opacity-0 motion-reduce:translate-y-0 motion-reduce:opacity-100",
        className,
      ].join(" ")}
    >
      {isInView ? children : fallback}
    </div>
  );
});

const LazyChart = memo(function LazyChart({
  children,
  height = "h-[320px]",
  fallback,
}) {
  const { ref, isInView } = useInView();

  return (
    <div ref={ref} className={`h-full w-full ${height}`}>
      {isInView
        ? children
        : fallback || <div className="h-full w-full bg-slate-50" />}
    </div>
  );
});

const HeroSection = memo(function HeroSection({ meta }) {
  const registrosValue = useMemo(
    () => meta?.registros?.toLocaleString("es-AR") || "...",
    [meta?.registros],
  );

  const periodoValue = useMemo(
    () => (meta ? `${meta.anio_min} - ${meta.anio_max}` : "..."),
    [meta],
  );

  return (
    <section className="border border-slate-300 bg-white">
      <div className="grid xl:grid-cols-[minmax(0,1.55fr)_360px]">
        <div className="border-b border-slate-200 px-5 py-5 md:px-7 md:py-6 xl:border-b-0 xl:border-r">
          <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-slate-500">
            Observatorio de inserción universitaria
          </p>

          <h2 className="mt-3 max-w-4xl text-2xl font-semibold leading-tight tracking-tight text-slate-950 md:text-4xl">
            Inserción laboral universitaria con foco analítico en brechas,
            regiones y oportunidades
          </h2>

          <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-600">
            Plataforma de lectura comparativa sobre empleo formal, salario y
            desempeño por disciplina, gestión y territorio.
          </p>

          <div className="mt-5 grid grid-cols-2 border border-slate-200 md:grid-cols-4">
            <IntroMetric label="Registros" value={registrosValue} />
            <IntroMetric label="Período" value={periodoValue} />
            <IntroMetric
              label="Disciplinas"
              value={meta?.disciplinas || "..."}
            />
            <IntroMetric label="Regiones" value={meta?.regiones || "..."} />
          </div>
        </div>

        <aside className="bg-slate-50 px-5 py-5 md:px-6 md:py-6">
          <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-500">
            Cobertura
          </p>
          <h3 className="mt-2 text-base font-semibold tracking-tight text-slate-950">
            Resumen del conjunto analizado
          </h3>

          <dl className="mt-4">
            <DataRow label="Registros" value={registrosValue} />
            <DataRow label="Columnas" value={meta?.columnas || "..."} />
            <DataRow label="Años observados" value={periodoValue} />
            <DataRow label="Disciplinas" value={meta?.disciplinas || "..."} />
            <DataRow label="Ramas" value={meta?.ramas || "..."} />
            <DataRow label="Regiones" value={meta?.regiones || "..."} />
          </dl>
        </aside>
      </div>
    </section>
  );
});

const TemporalSection = memo(function TemporalSection({ yearly }) {
  return (
    <section className="space-y-4">
      <SectionHeader
        eyebrow="Lectura temporal"
        title="Evolución general"
        description="Seguimiento anual del empleo formal y del salario mediano para el subconjunto filtrado."
      />

      <div className="grid gap-4 xl:grid-cols-2">
        <ChartPanel
          title="Tasa de empleo formal por año"
          subtitle="Serie anual del subconjunto visible"
        >
          <LazyChart
            height="h-[320px]"
            fallback={
              <div className="h-full w-full animate-pulse bg-slate-100" />
            }
          >
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={yearly} margin={CHART_MARGIN_DEFAULT}>
                <CartesianGrid {...GRID_STYLE} />
                <XAxis
                  dataKey="anio"
                  tick={AXIS_TICK_STYLE}
                  axisLine={AXIS_LINE_STYLE}
                  tickLine={AXIS_LINE_STYLE}
                />
                <YAxis
                  tick={AXIS_TICK_STYLE}
                  axisLine={AXIS_LINE_STYLE}
                  tickLine={AXIS_LINE_STYLE}
                />
                <Tooltip
                  contentStyle={TOOLTIP_STYLE}
                  formatter={formatPercent}
                />
                <Line
                  type="monotone"
                  dataKey="tasa_empleo_formal"
                  stroke="#0f172a"
                  strokeWidth={2.4}
                  dot={{ r: 2.5 }}
                  activeDot={{ r: 4 }}
                  isAnimationActive
                  animationDuration={700}
                  animationEasing="ease-out"
                />
              </LineChart>
            </ResponsiveContainer>
          </LazyChart>
        </ChartPanel>

        <ChartPanel
          title="Salario mediano por año"
          subtitle="Serie anual del segmento seleccionado"
        >
          <LazyChart
            height="h-[320px]"
            fallback={
              <div className="h-full w-full animate-pulse bg-slate-100" />
            }
          >
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={yearly} margin={CHART_MARGIN_DEFAULT}>
                <CartesianGrid {...GRID_STYLE} />
                <XAxis
                  dataKey="anio"
                  tick={AXIS_TICK_STYLE}
                  axisLine={AXIS_LINE_STYLE}
                  tickLine={AXIS_LINE_STYLE}
                />
                <YAxis
                  tick={AXIS_TICK_STYLE}
                  axisLine={AXIS_LINE_STYLE}
                  tickLine={AXIS_LINE_STYLE}
                />
                <Tooltip
                  contentStyle={TOOLTIP_STYLE}
                  formatter={formatCurrency}
                />
                <Line
                  type="monotone"
                  dataKey="salario_mediano"
                  stroke="#475569"
                  strokeWidth={2.4}
                  dot={{ r: 2.5 }}
                  activeDot={{ r: 4 }}
                  isAnimationActive
                  animationDuration={700}
                  animationEasing="ease-out"
                />
              </LineChart>
            </ResponsiveContainer>
          </LazyChart>
        </ChartPanel>
      </div>
    </section>
  );
});

const ComparativeSection = memo(function ComparativeSection({
  management,
  genderManagement,
  regionEmployment,
  regionSalary,
}) {
  const managementTooltipFormatter = useCallback((value, name) => {
    if (name === "Empleo formal") return formatPercent(value);
    return formatCurrency(value);
  }, []);

  return (
    <section className="space-y-4">
      <SectionHeader
        eyebrow="Comparativas"
        title="Gestión, género y territorio"
        description="Diferencias institucionales y regionales dentro del subconjunto actualmente seleccionado."
      />

      <div className="grid gap-4 xl:grid-cols-2">
        <ChartPanel
          title="Gestión: empleo y salario"
          subtitle="Comparación entre gestión estatal y privada"
        >
          <LazyChart
            height="h-[320px]"
            fallback={
              <div className="h-full w-full animate-pulse bg-slate-100" />
            }
          >
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={management} margin={CHART_MARGIN_DEFAULT}>
                <CartesianGrid {...GRID_STYLE} />
                <XAxis
                  dataKey="gestion"
                  tick={AXIS_TICK_STYLE}
                  axisLine={AXIS_LINE_STYLE}
                  tickLine={AXIS_LINE_STYLE}
                />
                <YAxis
                  yAxisId="left"
                  tick={AXIS_TICK_STYLE}
                  axisLine={AXIS_LINE_STYLE}
                  tickLine={AXIS_LINE_STYLE}
                />
                <YAxis
                  yAxisId="right"
                  orientation="right"
                  tick={AXIS_TICK_STYLE}
                  axisLine={AXIS_LINE_STYLE}
                  tickLine={AXIS_LINE_STYLE}
                />
                <Tooltip
                  contentStyle={TOOLTIP_STYLE}
                  formatter={managementTooltipFormatter}
                />
                <Legend />
                <Bar
                  yAxisId="left"
                  dataKey="tasa_empleo_formal"
                  fill="#0f172a"
                  name="Empleo formal"
                  isAnimationActive
                  animationDuration={700}
                />
                <Bar
                  yAxisId="right"
                  dataKey="salario_mediano"
                  fill="#94a3b8"
                  name="Salario mediano"
                  isAnimationActive
                  animationDuration={700}
                />
              </BarChart>
            </ResponsiveContainer>
          </LazyChart>
        </ChartPanel>

        <ChartPanel
          title="Género según gestión"
          subtitle="Empleo formal por género"
        >
          <LazyChart
            height="h-[320px]"
            fallback={
              <div className="h-full w-full animate-pulse bg-slate-100" />
            }
          >
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={genderManagement} margin={CHART_MARGIN_DEFAULT}>
                <CartesianGrid {...GRID_STYLE} />
                <XAxis
                  dataKey="genero"
                  tick={AXIS_TICK_STYLE}
                  axisLine={AXIS_LINE_STYLE}
                  tickLine={AXIS_LINE_STYLE}
                />
                <YAxis
                  tick={AXIS_TICK_STYLE}
                  axisLine={AXIS_LINE_STYLE}
                  tickLine={AXIS_LINE_STYLE}
                />
                <Tooltip
                  contentStyle={TOOLTIP_STYLE}
                  formatter={formatPercent}
                />
                <Legend />
                <Bar
                  dataKey="tasa_empleo_formal"
                  fill="#334155"
                  name="Empleo formal"
                  isAnimationActive
                  animationDuration={700}
                />
              </BarChart>
            </ResponsiveContainer>
          </LazyChart>
        </ChartPanel>

        <ChartPanel
          title="Empleo formal por región"
          subtitle="Ordenamiento territorial"
        >
          <LazyChart
            height="h-[320px]"
            fallback={
              <div className="h-full w-full animate-pulse bg-slate-100" />
            }
          >
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={regionEmployment}
                layout="vertical"
                margin={CHART_MARGIN_VERTICAL}
              >
                <CartesianGrid {...GRID_STYLE} />
                <XAxis
                  type="number"
                  tick={AXIS_TICK_STYLE}
                  axisLine={AXIS_LINE_STYLE}
                  tickLine={AXIS_LINE_STYLE}
                />
                <YAxis
                  type="category"
                  dataKey="region"
                  width={170}
                  tick={AXIS_TICK_STYLE}
                  axisLine={AXIS_LINE_STYLE}
                  tickLine={AXIS_LINE_STYLE}
                />
                <Tooltip
                  contentStyle={TOOLTIP_STYLE}
                  formatter={formatPercent}
                />
                <Bar
                  dataKey="tasa_empleo_formal"
                  fill="#0f766e"
                  isAnimationActive
                  animationDuration={700}
                />
              </BarChart>
            </ResponsiveContainer>
          </LazyChart>
        </ChartPanel>

        <ChartPanel
          title="Salario mediano por región"
          subtitle="Comparación territorial de ingresos"
        >
          <LazyChart
            height="h-[320px]"
            fallback={
              <div className="h-full w-full animate-pulse bg-slate-100" />
            }
          >
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={regionSalary}
                layout="vertical"
                margin={CHART_MARGIN_VERTICAL}
              >
                <CartesianGrid {...GRID_STYLE} />
                <XAxis
                  type="number"
                  tick={AXIS_TICK_STYLE}
                  axisLine={AXIS_LINE_STYLE}
                  tickLine={AXIS_LINE_STYLE}
                />
                <YAxis
                  type="category"
                  dataKey="region"
                  width={170}
                  tick={AXIS_TICK_STYLE}
                  axisLine={AXIS_LINE_STYLE}
                  tickLine={AXIS_LINE_STYLE}
                />
                <Tooltip
                  contentStyle={TOOLTIP_STYLE}
                  formatter={formatCurrency}
                />
                <Bar
                  dataKey="salario_mediano"
                  fill="#475569"
                  isAnimationActive
                  animationDuration={700}
                />
              </BarChart>
            </ResponsiveContainer>
          </LazyChart>
        </ChartPanel>
      </div>
    </section>
  );
});

const OpportunitySection = memo(function OpportunitySection({
  topOpportunityIndex,
  topOpportunityTable,
  scatter,
}) {
  const scatterTooltipFormatter = useCallback((value, name) => {
    if (name === "tasa_empleo_formal") return formatPercent(value);
    if (name === "salario_mediano") return formatCurrency(value);
    return value;
  }, []);

  return (
    <section className="space-y-4">
      <SectionHeader
        eyebrow="Oportunidad"
        title="Disciplinas con mayor proyección"
        description="Índice compuesto para sintetizar empleo formal y salario mediano en una lectura más directa."
      />

      <div className="grid gap-4 xl:grid-cols-[1.18fr_0.82fr]">
        <ChartPanel
          title="Top disciplinas por índice"
          subtitle="Ranking sintético del subconjunto"
          height="h-[360px]"
        >
          <LazyChart
            height="h-[360px]"
            fallback={
              <div className="h-full w-full animate-pulse bg-slate-100" />
            }
          >
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={topOpportunityIndex}
                layout="vertical"
                margin={CHART_MARGIN_VERTICAL}
              >
                <CartesianGrid {...GRID_STYLE} />
                <XAxis
                  type="number"
                  tick={AXIS_TICK_STYLE}
                  axisLine={AXIS_LINE_STYLE}
                  tickLine={AXIS_LINE_STYLE}
                />
                <YAxis
                  type="category"
                  dataKey="disciplina"
                  width={180}
                  tick={AXIS_TICK_STYLE}
                  axisLine={AXIS_LINE_STYLE}
                  tickLine={AXIS_LINE_STYLE}
                />
                <Tooltip contentStyle={TOOLTIP_STYLE} />
                <Bar
                  dataKey="indice_oportunidad"
                  fill="#0f172a"
                  isAnimationActive
                  animationDuration={700}
                />
              </BarChart>
            </ResponsiveContainer>
          </LazyChart>
        </ChartPanel>

        <ChartPanel
          title="Mapa de oportunidades"
          subtitle="Cruce entre empleo, salario y volumen de graduados"
          height="h-[360px]"
        >
          <LazyChart
            height="h-[360px]"
            fallback={
              <div className="h-full w-full animate-pulse bg-slate-100" />
            }
          >
            <ResponsiveContainer width="100%" height="100%">
              <ScatterChart margin={CHART_MARGIN_DEFAULT}>
                <CartesianGrid {...GRID_STYLE} />
                <XAxis
                  type="number"
                  dataKey="tasa_empleo_formal"
                  name="Empleo formal"
                  tick={AXIS_TICK_STYLE}
                  axisLine={AXIS_LINE_STYLE}
                  tickLine={AXIS_LINE_STYLE}
                />
                <YAxis
                  type="number"
                  dataKey="salario_mediano"
                  name="Salario mediano"
                  tick={AXIS_TICK_STYLE}
                  axisLine={AXIS_LINE_STYLE}
                  tickLine={AXIS_LINE_STYLE}
                />
                <ZAxis type="number" dataKey="graduados" range={[60, 400]} />
                <Tooltip
                  contentStyle={TOOLTIP_STYLE}
                  cursor={{ stroke: "#cbd5e1", strokeDasharray: "3 3" }}
                  formatter={scatterTooltipFormatter}
                />
                <Scatter
                  data={scatter}
                  isAnimationActive
                  animationDuration={700}
                  animationEasing="ease-out"
                >
                  {scatter.map((entry, index) => (
                    <Cell
                      key={`${entry.disciplina}-${index}`}
                      fill={SCATTER_COLORS[index % SCATTER_COLORS.length]}
                    />
                  ))}
                </Scatter>
              </ScatterChart>
            </ResponsiveContainer>
          </LazyChart>
        </ChartPanel>
      </div>

      <LazySection
        fallback={<SuspenseFallbackBlock className="min-h-[320px]" />}
      >
        <div className="border border-slate-300 bg-white">
          <Suspense
            fallback={<SuspenseFallbackBlock className="min-h-[320px]" />}
          >
            <OpportunityTable rows={topOpportunityTable} />
          </Suspense>
        </div>
      </LazySection>
    </section>
  );
});

export default function DashboardPage() {
  const {
    meta,
    filterOptions,
    filters,
    setFilters,
    loading,
    error,
    dashboard,
  } = useDashboardData();

  const handleFilterChange = useCallback(
    (key, value) => {
      setFilters((current) => {
        if (current[key] === value) return current;
        return { ...current, [key]: value };
      });
    },
    [setFilters],
  );

  const yearlyData = useMemo(
    () => dashboard?.yearly ?? [],
    [dashboard?.yearly],
  );
  const managementData = useMemo(
    () => dashboard?.management ?? [],
    [dashboard?.management],
  );
  const genderManagementData = useMemo(
    () => dashboard?.genderManagement ?? [],
    [dashboard?.genderManagement],
  );
  const regionEmploymentData = useMemo(
    () => dashboard?.regionEmployment ?? [],
    [dashboard?.regionEmployment],
  );
  const regionSalaryData = useMemo(
    () => dashboard?.regionSalary ?? [],
    [dashboard?.regionSalary],
  );
  const scatterData = useMemo(
    () => dashboard?.scatter ?? [],
    [dashboard?.scatter],
  );
  const kpis = useMemo(() => dashboard?.kpis ?? [], [dashboard?.kpis]);
  const topOpportunityIndex = useMemo(
    () => (dashboard?.opportunityIndex ?? []).slice(0, 10),
    [dashboard?.opportunityIndex],
  );
  const topOpportunityTable = useMemo(
    () => (dashboard?.opportunityIndex ?? []).slice(0, 12),
    [dashboard?.opportunityIndex],
  );

  return (
    <div className="space-y-5">
      <LazySection
        fallback={<SuspenseFallbackBlock className="min-h-[260px]" />}
      >
        <HeroSection meta={meta} />
      </LazySection>

      <LazySection
        fallback={<SuspenseFallbackBlock className="min-h-[180px]" />}
      >
        <section className="bg-white px-4 py-4 md:px-5 md:py-5">
          <Suspense
            fallback={<SuspenseFallbackBlock className="min-h-[180px]" />}
          >
            <FilterPanel
              filters={filters}
              onChange={handleFilterChange}
              options={filterOptions}
            />
          </Suspense>
        </section>
      </LazySection>

      {error ? (
        <div className="border border-rose-200 bg-rose-50 px-5 py-4 text-sm leading-6 text-rose-700">
          {error}
        </div>
      ) : null}

      {loading ? (
        <Suspense
          fallback={<SuspenseFallbackBlock className="min-h-[180px]" />}
        >
          <Loader message="Preparando tablero..." />
        </Suspense>
      ) : (
        <>
          <LazySection
            fallback={<SuspenseFallbackBlock className="min-h-[140px]" />}
          >
            <Suspense
              fallback={<SuspenseFallbackBlock className="min-h-[140px]" />}
            >
              <KPIGrid kpis={kpis} />
            </Suspense>
          </LazySection>

          <LazySection
            fallback={
              <div className="grid gap-4 xl:grid-cols-2">
                <ChartSkeleton />
                <ChartSkeleton />
              </div>
            }
          >
            <TemporalSection yearly={yearlyData} />
          </LazySection>

          <LazySection
            fallback={
              <div className="grid gap-4 xl:grid-cols-2">
                <ChartSkeleton />
                <ChartSkeleton />
                <ChartSkeleton />
                <ChartSkeleton />
              </div>
            }
          >
            <ComparativeSection
              management={managementData}
              genderManagement={genderManagementData}
              regionEmployment={regionEmploymentData}
              regionSalary={regionSalaryData}
            />
          </LazySection>

          <LazySection
            fallback={
              <div className="grid gap-4 xl:grid-cols-[1.18fr_0.82fr]">
                <ChartSkeleton height="h-[360px]" />
                <ChartSkeleton height="h-[360px]" />
              </div>
            }
          >
            <OpportunitySection
              topOpportunityIndex={topOpportunityIndex}
              topOpportunityTable={topOpportunityTable}
              scatter={scatterData}
            />
          </LazySection>
        </>
      )}
    </div>
  );
}

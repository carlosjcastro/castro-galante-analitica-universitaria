import MetricCard from "../ui/MetricCard";
import {
  formatCurrency,
  formatNumber,
  formatPercent,
} from "../../utils/format";

export default function KPIGrid({ kpis }) {
  if (!kpis) return null;

  const cards = [
    {
      title: "Registros analizados",
      value: formatNumber(kpis.registros),
      helper:
        "Cantidad total de filas disponibles luego de aplicar los filtros actuales.",
    },
    {
      title: "Graduados únicos",
      value: formatNumber(kpis.graduados),
      helper: "Personas graduadas incluidas en el segmento seleccionado.",
    },
    {
      title: "Tasa de empleo formal",
      value: formatPercent(kpis.tasa_empleo_formal),
      helper:
        "Proporción con salario formal observado dentro del universo filtrado.",
    },
    {
      title: "Salario mediano",
      value: formatCurrency(kpis.salario_mediano),
      helper: "Valor central de remuneración del segmento analizado.",
    },
    {
      title: "Salario promedio",
      value: formatCurrency(kpis.salario_promedio),
      helper: "Promedio general de ingresos del conjunto actualmente visible.",
    },
    {
      title: "Edad promedio al egreso",
      value: formatNumber(kpis.edad_promedio_egreso),
      helper: "Edad media estimada al momento de graduación.",
    },
  ];

  return (
    <section className="space-y-5">
      <div className="space-y-2">
        <h2 className="text-2xl font-semibold tracking-tight text-slate-950">
          Indicadores principales
        </h2>
        <p className="max-w-3xl text-sm leading-6 text-slate-600">
          Síntesis del segmento seleccionado para facilitar una lectura rápida
          de volumen, empleabilidad, remuneración y características generales de
          egreso.
        </p>
      </div>

      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {cards.map((card) => (
          <MetricCard key={card.title} {...card} />
        ))}
      </div>
    </section>
  );
}

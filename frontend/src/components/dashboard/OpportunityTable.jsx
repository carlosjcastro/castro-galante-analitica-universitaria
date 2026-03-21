import {
  formatCurrency,
  formatNumber,
  formatPercent,
} from "../../utils/format";

function cx(...classes) {
  return classes.filter(Boolean).join(" ");
}

function TableHeader({ children, align = "left", widthClass = "" }) {
  return (
    <th
      scope="col"
      className={cx(
        "border-b border-slate-300 px-5 py-4 text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500",
        align === "right" ? "text-right" : "text-left",
        widthClass,
      )}
    >
      {children}
    </th>
  );
}

function TableCell({
  children,
  align = "left",
  emphasis = false,
  subtle = false,
  mono = false,
  className = "",
}) {
  return (
    <td
      className={cx(
        "px-5 py-4 align-top text-sm leading-6",
        align === "right" ? "text-right" : "text-left",
        emphasis ? "font-semibold text-slate-950" : "text-slate-700",
        subtle && "text-slate-500",
        mono && "font-mono tabular-nums",
        className,
      )}
    >
      {children}
    </td>
  );
}

function MobileMetric({ label, value, strong = false }) {
  return (
    <div className="min-w-0 border-t border-slate-200 pt-3 first:border-t-0 first:pt-0">
      <dt className="text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-500">
        {label}
      </dt>
      <dd
        className={cx(
          "mt-1 break-words text-sm leading-6",
          strong ? "font-semibold text-slate-950" : "text-slate-700",
        )}
      >
        {value}
      </dd>
    </div>
  );
}

function SectionIntro({ eyebrow, title, description }) {
  return (
    <header className="grid gap-3 border-l-2 border-slate-900 pl-4 md:gap-4">
      <div className="min-w-0">
        <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-500">
          {eyebrow}
        </p>
        <h3 className="mt-2 text-lg font-semibold tracking-tight text-slate-950">
          {title}
        </h3>
        <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600">
          {description}
        </p>
      </div>
    </header>
  );
}

function EmptyState() {
  return (
    <section className="bg-white">
      <div className="border-t border-slate-300 pt-6">
        <SectionIntro
          eyebrow="Índice de oportunidad"
          title="No hay resultados para la selección actual"
          description="Probá ajustar los filtros o reducir el mínimo de graduados para visualizar disciplinas con información disponible."
        />
      </div>
    </section>
  );
}

function MobileRow({ row, index }) {
  return (
    <article className="grid gap-4 px-4 py-5 sm:px-5">
      <div className="grid grid-cols-[52px_minmax(0,1fr)] gap-4 sm:grid-cols-[60px_minmax(0,1fr)]">
        <div className="border-r border-slate-200 pr-3">
          <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-400">
            Rank
          </p>
          <p className="mt-2 font-mono text-lg font-semibold leading-none text-slate-950">
            {String(index + 1).padStart(2, "0")}
          </p>
        </div>

        <div className="min-w-0">
          <h4 className="break-words text-base font-semibold leading-6 tracking-tight text-slate-950">
            {row.disciplina}
          </h4>
          <p className="mt-1 break-words text-sm leading-6 text-slate-600">
            {row.rama}
          </p>
        </div>
      </div>

      <dl className="grid grid-cols-1 gap-x-6 gap-y-4 border-t border-slate-200 pt-4 sm:grid-cols-2">
        <MobileMetric label="Graduados" value={formatNumber(row.graduados)} />
        <MobileMetric
          label="Empleo formal"
          value={formatPercent(row.tasa_empleo_formal)}
        />
        <MobileMetric
          label="Salario mediano"
          value={formatCurrency(row.salario_mediano)}
        />
        <MobileMetric
          label="Índice"
          value={formatNumber(row.indice_oportunidad)}
          strong
        />
      </dl>
    </article>
  );
}

function DesktopTable({ rows }) {
  return (
    <div className="hidden xl:block">
      <div className="overflow-hidden border-y border-slate-300">
        <div className="overflow-x-auto">
          <table className="min-w-full table-fixed border-collapse">
            <thead>
              <tr>
                <TableHeader widthClass="w-16">#</TableHeader>
                <TableHeader widthClass="w-[26%]">Disciplina</TableHeader>
                <TableHeader widthClass="w-[18%]">Rama</TableHeader>
                <TableHeader align="right" widthClass="w-[12%]">
                  Graduados
                </TableHeader>
                <TableHeader align="right" widthClass="w-[14%]">
                  Empleo formal
                </TableHeader>
                <TableHeader align="right" widthClass="w-[16%]">
                  Salario mediano
                </TableHeader>
                <TableHeader align="right" widthClass="w-[14%]">
                  Índice
                </TableHeader>
              </tr>
            </thead>

            <tbody>
              {rows.map((row, index) => (
                <tr
                  key={`${row.disciplina}-${index}`}
                  className={cx(
                    "align-top transition-colors duration-150",
                    "border-b border-slate-200 last:border-b-0",
                    index % 2 === 0 ? "bg-white" : "bg-slate-50/40",
                    "hover:bg-slate-50",
                  )}
                >
                  <TableCell emphasis subtle mono>
                    {String(index + 1).padStart(2, "0")}
                  </TableCell>

                  <TableCell emphasis className="min-w-0">
                    <div className="min-w-0">
                      <p className="break-words font-semibold leading-6 tracking-tight text-slate-950">
                        {row.disciplina}
                      </p>
                    </div>
                  </TableCell>

                  <TableCell className="min-w-0">
                    <span className="break-words text-slate-600">
                      {row.rama}
                    </span>
                  </TableCell>

                  <TableCell align="right" mono>
                    {formatNumber(row.graduados)}
                  </TableCell>

                  <TableCell align="right" mono>
                    {formatPercent(row.tasa_empleo_formal)}
                  </TableCell>

                  <TableCell align="right" mono>
                    {formatCurrency(row.salario_mediano)}
                  </TableCell>

                  <TableCell align="right" emphasis mono>
                    {formatNumber(row.indice_oportunidad)}
                  </TableCell>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default function OpportunityTable({ rows = [] }) {
  if (!rows.length) {
    return <EmptyState />;
  }

  return (
    <section className="min-w-0 bg-white">
      <div className="min-w-0 border-t border-slate-300 pt-6">
        <SectionIntro
          eyebrow="Ranking analítico"
          title="Disciplinas con mayor índice de oportunidad"
          description="Comparación de disciplinas según volumen de graduados, empleo formal, salario mediano e índice compuesto de oportunidad."
        />

        <div className="mt-8 xl:hidden">
          <div className="overflow-hidden border-y border-slate-300">
            <div className="divide-y divide-slate-200">
              {rows.map((row, index) => (
                <MobileRow
                  key={`${row.disciplina}-${index}`}
                  row={row}
                  index={index}
                />
              ))}
            </div>
          </div>
        </div>

        <DesktopTable rows={rows} />
      </div>
    </section>
  );
}

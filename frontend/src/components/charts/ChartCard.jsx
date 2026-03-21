export default function ChartCard({ title, description, children }) {
  return (
    <article className="min-w-0 max-w-full bg-white">
      <div className="grid min-w-0 max-w-full gap-4 border-t border-slate-300 pt-5 sm:gap-5 lg:grid-cols-[minmax(0,220px)_minmax(0,1fr)] lg:items-start lg:gap-8">
        <div className="min-w-0 space-y-2">
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">
            Visualización
          </p>

          <h3 className="break-words text-lg font-semibold leading-snug tracking-tight text-slate-950">
            {title}
          </h3>

          {description ? (
            <p className="max-w-full break-words text-sm leading-6 text-slate-600 lg:max-w-xs">
              {description}
            </p>
          ) : null}
        </div>

        <div className="min-w-0 max-w-full">
          <div className="relative h-[260px] min-w-0 max-w-full sm:h-[300px] md:h-[320px] lg:h-[360px]">
            {children}
          </div>
        </div>
      </div>
    </article>
  );
}

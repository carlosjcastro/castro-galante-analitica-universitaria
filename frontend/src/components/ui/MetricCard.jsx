export default function MetricCard({ title, value, helper }) {
  return (
    <article className="min-w-0 max-w-full bg-white py-5">
      <div className="mb-4 h-px w-10 bg-slate-300 sm:w-12" />

      <div className="min-w-0 space-y-3">
        <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">
          {title}
        </p>

        <p className="break-words text-[1.75rem] font-semibold leading-tight tracking-tight text-slate-950 sm:text-3xl md:text-[2rem]">
          {value}
        </p>

        {helper ? (
          <p className="max-w-full break-words text-sm leading-6 text-slate-600 lg:max-w-xs">
            {helper}
          </p>
        ) : null}
      </div>
    </article>
  );
}

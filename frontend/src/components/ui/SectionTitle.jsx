export default function SectionTitle({ title, description, eyebrow }) {
  return (
    <div className="mb-5 space-y-2">
      {eyebrow ? (
        <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-500">
          {eyebrow}
        </p>
      ) : null}

      <h2 className="text-2xl font-semibold tracking-tight text-slate-950 md:text-[1.75rem]">
        {title}
      </h2>

      {description ? (
        <p className="max-w-3xl text-sm leading-6 text-slate-600 md:text-[15px]">
          {description}
        </p>
      ) : null}
    </div>
  );
}

const selectClassName =
  "w-full appearance-none border-b border-slate-300 bg-transparent px-0 py-3 pr-8 text-sm text-slate-800 outline-none transition duration-200 hover:border-slate-400 focus:border-slate-900";

function SelectField({ label, value, onChange, options }) {
  return (
    <label className="flex flex-col gap-2">
      <span className="text-sm font-medium tracking-tight text-slate-800">
        {label}
      </span>

      <div className="relative">
        <select value={value} onChange={onChange} className={selectClassName}>
          <option value="">Todas</option>
          {options.map((option) => (
            <option key={option.id ?? option} value={option.id ?? option}>
              {option.label ?? option}
            </option>
          ))}
        </select>

        <span className="pointer-events-none absolute right-0 top-1/2 -translate-y-1/2 text-slate-400">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4"
            viewBox="0 0 20 20"
            fill="currentColor"
            aria-hidden="true"
          >
            <path
              fillRule="evenodd"
              d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.51a.75.75 0 01-1.08 0l-4.25-4.51a.75.75 0 01.02-1.06z"
              clipRule="evenodd"
            />
          </svg>
        </span>
      </div>
    </label>
  );
}

function countActiveFilters(filters) {
  return Object.entries(filters).filter(
    ([key, value]) => key !== "anio" && value !== "" && value != null,
  ).length;
}

export default function FilterPanel({ filters, onChange, options }) {
  const activeFilters = countActiveFilters(filters);

  const resetFilters = () => {
    onChange("anio", "2021");
    onChange("gestionId", "");
    onChange("generoId", "");
    onChange("regionId", "");
    onChange("ramaId", "");
    onChange("disciplinaId", "");
  };

  return (
    <section className="border-t border-slate-300 pt-5">
      <div className="flex flex-col gap-4 border-b border-slate-200 pb-5 lg:flex-row lg:items-end lg:justify-between">
        <div className="space-y-1">
          <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-500">
            Filtros
          </p>
          <h2 className="text-xl font-semibold tracking-tight text-slate-950">
            Exploración del tablero
          </h2>
          <p className="text-sm leading-6 text-slate-600">
            Refiná la lectura por año, gestión, género, región y disciplina.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <span className="text-sm text-slate-500">
            {activeFilters} filtro{activeFilters === 1 ? "" : "s"} activo
            {activeFilters === 1 ? "" : "s"}
          </span>

          <button
            type="button"
            onClick={resetFilters}
            className="inline-flex items-center justify-center border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 transition hover:border-slate-400 hover:text-slate-900 cursor-pointer"
          >
            Limpiar
          </button>
        </div>
      </div>

      <div className="grid gap-x-8 gap-y-6 pt-6 sm:grid-cols-2 xl:grid-cols-3">
        <SelectField
          label="Año"
          value={filters.anio}
          onChange={(event) => onChange("anio", event.target.value)}
          options={(options?.anios || []).map((anio) => ({
            id: anio,
            label: anio,
          }))}
        />

        <SelectField
          label="Gestión"
          value={filters.gestionId}
          onChange={(event) => onChange("gestionId", event.target.value)}
          options={options?.gestiones || []}
        />

        <SelectField
          label="Género"
          value={filters.generoId}
          onChange={(event) => onChange("generoId", event.target.value)}
          options={options?.generos || []}
        />

        <SelectField
          label="Región"
          value={filters.regionId}
          onChange={(event) => onChange("regionId", event.target.value)}
          options={options?.regiones || []}
        />

        <SelectField
          label="Rama"
          value={filters.ramaId}
          onChange={(event) => onChange("ramaId", event.target.value)}
          options={options?.ramas || []}
        />

        <SelectField
          label="Disciplina"
          value={filters.disciplinaId}
          onChange={(event) => onChange("disciplinaId", event.target.value)}
          options={options?.disciplinas || []}
        />
      </div>
    </section>
  );
}

import { Link } from "react-router-dom";

export default function NotFoundPage() {
  return (
    <section className="flex min-h-[70vh] items-center justify-center">
      <div className="w-full max-w-3xl rounded-[2rem] border border-slate-200 bg-white px-6 py-12 text-center shadow-sm md:px-10 md:py-16">
        <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-slate-500">
          Error de navegación
        </p>

        <h2 className="mt-4 text-5xl font-semibold tracking-tight text-slate-950 md:text-6xl">
          404
        </h2>

        <h3 className="mt-4 text-2xl font-semibold tracking-tight text-slate-900">
          Página no encontrada
        </h3>

        <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-slate-600 md:text-[15px]">
          La ruta que intentaste abrir no existe dentro de la aplicación o ya no
          está disponible. Podés volver al tablero principal para continuar
          explorando el observatorio.
        </p>

        <div className="mt-8">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-2xl border border-slate-200 bg-slate-950 px-5 py-3 text-sm font-medium text-white transition duration-200 hover:bg-slate-800"
          >
            Volver al tablero
          </Link>
        </div>
      </div>
    </section>
  );
}

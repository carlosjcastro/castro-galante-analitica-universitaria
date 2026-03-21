export default function Loader({ message = "Cargando información..." }) {
  return (
    <div className="flex min-h-[220px] items-center justify-center bg-white px-6 py-10 text-center">
      <div className="max-w-md">
        <div className="mx-auto mb-6 h-px w-16 bg-slate-300" />

        <div className="mx-auto mb-6 flex h-10 w-10 items-center justify-center">
          <div className="h-6 w-6 animate-spin rounded-full border-2 border-slate-300 border-t-slate-900" />
        </div>

        <p className="text-sm font-medium tracking-tight text-slate-800">
          {message}
        </p>

        <p className="mt-2 text-sm leading-6 text-slate-500">
          Estamos preparando la visualización y actualizando los datos del
          tablero.
        </p>
      </div>
    </div>
  );
}

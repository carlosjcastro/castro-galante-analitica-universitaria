import { useEffect, useState } from "react";

const STORAGE_KEY = "disclaimer_accepted";

export default function DisclaimerModal({ githubUrl = "#" }) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const accepted = sessionStorage.getItem(STORAGE_KEY);
    if (!accepted) setOpen(true);
  }, []);

  const handleClose = () => {
    sessionStorage.setItem(STORAGE_KEY, "1");
    setOpen(false);
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/55 px-4">
      <div className="w-full max-w-[480px] border border-slate-300 bg-white">
        <div className="border-b border-slate-200 px-6 py-5">
          <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-500">
            Aviso de uso
          </p>
          <h2 className="mt-1.5 text-lg font-semibold tracking-tight text-slate-950">
            Antes de explorar el dashboard
          </h2>
        </div>

        <div className="flex flex-col gap-3 px-6 py-5">
          <p className="text-sm leading-6 text-slate-600">
            Esta plataforma procesa un dataset real de inserción laboral
            universitaria en Argentina. Para mantenerla disponible de forma
            gratuita, el servidor tiene recursos limitados.
          </p>

          <div className="flex gap-3 border border-slate-200 bg-slate-50 px-4 py-3">
            <svg
              className="mt-0.5 h-4 w-4 shrink-0 text-slate-400"
              viewBox="0 0 16 16"
              fill="currentColor"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M8 1.5a6.5 6.5 0 1 0 0 13 6.5 6.5 0 0 0 0-13ZM0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8Z" />
              <path d="M8 6.5a.75.75 0 0 1 .75.75v4.25a.75.75 0 0 1-1.5 0V7.25A.75.75 0 0 1 8 6.5ZM8 5a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z" />
            </svg>
            <div>
              <p className="text-sm font-semibold text-slate-900">
                Los notebooks originales no están disponibles aquí
              </p>
              <p className="mt-1 text-sm leading-6 text-slate-600">
                Para evitar costos de infraestructura excesivos en el servidor, el
                acceso a los notebooks de análisis en GitHub no está habilitado
                desde esta aplicación.
              </p>
            </div>
          </div>

          <p className="text-sm leading-6 text-slate-600">
            Si querés revisar el análisis exploratorio completo, podés acceder
            directamente al repositorio en GitHub.
          </p>
        </div>

        <div className="flex items-center justify-end gap-2 border-t border-slate-200 px-6 py-4">
          <a
            href={githubUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="border border-slate-300 px-4 py-2 text-sm text-slate-600 hover:bg-slate-50"
          >
            Ver en GitHub
          </a>
          <button
            onClick={handleClose}
            className="border border-slate-900 bg-white px-5 py-2 text-sm font-semibold text-slate-950 hover:bg-slate-50 cursor-pointer"
          >
            Entendido
          </button>
        </div>
      </div>
    </div>
  );
}
import { NavLink, Outlet } from "react-router-dom";
import {
  BarChart3,
  GitCompareArrows,
  ArrowUpRight,
  BriefcaseBusiness,
  FileText,
  Linkedin,
  Github,
} from "lucide-react";
import logo from "../../assets/logo.png";

const navigation = [
  {
    to: "/",
    label: "Tablero",
    icon: BarChart3,
    end: true,
  },
  {
    to: "/comparar",
    label: "Comparar",
    icon: GitCompareArrows,
  },
  {
    to: "/documentacion",
    label: "Documentación",
    icon: FileText,
  },
];

const PORTFOLIO_URL = "https://carlosjcastrog.com";
const LINKEDIN_URL = "https://www.linkedin.com/in/carlosjcastrog/";
const GITHUB_URL = "https://github.com/carlosjcastro";
const CURRENT_YEAR = new Date().getFullYear();

const LOGO_SRC = logo;
const LOGO_ALT = "Logo del proyecto";

function cx(...classes) {
  return classes.filter(Boolean).join(" ");
}

function navItemClass(isActive) {
  return cx(
    "group inline-flex h-10 items-center gap-2 border-b-2 px-3 text-sm font-medium tracking-tight transition-colors duration-200",
    isActive
      ? "border-slate-950 text-slate-950"
      : "border-transparent text-slate-500 hover:text-slate-900",
  );
}

function navIconClass(isActive) {
  return cx(
    "h-4 w-4 shrink-0 transition-colors duration-200",
    isActive ? "text-slate-950" : "text-slate-400 group-hover:text-slate-700",
  );
}

function externalLinkClassName() {
  return "inline-flex items-center gap-2 text-sm text-slate-500 transition-colors duration-200 hover:text-slate-900";
}

function LogoSlot({ src, alt, variant = "header", className = "" }) {
  const sizeClass =
    variant === "footer"
      ? "h-12 w-12 sm:h-14 sm:w-14"
      : "h-16 w-16 sm:h-18 sm:w-18 md:h-20 md:w-20";

  if (src) {
    return (
      <div
        className={cx(
          "flex shrink-0 items-center justify-center",
          sizeClass,
          className,
        )}
      >
        <img
          src={src}
          alt={alt}
          className="block h-full w-full object-contain object-center"
        />
      </div>
    );
  }

  return (
    <div
      aria-hidden="true"
      className={cx(
        "flex shrink-0 items-center justify-center border border-dashed border-slate-300 bg-slate-50 text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-400",
        sizeClass,
        className,
      )}
    >
      Logo
    </div>
  );
}

function BrandBlock({ footer = false }) {
  return (
    <div
      className={cx(
        "grid min-w-0 grid-cols-[auto_minmax(0,1fr)] gap-4",
        footer ? "items-center" : "items-center",
      )}
    >
      <LogoSlot
        src={LOGO_SRC}
        alt={LOGO_ALT}
        variant={footer ? "footer" : "header"}
      />

      <div className="min-w-0">
        {footer ? (
          <>
            <p className="text-sm text-slate-600">
              Proyecto de análisis y visualización de datos educativos.
            </p>

            <div className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-2">
              <a
                href={PORTFOLIO_URL}
                target="_blank"
                rel="noreferrer"
                className={externalLinkClassName()}
                aria-label="Abrir portfolio de Carlos José Castro Galante"
              >
                <BriefcaseBusiness className="h-4 w-4" strokeWidth={1.8} />
                <span>Portfolio</span>
                <ArrowUpRight className="h-3.5 w-3.5" strokeWidth={1.8} />
              </a>

              <a
                href={LINKEDIN_URL}
                target="_blank"
                rel="noreferrer"
                className={externalLinkClassName()}
                aria-label="Abrir perfil de LinkedIn de Carlos José Castro Galante"
              >
                <Linkedin className="h-4 w-4" strokeWidth={1.8} />
                <span>LinkedIn</span>
                <ArrowUpRight className="h-3.5 w-3.5" strokeWidth={1.8} />
              </a>

              <a
                href={GITHUB_URL}
                target="_blank"
                rel="noreferrer"
                className={externalLinkClassName()}
                aria-label="Abrir perfil de GitHub de Carlos José Castro Galante"
              >
                <Github className="h-4 w-4" strokeWidth={1.8} />
                <span>GitHub</span>
                <ArrowUpRight className="h-3.5 w-3.5" strokeWidth={1.8} />
              </a>
            </div>
          </>
        ) : (
          <>
            <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-500">
              Analítica Universitaria
            </p>

            <div className="mt-1 flex flex-col gap-1 sm:flex-row sm:flex-wrap sm:items-baseline sm:gap-3">
              <h1 className="text-xl font-semibold tracking-tight text-slate-950 md:text-2xl">
                Castro Galante
              </h1>
              <span className="hidden text-slate-300 sm:inline">/</span>
              <p className="text-sm text-slate-600 md:text-[15px]">
                Inserción laboral y oportunidades
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default function AppLayout() {
  return (
    <div className="min-h-screen bg-white text-slate-900">
      <header className="border-b border-slate-200 bg-white">
        <div className="container-app">
          <div className="flex flex-col gap-4 py-4 md:gap-5 md:py-5">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <BrandBlock />

              <nav aria-label="Navegación principal" className="min-w-0">
                <ul className="flex min-h-10 flex-wrap items-center gap-x-4 gap-y-1">
                  {navigation.map(({ to, label, icon: Icon, end }) => (
                    <li key={to}>
                      <NavLink to={to} end={end}>
                        {({ isActive }) => (
                          <span className={navItemClass(isActive)}>
                            <Icon
                              className={navIconClass(isActive)}
                              strokeWidth={1.9}
                            />
                            <span>{label}</span>
                          </span>
                        )}
                      </NavLink>
                    </li>
                  ))}
                </ul>
              </nav>
            </div>
          </div>
        </div>
      </header>

      <main className="container-app py-6 md:py-8 lg:py-10">
        <Outlet />
      </main>

      <footer className="mt-12 border-t border-slate-200 bg-white">
        <div className="container-app">
          <div className="flex flex-col gap-5 py-5 md:gap-6">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <BrandBlock footer />

              <div className="shrink-0 text-left md:text-right">
                <p className="text-sm font-medium tracking-tight text-slate-800">
                  © {CURRENT_YEAR} Carlos José Castro Galante
                </p>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

import {
  ArrowUpRight,
  BookOpenText,
  Database,
  FileText,
  GraduationCap,
  ShieldCheck,
  SquareTerminal,
} from "lucide-react";

const CURRENT_YEAR = new Date().getFullYear();

const PROJECT_NAME = "Castro Galante / Analítica Universitaria";
const ACADEMIC_CONTEXT =
  "Proyecto desarrollado para presentación académica y técnica en UTN";
const AUTHOR_NAME = "Carlos José Castro Galante";

const SOURCE_LINKS = [
  {
    label: "Portal oficial de datos abiertos de Argentina",
    href: "https://datos.gob.ar/",
  },
];

const overviewItems = [
  {
    label: "Proyecto",
    value: "Académico, técnico y de portfolio",
  },
  {
    label: "Autor",
    value: AUTHOR_NAME,
  },
  {
    label: "Datos",
    value: "Fuentes públicas y abiertas",
  },
  {
    label: "Institución",
    value: "UTN",
  },
];

const documentationSections = [
  {
    id: "proposito",
    eyebrow: "Proyecto",
    title: "Qué es esta plataforma",
    icon: GraduationCap,
    lead: "Esta sección explica el objetivo general del proyecto y el tipo de problema que busca resolver.",
    paragraphs: [
      "La plataforma fue desarrollada para analizar y visualizar inserción laboral formal, brechas, trayectorias y oportunidades de graduados universitarios en Argentina.",
      "El propósito no es solo mostrar datos, sino convertir información pública en una herramienta clara, entendible y útil para lectura académica, técnica y profesional.",
    ],
  },
  {
    id: "uso",
    eyebrow: "Uso",
    title: "Cómo usar el tablero",
    icon: BookOpenText,
    lead: "El sistema fue pensado para que cualquier usuario pueda pasar de una visión general a una lectura más específica.",
    paragraphs: [
      "El tablero principal permite aplicar filtros por año, gestión, género, región, rama y disciplina. Cada selección modifica indicadores, gráficos y rankings disponibles.",
      "La vista comparativa permite enfrentar dos disciplinas para observar diferencias en empleo formal y salario mediano a lo largo del tiempo.",
    ],
    bullets: [
      "Empezar por la vista general para entender el conjunto completo.",
      "Aplicar filtros para concentrarse en segmentos específicos.",
      "Usar el comparador para estudiar diferencias entre disciplinas.",
      "Revisar rankings y métricas para sintetizar hallazgos relevantes.",
    ],
  },
  {
    id: "metodologia",
    eyebrow: "Metodología",
    title: "Cómo fue construido el proyecto",
    icon: SquareTerminal,
    lead: "La plataforma integra procesamiento, visualización, estructura full stack y documentación dentro de una sola experiencia.",
    paragraphs: [
      "El proyecto separa frontend, backend y capa de datos para mantener claridad técnica, reutilización de componentes y facilidad de mantenimiento.",
      "La propuesta combina visualización comparativa, lectura interpretativa y organización de contenidos para que el análisis sea comprensible y navegable.",
    ],
    bullets: [
      "Frontend desarrollado en React y Vite.",
      "Backend implementado con FastAPI.",
      "Visualizaciones construidas sobre datos procesados.",
      "Enfoque centrado en legibilidad, estructura y utilidad académica.",
    ],
  },
  {
    id: "datos",
    eyebrow: "Datos",
    title: "Qué significa que los datos sean públicos",
    icon: Database,
    lead: "Esta aclaración es importante para diferenciar la fuente de datos de la autoría del desarrollo.",
    paragraphs: [
      "La información utilizada en este proyecto proviene de fuentes públicas y abiertas. Eso significa que los datos no son de propiedad exclusiva del autor.",
      "Sin embargo, la selección, organización, integración, presentación, visualización, estructura técnica, lógica analítica y documentación desarrolladas en esta plataforma constituyen una creación original.",
      "En otras palabras, los datos conservan su carácter público, pero el proyecto que los procesa y presenta de esta forma concreta es una obra propia.",
    ],
  },
  {
    id: "copyright",
    eyebrow: "Titularidad",
    title: "Autoría, uso y derechos del proyecto",
    icon: ShieldCheck,
    lead: "Esta sección delimita con claridad qué parte del trabajo es de fuente pública y qué parte pertenece al desarrollo original del autor.",
    paragraphs: [
      "El código fuente, la arquitectura del sistema, la experiencia de usuario, la documentación, la organización visual y la implementación completa de esta plataforma pertenecen a Carlos José Castro Galante.",
      "La disponibilidad pública de los datos no habilita la copia del desarrollo, la interfaz, la lógica implementada ni la documentación original sin atribución correspondiente.",
      "Este proyecto fue desarrollado con fines académicos, profesionales y de portfolio, y puede presentarse como producción propia del autor en contextos universitarios, técnicos y laborales.",
    ],
    bullets: [
      "Los datos utilizados mantienen su condición pública según su fuente original.",
      "La implementación del sistema y su diseño son de autoría propia.",
      "La documentación y la estructura del producto forman parte del desarrollo original.",
      "La presentación académica está orientada al contexto de UTN.",
    ],
  },
];

function SectionAnchor({ href, index, children }) {
  return (
    <a
      href={href}
      className="flex items-start justify-between gap-4 border-b border-slate-100 py-3 text-sm text-slate-600 transition-colors duration-200 hover:text-slate-950 last:border-b-0"
    >
      <span className="flex min-w-0 items-start gap-3">
        <span className="text-slate-400">{String(index).padStart(2, "0")}</span>
        <span>{children}</span>
      </span>
      <span className="text-slate-300">↗</span>
    </a>
  );
}

function ExternalLink({ href, children }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className="inline-flex items-center gap-2 text-sm text-slate-600 transition-colors duration-200 hover:text-slate-950"
    >
      <span>{children}</span>
      <ArrowUpRight className="h-3.5 w-3.5" strokeWidth={1.8} />
    </a>
  );
}

function OverviewItem({ label, value }) {
  return (
    <div className="border-t border-slate-200 py-4 first:border-t-0 first:pt-0">
      <dt className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">
        {label}
      </dt>
      <dd className="mt-2 text-sm font-medium leading-6 text-slate-900">
        {value}
      </dd>
    </div>
  );
}

function SectionBlock({ section }) {
  const Icon = section.icon;

  return (
    <section
      id={section.id}
      className="grid gap-6 border-t border-slate-300 pt-6 scroll-mt-24 lg:grid-cols-[220px_minmax(0,1fr)]"
    >
      <div className="space-y-3">
        <div className="inline-flex items-center gap-2 text-slate-500">
          <Icon className="h-4 w-4" strokeWidth={1.8} />
          <span className="text-[11px] font-semibold uppercase tracking-[0.22em]">
            {section.eyebrow}
          </span>
        </div>

        <h2 className="text-xl font-semibold tracking-tight text-slate-950">
          {section.title}
        </h2>
      </div>

      <div className="space-y-5">
        <p className="border-l-2 border-slate-200 pl-4 text-sm leading-7 text-slate-700 md:text-[15px]">
          {section.lead}
        </p>

        <div className="space-y-4">
          {section.paragraphs.map((paragraph) => (
            <p
              key={paragraph}
              className="text-sm leading-7 text-slate-600 md:text-[15px]"
            >
              {paragraph}
            </p>
          ))}
        </div>

        {section.bullets?.length ? (
          <ul className="grid gap-3 border-t border-slate-200 pt-4">
            {section.bullets.map((item) => (
              <li
                key={item}
                className="grid gap-3 text-sm leading-6 text-slate-600 md:grid-cols-[12px_minmax(0,1fr)]"
              >
                <span className="mt-2 inline-block h-[6px] w-[6px] bg-slate-400" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        ) : null}
      </div>
    </section>
  );
}

export default function DocumentationPage() {
  return (
    <div className="space-y-14">
      <section className="grid gap-10 xl:grid-cols-[minmax(0,1.35fr)_320px] xl:items-start">
        <div className="space-y-6 border-t border-slate-300 pt-6">
          <div className="space-y-3">
            <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-slate-500">
              Documentación del proyecto
            </p>

            <h1 className="max-w-4xl text-3xl font-semibold leading-tight tracking-tight text-slate-950 md:text-5xl">
              Uso, alcance, datos públicos y autoría del desarrollo
            </h1>

            <p className="max-w-3xl text-sm leading-8 text-slate-600 md:text-[15px]">
              Esta página reúne de forma ordenada la información esencial del
              proyecto: qué hace la plataforma, cómo utilizarla, de dónde salen
              los datos y qué parte del trabajo corresponde al desarrollo
              original.
            </p>
          </div>

          <div className="border-t border-slate-200 pt-4">
            <p className="text-sm font-medium text-slate-800">{PROJECT_NAME}</p>
            <p className="mt-1 text-sm text-slate-500">{ACADEMIC_CONTEXT}</p>
          </div>
        </div>

        <aside className="space-y-5 border-t border-slate-300 pt-6 xl:sticky xl:top-24">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-500">
              Navegación
            </p>
            <h2 className="mt-2 text-lg font-semibold tracking-tight text-slate-950">
              Contenido de la página
            </h2>
          </div>

          <nav className="border-top border-slate-200">
            {documentationSections.map((section, index) => (
              <SectionAnchor
                key={section.id}
                href={`#${section.id}`}
                index={index + 1}
              >
                {section.title}
              </SectionAnchor>
            ))}
          </nav>

          <div className="border-t border-slate-200 pt-4">
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">
              Fuente pública
            </p>

            <div className="mt-3 space-y-3">
              {SOURCE_LINKS.map((link) => (
                <ExternalLink key={link.href} href={link.href}>
                  {link.label}
                </ExternalLink>
              ))}
            </div>
          </div>
        </aside>
      </section>

      <section className="grid gap-10 xl:grid-cols-[minmax(0,1fr)_320px] xl:items-start">
        <div className="border-t border-slate-300 pt-6">
          <div className="max-w-3xl">
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-500">
              Resumen rápido
            </p>
            <h2 className="mt-2 text-xl font-semibold tracking-tight text-slate-950">
              Lo esencial del proyecto
            </h2>
          </div>

          <dl className="mt-6 grid gap-x-8 md:grid-cols-2">
            {overviewItems.map((item) => (
              <OverviewItem
                key={item.label}
                label={item.label}
                value={item.value}
              />
            ))}
          </dl>
        </div>

        <aside className="border-t border-slate-300 pt-6">
          <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-500">
            Aclaración clave
          </p>
          <h2 className="mt-2 text-lg font-semibold tracking-tight text-slate-950">
            Datos públicos, desarrollo propio
          </h2>

          <div className="mt-4 border-t border-slate-200 pt-4 text-sm leading-7 text-slate-600">
            Los datos utilizados conservan su carácter público según la fuente
            original. La implementación técnica, la estructura del sistema, la
            visualización, la documentación y la lógica del proyecto son de
            autoría propia.
          </div>
        </aside>
      </section>

      {documentationSections.map((section) => (
        <SectionBlock key={section.id} section={section} />
      ))}

      <section className="grid gap-6 border-t border-slate-300 pt-6 lg:grid-cols-[220px_minmax(0,1fr)]">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 text-slate-500">
            <FileText className="h-4 w-4" strokeWidth={1.8} />
            <span className="text-[11px] font-semibold uppercase tracking-[0.22em]">
              Cierre
            </span>
          </div>

          <h2 className="text-xl font-semibold tracking-tight text-slate-950">
            Declaración final
          </h2>
        </div>

        <div className="space-y-4">
          <p className="text-sm leading-7 text-slate-600 md:text-[15px]">
            Este proyecto utiliza datos públicos, pero no se limita a reproducir
            información existente: constituye una producción técnica y visual
            propia, con diseño, estructura, documentación e interpretación
            desarrolladas específicamente para esta plataforma.
          </p>

          <p className="text-sm leading-7 text-slate-600 md:text-[15px]">
            © {CURRENT_YEAR} {AUTHOR_NAME}. Proyecto original desarrollado para
            uso académico, presentación técnica y portfolio profesional.
          </p>
        </div>
      </section>
    </div>
  );
}

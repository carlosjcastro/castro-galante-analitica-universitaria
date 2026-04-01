# Castro Galante - Analítica Universitaria - Full Stack

Aplicación full stack construida a partir del análisis original en notebook. El proyecto transforma el trabajo práctico en un producto web con frontend en React + Vite + Tailwind CSS y backend en FastAPI.

## Objetivo

Explorar la inserción laboral formal de graduados universitarios en Argentina y convertir los resultados del análisis en una experiencia web usable, visual y escalable.

## Stack tecnológico

### Frontend
- React
- Vite
- Tailwind CSS
- Recharts
- React Router DOM
- Axios

### Backend
- FastAPI
- Pandas
- NumPy
- OpenPyXL

## Estructura del proyecto

```text
castro-galante-analitica-universitaria-fullstack/
├─ backend/
│  ├─ app/
│  │  ├─ api/
│  │  ├─ core/
│  │  ├─ services/
│  │  └─ main.py
│  ├─ data/raw/
│  └─ requirements.txt
├─ frontend/
│  ├─ src/
│  ├─ package.json
│  └─ vite.config.js
└─ README.md
```

## Requisitos previos

### Backend
- Python 3.11 o superior recomendado

### Frontend
- Node.js 20.19 o superior recomendado
- npm instalado

## Ejecución del backend

```bash
cd backend
python -m venv .venv
source .venv/Scripts/activate  # Git Bash
# o .venv\Scripts\Activate.ps1 en PowerShell
pip install -r requirements.txt
fastapi dev app/main.py
```

Backend disponible en:
- http://127.0.0.1:8000
- documentación Swagger: http://127.0.0.1:8000/docs

## Ejecución del frontend

En otra terminal:
=======
<p align="center">
  <img src="logo-wb.png" alt="Logo Castro Galante Analítica Universitaria" width="400" />
</p>

# Castro Galante - Analítica Universitaria

Plataforma de análisis y visualización de la inserción laboral formal de graduados universitarios en Argentina. Permite explorar datos por disciplina, gestión institucional, género, región y año, con foco en empleo formal, salario mediano y brechas estructurales.

---

## Tabla de contenidos

- [Descripción general](#descripción-general)
- [Funcionalidades](#funcionalidades)
- [Tecnologías](#tecnologías)
- [Estructura del proyecto](#estructura-del-proyecto)
- [Instalación y configuración local](#instalación-y-configuración-local)
- [Variables de entorno](#variables-de-entorno)
- [API - Endpoints disponibles](#api--endpoints-disponibles)
- [Despliegue](#despliegue)

---

## Descripción general

El Radar Universitario Argentino es una herramienta de lectura comparativa sobre el mercado laboral de egresados universitarios. A partir de un dataset de registros individuales enriquecido con un diccionario de categorías, calcula indicadores clave y los expone a través de una API REST consumida por un dashboard interactivo.

El sistema está diseñado para soportar filtros combinados por año, gestión institucional (pública/privada), género, región geográfica, disciplina y rama del conocimiento.

---

## Funcionalidades

### Dashboard principal

- **KPIs globales** - registros totales, graduados únicos, tasa de empleo formal, salario promedio, salario mediano y edad promedio al egreso.
- **Evolución temporal** - serie anual de tasa de empleo formal y salario mediano para el subconjunto filtrado.
- **Comparativa por gestión** - empleo formal y salario mediano según gestión estatal o privada.
- **Comparativa por género y gestión** - tasa de empleo formal cruzada entre género e institución.
- **Ranking regional** - empleo formal y salario mediano por región geográfica.
- **Índice de oportunidad** - ranking compuesto por disciplina que combina empleo formal (55 %) y salario mediano (45 %), normalizado sobre el subconjunto.
- **Mapa de oportunidades** - scatter plot que cruza empleo formal, salario mediano y volumen de graduados por disciplina.

### Comparador de disciplinas

- Selección de dos disciplinas para contrastar su evolución temporal en empleo formal y salario mediano.
- Resumen automático del año más reciente con identificación del ganador en cada indicador.

### Filtros globales

Todos los gráficos y KPIs responden a filtros combinables por:

| Dimensión | Descripción |
|---|---|
| Año | Uno o varios años del período disponible |
| Gestión | Estatal / Privada |
| Género | Femenino / Masculino / Otro |
| Región | Región geográfica del graduado |
| Disciplina | Área disciplinar específica |
| Rama | Rama del conocimiento |

---

## Tecnologías

### Backend

| Tecnología | Uso |
|---|---|
| Python 3.11+ | Lenguaje base |
| FastAPI | Framework API REST |
| Pandas | Procesamiento y análisis de datos |
| NumPy | Cálculos numéricos |
| Uvicorn | Servidor ASGI |

### Frontend

| Tecnología | Uso |
|---|---|
| React 18 | Framework UI |
| Recharts | Gráficos y visualizaciones |
| Axios | Cliente HTTP |
| Tailwind CSS | Estilos utilitarios |
| Vite | Bundler y dev server |

---

## Estructura del proyecto

```
.
├── backend/
│   ├── app/
│   │   ├── api/
│   │   │   └── v1/
│   │   │       └── endpoints/
│   │   │           └── dashboard.py       # Endpoints REST
│   │   ├── core/
│   │   │   └── config.py                  # Configuración y variables de entorno
│   │   ├── services/
│   │   │   ├── data_loader.py             # Carga y enriquecimiento del dataset
│   │   │   └── dashboard_service.py       # Lógica de negocio y agregaciones
│   │   └── main.py                        # Aplicación FastAPI y lifespan
│   ├── data/
│   │   └── raw/
│   │       ├── base_araucano.csv          # Dataset principal
│   │       └── diccionario_araucano.xlsx  # Diccionario de categorías
│   └── requirements.txt
│
└── frontend/
    ├── src/
    │   ├── api/
    │   │   └── client.js                  # Cliente HTTP centralizado
    │   ├── components/
    │   │   ├── dashboard/                 # FilterPanel, KPIGrid, OpportunityTable
    │   │   ├── charts/                    # ChartCard
    │   │   └── ui/                        # Loader
    │   ├── hooks/
    │   │   └── useDashboardData.js        # Estado y fetching del dashboard
    │   ├── pages/
    │   │   ├── DashboardPage.jsx          # Página principal
    │   │   └── ComparePage.jsx            # Comparador de disciplinas
    │   └── utils/
    │       └── format.js                  # Formateo de moneda y porcentaje
    ├── .env.example
    └── vite.config.js
```

---

## Instalación y configuración local

### Requisitos previos

- Python 3.11 o superior
- Node.js 18 o superior
- El archivo `base_araucano.csv` y `diccionario_araucano.xlsx` ubicados en `backend/data/raw/`

### Backend

```bash
cd backend
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```

La API quedará disponible en `http://localhost:8000`.  
La documentación interactiva en `http://localhost:8000/docs`.

### Frontend

```bash
cd frontend
npm install
npm run dev
```

Frontend disponible en:
- http://127.0.0.1:5173

## Rutas principales del frontend

- `/` tablero principal
- `/comparar` comparador de disciplinas

## Endpoints principales del backend

- `GET /api/v1/meta`
- `GET /api/v1/filters`
- `GET /api/v1/kpis`
- `GET /api/v1/charts/empleo-evolucion`
- `GET /api/v1/charts/gestion-resumen`
- `GET /api/v1/charts/genero-gestion`
- `GET /api/v1/charts/region-empleo`
- `GET /api/v1/charts/region-salario`
- `GET /api/v1/rankings/indice-oportunidad`
- `GET /api/v1/charts/scatter-disciplinas`
- `GET /api/v1/compare`

## Qué hace la aplicación

- muestra KPIs clave del conjunto filtrado
- visualiza evolución de empleo formal y salarios
- compara gestión estatal y privada
- permite analizar diferencias por género y región
- construye un índice propio de oportunidad por disciplina
- incluye un comparador temporal entre dos disciplinas

## Próximas mejoras sugeridas

- autenticación y perfiles de usuario
- favoritos o vistas guardadas
- exportación a PDF y CSV
- mapas geográficos por provincia
- storytelling automático con insights generados
- base de datos relacional para desacoplar la capa de archivos
- tests unitarios y tests de integración

## Git

```bash
git init
git add .
git commit -m "feat: castro-galante-analitica-universitaria - full stack"
```
=======
cp .env.example .env
npm run dev
```

El frontend quedará disponible en `http://localhost:5173`.

---

## Variables de entorno

### Backend (`backend/.env` o variables del servicio en Railway)

| Variable | Descripción | Valor por defecto |
|---|---|---|
| `FRONTEND_ORIGINS` | Lista de orígenes permitidos por CORS, separados por coma | Localhost + dominios de producción definidos en `config.py` |

### Frontend (`frontend/.env`)

| Variable | Descripción | Ejemplo |
|---|---|---|
| `VITE_API_URL` | URL base del backend | `https://castro-galante-analitica-universitaria-castro-galante-analitica.up.railway.app` |

---

## API - Endpoints disponibles

Todos los endpoints tienen el prefijo `/api/v1`.

| Método | Ruta | Descripción |
|---|---|---|
| `GET` | `/health` | Estado del servicio |
| `GET` | `/meta` | Metadatos del dataset (registros, años, disciplinas, regiones) |
| `GET` | `/filters` | Opciones disponibles para todos los filtros |
| `GET` | `/kpis` | KPIs globales con filtros opcionales |
| `GET` | `/charts/empleo-evolucion` | Serie anual de empleo formal y salario mediano |
| `GET` | `/charts/gestion-resumen` | Resumen por gestión institucional para un año |
| `GET` | `/charts/genero-gestion` | Empleo formal por género y gestión para un año |
| `GET` | `/charts/region-empleo` | Empleo formal por región para un año |
| `GET` | `/charts/region-salario` | Salario mediano por región para un año |
| `GET` | `/rankings/indice-oportunidad` | Ranking de disciplinas por índice de oportunidad |
| `GET` | `/charts/scatter-disciplinas` | Datos para el scatter plot de disciplinas |
| `GET` | `/compare` | Evolución comparada de dos disciplinas |

### Parámetros de filtro comunes

| Parámetro | Tipo | Descripción |
|---|---|---|
| `anios` | `int[]` | Uno o varios años |
| `gestion_ids` | `int[]` | IDs de gestión |
| `genero_ids` | `int[]` | IDs de género |
| `region_ids` | `int[]` | IDs de región |
| `disciplina_ids` | `int[]` | IDs de disciplina |
| `rama_ids` | `int[]` | IDs de rama |

---

## Despliegue

### Backend - Railway

1. Conectar el repositorio en [railway.app](https://railway.app).
2. Configurar el directorio raíz como `backend/`.
3. Agregar la variable de entorno `FRONTEND_ORIGINS` con el dominio del frontend.
4. Railway detecta automáticamente el comando de inicio: `fastapi run app/main.py --host 0.0.0.0 --port $PORT`.

### Frontend - Vercel / hosting estático

1. Configurar el directorio raíz como `frontend/`.
2. Agregar la variable de entorno `VITE_API_URL` con la URL pública del backend en Railway.
3. Comando de build: `npm run build`.
4. Directorio de salida: `dist/`.

---


## Licencia

MIT

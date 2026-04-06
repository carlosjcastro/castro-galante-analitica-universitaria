# Castro Galante Analítica Universitaria - Full Stack

Plataforma de análisis y visualización de la inserción laboral formal de graduados universitarios en Argentina. Construida sobre un notebook de análisis original, el proyecto transforma ese trabajo en un producto web completo con frontend en React y backend en FastAPI.

-----

## Descripción general

El Radar Universitario Argentino permite explorar la situación laboral de egresados universitarios argentinos a partir de un dataset de registros individuales enriquecido con un diccionario de categorías. El sistema calcula indicadores clave y los expone a través de una API REST consumida por un dashboard interactivo.

Los datos se pueden filtrar por año, gestión institucional (pública o privada), género, región geográfica, disciplina y rama del conocimiento. Todos los gráficos y KPIs responden a esos filtros de forma combinada.

-----

## Funcionalidades

### Dashboard principal

- **KPIs globales:** registros totales, graduados únicos, tasa de empleo formal, salario promedio, salario mediano y edad promedio al egreso.
- **Evolución temporal:** serie anual de tasa de empleo formal y salario mediano para el subconjunto filtrado.
- **Comparativa por gestión:** empleo formal y salario mediano según gestión estatal o privada.
- **Comparativa por género y gestión:** tasa de empleo formal cruzada entre género e institución.
- **Ranking regional:** empleo formal y salario mediano por región geográfica.
- **Índice de oportunidad:** ranking compuesto por disciplina que combina empleo formal (55%) y salario mediano (45%), normalizado sobre el subconjunto filtrado.
- **Mapa de oportunidades:** scatter plot que cruza empleo formal, salario mediano y volumen de graduados por disciplina.

### Comparador de disciplinas

- Selección de dos disciplinas para contrastar su evolución temporal en empleo formal y salario mediano.
- Resumen automático del año más reciente con identificación del indicador ganador en cada dimensión.

### Filtros globales

|Dimensión |Descripción                             |
|----------|----------------------------------------|
|Año       |Uno o varios años del período disponible|
|Gestión   |Estatal / Privada                       |
|Género    |Femenino / Masculino / Otro             |
|Región    |Región geográfica del graduado          |
|Disciplina|Área disciplinar específica             |
|Rama      |Rama del conocimiento                   |

-----

## Stack tecnológico

### Frontend

|Tecnología      |Uso                       |
|----------------|--------------------------|
|React 18        |Framework UI              |
|Vite            |Bundler y dev server      |
|Tailwind CSS    |Estilos utilitarios       |
|Recharts        |Gráficos y visualizaciones|
|React Router DOM|Enrutamiento              |
|Axios           |Cliente HTTP              |

### Backend

|Tecnología  |Uso                              |
|------------|---------------------------------|
|Python 3.11+|Lenguaje base                    |
|FastAPI     |Framework API REST               |
|Pandas      |Procesamiento y análisis de datos|
|NumPy       |Cálculos numéricos               |
|OpenPyXL    |Lectura de archivos Excel        |
|Uvicorn     |Servidor ASGI                    |

-----

## Estructura del proyecto

```
castro-galante-analitica-universitaria-fullstack/
├── backend/
│   ├── app/
│   │   ├── api/
│   │   │   └── v1/
│   │   │       └── endpoints/
│   │   │           └── dashboard.py
│   │   ├── core/
│   │   │   └── config.py
│   │   ├── services/
│   │   │   ├── data_loader.py
│   │   │   └── dashboard_service.py
│   │   └── main.py
│   ├── data/
│   │   └── raw/
│   │       ├── base_araucano.csv
│   │       └── diccionario_araucano.xlsx
│   └── requirements.txt
└── frontend/
    ├── src/
    │   ├── api/
    │   │   └── client.js
    │   ├── components/
    │   │   ├── dashboard/
    │   │   ├── charts/
    │   │   └── ui/
    │   ├── hooks/
    │   │   └── useDashboardData.js
    │   ├── pages/
    │   │   ├── DashboardPage.jsx
    │   │   └── ComparePage.jsx
    │   └── utils/
    │       └── format.js
    ├── .env.example
    └── vite.config.js
```

-----

## Requisitos previos

- Python 3.11 o superior
- Node.js 20.19 o superior
- Los archivos `base_araucano.csv` y `diccionario_araucano.xlsx` ubicados en `backend/data/raw/`

-----

## Instalación y ejecución local

### Backend

```bash
cd backend
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```

La API queda disponible en `http://localhost:8000`.  
La documentación interactiva Swagger en `http://localhost:8000/docs`.

### Frontend

En otra terminal:

```bash
cd frontend
cp .env.example .env
npm install
npm run dev
```

El frontend queda disponible en `http://localhost:5173`.

### Rutas principales del frontend

|Ruta       |Descripción              |
|-----------|-------------------------|
|`/`        |Tablero principal        |
|`/comparar`|Comparador de disciplinas|

-----

## Variables de entorno

### Backend (`backend/.env`)

|Variable          |Descripción                                     |Valor por defecto                                          |
|------------------|------------------------------------------------|-----------------------------------------------------------|
|`FRONTEND_ORIGINS`|Orígenes permitidos por CORS, separados por coma|Localhost + dominios de producción definidos en `config.py`|

### Frontend (`frontend/.env`)

|Variable      |Descripción         |Ejemplo                                                                                 |
|--------------|--------------------|----------------------------------------------------------------------------------------|
|`VITE_API_URL`|URL base del backend|`https://castro-galante-analitica-universitaria-castro-galante-analitica.up.railway.app`|

-----

## API - Endpoints disponibles

Todos los endpoints tienen el prefijo `/api/v1`.

|Método|Ruta                          |Descripción                                                   |
|------|------------------------------|--------------------------------------------------------------|
|`GET` |`/health`                     |Estado del servicio                                           |
|`GET` |`/meta`                       |Metadatos del dataset (registros, años, disciplinas, regiones)|
|`GET` |`/filters`                    |Opciones disponibles para todos los filtros                   |
|`GET` |`/kpis`                       |KPIs globales con filtros opcionales                          |
|`GET` |`/charts/empleo-evolucion`    |Serie anual de empleo formal y salario mediano                |
|`GET` |`/charts/gestion-resumen`     |Resumen por gestión institucional para un año                 |
|`GET` |`/charts/genero-gestion`      |Empleo formal por género y gestión para un año                |
|`GET` |`/charts/region-empleo`       |Empleo formal por región para un año                          |
|`GET` |`/charts/region-salario`      |Salario mediano por región para un año                        |
|`GET` |`/rankings/indice-oportunidad`|Ranking de disciplinas por índice de oportunidad              |
|`GET` |`/charts/scatter-disciplinas` |Datos para el scatter plot de disciplinas                     |
|`GET` |`/compare`                    |Evolución comparada de dos disciplinas                        |

### Parámetros de filtro comunes

|Parámetro       |Tipo   |Descripción      |
|----------------|-------|-----------------|
|`anios`         |`int[]`|Uno o varios años|
|`gestion_ids`   |`int[]`|IDs de gestión   |
|`genero_ids`    |`int[]`|IDs de género    |
|`region_ids`    |`int[]`|IDs de región    |
|`disciplina_ids`|`int[]`|IDs de disciplina|
|`rama_ids`      |`int[]`|IDs de rama      |

-----

## Próximas mejoras

- Autenticación y perfiles de usuario
- Favoritos y vistas guardadas
- Exportación a PDF y CSV
- Mapas geográficos por provincia
- Storytelling automático con insights generados por el sistema
- Base de datos relacional para desacoplar la capa de archivos planos
- Tests unitarios y de integración

-----

## Licencia

MIT

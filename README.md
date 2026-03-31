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

# Guía paso a paso - Castro Galante - Analítica Universitaria

## 1. Abrir el proyecto

Descomprimí la carpeta y abrila completa en Visual Studio Code.

## 2. Levantar el backend

Abrí una terminal y ejecutá:

```bash
cd backend
python -m venv .venv
source .venv/Scripts/activate
pip install -r requirements.txt
fastapi dev app/main.py
```

Si usás PowerShell, la activación cambia por esta:

```powershell
.venv\Scripts\Activate.ps1
```

Cuando quede levantado, probá estas URLs:

- http://127.0.0.1:8000
- http://127.0.0.1:8000/docs

## 3. Levantar el frontend

Abrí otra terminal, sin cerrar la del backend:

```bash
cd frontend
npm install
npm run dev
```

Abrí luego:

- http://127.0.0.1:5173

## 4. Qué vas a ver

### Pantalla principal
- portada del producto
- resumen del dataset
- filtros analíticos
- tarjetas KPI
- gráficos de evolución
- gráficos por gestión, género y región
- ranking de índice de oportunidad
- scatter de disciplinas

### Comparador
- selección de dos disciplinas
- comparación temporal de empleo formal
- comparación temporal de salario mediano

## 5. Cómo se conecta todo

### Backend
El backend hace lo siguiente:
- carga el CSV principal
- carga el Excel de diccionarios
- enriquece el dataset con etiquetas legibles
- calcula variables derivadas como empleo formal y edad al egreso
- expone endpoints listos para el frontend

### Frontend
El frontend hace lo siguiente:
- consulta los endpoints del backend
- muestra filtros y métricas
- dibuja gráficos interactivos
- organiza la experiencia en rutas y componentes reutilizables

## 6. Archivos más importantes

### Backend
- `backend/app/main.py` punto de entrada
- `backend/app/core/config.py` configuración principal
- `backend/app/services/data_loader.py` carga y enriquecimiento del dataset
- `backend/app/services/dashboard_service.py` lógica analítica
- `backend/app/api/v1/endpoints/dashboard.py` endpoints

### Frontend
- `frontend/src/App.jsx` rutas principales
- `frontend/src/api/client.js` cliente HTTP
- `frontend/src/hooks/useDashboardData.js` carga del tablero
- `frontend/src/pages/DashboardPage.jsx` pantalla principal
- `frontend/src/pages/ComparePage.jsx` pantalla de comparación

## 7. Orden recomendado de trabajo

1. levantar backend
2. abrir `/docs` y revisar endpoints
3. levantar frontend
4. verificar tablero
5. verificar comparador
6. ajustar estilos, textos o métricas
7. subir a GitHub

## 8. Si algo falla

### Error en backend por dependencias
Ejecutá otra vez:

```bash
pip install -r requirements.txt
```

### Error en frontend por paquetes
Ejecutá:

```bash
npm install
```

### Error de conexión entre frontend y backend
Comprobá que el backend esté abierto en `http://127.0.0.1:8000`.

### Error de puertos ocupados
Podés cambiar puertos en:
- `frontend/vite.config.js`
- comando del backend con host/port si más adelante querés personalizarlo

## 9. Siguiente mejora sugerida

Una vez que lo tengas corriendo, el siguiente paso lógico es:
- agregar un endpoint de insights automáticos
- permitir exportar reportes
- incorporar autenticación
- persistir configuraciones de filtros

## 10. Publicación

### Backend
Podés desplegarlo luego en Render, Railway o una VM.

### Frontend
Podés desplegarlo en Vercel o Netlify.

## 11. GitHub

```bash
git init
git add .
git commit -m "feat: Castro Galante - análitica universitaria argentino full stack"
```

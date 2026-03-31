from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.v1.endpoints.dashboard import router as dashboard_router
from app.core.config import API_PREFIX, APP_NAME, APP_VERSION, FRONTEND_ORIGINS
from app.services.data_loader import get_repository


@asynccontextmanager
async def lifespan(app: FastAPI):
    get_repository()
    yield


app = FastAPI(
    title=APP_NAME,
    version=APP_VERSION,
    description='API para visualizar inserción laboral formal de graduados universitarios en Argentina.',
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=FRONTEND_ORIGINS,
    allow_credentials=True,
    allow_methods=['*'],
    allow_headers=['*'],
)

app.include_router(dashboard_router, prefix=API_PREFIX)


@app.get('/')
def read_root() -> dict:
    return {
        'message': 'Castro-Galante Analítica Universitaria API',
        'docs': '/docs',
        'api_prefix': API_PREFIX,
    }
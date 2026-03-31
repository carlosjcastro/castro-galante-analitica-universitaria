import os
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parents[2]
DATA_DIR = BASE_DIR / 'data' / 'raw'
CSV_PATH = DATA_DIR / 'base_araucano.csv'
DICTIONARY_PATH = DATA_DIR / 'diccionario_araucano.xlsx'

API_PREFIX = '/api/v1'
APP_NAME = 'Castro-Galante Analítica Universitaria API'
APP_VERSION = '1.0.0'

_default_origins = ','.join([
    'http://localhost:5173',
    'http://127.0.0.1:5173',
    'http://localhost:4173',
    'http://127.0.0.1:4173',
    'https://castro-galante-analitica.carlosjcastrog.com',
    'https://carlosjcastrog.com',
    'https://www.carlosjcastrog.com',
    'https://castro-galante-analitica-universitaria-castro-galante-analitica.up.railway.app',
])

FRONTEND_ORIGINS = os.getenv('FRONTEND_ORIGINS', _default_origins).split(',')
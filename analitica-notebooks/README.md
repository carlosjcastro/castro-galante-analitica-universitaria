# Castro Galante - Analítica Universitaria

Analisis exploratorio de insercion laboral formal y brechas de graduados universitarios en Argentina.

Este proyecto fue desarrollado como trabajo practico final del curso de Python, pero fue pensado desde el inicio para tener una segunda vida como proyecto de portfolio. En lugar de hacer un analisis generico, el foco esta puesto en una problematica real del sistema universitario argentino: que tan distinta puede ser la salida laboral segun la disciplina, la region, el genero o el tipo de gestion de la institucion.

## Idea del proyecto

La propuesta es construir una radiografia clara y visual de la insercion laboral formal de graduados universitarios argentinos, utilizando datos publicos y un proceso de analisis ordenado, comentado y reutilizable.

El proyecto busca responder preguntas concretas como:

- Como evoluciono la insercion laboral formal entre 2019 y 2021.
- Si existen diferencias entre graduados de instituciones estatales y privadas.
- Que disciplinas muestran mejor equilibrio entre empleabilidad formal y salario mediano.
- Como aparece la brecha de genero dentro de cada tipo de gestion.
- Que regiones presentan escenarios mas favorables o mas vulnerables.

## Dataset utilizado

Se utiliza el dataset publico **Graduados universitarios del sistema Araucano (2016-2018)**, publicado por CEP XXI con base en registros de la Secretaria de Politicas Universitarias y del SIPA.

Contenido principal del dataset:

- 820.335 filas
- 13 columnas originales
- 273.445 personas unicas
- Informacion para los años 2019, 2020 y 2021
- Variables academicas, demograficas y laborales

En este proyecto se agregan variables derivadas para enriquecer el analisis:

- `empleo_formal`
- `edad`
- `edad_al_egreso`
- `tramo_edad_egreso`

## Preguntas de analisis

1. Como evoluciono la insercion laboral formal entre 2019 y 2021.
2. Que diferencias existen entre gestion estatal y privada en 2021.
3. Que disciplinas presentan mejor equilibrio entre insercion formal y salario.
4. Como se expresa la brecha de genero dentro de cada tipo de gestion.
5. Que regiones muestran mayores desigualdades en empleo formal y salario mediano.

## Hallazgos principales

A partir del analisis realizado en la notebook, los resultados mas relevantes fueron los siguientes:

- La insercion laboral formal paso de **57,4% en 2019** a **59,6% en 2021**, con una mejora de **2,2 puntos porcentuales**.
- En 2021, la **gestion estatal** mostro una mayor tasa de insercion laboral formal.
- En cambio, la **gestion privada** presento un salario mediano mas alto entre quienes tenian empleo asalariado formal.
- Al combinar insercion y salario en un indice propio, **Informatica** aparece como la disciplina mejor posicionada.
- La brecha de genero se mantuvo visible tanto en empleo formal como en remuneracion, en ambas gestiones.
- En el plano regional, **CABA** y **Patagonia** se destacaron por mejores resultados de insercion formal, mientras que **Resto Pampeana** quedo mas rezagada.

## Valor agregado del proyecto

Este trabajo no se limita a cumplir la consigna. Tambien deja una base de proyecto que puede crecer sin rehacer todo desde cero.

Puntos fuertes:

- Codigo claro, separado y comentado.
- Notebook pensada para lectura academica y tambien para mostrar en portfolio.
- Carpeta `src/` con funciones reutilizables.
- Figuras exportadas para documentacion o futura interfaz.
- Enfoque realista sobre una problematica actual del ambito universitario argentino.

## Estructura del proyecto

```text
castro-galante-analitica-universitaria/
├── data/
│   └── raw/
│       ├── base_araucano.csv
│       └── diccionario_araucano.xlsx
├── docs/
│   ├── Trabajo Practico Final.pdf
│   └── metodologia_araucano.pdf
├── notebooks/
│   ├── castro_galante_analitica_u.ipynb
│   └── castro_galante_analitica_u_ejecutado.ipynb
├── outputs/
│   └── figuras/
├── src/
│   └── analisis_utils.py
├── .gitignore
├── LICENSE
├── README.md
└── requirements.txt
```

## Tecnologias utilizadas

- Python 3
- pandas
- numpy
- matplotlib
- seaborn
- openpyxl
- Jupyter Notebook

## Como ejecutar el proyecto

1. Clonar o descargar este repositorio.
2. Crear un entorno virtual.
3. Instalar dependencias.
4. Abrir la notebook y ejecutar las celdas.

### Instalacion rapida

```bash
python -m venv .venv
```

En Windows:

```bash
.venv\Scripts\activate
```

En Linux o macOS:

```bash
source .venv/bin/activate
```

Instalar dependencias:

```bash
pip install -r requirements.txt
```

Abrir Jupyter:

```bash
jupyter notebook
```

## Sobre la interpretacion de salarios

Los salarios del dataset estan expresados en **pesos corrientes** del mes de noviembre de cada año. Por eso, en el proyecto se priorizan comparaciones salariales dentro del mismo año, especialmente en 2021, para evitar conclusiones debiles por efecto inflacionario.

## Posibles mejoras futuras

- Ajustar salarios por inflacion.
- Incorporar un tablero interactivo con Streamlit.
- Agregar filtros por rama, tipo de titulo o tamaño de empresa.
- Explorar modelos predictivos simples con enfoque responsable.
- Llevar el analisis a una interfaz web orientada a orientacion universitaria o empleabilidad.

## Autor

**Carlos Jose Castro Galante**
**Repositorio del proyecto:** https://github.com/carlosjcastro/castro-galante-analitica-universitaria

Proyecto academico y de portfolio orientado al analisis de datos en educacion superior.

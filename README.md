# Evaluacion C1 - Microservicios

Este proyecto es una aplicación de análisis de datos de ventas, construida con Next.js y PostgreSQL.

## Instrucciones de Instalación y Ejecución

Sigue estos pasos para levantar el entorno completo (Base de datos + Aplicación):

### 1. Clonar el repositorio

```bash
git clone <url-del-repositorio>
cd evaluacion
```

### 2. Configurar Variables de Entorno

Copia el archivo de ejemplo para crear tu archivo `.env`:

```bash
cp .env.example .env
```
*Si estás en Windows (PowerShell), usa:* `Copy-Item .env.example .env`

### 3. Levantar con Docker (Recomendado)

Ejecuta el siguiente comando para construir y levantar los contenedores:

```bash
docker-compose up --build
```

Esto iniciará:
*   Una base de datos PostgreSQL en el puerto `5432`.
*   La aplicación web en `http://localhost:3000`.

## Tecnologías

*   **Frontend/Backend**: Next.js 15
*   **Base de Datos**: PostgreSQL 16
*   **Contenedores**: Docker & Docker Compose

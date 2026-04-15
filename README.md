# CentroSur Back

Backend del sistema CentroSur para gestionar preguntas, respuestas, categorías y eventos en tiempo real.

## Tecnologías

- NestJS 10
- TypeScript 5.7
- Node.js 18.20.8
- `node-jt400` 6.0.1 para conexión DB2
- Socket.IO 4.8.3

## Requisitos

- Node.js 18.20.8
- npm
- Acceso a la base de datos DB2
- El archivo de entorno `.dev.env` en la raíz del proyecto

## Variables de entorno

El backend carga variables desde `.dev.env`, `dev.env` o `.env`.

Variables principales:

- `PORT_BACKEND`: puerto del backend
- `DATABASE_HOST`: host de DB2
- `DATABASE_USER`: usuario de DB2
- `DATABASE_PASSWORD`: contraseña de DB2
- `DATABASE_NAME`: nombre de la base
- `DATABASE_ESQUEMA`: esquema DB2
- `DATABASE_PORT`: puerto de la base
- `DATABASE_TYPE`: tipo de base
- `HOST_BACKEND`: URL pública del backend
- `PRODUCTION`: bandera de producción
- `CORS_ORIGIN`: origen permitido del frontend
- `SMS`: integración usada por el proyecto

## Instalación

```bash
npm install
```

## Desarrollo

```bash
npm run start:dev
```

## Producción

```bash
npm run build
npm run start:prod
```

## Endpoints principales

- `GET /questions`
- `POST /questions`
- `PATCH /questions/:id`
- `DELETE /questions/:id`
- `GET /categories`
- `POST /categories`
- `PATCH /categories/:id`
- `DELETE /categories/:id`

## Notas

- El backend usa CORS configurado por variable de entorno.
- Si cambias el origen del frontend, actualiza `CORS_ORIGIN`.
- Si el puerto del backend cambia, actualiza `PORT_BACKEND`.

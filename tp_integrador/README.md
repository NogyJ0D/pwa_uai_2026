# TP Final Integrador

Aplicación web tipo e-commerce.

## Estructura del proyecto

```text
tp_integrador/
├── backend/          # API REST con Express + TypeORM
│   ├── src/
│   │   ├── app.ts
│   │   ├── config/database.ts
│   │   ├── routes/index.ts
│   │   ├── controllers/
│   │   ├── services/
│   │   ├── repositories/
│   │   └── entities/
│   ├── init.sql
│   ├── .env.example
│   └── package.json
├── frontend/         # Interfaz con React + Vite + Tailwind
│   ├── src/
│   │   ├── config/api.ts
│   │   ├── components/
│   │   ├── pages/
│   │   └── types/
│   └── package.json
└── consignas_tp/     # Material de la cátedra
```

## Arquitectura

### Backend (monolito en capas)

```text
Cliente → Routes → Controllers → Services → Repositories → DDBB
```

Solo endpoints GET:

- `GET /productos` — listado paginado (filtros: `category`, `brand`, `priceMin`, `priceMax`, `sortBy`, `order`, `page`, `limit`)
- `GET /productos/:id` — detalle de un producto
- `GET /categorias` — listado de categorías
- `GET /marcas` — listado de marcas

### Frontend

React 19 + TypeScript + Tailwind CSS 4 + React Router 7.

El carrito se maneja con estado global y localStorage.

## Iniciar

### 1. Backend

```sh
cd backend
cp .env.example .env           # completar credenciales en .env
npm install
npm run dev                    # http://localhost:8080
```

Variables del `.env`:

| Variable       | Descripción                                       |
| -------------- | ------------------------------------------------- |
| `PORT`         | Puerto del servidor                               |
| `DB_TYPE`      | Tipo de base de datos (`postgres`, `mysql`, etc.) |
| `DB_HOST`      | Host de la base de datos                          |
| `DB_PORT`      | Puerto de la base de datos                        |
| `DB_USER`      | Usuario                                           |
| `DB_PASSWORD`  | Contraseña                                        |
| `DB_NAME`      | Nombre de la base de datos                        |
| `CORS_ORIGINS` | Orígenes permitidos separados por coma            |

### 2. Frontend

```sh
cd frontend
cp src/config/api.example.ts src/config/api.ts   # editar URL si cambió el puerto
npm install
npm run dev                    # http://localhost:5173
```

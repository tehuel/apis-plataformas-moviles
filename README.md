# APIs Plataformas Móviles

API de servicios y datos de práctica para el desarrollo de aplicaciones móviles y web, construida con [Hono](https://hono.dev/) sobre [Bun](https://bun.sh/) con persistencia en SQLite y empaquetada para ejecutarse en Docker.

Incluye una interfaz web interactiva en `/` con documentación y probador de endpoints en tiempo real, ofreciendo los siguientes recursos:

- **/comidas**: Catálogo de comidas y bebidas tradicionales argentinas.
  - `GET /comidas`: Listado resumido (`id`, `nombre`, `imagen`, `grupo`, `tipo`) con filtros por grupo, búsqueda por texto unificada, ordenamiento y paginación.
  - `GET /comidas/:id`: Detalle completo del plato consultado (incluyendo imagen, descripción, ingredientes principales y etiquetas).
- **/contador**: Contador persistente respaldado por SQLite (`bun:sqlite`) con operaciones de lectura (`GET`) e incremento atómico (`POST`).
- **/health**: Endpoint de estado (`GET /health`) para healthchecks de contenedores y proxies inversos.

## Desarrollo local con Bun

```bash
# Instalar dependencias
bun install

# Iniciar servidor de desarrollo con recarga automática
bun run dev

# Iniciar servidor en modo normal
bun run start

# Ejecutar pruebas de integración y verificación de tipos
bun test
bun run typecheck
```

## Ejecución con Docker

```bash
# Construir e iniciar el servicio en segundo plano
docker compose up --build -d

# Detener los contenedores
docker compose down
```

Los datos del contador se persisten en el volumen nombrado `counters-data` montado en `/data`.

## Variables de entorno

| Variable | Por defecto | Descripción |
| --- | --- | --- |
| `PORT` | `3000` | Puerto HTTP donde escucha el servidor. |
| `HOST` | `0.0.0.0` | Interfaz de red a la que se enlaza el servidor. |
| `DB_PATH` | `./data/counters.db` | Ruta al archivo SQLite (en Docker se configura como `/data/counters.db`). |

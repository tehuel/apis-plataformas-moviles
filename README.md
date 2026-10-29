# APIs Plataformas Móviles

API de servicios y datos de práctica para el desarrollo de aplicaciones móviles y web, construida con [Hono](https://hono.dev/) y desplegada sobre [Cloudflare Workers](https://workers.cloudflare.com/).

Incluye una interfaz web interactiva en `/` con documentación y probador de endpoints en tiempo real, ofreciendo los siguientes recursos:

- **/comidas**: Catálogo de comidas y bebidas tradicionales argentinas.
  - `GET /comidas`: Listado resumido (`id`, `nombre`, `grupo`, `tipo`, `region`) con filtros por grupo, búsqueda por texto unificada, ordenamiento y paginación.
  - `GET /comidas/:id`: Detalle completo del plato consultado (incluyendo descripción, ingredientes principales y etiquetas).
- **/contador**: Contador persistente respaldado por Cloudflare KV con operaciones de lectura (`GET`) e incremento (`POST`).

## Comandos básicos

```bash
# Instalar dependencias
npm install

# Iniciar servidor de desarrollo local
npm run dev
```


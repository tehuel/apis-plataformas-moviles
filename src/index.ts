import { Hono } from 'hono'
import { trimTrailingSlash } from 'hono/trailing-slash'
import { cors } from 'hono/cors'
import { serveStatic } from 'hono/bun'
import contador from './routes/contador'
import comidas from './routes/comidas'

const app = new Hono()

app.use(trimTrailingSlash())
app.use('*', cors())

// Healthcheck para contenedores y proxies inversos
app.get('/health', (c) => c.json({ status: 'ok' }))

// Endpoints de la API
app.route('/contador', contador)
app.route('/comidas', comidas)

// Activos estáticos (documentación y especificación OpenAPI)
app.get('/*', serveStatic({ root: './public' }))

export { app }

export default {
    port: Number(process.env.PORT) || 3000,
    hostname: process.env.HOST || '0.0.0.0',
    fetch: app.fetch,
}

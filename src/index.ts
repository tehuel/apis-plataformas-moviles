import { Hono } from 'hono'
import { trimTrailingSlash } from 'hono/trailing-slash'
import { cors } from 'hono/cors'
import contador from './routes/contador'
import comidas from './routes/comidas'
import { renderHomeView } from './views/homeView'

const app = new Hono()

app.use(trimTrailingSlash())
app.use('*', cors())

// Home page & documentación en HTML
app.get('/', (c) => {
    return c.html(renderHomeView())
})

// Endpoints de la API
app.route('/contador', contador)
app.route('/comidas', comidas)

export default app

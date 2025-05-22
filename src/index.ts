import { Hono } from 'hono'
import contador from './contador'
import comidas from './comidas'

const app = new Hono()

app.get('/', (c) => {
  return c.json({
    'título': 'APIs de Plataformas Móviles',
    'descripción': 'Una colección de APIs para plataformas móviles',
    'recursos': {
      '/contador/': 'API para contar',
      '/comidas/': 'API de comidas argentinas',
    },
  })
})

app.route('/contador/', contador)
app.route('/comidas/', comidas)

export default app

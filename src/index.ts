import { Hono } from 'hono'
import contador from './contador'

const app = new Hono()

app.get('/', (c) => {
  return c.json({
    'título': 'APIs de Plataformas Móviles',
    'descripción': 'Una colección de APIs para plataformas móviles',
    'recursos': {
      '/contador/': 'API para contar',
    },
  })
})

app.route('/contador/', contador)

export default app

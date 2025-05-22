import { Hono } from 'hono'
import count from './counter'

const app = new Hono()

app.get('/', (c) => {
  return c.text('Hello Hono!')
})

app.route('/count/', count)

export default app

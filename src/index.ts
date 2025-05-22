import { Hono } from 'hono'

type Bindings = {
  COUNTER_KV: KVNamespace
}

const app = new Hono()

app.get('/', (c) => {
  return c.text('Hello Hono!')
})

export default app

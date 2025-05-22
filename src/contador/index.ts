import { Hono } from 'hono'

type Bindings = {
    COUNTER_KV: KVNamespace
}

const app = new Hono<{ Bindings: Bindings }>()

app.get('/', (c) => {
    return c.json({
        'título': 'API Contador',
        'descripción': 'Una API para contar',
        endpoints: [
            { 
                'método': 'GET', 
                ruta: '/contador/:nombre',
                'descripción': 'Obtiene el valor actual del contador :nombre',
            },
            { 
                'método': 'POST', 
                ruta: '/contador/:nombre',
                'descripción': 'Incrementa y obtiene el valor actual del contador :nombre',
            },
        ],
    })
})

app.get('/:name', async (c) => {
    const name = c.req.param('name')
    const current = parseInt(await c.env.COUNTER_KV.get(name) || '0')
    return c.json({ count: current })
})

app.post('/:name', async (c) => {
    const name = c.req.param('name')
    const current = parseInt(await c.env.COUNTER_KV.get(name) || '0')
    const updated = current + 1
    await c.env.COUNTER_KV.put(name, updated.toString())
    return c.json({ count: updated })
})

export default app

import { describe, expect, it } from 'bun:test'

// Configurar SQLite en memoria antes de importar la app para no crear ./data al correr `bun test`
process.env.DB_PATH = ':memory:'
const { app } = await import('./index')

describe('APIs Plataformas Móviles', () => {
    it('GET /health responde ok', async () => {
        const res = await app.request('/health')
        expect(res.status).toBe(200)
        expect(await res.json()).toEqual({ status: 'ok' })
    })

    it('sirve los activos estáticos de documentación y OpenAPI', async () => {
        const indexRes = await app.request('/')
        expect(indexRes.status).toBe(200)
        expect(indexRes.headers.get('content-type')).toContain('text/html')
        expect(await indexRes.text()).toContain('APIs Plataformas Móviles')

        const specRes = await app.request('/openapi.json')
        expect(specRes.status).toBe(200)
        expect(specRes.headers.get('content-type')).toContain('application/json')
        const spec = (await specRes.json()) as { openapi: string }
        expect(spec.openapi).toBe('3.0.3')

        const missingRes = await app.request('/no-existe')
        expect(missingRes.status).toBe(404)
    })

    it('GET /comidas devuelve el listado paginado por defecto y soporta filtros', async () => {
        const res = await app.request('/comidas')
        expect(res.status).toBe(200)
        const body = (await res.json()) as {
            data: Array<{ id: string }>
            total: number
            pagina: number
            limite: number
        }
        expect(body.pagina).toBe(1)
        expect(body.limite).toBe(5)
        expect(body.data).toHaveLength(5)
        expect(body.total).toBeGreaterThan(5)

        const filteredRes = await app.request('/comidas?grupo=salados&busqueda=empanada')
        expect(filteredRes.status).toBe(200)
        const filtered = (await filteredRes.json()) as { data: Array<{ id: string }> }
        expect(filtered.data.some((item) => item.id === 'empanadas')).toBe(true)
    })

    it('GET /comidas valida parámetros y redirige trailing slash', async () => {
        const invalidRes = await app.request('/comidas?grupo=invalido')
        expect(invalidRes.status).toBe(400)
        const errorBody = (await invalidRes.json()) as { error: string }
        expect(typeof errorBody.error).toBe('string')

        const trailingRes = await app.request('/comidas/')
        expect(trailingRes.status).toBe(301)
        expect(trailingRes.headers.get('location')?.endsWith('/comidas')).toBe(true)
    })

    it('GET /comidas/:id devuelve detalle o 404 si no existe', async () => {
        const res = await app.request('/comidas/empanadas')
        expect(res.status).toBe(200)
        const comida = (await res.json()) as {
            id: string
            ingredientes_principales: string[]
        }
        expect(comida.id).toBe('empanadas')
        expect(Array.isArray(comida.ingredientes_principales)).toBe(true)

        const missingRes = await app.request('/comidas/inexistente')
        expect(missingRes.status).toBe(404)
        const missingBody = (await missingRes.json()) as { error: string }
        expect(typeof missingBody.error).toBe('string')
    })

    it('GET y POST /contador/:name consultan e incrementan de forma aislada', async () => {
        const initial = await app.request('/contador/demo')
        expect(initial.status).toBe(200)
        expect(await initial.json()).toEqual({ count: 0 })

        const firstInc = await app.request('/contador/demo', { method: 'POST' })
        expect(firstInc.status).toBe(200)
        expect(await firstInc.json()).toEqual({ count: 1 })

        const secondInc = await app.request('/contador/demo', { method: 'POST' })
        expect(secondInc.status).toBe(200)
        expect(await secondInc.json()).toEqual({ count: 2 })

        const current = await app.request('/contador/demo')
        expect(current.status).toBe(200)
        expect(await current.json()).toEqual({ count: 2 })

        const other = await app.request('/contador/otro')
        expect(other.status).toBe(200)
        expect(await other.json()).toEqual({ count: 0 })
    })
})

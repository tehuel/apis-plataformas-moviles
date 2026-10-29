import { Hono } from 'hono'
import comidas from './comidas.json'
import { filterByField, sortByField, paginate, SortOrder, assertInList, searchByTerm } from '../../utils/listUtils'

const app = new Hono()

export type ComidaDetalle = typeof comidas[0]
export type ComidaResumen = Pick<ComidaDetalle, 'id' | 'nombre' | 'grupo' | 'tipo' | 'region'>

type CampoListado = keyof ComidaResumen

const CAMPOS_LISTADO: CampoListado[] = ['id', 'nombre', 'grupo', 'tipo', 'region']
const GRUPOS_VALIDOS = ['salados', 'dulces', 'bebidas', '']
const CAMPOS_ORDEN_VALIDOS: CampoListado[] = ['id', 'nombre', 'grupo', 'tipo', 'region']
const SENTIDOS_ORDEN_VALIDOS: SortOrder[] = ['asc', 'desc']

app.get('/', async (c) => {
    try {
        // filter (en campo grupo)
        const grupo = c.req.query('grupo') || ''
        assertInList(grupo.toLowerCase(), GRUPOS_VALIDOS, 'grupo')
        const comidas_filtradas = filterByField(comidas, 'grupo', grupo)

        // search (unificado con los campos del listado)
        const busqueda = c.req.query('busqueda') || ''
        const comidas_buscadas = searchByTerm(comidas_filtradas, busqueda, CAMPOS_LISTADO)

        // sort
        const sort = (c.req.query('ordenar_campo') as CampoListado) || 'nombre'
        assertInList(sort, CAMPOS_ORDEN_VALIDOS, 'ordenar_campo')
        const order = (c.req.query('ordenar_sentido') as SortOrder) || 'asc'
        assertInList(order, SENTIDOS_ORDEN_VALIDOS, 'ordenar_sentido')
        const comidas_ordenadas = sortByField(comidas_buscadas, sort, order)

        // paginate
        const page = parseInt(c.req.query('pagina') || '1')
        const limit = parseInt(c.req.query('limite') || '5')
        const comidas_paginadas = paginate(comidas_ordenadas, page, limit)

        // proyeccion a datos de listado
        const data: ComidaResumen[] = comidas_paginadas.map(({ id, nombre, grupo, tipo, region }) => ({
            id,
            nombre,
            grupo,
            tipo,
            region,
        }))

        return c.json({
            data,
            total: comidas_buscadas.length,
            pagina: page,
            paginas: Math.ceil(comidas_buscadas.length / limit),
            limite: limit,
        })
    } catch (err: any) {
        return c.json({
            error: err.message,
        }, 400)
    }
})

app.get('/:id', async (c) => {
    const rawId = c.req.param('id')
    const id = rawId.toLowerCase()
    const comida = comidas.find(item => item.id.toLowerCase() === id)

    if (!comida) {
        return c.json({
            error: `Comida con id '${rawId}' no encontrada`,
        }, 404)
    }

    return c.json(comida)
})

export default app

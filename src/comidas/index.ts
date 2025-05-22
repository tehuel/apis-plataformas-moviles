import { Hono } from 'hono'
import comidas from './comidas.json'
import { filterByField, sortByField, paginate, SortOrder, assertInList } from '../utils/listUtils'

const app = new Hono()

type SortField = keyof typeof comidas[0];

const GRUPOS_VALIDOS = ['salados', 'dulces', 'bebidas', ''];
const CAMPOS_ORDEN_VALIDOS: SortField[] = ['nombre', 'grupo', 'tipo', 'region', 'descripcion'];
const SENTIDOS_ORDEN_VALIDOS: SortOrder[] = ['asc', 'desc'];

app.get('/', (c) => {
    return c.json({
        'título': 'Comidas API',
        'descripción': 'Una API de comidas argentinas',
        'endpoints': [
            {
                'método': 'GET',
                'ruta': '/comidas/lista',
                'descripción': 'Devuelve una lista de comidas argentinas',
                'parametros (opcionales)': {
                    'grupo': 'Filtrar listado por grupo (salados, dulces, bebidas) [por defecto: no filtrar]',
                    'ordenar_campo': 'Campo por el que se ordena (nombre, grupo, tipo, region, descripcion) [por defecto: nombre]',
                    'ordenar_sentido': 'Sentido del orden de la lista (asc, desc) [por defecto: asc]',
                    'pagina': 'Número de página [por defecto: 1]',
                    'limite': 'Número máximode elementos por página [por defecto: 5]',
                },
            },
        ],
    })
})

app.get('/lista', async (c) => {
    try {
        // filter campo grupo
        const grupo = c.req.query('grupo') || '';
        assertInList(grupo.toLowerCase(), GRUPOS_VALIDOS, 'grupo');
        const filtered = filterByField(comidas, 'grupo', grupo);

        // sort
        const sort = (c.req.query('ordenar_campo') as SortField) || 'nombre';
        assertInList(sort, CAMPOS_ORDEN_VALIDOS, 'ordenar_campo');
        const order = (c.req.query('ordenar_sentido') as SortOrder) || 'asc';
        assertInList(order, SENTIDOS_ORDEN_VALIDOS, 'ordenar_sentido');
        const sorted = sortByField(filtered, sort, order);

        // paginate
        const page = parseInt(c.req.query('pagina') || '1');
        const limit = parseInt(c.req.query('limite') || '5');
        const paginated = paginate(sorted, page, limit);

        return c.json({
            'data': paginated,
            'total': filtered.length,
            'pagina': page,
            'paginas': Math.ceil(filtered.length / limit),
            'limite': limit,
        })
    } catch (err: any) {
        return c.json({
            error: err.message,
        }, 400);
    }
})

export default app

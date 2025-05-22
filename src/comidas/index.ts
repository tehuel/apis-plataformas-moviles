import { Hono } from 'hono'
import comidas from './comidas.json'

const app = new Hono()

type SortField = 'nombre' | 'grupo' | 'tipo' | 'region' | 'descripcion';
type SortOrder = 'asc' | 'desc';

const GRUPOS_VALIDOS = ['salados', 'dulces', 'bebidas'];

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
    // filter
    const grupo = c.req.query('grupo') || '';
    if (grupo && !GRUPOS_VALIDOS.includes(grupo.toLowerCase())) {
        return c.json({
            'error': 'Grupo no válido',
            'grupos válidos': GRUPOS_VALIDOS,
        }, 400)
    }
    const filtered = grupo
        ? comidas.filter(item => item.grupo.toLowerCase() === grupo.toLowerCase())
        : comidas;

    // sort
    const sort = (c.req.query('ordenar_campo') as SortField) || 'nombre';
    const order = (c.req.query('ordenar_sentido') as SortOrder) || 'asc';

    const sorted = filtered.sort((a, b) => {
        const res = a[sort].localeCompare(b[sort]);
        return order === 'asc' ? res : -res;
    });

    // paginate
    const page = parseInt(c.req.query('pagina') || '1');
    const limit = parseInt(c.req.query('limite') || '5');

    const paginated = sorted.slice((page - 1) * limit, page * limit);

    return c.json({
        'data': paginated,
        'total': filtered.length,
        'pagina': page,
        'paginas': Math.ceil(sorted.length / limit),
        'limite': limit,
    })
})

export default app

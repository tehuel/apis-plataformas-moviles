import { Hono } from 'hono'
import comidas from './comidas.json'
import { filterByField, sortByField, paginate, SortOrder, assertInList, searchByTerm } from '../utils/listUtils'

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
                    'grupo': 'Filtrar listado por grupo (salados, dulces, bebidas) [por defecto: ninguno]',
                    'busqueda': 'Buscar en el listado [por defecto: ninguno]',
                    'ordenar_campo': 'Campo por el que se ordena (nombre, grupo, tipo, region, descripcion) [por defecto: nombre]',
                    'ordenar_sentido': 'Sentido del orden de la lista (asc, desc) [por defecto: asc]',
                    'pagina': 'Número de página [por defecto: 1]',
                    'limite': 'Número máximo de elementos por página [por defecto: 5]',
                },
            },
        ],
    })
})

app.get('/lista', async (c) => {
    try {
        // filter (en campo grupo)
        const grupo = c.req.query('grupo') || '';
        assertInList(grupo.toLowerCase(), GRUPOS_VALIDOS, 'grupo');
        const comidas_filtradas = filterByField(comidas, 'grupo', grupo);

        // search
        const busqueda = c.req.query('busqueda') || '';
        const comidas_buscadas = searchByTerm(comidas_filtradas, busqueda, [
            'nombre', 'descripcion', 'tipo', 'region', 'ingredientes_principales'
        ]);

        // sort
        const sort = (c.req.query('ordenar_campo') as SortField) || 'nombre';
        assertInList(sort, CAMPOS_ORDEN_VALIDOS, 'ordenar_campo');
        const order = (c.req.query('ordenar_sentido') as SortOrder) || 'asc';
        assertInList(order, SENTIDOS_ORDEN_VALIDOS, 'ordenar_sentido');
        const comidas_ordenadas = sortByField(comidas_buscadas, sort, order);

        // paginate
        const page = parseInt(c.req.query('pagina') || '1');
        const limit = parseInt(c.req.query('limite') || '5');
        const comidas_paginadas = paginate(comidas_ordenadas, page, limit);

        return c.json({
            'data': comidas_paginadas,
            'total': comidas_buscadas.length,
            'pagina': page,
            'paginas': Math.ceil(comidas_buscadas.length / limit),
            'limite': limit,
        })
    } catch (err: any) {
        return c.json({
            error: err.message,
        }, 400);
    }
})

export default app

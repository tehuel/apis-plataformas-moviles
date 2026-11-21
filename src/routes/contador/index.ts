import { Hono } from 'hono'
import { Database } from 'bun:sqlite'
import { mkdirSync } from 'node:fs'
import { dirname } from 'node:path'

const dbPath = process.env.DB_PATH || './data/counters.db'
if (dbPath !== ':memory:') {
    mkdirSync(dirname(dbPath), { recursive: true })
}

export const db = new Database(dbPath)
db.exec('PRAGMA journal_mode = WAL;')
db.exec('PRAGMA busy_timeout = 5000;')
db.exec(`
    CREATE TABLE IF NOT EXISTS counters (
        name TEXT PRIMARY KEY,
        count INTEGER NOT NULL DEFAULT 0
    )
`)

process.on('exit', () => {
    db.close()
})

const getCounter = db.query<{ count: number }, [string]>(
    'SELECT count FROM counters WHERE name = ?'
)

const incrementCounter = db.query<{ count: number }, [string]>(
    `INSERT INTO counters (name, count) VALUES (?, 1)
     ON CONFLICT(name) DO UPDATE SET count = count + 1
     RETURNING count`
)

const app = new Hono()

app.get('/:name', (c) => {
    const name = c.req.param('name')
    const row = getCounter.get(name)
    return c.json({ count: row?.count ?? 0 })
})

app.post('/:name', (c) => {
    const name = c.req.param('name')
    const row = incrementCounter.get(name)!
    return c.json({ count: row.count })
})

export default app

import { Pool } from 'pg'

const pool = new Pool({
    host: 'localhost',
    user: process.env.DB_USERNAME,
    port: 5432,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD
})

export default pool
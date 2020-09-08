const mssql = require('mssql')

const config = {
    user: process.env.user, 
    password: process.env.password, 
    server: process.env.server,
    encrypt: true,
    database: process.env.database,
    pool: {
        max: process.env.pool
    }
}

const AZURE_POOL = mssql.connect(config)

module.exports = {
    AZURE_POOL
}
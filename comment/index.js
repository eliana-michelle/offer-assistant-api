const mssql = require('mssql')
const { AZURE_POOL } = require('../util/poolConfig')

const { headers }  = require('../util/headers')


module.exports = async function (context, req) {
    const comment = req.body.comment.replace(/'/g, "''")
    const user = req.body.user
    const session = req.body.session

    try {
        const azurePool = await AZURE_POOL
        await azurePool.request().query(`EXEC comment_upsert @invoice='${session}', @comment='${comment}', @username='${user}'`)
        const comments = await azurePool.request().query(`SELECT * FROM comments WHERE invoice = '${session}'`)
        
        context.res = {
            status: 200, 
            headers: headers, 
            body: {
                status: true,
                data: comments
            }
        }
    } catch (error){
        context.log(error)
        context.res = {
            status: 500, 
            headers: headers
        }
    }  
}
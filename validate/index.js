const { AZURE_POOL } = require('../util/poolConfig')

const { headers }  = require('../util/headers')

module.exports = async function (context, req) {
    const invoice = context.req.params.sessionId;

    try {
        const azurePool = await AZURE_POOL;
        
        const validate = await azurePool.request().query(`SELECT * FROM sessions WHERE invoice = '${invoice}'`);
        const comments = await azurePool.request().query(`SELECT * FROM comments WHERE invoice = ${invoice}`);
        const history = await azurePool.request().query(`SELECT * FROM audit_history WHERE invoice = ${invoice}`);
        const session = validate.recordset[0]

        if(validate.recordset.length > 0){
            context.res = {
                status: 200, 
                headers: headers, 
                body: {
                    status: true, 
                    session: session,
                    comments: comments.recordset,
                    history: history.recordset
                }
            }
        } else {
            context.res = {
                status: 404, 
                headers: headers, 
                body: {
                    status: false
                }
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
const { AZURE_POOL } = require('../util/poolConfig')

const { headers }  = require('../util/headers')


module.exports = async function (context, req) {
    const status = req.body.cancelStatus
    const user = req.body.user.name
    const session = req.body.session

    const comment = `Offer status changed to ${status} by ${user}`

    try {
        const azurePool = await AZURE_POOL
        const updatedSession = await azurePool.request().query(`EXEC updateCancelStatus_upsert @invoice='${session}', @cancel_status='${status}', @username='${user}', @comment='${comment}'`)
        const updatedHistory = await azurePool.request().query(`SELECT * FROM audit_history WHERE invoice = '${session}'`)

        context.res = {
            status: 200, 
            headers: headers, 
            body: {
                status: true,
                data: updatedSession,
                history: updatedHistory
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
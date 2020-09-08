const { AZURE_POOL } = require('../util/poolConfig')

const { headers }  = require('../util/headers')

module.exports = async function (context, req) {
    const sessions = context.req.body.sessions
    const user = context.req.body.user.name

    try {
        const azurePool = await AZURE_POOL

        const updatedSessions = []

        const markCompleted = async sessions => {
            for (i=0; i < sessions.length; i++){
                const sessionRaw = await azurePool.request().query(`EXEC markCompleted_procedure @invoice='${sessions[i].invoice}', @comment='Marked as completed', @username='${user}'`)
                const session = sessionRaw.recordset[0]
                updatedSessions.push(session)
            }
        }

        await markCompleted(sessions)

        context.res = {
            status: 200, 
            headers: headers, 
            body: {
                status: true,
                sessions: updatedSessions
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
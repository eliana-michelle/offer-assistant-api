const { AZURE_POOL } = require('../util/poolConfig')

const { headers }  = require('../util/headers')


module.exports = async function (context, req) {

    try {
        const azurePool = await AZURE_POOL
        const offerCodes = await azurePool.request().query(`SELECT DISTINCT offer_code FROM sessions`)
  
        context.res = {
            status: 200, 
            headers: headers, 
            body: {
                status: true, 
                offerCodes: offerCodes.recordset
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
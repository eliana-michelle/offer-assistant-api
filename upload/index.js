const mssql = require('mssql')
const { AZURE_POOL } = require('../util/poolConfig')

const { headers }  = require('../util/headers')

module.exports = async function (context, req) {
    const importedData = req.body

    try {
        let azurePool = await AZURE_POOL

        await importedData.forEach(b => {
            azurePool.request().query( `EXEC uploadSessions @invoice='${b.invoice}', @office='${b.office}', @cancel_status='${b.cancel_status}', @first_name='${b.first_name}', @last_name='${b.last_name}', @offer_code='${b.offer_code}', @offer_description='${b.offer_description}', @letter_sent='${b.letter_sent}', @expiration_date='${b.expiration_date}'`)
        })
           
        context.res = {
            status: 200, 
            headers: headers, 
            body: {
                status: true,
                data: 'Files Uploaded'
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
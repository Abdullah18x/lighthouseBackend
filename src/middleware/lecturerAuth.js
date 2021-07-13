const jwt = require('jsonwebtoken')
const sql = require('../config/mysqlConfig')

const auth = async (req,res,next) => {
    try {
        const token = req.header('Authorization')
        const decoded = jwt.verify(token, 'sapApi')
        
        const query = 'SELECT * FROM lecturer WHERE userName = ?'
        let conn = await sql.getDBConnection();
        let [data,fields] = await conn.execute(query,[decoded.user])

        if(!data){
            throw new Error()
        }
        next()
    } catch (e) {
        res.status(401).send({error:'Please authenticate'})
    }
}

module.exports = auth
const jwt = require('jsonwebtoken')
const sql = require('../config/mysqlConfig')

let generateToken = async (userId, userType, userName) => {
    const token = jwt.sign({user: userName}, 'sapApi')
    const query = 'UPDATE tokens SET expired = 1 WHERE userId = ? AND userType = ?'
    const query2 = 'INSERT INTO tokens(userId, userType, token, expired) VALUES (?,?,?,?)'
    try {
        let conn = await sql.getDBConnection();
        await conn.execute(query,[userId,userType])
        await conn.execute(query2,[userId,userType,token,0])
        return token
    } catch (error) {
        return 'error'
    }
}
exports.generateToken = generateToken
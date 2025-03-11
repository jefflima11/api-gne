const dbConnection = require('../config/db-connection');

async function listarSetores(req, res) {
    try {
        const connect = await dbConnection
        const result = await connect.query`select * from dbo.setor`
        res.status(200).json(result.recordset);
    } catch (error) {
        res.status(500).json({message:'Erro ao buscar usuarios', erro: error.message});
    }
};

module.exports =  { listarSetores };
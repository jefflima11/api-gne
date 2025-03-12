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

async function listarSetorPorId(req, res) {
    const { id } = req.params;

    if (!id) {
        return res.status(400).json({ message: 'O ID do setor é obrigatório.' });
    }

    try {
        const pool = await dbConnection;
        const result = await pool.request()
            .input('id', id)
            .query(`SELECT 
                        CD_SETOR,
                        NM_SETOR,
                        DT_CRIACAO,
                        CASE
                            WHEN DT_INATIVACAO IS NULL THEN 'S'
                            ELSE 'N'
                        END ATIVO
                    FROM 
                        dbo.setor 
                    WHERE 
                        cd_setor = @id
                    `);

        if (result.recordset.length === 0) {
            return res.status(404).json({ message: 'Setor não encontrado.' });
        }

        res.status(200).json(result.recordset[0]);
    } catch (error) {
        console.error('Erro ao buscar setor:', error);
        res.status(500).json({ message: 'Erro ao buscar setor.' });
    }
};

async function atualizarSetor(req, res) {
    const { id } = req.params;
    const { nm_setor } = req.body;

    if (!id) {
        return res.status(400).json({ message: 'O ID do setor é obrigatório.' });
    }

    if (!nm_setor) {
        return res.status(400).json({ message: 'O nome do setor é obrigatório.' });
    }

    try {
        const pool = await dbConnection;
        const result = await pool.request()
            .input('id', id)
            .input('nome', nm_setor)
            .query('UPDATE dbo.setor SET nm_setor = @nome WHERE cd_setor = @id');

        if (result.rowsAffected[0] === 0) {
            return res.status(404).json({ message: 'Setor não encontrado.' });
        }

        res.status(200).json({ message: 'Setor atualizado com sucesso.' });
    } catch (error) {
        console.error('Erro ao atualizar setor:', error);
        res.status(500).json({ message: 'Erro ao atualizar setor.' });
    }
};

module.exports =  { listarSetores, atualizarSetor, listarSetorPorId };
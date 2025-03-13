const dbConnection = require('../config/db-connection');

async function adicionarSetor(req, res) {
    try {
        const { nm_setor } = req.body;
        if (!nm_setor) {
            return res.status(400).json({ message: "O nome do setor é obrigatório." });
        }

        const pool = await dbConnection;

        // Verifica se o setor já existe
        const checkResult = await pool.request()
            .input('nm_setor', nm_setor)
            .query(`SELECT nm_setor FROM dbo.setor WHERE nm_setor = @nm_setor`);

        if (checkResult.recordset.length > 0) {
            return res.status(409).json({ message: "Setor já cadastrado." });
        }

        // Se não existir, insere no banco
        const insertResult = await pool.request()
            .input('nm_setor', nm_setor)
            .query(`INSERT INTO dbo.setor (nm_setor, dt_criacao) VALUES (@nm_setor, GETDATE())`);

        res.status(201).json({ message: "Novo setor inserido", data: insertResult.recordset });
        
    } catch (error) {
        console.error("Erro ao adicionar setor:", error);
        res.status(500).json({ message: "Erro interno do servidor", error: error.message });
    }
};

async function listarSetores(req, res) {
    try {
        const connect = await dbConnection
        const result = await connect.query`select * from dbo.setor where deletedAt is null`
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
                    AND
                        deletedAt IS NULL
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

async function editarAtividadeDoSetor(req, res) {
    const { id } = req.params;

    if (!id) {
        return res.status(400).json({ message: 'O ID do setor é obrigatório.' });
    }

    try {
        const pool = await dbConnection;
        const result = await pool.request()
            .input('id', id)
            .query(`SELECT DT_INATIVACAO FROM dbo.setor WHERE cd_setor = @id`);

        if (result.rowsAffected[0] === 0) {
            return res.status(404).json({ message: 'Setor não encontrado.' });
        }

        if (result.recordset[0].DT_INATIVACAO != null) {
            await pool.request()
                .input('id', id)
                .query('UPDATE dbo.setor SET dt_inativacao = NULL WHERE cd_setor = @id');
            return res.status(200).json({ message: 'Setor ativado com sucesso.', sql: result.recordset[0] });
        } else {
            await pool.request()
                .input('id', id)
                .query('UPDATE dbo.setor SET dt_inativacao = GETDATE() WHERE cd_setor = @id');
            return res.status(200).json({ message: 'Setor inativado com sucesso.', sql: result.recordset[0] });
        }
    } catch (error) {
        console.error('Erro ao inativar setor:', error);
        res.status(500).json({ message: 'Erro ao inativar setor.' });
    }
}

async function deletarSetores(req, res) {
    const { id } = req.params;

    if (!id) {
        return res.status(400).json({ message: 'O ID do setor é obrigatório.' });
    }

    try {
        const pool = await dbConnection;
        const result = await pool.request()
            .input('id', id)
            .query('SELECT dt_inativacao FROM dbo.setor WHERE cd_setor = @id');
        
        if (result.recordset[0].dt_inativacao === null) {
            return res.status(400).json({ message: 'Setor ainda não inativado' });
        }
    } catch (error) {
        console.error('Erro ao deletar setor:', error);
        res.status(500).json({ message: 'Erro ao deletar setor.' });
    }

    try {
        const pool = await dbConnection;
        const result = await pool.request()
            .input('id', id)
            .query('SELECT deletedAt FROM dbo.setor WHERE cd_setor = @id');

        if (result.recordset[0].deletedAt != null) {
            return res.status(400).json({ message: 'Setor já deletado anteriormente.'});
        } else {
            const result = await pool.request()
                .input('id', id)
                .query('UPDATE dbo.setor SET deletedAt = GETDATE() WHERE cd_setor = @id');
            return res.status(200).json({ message: 'Setor deleteado com sucesso.' });
        }
    } catch (error) {
        console.error('Erro ao deletar setor:', error);
        res.status(500).json({ message: 'Erro ao deletar setor.' });
    }
}

module.exports =  { listarSetores, atualizarSetor, listarSetorPorId, editarAtividadeDoSetor, deletarSetores, adicionarSetor };
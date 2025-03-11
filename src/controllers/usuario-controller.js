const { request } = require('express');
const dbConnection = require('../config/db-connection');

async function listarUsuarios(req, res) {
    try {
        const connect = await dbConnection
        const result = await connect.query
            `SELECT
                CD_USUARIO,
                NM_USUARIO,
                DT_NASCIMENTO,
                NR_CPF,
                SENHA,
                EMAIL,
                CONTATO,
                NM_SETOR,
                CASE
                    WHEN TP_PRIVILEGIO = 'A' THEN 'ADMINISTRADOR'
                    WHEN TP_PRIVILEGIO = 'G' THEN 'GERENTE'
                    WHEN TP_PRIVILEGIO = 'U' THEN 'USUARIO'
                    WHEN TP_PRIVILEGIO = 'C' THEN 'COORDENADOR'
                    ELSE 'CARGO NÃO CADASTRADO'
                END TP_PRIVILEGIO
                
            FROM 
                dbo.usuarios
                INNER JOIN dbo.setor ON dbo.usuarios.cd_setor = dbo.setor.cd_setor
                INNER JOIN dbo.cargo ON dbo.usuarios.cd_cargo = dbo.cargo.cd_cargo
            `
        res.status(200).json(result.recordset);
    } catch (error) {
        res.status(500).json({message:'Erro ao buscar usuarios', erro: error.message});
    }
};

async function listarUsuarioPorId(req, res) {
    const { id } = req.params;

    if (!id) {
        return res.status(400).json({ message: 'O ID do usuário é obrigatório.' });
    }

    try {
        const pool = await dbConnection;
        const result = await pool.request()
            .input('id', id)
            .query('SELECT * FROM dbo.usuarios WHERE cd_usuario = @id');

        if (result.recordset.length === 0) {
            return res.status(404).json({ message: 'Usuário não encontrado.' });
        }

        res.status(200).json(result.recordset[0]);
    } catch (error) {
        console.error('Erro ao buscar usuário:', error);
        res.status(500).json({ message: 'Erro ao buscar usuário.' });
    }
};

async function atualizarUsuario(req, res) {
    const { id } = req.params;
    const { nm_usuario, dt_nascimento, nr_cpf, cd_setor, cd_cargo, senha, email, contato } = req.body;

    if (!id) {
        return res.status(400).json({ message: 'O ID do usuário é obrigatório.' });
    }

    try {
        const pool = await dbConnection;
        let query = 'UPDATE dbo.usuarios SET';
        const updates = [];

        if (nm_usuario) updates.push('nm_usuario = @nm_usuario');
        if (dt_nascimento) updates.push('dt_nascimento = @dt_nascimento');
        if (nr_cpf) updates.push('nr_cpf = @nr_cpf');
        if (cd_setor) updates.push('cd_setor = @cd_setor');
        if (cd_cargo) updates.push('cd_cargo = @cd_cargo');
        if (senha) updates.push('senha = @senha');
        if (email) updates.push('email = @email');
        if (contato) updates.push('contato = @contato');

        if (updates.length === 0) {
            return res.status(400).json({ message: 'É necessário informar ao menos um campo para atualização.' });
        }

        query += ' ' + updates.join(', ') + ' WHERE cd_usuario = @id';

        const request = pool.request().input('id', id);

        if (nm_usuario) request.input('nm_usuario', nm_usuario);
        if (dt_nascimento) request.input('dt_nascimento', dt_nascimento);
        if (nr_cpf) request.input('nr_cpf', nr_cpf);
        if (cd_setor) request.input('cd_setor', cd_setor);
        if (cd_cargo) request.input('cd_cargo', cd_cargo);
        if (senha) request.input('senha', senha);
        if (email) request.input('email', email);
        if (contato) request.input('contato', contato);

        const result = await request.query(query);

        if (result.rowsAffected[0] === 0) {
            return res.status(404).json({ message: 'Usuário não encontrado.' });
        }

        res.status(200).json({ message: 'Usuário atualizado com sucesso.' });
    } catch (error) {
        console.error('Erro ao atualizar usuário:', error);
        res.status(500).json({ message: 'Erro ao atualizar usuário.' });
    }
}

module.exports =  { listarUsuarios, atualizarUsuario, listarUsuarioPorId };
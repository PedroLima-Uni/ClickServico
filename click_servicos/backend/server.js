import express from 'express'
import mysql from 'mysql2'
import cors from 'cors'

const app = express()
app.use(cors())
app.use(express.json())

// ================================
//  CONEXÃO COM O BANCO DE DADOS
// ================================
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'clickservico_db'
})

db.connect(err => {
    if (err) {
        console.error("❌ Erro ao conectar ao MySQL:", err)
        return
    }
    console.log("✅ Conectado ao MySQL!")
})


// =======================================
//  ROTA: CADASTRAR NOVO USUÁRIO (POST)
// =======================================
app.post('/usuarios', (req, res) => {
    const { nome, email, celular, senha, tipoUsuario } = req.body

    if (!nome || !email || !celular || !senha || !tipoUsuario) {
        return res.status(400).json({ erro: "Preencha todos os campos!" })
    }

    const sql = `
        INSERT INTO usuarios (nome, email, celular, senha, tipo)
        VALUES (?, ?, ?, ?, ?)
    `;

    db.query(sql, [nome, email, celular, senha, tipoUsuario], (err, result) => {
        if (err) {
            console.error("Erro ao inserir usuário:", err)
            return res.status(500).json({ erro: "Erro interno ao cadastrar usuário" })
        }

        res.status(201).json({
            mensagem: "Usuário cadastrado com sucesso!",
            id: result.insertId
        })
    })
})


// =======================================
//  ROTA: LOGIN (POST)
// =======================================
app.post('/login', (req, res) => {
    const { email, senha } = req.body;

    if (!email || !senha) {
        return res.status(400).json({ erro: "Preencha email e senha." })
    }

    const sql = "SELECT * FROM usuarios WHERE email = ? LIMIT 1";

    db.query(sql, [email], (err, results) => {
        if (err) {
            console.error("Erro ao buscar usuário:", err);
            return res.status(500).json({ erro: "Erro interno no servidor." })
        }

        if (results.length === 0) {
            return res.status(401).json({ erro: "Usuário não encontrado." })
        }

        const usuario = results[0];

        // Verifica a senha
        if (usuario.senha !== senha) {
            return res.status(401).json({ erro: "Senha incorreta." })
        }

        return res.status(200).json({
            mensagem: "Login realizado com sucesso!",
            usuario: {
                id_usuario: usuario.id_usuario,
                nome: usuario.nome,
                email: usuario.email,
                tipo: usuario.tipo, // <<< CONSISTENTE COM O FRONT
                celular: usuario.celular
            }
        })
    })
})


// =======================================
//  LISTAR USUÁRIOS (GET)
// =======================================
app.get('/usuarios', (req, res) => {
    const sql = "SELECT * FROM usuarios"

    db.query(sql, (err, results) => {
        if (err) {
            return res.status(500).json({ erro: "Erro ao consultar usuários" })
        }
        res.status(200).json(results)
    })
})


// ================================
//  INICIAR SERVIDOR
// ================================
app.listen(3000, () => {
    console.log("🚀 Servidor rodando na porta 3000")
})

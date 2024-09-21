const express = require('express');
const mysql = require('mysql2');
const cors = require('cors'); // Importar o pacote cors
const app = express();
const port = 3000;

// Middleware
app.use(cors()); // Permitir CORS para todas as rotas
app.use(express.json());

// Conexão com o banco de dados MySQL
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '1234',
    database: 'TODOLIST'
});

db.connect((err) => {
    if (err) {
        console.log('Erro ao conectar no banco de dados:', err);
        return;
    }
    console.log('Conectado ao banco de dados MySQL!');
});

// Rota para adicionar uma tarefa
app.post('/add-tarefa', (req, res) => {
    const { titulo } = req.body;

    if (!titulo) {
        return res.status(400).send('Título da tarefa é obrigatório');
    }

    const sql = 'INSERT INTO Lista_Tarefa (titulo) VALUES (?)';
    db.query(sql, [titulo], (err, result) => {
        if (err) {
            return res.status(500).send('Erro ao inserir a tarefa no banco de dados');
        }
        res.status(200).send('Tarefa adicionada com sucesso!');
    });
});

// Rota para obter todas as tarefas
app.get('/todos', (req, res) => {
    const sql = 'SELECT * FROM Lista_Tarefa';
    db.query(sql, (err, results) => {
        if (err) {
            return res.status(500).send('Erro ao buscar tarefas no banco de dados');
        }
        res.json(results);
    });
});

// Rota para deletar uma tarefa
app.delete('/deletar/:id', (req, res) => {
    const tarefaId = req.params.id; // Pega o ID da tarefa a partir da URL
    const sql = 'DELETE FROM Lista_Tarefa WHERE ID = ?';

    db.query(sql, [tarefaId], (err, result) => {
        if (err) {
            return res.status(500).send('Erro ao deletar a tarefa no banco de dados');
        }
        res.status(200).send('Tarefa deletada com sucesso!');
    });
});


// Iniciar o servidor
app.listen(port, () => {
    console.log(`Servidor rodando em http://localhost:${port}`);
});


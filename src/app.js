const express = require('express');

const app = express();

const PORTA = 3000;

app.use(express.json());

// rota teste
app.get('/', (req, res) => {
  res.send('API rodando 🚀');
});

app.listen(PORTA, () => {
  console.log(`Servidor rodando em http://localhost:${PORTA}`);
});


const db = require('./db/connection');

db.query('SELECT NOW()')
  .then(res => console.log('Banco conectado:', res.rows[0]))
  .catch(err => console.error('Erro ao conectar:', err));


// rotas
const clientesRoutes = require('./routes/clientes');

app.use('/clientes', clientesRoutes);
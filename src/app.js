const express = require('express');
const cors = require('cors');

const app = express();

const PORTA = 3000;

app.use(cors());
app.use(express.json());

// rota teste
app.get('/', (req, res) => {
  res.send('API rodando 🚀');
});

const db = require('./database/connection');

db.query('SELECT NOW()')
  .then(res => console.log('Banco conectado:', res.rows[0]))
  .catch(err => console.error('Erro ao conectar:', err));

// rotas
const authRoutes = require('./modules/auth/auth.routes');
const carrinhoRoutes = require('./modules/carrinho/carrinho.routes');
const categoriasRoutes = require('./modules/categorias/categorias.routes');
const clientesRoutes = require('./modules/clientes/clientes.routes');
const pedidosRoutes = require('./modules/pedidos/pedidos.routes');
const produtosRoutes = require('./modules/produtos/produtos.routes');

app.use('/auth', authRoutes);
app.use('/carrinho', carrinhoRoutes);
app.use('/categorias', categoriasRoutes);
app.use('/clientes', clientesRoutes);
app.use('/pedidos', pedidosRoutes);
app.use('/produtos', produtosRoutes);

module.exports = app;
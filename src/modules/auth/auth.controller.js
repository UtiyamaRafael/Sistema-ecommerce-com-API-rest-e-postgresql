const bcrypt = require('bcrypt');
const pool = require('../../database/connection');

const register = async (req, res) => {
  const { nome, email, senha } = req.body;
  try {
    const hashedSenha = await bcrypt.hash(senha, 10);
    const result = await pool.query('INSERT INTO clientes (nome, email, senha) VALUES ($1, $2, $3) RETURNING id', [nome, email, hashedSenha]);
    res.status(201).json({ message: 'Cliente registrado', id: result.rows[0].id });
  } catch (error) {
    if (error.code === '23505') { // unique violation
      res.status(400).json({ error: 'Email já cadastrado' });
    } else {
      res.status(500).json({ error: error.message });
    }
  }
};

const login = async (req, res) => {
  const { email, senha } = req.body;
  try {
    const result = await pool.query('SELECT * FROM clientes WHERE email = $1', [email]);
    if (result.rows.length === 0) return res.status(401).json({ message: 'Credenciais inválidas' });
    const cliente = result.rows[0];
    const isValid = await bcrypt.compare(senha, cliente.senha);
    if (!isValid) return res.status(401).json({ message: 'Credenciais inválidas' });
    // For now, no token, just return cliente data
    res.json({ message: 'Login bem-sucedido', cliente: { id: cliente.id, nome: cliente.nome, email: cliente.email } });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { register, login };
const bcrypt = require('bcrypt');
const pool = require('../../database/connection');

// =======================
// Função auxiliar para validar email
// =======================
const validateEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
};

// =======================
// Função de Registro
// =======================
const register = async (req, res) => {
  const { nome, email, senha } = req.body;

  // Validação dos dados
  if (!nome || !email || !senha) {
    return res.status(400).json({ error: 'Nome, email e senha são obrigatórios' });
  }
  if (!validateEmail(email)) {
    return res.status(400).json({ error: 'Email inválido' });
  }
  if (senha.length < 6) {
    return res.status(400).json({ error: 'Senha deve ter pelo menos 6 caracteres' });
  }

  try {
    const hashedSenha = await bcrypt.hash(senha, 10);

    const result = await pool.query(
      'INSERT INTO clientes (nome, email, senha) VALUES ($1, $2, $3) RETURNING id',
      [nome.trim(), email.trim().toLowerCase(), hashedSenha]
    );

    res.status(201).json({
      message: 'Cliente registrado',
      id: result.rows[0].id,
    });
  } catch (error) {
    if (error.code === '23505') {
      // Violação de chave única (email já cadastrado)
      res.status(400).json({ error: 'Email já cadastrado' });
    } else {
      res.status(500).json({ error: error.message });
    }
  }
};

// =======================
// Função de Login
// =======================
const login = async (req, res) => {
  const { email, senha } = req.body;

  // Validação dos dados
  if (!email || !senha) {
    return res.status(400).json({ error: 'Email e senha são obrigatórios' });
  }
  if (!validateEmail(email)) {
    return res.status(400).json({ error: 'Email inválido' });
  }

  try {
    const result = await pool.query(
      'SELECT * FROM clientes WHERE email = $1',
      [email.trim().toLowerCase()]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({ message: 'Credenciais inválidas' });
    }

    const cliente = result.rows[0];
    const isValid = await bcrypt.compare(senha, cliente.senha);

    if (!isValid) {
      return res.status(401).json({ message: 'Credenciais inválidas' });
    }

    // Por enquanto, sem token, apenas retorna dados do cliente
    res.json({
      message: 'Login bem-sucedido',
      cliente: {
        id: cliente.id,
        nome: cliente.nome,
        email: cliente.email,
      },
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// =======================
// Exportação
// =======================
module.exports = { register, login };

const express = require('express');
const router = express.Router();
const db = require('../db/connection');
const bcrypt = require('bcrypt');

// cadastro de cliente
router.post('/register', async (req, res) => {
  try {
    const { nome, cpf, email, senha } = req.body;

    const hash = await bcrypt.hash(senha, 10);

    const result = await db.query(
      'INSERT INTO clientes (nome, cpf, email, senha) VALUES ($1, $2, $3, $4) RETURNING *',
      [nome, cpf, email, hash]
    );

    res.json(result.rows[0]);

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
// Import required packages
const express = require('express');
const pool = require('./db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());

const secret = 'mysecret@555';

// SIGNUP ROUTE
app.post('/signup', async (req, res) => {
  const { name, password } = req.body;
  try {
    const hashed = await bcrypt.hash(password, 10);
    await pool.query('INSERT INTO users (name, password) VALUES ($1, $2)', [name, hashed]);
    res.status(201).json({ message: 'User registered successfully' });
  } catch (err) {
    console.error('Signup Error:', err);
    res.status(500).json({ message: 'Error signing up' });
  }
});

// LOGIN ROUTE
app.post('/login', async (req, res) => {
  const { name, password } = req.body;
  try {
    const result = await pool.query('SELECT * FROM users WHERE name=$1', [name]);
    const user = result.rows[0];
    if (!user) return res.status(401).json({ message: 'Invalid credentials' });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(401).json({ message: 'Invalid credentials' });

    const token = jwt.sign({ name: user.name }, secret, { expiresIn: '1h' });
    res.json({ message: 'Login successful', token });
  } catch (err) {
    console.error('Login Error:', err);
    res.status(500).json({ message: 'Login failed' });
  }
});

// PROTECTED ROUTE
app.get('/home', (req, res) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'No token provided' });

  try {
    const decoded = jwt.verify(token, secret);
    res.json({ message: 'Welcome to the protected page!', user: decoded.name });
  } catch (err) {
    res.status(401).json({ message: 'Invalid or expired token' });
  }
});

// Start the server
app.listen(4000, () => console.log('✅ Server running on port 4000'));

const express = require('express');
const bodyParser = require('body-parser');
const { Pool } = require('pg');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const app = express();
const port = 5000;

// PostgreSQL setup
const pool = new Pool({
  user: 'your_username',
  host: 'localhost',
  database: 'ticket_booking',
  password: 'your_password',
  port: 5432,
});

app.use(bodyParser.json());

// Middleware for authentication
const authenticateToken = (req, res, next) => {
  const token = req.header('Authorization')?.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'Unauthorized' });

  jwt.verify(token, 'your_secret_key', (err, user) => {
    if (err) return res.status(403).json({ message: 'Forbidden' });
    req.user = user;
    next();
  });
};

// User signup
app.post('/api/auth/register', async (req, res) => {
  const { username, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);
  try {
    const result = await pool.query(
      'INSERT INTO users (username, password) VALUES ($1, $2) RETURNING id',
      [username, hashedPassword]
    );
    res.status(201).json({ userId: result.rows[0].id });
  } catch (err) {
    res.status(400).json({ error: 'User already exists or invalid data' });
  }
});

// User login
app.post('/api/auth/login', async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await pool.query('SELECT * FROM users WHERE username = $1', [username]);
    if (!user.rows.length) return res.status(404).json({ error: 'User not found' });

    const validPassword = await bcrypt.compare(password, user.rows[0].password);
    if (!validPassword) return res.status(401).json({ error: 'Invalid credentials' });

    const token = jwt.sign({ userId: user.rows[0].id }, 'your_secret_key');
    res.json({ token });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Book seats
app.post('/api/seats/book', authenticateToken, async (req, res) => {
  const { userId } = req.user;
  const { seats } = req.body;

  if (!Array.isArray(seats) || seats.length > 7) {
    return res.status(400).json({ message: 'Invalid number of seats' });
  }

  try {
    const reservedSeats = await pool.query('SELECT seat_number FROM reservations WHERE seat_number = ANY($1)', [seats]);
    if (reservedSeats.rows.length > 0) {
      return res.status(400).json({ message: 'Some seats are already booked' });
    }

    const queries = seats.map((seat) => {
      return pool.query('INSERT INTO reservations (user_id, seat_number) VALUES ($1, $2)', [userId, seat]);
    });
    await Promise.all(queries);
    res.status(201).json({ message: 'Seats booked successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Reset all bookings
app.post('/api/seats/reset', authenticateToken, async (req, res) => {
  try {
    await pool.query('DELETE FROM reservations');
    res.json({ message: 'All bookings have been reset' });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

app.listen(port, () => console.log(`Server running on port ${port}`));

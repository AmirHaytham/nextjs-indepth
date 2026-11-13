// A small backend for the frontend examples. Users and courses live in memory.
// The routes match the slides: POST /auth/login, GET /auth/me, POST /auth/logout,
// GET /students/:id/courses and GET /courses.
const express = require('express');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const jwt = require('jsonwebtoken');

const PORT = process.env.PORT ?? 4000;
const SECRET = 'lab8-demo-secret';
// Short on purpose, so "authentication expiry" can be seen in class.
const TOKEN_SECONDS = Number(process.env.TOKEN_SECONDS ?? 60);

const users = [
  { id: 1, name: 'Ahmed', email: 'ahmed@giu-uni.de', password: 'student123', role: 'student' },
  { id: 2, name: 'Mona', email: 'mona@giu-uni.de', password: 'student123', role: 'student' },
  { id: 3, name: 'Dr. Nada', email: 'nada@giu-uni.de', password: 'admin123', role: 'admin' },
];

const courses = [
  { id: 'CSEN603', title: 'Software Project I', studentIds: [1, 2] },
  { id: 'CSEN501', title: 'Databases', studentIds: [1] },
  { id: 'CSEN502', title: 'Computer Networks', studentIds: [2] },
];

const publicUser = ({ password, ...user }) => user;

const app = express();
app.use(cors({ origin: [/^http:\/\/localhost:\d+$/], credentials: true }));
app.use(express.json());
app.use(cookieParser());

app.use((req, res, next) => {
  res.on('finish', () => console.log(`${req.method.padEnd(5)} ${req.path.padEnd(22)} ${res.statusCode}`));
  next();
});

// Cookie for the browser, Bearer header for the Next.js server (slide 019).
function requireAuth(req, res, next) {
  const [type, bearer] = req.headers.authorization?.split(' ') ?? [];
  const token = req.cookies.token ?? (type === 'Bearer' ? bearer : undefined);
  if (!token) return res.status(401).json({ message: 'No token, please log in' });

  try {
    const { id } = jwt.verify(token, SECRET);
    req.user = users.find((u) => u.id === id);
    next();
  } catch {
    res.status(401).json({ message: 'Token expired or invalid' });
  }
}

app.post('/auth/login', (req, res) => {
  const { email, password } = req.body ?? {};
  const user = users.find((u) => u.email === email && u.password === password);
  if (!user) return res.status(401).json({ message: 'Invalid credentials' });

  const token = jwt.sign({ id: user.id }, SECRET, { expiresIn: TOKEN_SECONDS });
  // The slide 005 cookie: HttpOnly, SameSite=Lax, Path=/.
  // Secure is left off because this runs on plain http://localhost.
  res.cookie('token', token, { httpOnly: true, sameSite: 'lax', path: '/', maxAge: TOKEN_SECONDS * 1000 });
  res.json({ message: 'Login successful', user: publicUser(user) });
});

app.post('/auth/logout', (req, res) => {
  res.clearCookie('token', { path: '/' });
  res.json({ message: 'Logged out' });
});

app.get('/auth/me', requireAuth, (req, res) => res.json(publicUser(req.user)));

// A student may only read their own courses. Admins may read anyone's.
app.get('/students/:id/courses', requireAuth, (req, res) => {
  const id = Number(req.params.id);
  if (req.user.role !== 'admin' && req.user.id !== id) {
    return res.status(403).json({ message: 'You can only see your own courses' });
  }
  res.json(courses.filter((c) => c.studentIds.includes(id)).map(({ studentIds, ...c }) => c));
});

app.get('/courses', requireAuth, (req, res) => {
  if (req.user.role !== 'admin') return res.status(403).json({ message: 'Admins only' });
  res.json(courses.map(({ studentIds, ...c }) => ({ ...c, students: studentIds.length })));
});

app.listen(PORT, () => {
  console.log(`Backend on http://localhost:${PORT}, tokens last ${TOKEN_SECONDS} seconds`);
});

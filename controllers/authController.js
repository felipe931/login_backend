const jwt = require("jsonwebtoken");
let refreshTokens = [];

const users = [
 { email: 'admin@example.com', password: 'admin123', role: 'admin' },
 { email: 'user@example.com', password: 'user123', role: 'student' },
];

const login = (req, res) => {
 const { email, password } = req.body;
 const user = users.find(u => u.email === email && u.password === password);
  if (!user) {
   return res.status(401).json({ error: 'Credenciais inválidas' });
 }
  const accessToken = jwt.sign({ email: user.email, role: user.role }, 'secreta', { expiresIn: '1h' });
 
  const refreshToken = jwt.sign({ email: user.email, role: user.role }, 'refresh_Secreta', { expiresIn: '7d' });
 
  refreshTokens.push(refreshToken);
 
  res.json({ accessToken, refreshToken });
};

const refreshToken = (req, res) => {
 const { token } = req.body;
 if (!token) return res.status(401).json({ error: 'Acesso negado' });
 if (!refreshTokens.includes(token)) return res.status(403).json({ error: 'Token inválido' });

module.exports = { login, refreshToken };
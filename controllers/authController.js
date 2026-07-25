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

  res.cookie('access', accessToken, { httpOnly: true, secure: true, sameSite: 'strict', maxAge: 3600000 });
  res.cookie('refresh', refreshToken, { httpOnly: true, secure: true, sameSite: 'strict', maxAge: 604800000 });

  res.json({ accessToken, refreshToken });
};

const refreshToken = (req, res) => {
 const { token } = req.body;
 if (!token) return res.status(401).json({ error: 'Acesso negado' });
 if (!refreshTokens.includes(token)) return res.status(403).json({ error: 'Token inválido' });

refreshTokens = refreshTokens.filter(t => t !== token);

  try {
    const verified = jwt.verify(token, 'refresh_Secreta');
    const newRefreshToken = jwt.sign({ email: verified.email, role: verified.role }, 'refresh_Secreta', { expiresIn: '7d' });
    refreshTokens.push(newRefreshToken);

    const newAccessToken = jwt.sign({ email: verified.email, role: verified.role }, 'secreta', { expiresIn: '15m' });

    res.json({ accessToken: newAccessToken, refreshToken: newRefreshToken });
  }  catch (error) {
    return res.status(403).json({ error: 'Token inválido' });
  }
};


module.exports = { login, refreshToken };        
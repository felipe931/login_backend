const express = require("express");
const app = express();

const authRoutes = require('./routes/authRoutes');
const authMiddleware = require('./middlewares/authMiddleware');
const rolesMiddleware = require('./middlewares/rolesMiddleware');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api", authRoutes);

app.get("/api/perfil", authMiddleware.tokenValidation, (req, res) => { res.json({ messagem: `Bem-vindo, ${req.user.email}!` }); });

app.get("/api/admin", rolesMiddleware.authorization(['admin']),
(_req, res) => { res.json({ messagem: "Acesso permitido para administradores" }); });

app.get("/api/student", rolesMiddleware.authorization(['student', 'admin']),
(req, res) => { res.json({ messagem: "Acesso permitido para estudantes" }); });

app.listen(3000, () => console.log("Server running on port 3000"));

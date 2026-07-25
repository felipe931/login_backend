const jwt = require("jsonwebtoken");

const authorization = (roles) => {
    return (req, res, next) => {
        const token = req.cookies.access;
        if (!token) return res.status(401).json({ error: "Acesso negado" });
        
        try {
            const verified = jwt.verify(token, "secreta");
        if (!roles.includes(verified.role)) {
            return res.status(403).json({ error: "Acesso negado" });
        }    
            req.user = verified;
            next();
        } catch (error) {
            return res.status(400).json({ error: "Token inválido" });
        }
    }
}

module.exports = { authorization };
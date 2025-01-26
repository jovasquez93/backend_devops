
const jwt = require('jsonwebtoken');
const SECRET_KEY = process.env.SECRET || "secret_key";

module.exports = {
    authenticateToken: (req, res, next) => {
        let token = req.headers['authorization'];
        if (!token) return res.sendStatus(401);
        token = token.split(' ')[1];
        jwt.verify(token, SECRET_KEY, (err, user) => {
            if (err) return res.sendStatus(403);
            req.user = user;
            next();
        });
    }
}
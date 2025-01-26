const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const User = require('../models/user');

const SECRET_KEY = process.env.SECRET || "secret_key";
module.exports = {
    auth: async (req, res) => {
        const { username, password } = req.body;
        const user = await User.findOne({ username });
        if (user && bcrypt.compareSync(password, user.password)) {
            const token = jwt.sign({ username }, SECRET_KEY, { expiresIn: '1h' });
            res.json({ token, valid: '1h' });
        } else {
            res.status(401).send('Invalid credentials');
        }
    },
    register: async (req, res) => {
        const { username, password } = req.body;
        const hashedPassword = bcrypt.hashSync(password, 10);
        const user = new User({ username, password: hashedPassword });
        await user.save();
        res.status(201).json({
            status: "created"
        });
    }
}
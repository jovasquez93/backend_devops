
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const app = express();
const PORT = 3000;
const SECRET_KEY = process.env.secret;
const connectMongo = process.env.mongo_connection;
app.use(express.json());
app.use(cors());

// MongoDB connection
mongoose.connect(connectMongo, {
    useNewUrlParser: true,
}).then(() => console.log('Connected to MongoDB')).catch(err => console.error(err));

// Schemas and Models
const UserSchema = new mongoose.Schema({
    username: String,
    password: String,
});

const CompanySchema = new mongoose.Schema({
    name: String,
    address: String,
    email: String,
});

const User = mongoose.model('User', UserSchema);
const Company = mongoose.model('Company', CompanySchema);

// Routes
app.post('/api/login', async (req, res) => {
    const { username, password } = req.body;
    const user = await User.findOne({ username });
    if (user && bcrypt.compareSync(password, user.password)) {
        const token = jwt.sign({ username }, SECRET_KEY, { expiresIn: '1h' });
        res.json({ token });
    } else {
        res.status(401).send('Invalid credentials');
    }
});

app.post('/api/register', async (req, res) => {
    const { username, password } = req.body;
    const hashedPassword = bcrypt.hashSync(password, 10);
    const user = new User({ username, password: hashedPassword });
    await user.save();
    res.sendStatus(201);
});

// Middleware to verify JWT
function authenticateToken(req, res, next) {
    const token = req.headers['authorization'];
    if (!token) return res.sendStatus(401);
    jwt.verify(token, SECRET_KEY, (err, user) => {
        if (err) return res.sendStatus(403);
        req.user = user;
        next();
    });
}

// CRUD for companies
app.get('/api/companies', authenticateToken, async (req, res) => {
    const companies = await Company.find();
    res.json(companies);
});

app.post('/api/companies', authenticateToken, async (req, res) => {
    const company = new Company(req.body);
    await company.save();
    res.sendStatus(201);
});

app.put('/api/companies/:id', authenticateToken, async (req, res) => {
    await Company.findByIdAndUpdate(req.params.id, req.body);
    res.sendStatus(200);
});

app.delete('/api/companies/:id', authenticateToken, async (req, res) => {
    await Company.findByIdAndDelete(req.params.id);
    res.sendStatus(200);
});

// Start server
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));

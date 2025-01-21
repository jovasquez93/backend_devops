
const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const app = express();
const PORT = 3000;
const SECRET_KEY = process.env.secret || "secret_key";
const connectMongo = process.env.mongo_connection || "mongodb://localhost:27017/mean_crud";
app.use(express.json());
app.use(cors());
app.use(express.static(path.join(__dirname, 'public')));
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
    let token = req.headers['authorization'];
    if (!token) return res.sendStatus(401);
    token = token.split(' ')[1];
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
    res.status(201).json({
        created: "Ok"
    });
});

app.put('/api/companies/:id', authenticateToken, async (req, res) => {
    await Company.findByIdAndUpdate(req.params.id, req.body);
    res.status(200).json({
        update: "Ok"
    });
});

app.delete('/api/companies/:id', authenticateToken, async (req, res) => {
    await Company.findByIdAndDelete(req.params.id);
    res.status(200).json({
        deleted: "Ok"
    });
});


app.get('*', (req, res, next) => {
    if (!req.path.startsWith('/api'))
        res.sendFile(path.join(__dirname, 'public/index.html'));
    else
        next();
});

// Start server
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));

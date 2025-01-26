
const express = require('express');
const cors = require('cors');

const connectDB = require('./config/db');
const routerAuth = require("./routes/login");
const routerCompany = require("./routes/company");

const app = express();
const PORT = 3000;

connectDB();

const corsOptions = {
    origin: '*'
}
app.use(cors(corsOptions));
app.disable('x-powered-by');
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: false }));


// Validate Service
app.get('/', async (req, res) => {
    res.status(200).json({
        ping: "Pong"
    })
})
// Routes
app.use("/api/auth", routerAuth);
app.use("/api/companies", routerCompany);

// Start server
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));

module.exports = app;

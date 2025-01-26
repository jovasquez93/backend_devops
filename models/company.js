const mongoose = require('mongoose');

const CompanySchema = new mongoose.Schema({
    name: String,
    address: String,
    email: String,
});

module.exports = mongoose.model('Company', CompanySchema);

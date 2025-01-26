const Company = require('../models/company');
module.exports = {
    listAll: async (req, res) => {
        const companies = await Company.find();
        res.json(companies);
    },
    getById: async (req, res) => {
        const companies = await Company.findById(req.params.id);
        res.json(companies);
    },
    register: async (req, res) => {
        const company = new Company(req.body);
        await company.save();
        res.status(201).json({
            created: "Ok"
        });
    },
    update: async (req, res) => {
        await Company.findByIdAndUpdate(req.params.id, req.body);
        res.status(200).json({
            update: "Ok"
        });
    },
    delete: async (req, res) => {
        await Company.findByIdAndDelete(req.params.id);
        res.status(200).json({
            deleted: "Ok"
        });
    }
}
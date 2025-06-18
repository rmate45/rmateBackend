const mongoose = require('mongoose')

const financialAdvisoreSchema = new mongoose.Schema({
    financial_Advisor_file_no: { type: Number },
    details: [
        {
            primary_business_name: { type: String },
            main_office_city: { type: String },
            main_office_state: { type: String },
            _id: false
        }
    ]
}, { timestamps: true })

financialAdvisoreSchema.index({ 'details.primary_business_name': 1 });

let financialAdvisorModel = mongoose.model('financial-advisors', financialAdvisoreSchema)
module.exports = financialAdvisorModel
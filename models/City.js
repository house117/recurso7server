const mongoose = require("mongoose");

const CitySchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    state: {
        type: String
    },
    country: {
        type: String,
        required: true
    },
    population: {
        type: Number
    },
    areakm2: {
        type: String
    },
    yearfounded: {
        type: Number
    },
    language: {
        type: String
    },
    website: {
        type: String
    },
    description: {
        type: String,
        required: true
    },
    principal_image: {
        type: String
    },
    creation_date: {
        type: Date,
        default: Date.now
    }
});

module.exports = City = mongoose.model("city", CitySchema);

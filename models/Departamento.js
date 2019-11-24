const mongoose = require("mongoose");

const DepartamentoSchema = mongoose.Schema({
    nombre: {
        type: String,
        required: true,
        unique: true
    },
    porcentaje: {
        type: Number
    },
    saldo: {
        type: Number,
        required: true,
        default: 0.0
    }
});

module.exports = City = mongoose.model("departamento", DepartamentoSchema);

const mongoose = require("mongoose");
const MovimientoSchema = new mongoose.Schema({
    id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "movimiento"
    },
    tipo: {
        type: String
    },
    cantidad: {
        type: Number
    },
    motivo: {
        type: String
    }
});

module.exports = Movimiento = mongoose.model("movimiento", MovimientoSchema);

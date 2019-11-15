const mongoose = require("mongoose");
const ConteoSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user"
    },
    diezmo: {
        type: Number
    },
    ofrenda: {
        type: Number
    },
    primicias: {
        type: Number
    },
    inversion: {
        type: Number
    },
    cumpleanos: {
        type: Number
    },
    agradecimiento: {
        type: Number
    },
    otros: {
        type: Number
    },
    fecha: {
        type: Date,
        default: Date.now
    }
});

module.exports = Conteo = mongoose.model("conteo", ConteoSchema);

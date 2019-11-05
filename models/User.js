const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
    nombre: {
        type: String,
        required: true
    },
    apellidos: {
        type: String,
        required: true
    },
    cargo: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    profileimg: {
        type: String
    }
});

module.exports = User = mongoose.model("user", UserSchema);

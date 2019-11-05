const express = require("express");
const router = express.Router();
const { check, validationResult } = require("express-validator");
const User = require("../../models/User");

// @route   POST api/users
// @desc    Register or update user
// @access  public
router.post(
    "/",
    [
        check("nombre", "Se requiere un nombre de persona")
            .not()
            .isEmpty(),
        check("apellidos", "Se requiere el apellido de la persona")
            .not()
            .isEmpty(),
        check("cargo", "Se requiere un cargo de la persona")
            .not()
            .isEmpty(),
        check("email", "Se requiere un email de la persona")
            .not()
            .isEmpty()
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ erros: errors.array() });
        }
        console.log(req.body);

        const { id, nombre, apellidos, cargo, email, profileimg } = req.body;
        //build profile object
        const userFields = {};

        if (id) {
            userFields.id = req.body.id;
        }
        userFields.nombre = req.body.nombre;
        userFields.apellidos = req.body.apellidos;
        userFields.cargo = req.body.cargo;
        userFields.email = req.body.email;
        if (profileimg) {
            userFields.profileimg = req.body.profileimg;
        }
        if (id) {
            console.log("id recibido: " + req.body.id);
        }
        try {
            console.log("HASTA AQUIIIIIIIIIIIIIIIIIIIIIIIIIIIIII");

            let user = await User.findOne({ _id: req.body.id });
            console.log("HASTA AQUIIIIIIIIIIIIIIIIIIIIIIIIIIIIII");

            if (user) {
                console.log("ENCONTRO EL USUARIO AL MENOS!");
                user = await User.findOneAndUpdate(
                    { _id: req.body.id },
                    { $set: userFields },
                    { new: true, upsert: true }
                );
                return res.json(user);
            }
            newUser = new User({
                nombre: userFields.nombre,
                apellidos: userFields.apellidos,
                cargo: userFields.cargo,
                email: userFields.email,
                profileimg: userFields.profileimg
            });
            await newUser.save();
            res.json(newUser);
        } catch (error) {
            console.error(error.message);
            res.status(500).send("Server Error");
        }

        //res.send("Cities route");
    }
);

// @route   GET api/users/
// @desc    Get users in database
// @access  public
router.get("/", async (req, res) => {
    try {
        const users = await User.find({});
        console.log("BUSCANDO USUARIOS...");
        res.json(users);
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error");
    }
});

// @route   GET api/ciudades/:id
// @desc    Get users by id
// @access  public
router.get("/:id", async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        console.log(req.params.id);
        if (!user) {
            return res.status(404).json({ msg: "User not found" });
        }

        res.json(user);
    } catch (err) {
        console.error(err.message);
        if (err.kind === "ObjectId") {
            return res.status(404).json({ msg: "User not found" });
        }
        res.status(500).send("Server Error");
    }
});

// @route   DELETE api/ciudades/:id
// @desc    Delete a user
// @access  public
router.delete("/:id", async (req, res) => {
    try {
        console.log("entro A DELETE!!!!!!!!!!!");
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ msg: "User not found" });
        }

        await user.remove();

        res.json({ msg: "Usuario eliminado" });
        //res.json(users);
    } catch (err) {
        console.error(err.message);
        if (err.kind === "ObjectId") {
            return res.status(404).json({ msg: "User not found" });
        }
        res.status(500).send("Server Error");
    }
});

module.exports = router;

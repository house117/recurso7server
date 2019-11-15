const express = require("express");
const router = express.Router();
const { check, validationResult } = require("express-validator");
const Conteo = require("../../models/Conteo");
const User = require("../../models/User");
const mongoose = require("mongoose");

var DateOnly = require("mongoose-dateonly")(mongoose);
//Register or update CONTEO
// @route   POST api/conteo
// @desc    Register or update conteo
// @access  public
router.post(
    "/",
    [
        check("user", "Se requiere un id de usuario")
            .not()
            .isEmpty()
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ erros: errors.array() });
        }
        console.log(req.body);

        const {
            id,
            user,
            diezmo,
            ofrenda,
            primicias,
            inversion,
            cumpleanos,
            agradecimiento,
            otros,
            fecha
        } = req.body;
        //build profile object
        const conteoFields = {};
        if (id) {
            conteoFields.id = req.body.id;
            console.log("id de conteo recibido recibido: " + req.body.user);
        }
        conteoFields.user = req.body.user;
        console.log("id usuario recibido: " + req.body.user);
        if (diezmo) {
            conteoFields.diezmo = req.body.diezmo;
        }
        if (ofrenda) {
            conteoFields.ofrenda = req.body.ofrenda;
        }
        if (primicias) {
            conteoFields.primicias = req.body.primicias;
        }
        if (inversion) {
            conteoFields.inversion = req.body.inversion;
        }
        if (cumpleanos) {
            conteoFields.cumpleanos = req.body.cumpleanos;
        }
        if (agradecimiento) {
            conteoFields.agradecimiento = req.body.agradecimiento;
        }
        if (otros) {
            conteoFields.otros = req.body.otros;
        }
        if (fecha) {
            conteoFields.fecha = req.body.fecha;
        }
        try {
            let conteo = await Conteo.findOne({ _id: req.body.id });
            console.log("Buscó el conteo");
            if (conteo) {
                console.log("ENCONTRO EL CONTEO AL MENOS!");
                conteo = await Conteo.findOneAndUpdate(
                    { _id: req.body.id },
                    { $set: conteoFields },
                    { new: true, upsert: true }
                );
                console.log("A punto de vuelta");
                return res.json(conteo);
            }
            console.log("No encontró el conteo, creando uno nuevo");
            newConteo = new Conteo({
                user: conteoFields.user,
                diezmo: conteoFields.diezmo,
                ofrenda: conteoFields.ofrenda,
                primicias: conteoFields.primicias,
                inversion: conteoFields.inversion,
                cumpleanos: conteoFields.cumpleanos,
                agradecimiento: conteoFields.agradecimiento,
                otros: conteoFields.otros,
                fecha: conteoFields.fecha
            });
            await newConteo.save();
            res.json(newConteo);
        } catch (error) {
            console.error(error.message);
            res.status(500).send("Server Error");
        }

        //res.send("Cities route");
    }
);

// @route   GET api/conteo/
// @desc    Get conteo in database today
// @access  public
router.get("/hoy", async (req, res) => {
    try {
        //Person.find({ birthday: { $lt: Date.now() } });
        var start = new Date();
        start.setHours(0, 0, 0, 0);

        var end = new Date();
        end.setHours(23, 59, 59, 999);

        var conteos = await Conteo.find({
            fecha: { $gte: start, $lt: end }
        });

        console.log("BUSCANDO conteos de HOY...");

        res.json(conteos);
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error");
    }
});

// @route   GET api/conteo/
// @desc    Get conteo in database
// @access  public
router.get("/", async (req, res) => {
    try {
        const conteos = await Conteo.find({});
        console.log("BUSCANDO conteos...");
        res.json(conteos);
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error");
    }
});

// @route   DELETE api/users/:id
// @desc    Delete a conteo
// @access  public
router.delete("/:id", async (req, res) => {
    try {
        console.log("entro A DELETE conteo!!!!!!!!!!!");
        const conteo = await Conteo.findById(req.params.id);
        if (!conteo) {
            return res.status(404).json({ msg: "Conteo not found" });
        }

        await conteo.remove();

        res.json({ msg: "Conteo eliminado" });
        //res.json(users);
    } catch (err) {
        console.error(err.message);
        if (err.kind === "ObjectId") {
            return res.status(404).json({ msg: "Conteo not found" });
        }
        res.status(500).send("Server Error");
    }
});

module.exports = router;

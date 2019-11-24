const express = require("express");
const router = express.Router();
const { check, validationResult } = require("express-validator");
const Depto = require("../../models/Departamento");
const mongoose = require("mongoose");

//Register or update CONTEO
// @route   POST api/departamentos
// @desc    Register or update departamento
// @access  public
router.post(
    "/",
    [
        check("nombre", "Se requiere un nombre de departamento")
            .not()
            .isEmpty()
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ erros: errors.array() });
        }
        console.log(req.body);

        const { id, nombre, porcentaje, saldo } = req.body;
        //build profile object
        const departamentoFields = {};

        if (id) {
            departamentoFields.id = req.body.id;
            console.log(
                "id de departamento recibido recibido: " + req.body.user
            );
        }
        console.log("id usuario recibido: " + req.body.user);
        if (nombre) {
            departamentoFields.nombre = req.body.nombre;
        }
        if (porcentaje) {
            departamentoFields.porcentaje = req.body.porcentaje;
        }
        if (saldo) {
            departamentoFields.saldo = req.body.saldo;
        }
        try {
            let departamento = await Depto.findOne({ _id: req.body.id });
            console.log("Buscó el departamento");
            if (departamento) {
                console.log("ENCONTRO EL departamento AL MENOS!");
                departamento = await Depto.findOneAndUpdate(
                    { _id: req.body.id },
                    { $set: departamentoFields },
                    { new: true, upsert: true }
                );
                console.log("A punto de vuelta");
                return res.json(departamento);
            }
            console.log("No encontró el departamento, creando uno nuevo");
            newDepto = new Depto({
                nombre: departamentoFields.nombre,
                porcentaje: departamentoFields.porcentaje,
                saldo: departamentoFields.saldo
            });
            await newDepto.save();
            res.json(newDepto);
        } catch (error) {
            console.error(error.message);
            res.status(500).send("Server Error");
        }

        //res.send("Cities route");
    }
);

// @route   GET api/conteo/
// @desc    Get departamentos in database
// @access  public
router.get("/", async (req, res) => {
    try {
        const departamentos = await Depto.find({});
        console.log("BUSCANDO departamentos...");
        res.json(departamentos);
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
        console.log("entro A DELETE Departamentos!");
        const conteo = await Depto.findById(req.params.id);
        if (!conteo) {
            return res.status(404).json({ msg: "Departamento not found" });
        }

        await conteo.remove();

        res.json({ msg: "Departamento eliminado" });
        //res.json(users);
    } catch (err) {
        console.error(err.message);
        if (err.kind === "ObjectId") {
            return res.status(404).json({ msg: "Departamento not found" });
        }
        res.status(500).send("Server Error");
    }
});

module.exports = router;

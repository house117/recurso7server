const express = require("express");
const router = express.Router();
const { check, validationResult } = require("express-validator");
const Movimiento = require("../../models/Movimiento");
const Departamento = require("../../models/Departamento");
const mongoose = require("mongoose");

var DateOnly = require("mongoose-dateonly")(mongoose);
//Register or update CONTEO
// @route   POST api/movimiento
// @desc    Register or update movimiento
// @access  public
router.post(
    "/",
    [
        check("id", "Se requiere un id de departamento")
            .not()
            .isEmpty()
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ erros: errors.array() });
        }
        console.log(req.body);

        const { _id, id, tipo, cantidad, motivo } = req.body;
        //build profile object
        const movimientoFields = {};
        if (_id) {
            movimientoFields._id = req.body._id;
            console.log("id de departamento recibido: " + req.body._id);
        }
        if (id) {
            movimientoFields.id = req.body.id;
            console.log("id de departamento recibido: " + req.body.id);
        }
        movimientoFields.user = req.body.user;
        console.log("id usuario recibido: " + req.body.user);
        if (tipo) {
            movimientoFields.tipo = req.body.tipo;
        }
        if (cantidad) {
            movimientoFields.cantidad = req.body.cantidad;
        }
        if (motivo) {
            movimientoFields.motivo = req.body.motivo;
        }

        console.log("Se supone que ya se sumo olv :v ");

        try {
            let departamento = await Departamento.findOne({
                _id: req.body.id
            });
            if (tipo == "Ingreso") {
                console.log("Se prepara un movimiento de inreso");
                if (departamento) {
                    console.log(
                        "Encontró el departamento al que se le agregara jajajsdas"
                    );
                    console.log(
                        "Cantidad del depto antes de la suma: " +
                            departamento.saldo
                    );
                    departamento.saldo += cantidad;
                    console.log(
                        "Cantidad del depto antes de la suma: " +
                            departamento.saldo
                    );
                }
            }
            if (tipo == "Egreso") {
                console.log("Se prepara un movimiento de inreso");
                if (departamento) {
                    console.log(
                        "Encontró el departamento al que se le agregara jajajsdas"
                    );
                    console.log(
                        "Cantidad del depto antes de la suma: " +
                            departamento.saldo
                    );
                    departamento.saldo -= cantidad;
                    console.log(
                        "Cantidad del depto antes de la suma: " +
                            departamento.saldo
                    );
                }
            }
            departamento = await Departamento.findOneAndUpdate(
                { _id: req.body.id },
                { $set: departamento },
                { new: true, upsert: true }
            );
            let movimiento = await Movimiento.findOne({ _id: req.body._id });
            console.log("Buscó el movimiento");
            if (movimiento) {
                console.log("ENCONTRO EL movimiento AL MENOS!");
                movimiento = await Movimiento.findOneAndUpdate(
                    { _id: req.body._id },
                    { $set: movimientoFields },
                    { new: true, upsert: true }
                );
                console.log("A punto de vuelta");
                return res.json(movimiento);
            }
            console.log("No encontró el movimiento, creando uno nuevo");
            newMovimiento = new Movimiento({
                id: movimientoFields.id,
                tipo: movimientoFields.tipo,
                cantidad: movimientoFields.cantidad,
                motivo: movimientoFields.motivo
            });
            await newMovimiento.save();
            res.json(newMovimiento);
        } catch (error) {
            console.error(error.message);
            res.status(500).send("Server Error");
        }

        //res.send("Cities route");
    }
);
// @route   GET api/ciudades/:id
// @desc    Get users by id
// @access  public
router.get("/:id", async (req, res) => {
    try {
        const movimiento = await Movimiento.find({ id: req.params.id });
        console.log(req.params.id);
        if (!movimiento) {
            return res.status(404).json({ msg: "Movimiento not found" });
        }

        res.json(movimiento);
    } catch (err) {
        console.error(err.message);
        if (err.kind === "ObjectId") {
            return res.status(404).json({ msg: "Movimiento not found" });
        }
        res.status(500).send("Server Error");
    }
});
// @route   GET api/movimiento/
// @desc    Get movimiento in database today
// @access  public
/*
router.get("/hoy", async (req, res) => {
    try {
        var start = new Date();
        start.setHours(0, 0, 0, 0);

        var end = new Date();
        end.setHours(23, 59, 59, 999);

        var movimientos = await Movimiento.find({
            fecha: { $gte: start, $lt: end }
        });

        console.log("BUSCANDO movimientos de HOY...");

        res.json(movimientos);
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error");
    }
});
*/
// @route   GET api/movimiento/
// @desc    Get movimiento in database
// @access  public
router.get("/", async (req, res) => {
    try {
        const movimientos = await Movimiento.find({});
        console.log("BUSCANDO movimientos...");
        res.json(movimientos);
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error");
    }
});

// @route   DELETE api/movimientos/:id
// @desc    Delete a movimiento
// @access  public
router.delete("/:id", async (req, res) => {
    try {


        console.log("id mov recibido:"+req.params.id);
        let movimientoAux = await Movimiento.findOne({ _id: req.params.id });
        
        if(movimientoAux){
            console.log("HOLA JOSE EXISTE MOVAU");
        }
        //funcion prueba
        let departamento = await Departamento.findOne({
            _id: movimientoAux.id
        });
        if (movimientoAux.tipo == "Ingreso") {
            console.log("Se prepara un movimiento de inreso");
            if (departamento) {
                console.log(
                    "Encontró el departamento al que se le agregara jajajsdas"
                );
                console.log(
                    "Cantidad del depto antes de la suma: " +
                        departamento.saldo
                );
                departamento.saldo -= movimientoAux.cantidad;
                console.log(
                    "Cantidad del depto antes de la suma: " +
                        departamento.saldo
                );
            }
        }
        if (movimientoAux.tipo == "Egreso") {
            console.log("Se prepara un movimiento de inreso");
            if (departamento) {
                console.log(
                    "Encontró el departamento al que se le agregara jajajsdas"
                );
                console.log(
                    "Cantidad del depto antes de la suma: " +
                        departamento.saldo
                );
                departamento.saldo += movimientoAux.cantidad;
                console.log(
                    "Cantidad del depto antes de la suma: " +
                        departamento.saldo
                );
            }
        }
        departamento = await Departamento.findOneAndUpdate(
            { _id: movimientoAux.id },
            { $set: departamento },
            { new: true, upsert: true }
        );
        
        //fin funcion


















        console.log("entro A DELETE Movimiento!");
        const movimiento = await Movimiento.findById(req.params.id);
        if (!movimiento) {
            return res.status(404).json({ msg: "Movimiento not found" });
        }

        await movimiento.remove();

        res.json({ msg: "Movimiento eliminado" });
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

const express = require("express");
const router = express.Router();
const { check, validationResult } = require("express-validator");
const City = require("../../models/City");

// @route   POST api/ciudades
// @desc    Register city
// @access  public
router.post(
    "/",
    [
        check("name", "Se requiere un nombre de ciudad")
            .not()
            .isEmpty(),
        check("country", "Se requiere un pais")
            .not()
            .isEmpty(),
        check("description", "Se requiere una descripción")
            .not()
            .isEmpty()
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ erros: errors.array() });
        }
        const {
            id,
            name,
            state,
            country,
            population,
            areakm2,
            yearfounded,
            language,
            website,
            description,
            principal_image
        } = req.body;
        //build profile object
        const cityFields = {};

        if (id) {
            cityFields.id = req.body.id;
        }
        cityFields.name = req.body.name;
        if (state) cityFields.state = req.body.state;
        cityFields.country = req.body.country;
        if (population) cityFields.population = req.body.population;
        if (areakm2) cityFields.areakm2 = req.body.areakm2;
        if (yearfounded) cityFields.yearfounded = req.body.yearfounded;
        if (language) cityFields.language = req.body.language;
        if (website) cityFields.website = req.body.website;
        cityFields.description = req.body.description;
        if (principal_image)
            cityFields.principal_image = req.body.principal_image;
        console.log("ASDASFASDLKASDJFKLASD");
        console.log("id recibido: " + req.body.id);
        try {
            let city = await City.findOne({ _id: req.body.id });
            if (city) {
                console.log("ENCONTRO LA CIUDAD AL MENOS!");
                city = await City.findOneAndUpdate(
                    { _id: req.body.id },
                    { $set: cityFields },
                    { new: true, upsert: true }
                );
                return res.json(city);
            }
            newCity = new City({
                name: cityFields.name,
                state: cityFields.state,
                country: cityFields.country,
                population: cityFields.population,
                areakm2: cityFields.areakm2,
                yearfounded: cityFields.yearfounded,
                language: cityFields.language,
                website: cityFields.website,
                description: cityFields.description,
                principal_image: cityFields.principal_image
            });
            await newCity.save();
            res.json(newCity);
        } catch (error) {
            console.error(error.message);
            res.status(500).send("Server Error");
        }

        //res.send("Cities route");
    }
);
/*router.delete("/", async (req, res) => {
    try {
        await 
    } catch (error) {
        console.error(error.message);
    }
});
*/

// @route   GET api/ciudades/
// @desc    Get cities in database
// @access  public
router.get("/", async (req, res) => {
    try {
        const cities = await City.find({});
        console.log("HOLA MUNDO???");
        res.json(cities);
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error");
    }
});

// @route   GET api/ciudades/:id
// @desc    Get city by id
// @access  public
router.get("/:id", async (req, res) => {
    try {
        const city = await City.findById(req.params.id);
        console.log(req.params.id);
        if (!city) {
            return res.status(404).json({ msg: "City not found" });
        }

        res.json(city);
    } catch (err) {
        console.error(err.message);
        if (err.kind === "ObjectId") {
            return res.status(404).json({ msg: "City not found" });
        }
        res.status(500).send("Server Error");
    }
});

// @route   DELETE api/ciudades/:id
// @desc    Delete a city
// @access  public
router.delete("/:id", async (req, res) => {
    try {
        console.log("entro A DELETE!!!!!!!!!!!");
        const city = await City.findById(req.params.id);
        if (!city) {
            return res.status(404).json({ msg: "City not found" });
        }

        await city.remove();

        res.json({ msg: "Ciudad eliminada" });
        res.json(cities);
    } catch (err) {
        console.error(err.message);
        if (err.kind === "ObjectId") {
            return res.status(404).json({ msg: "City not found" });
        }
        res.status(500).send("Server Error");
    }
});

module.exports = router;

const express = require("express");
const route = express.Router();
const db = require("../database/db");
const router = require("./voiture");

route.get("/findAll", (req, res) => {
    db.garage
        .findAll({
            attributes: {
                include: [],
                // don't need to show this filed
                exclude: ["updated_at", "created_at"],
            },
            include: [{
                model: db.atelier,
                attributes: {
                    include: [],
                    // don't need to show this filed
                    exclude: ["garageId", "updated_at", "created_at"],
                },
            }, ],
            where: { id: req.params.id },
        })
        .then((garage) => {
            if (garage) {
                res.json({
                    garages: garage,
                });
            } else {
                res.json({ error: "pas de garage" });
            }
        })
        .catch((err) => {
            res.json(err);
        });
});

route.post("/new", (req, res) => {
    db.garage
        .create(req.body)
        .then((garage) => {
            res.status(200).json(garage);
        })
        .catch((err) => {
            res.json(err);
        });
});

router.get("/findby/:id", (req, res) => {
    db.garage
        .findOne({
            attributes: {
                include: [],
                // don't need to show this filed
                exclude: ["updated_at", "created_at"],
            },
            include: [{
                model: db.atelier,
                attributes: {
                    include: [],
                    // don't need to show this filed
                    exclude: ["garageId", "updated_at", "created_at"],
                },
            }, ],
            where: { id: req.params.id },
        })
        .then((garage) => {
            res.json(garage);
        })
        .catch((err) => {
            res.json(err);
        });
});

module.exports = route;
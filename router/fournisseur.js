const express = require("express");
const route = express.Router();

const db = require("../database/db");

route.post("/creer", (req, res) => {
    db.fournisseur
        .findOne({
            where: { email: req.body.email },
        })
        .then((fournisseur) => {
            if (!fournisseur) {
                db.fournisseur.create(req.body).catch((err) => {
                    res.status(400).send("error" + err);
                });
            } else {
                fournisseur
                    .update({
                        adresse: req.body.adresse,
                    })
                    .then((rep) => {
                        res.status(200).json({ fournisseur: rep });
                    })
                    .catch((err) => {
                        res.status(403).json("n'est pas jour");
                    });
            }
        })
        .catch((err) => {
            res.status(404).json("N'est trouver");
        });
});

module.exports = route;
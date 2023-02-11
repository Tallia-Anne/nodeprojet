const express = require("express");
const router = express.Router();
const db = require("../database/db");
// creer un atelier associer au garage
router.post("/findOne", (req, res) => {
    db.atelier
        .findOne({
            where: { nom: req.body.nom, garageId: req.body.id },
        })
        .then((atelier) => {
            if (!atelier) {
                db.atelier
                    .create(req.body)
                    .then((response) => res.json(response))
                    .catch((err) => {
                        res.json(err);
                    });
            }
        });
});

module.exports = router;
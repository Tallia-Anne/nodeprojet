const express = require("express");
const route = express.Router();

const db = require("../database/db");

route.post("/new", (req, res) => {
    db.piece
        .create(req.body)
        .then((piece) => {
            res.status(200).json(piece);
        })
        .catch((err) => {
            res.json(err);
        });
});

route.post("/findOne", (req, res) => {
    db.piece
        .findOne({
            where: { name: req.body.name, marqueId: req.body.id },
        })
        .then((piece) => {
            if (!piece) {
                db.piece
                    .create(req.body)
                    .then((response) => res.json(response))
                    .catch((err) => {
                        res.json(err);
                    });
            }
        });
});

route.get("/findby/:id", (req, res) => {
    db.piece
        .findOne({
            attributes: {
                include: [],
                // don't need to show this filed
                exclude: ["updated_at", "created_at"],
            },
            include: [{
                model: db.reparation,
                attributes: {
                    include: [],
                    // don't need to show this filed
                    exclude: ["pieceId", "updated_at", "created_at"],
                },
            }, ],
            where: { id: req.params.id },
        })
        .then((piece) => {
            res.json(piece);
        })
        .catch((err) => {
            res.json(err);
        });
});

module.exports = route;
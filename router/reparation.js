const Express = require("express"),
    router = Express.Router(),
    db = require("../database/db");

// cette route permet de créer un reparation
router.post("/inventer", (req, res) => {
    //pouvoir le stoker
    var piece = req.body.piece;

    db.reparation
        .findOne({
            // recuperer la reference du reparation
            where: { date_de_reparations: req.body.date_de_reparations },
        })
        .then((reparation) => {
            if (!reparation) {
                db.reparation
                    .create(req.body)
                    .then((reparationitem) => {
                        db.piece
                            .create({
                                Status: 1,
                                piece: req.body.piece,
                                reparationId: reparationitem.id,
                            })
                            .then((piece) => {
                                res.status(200).json({
                                    reparationId: reparationitem,
                                    piece: piece,
                                    message: "ok ",
                                });
                            })
                            .catch((err) => {
                                res.json(err);
                            });
                    })
                    .catch((err) => {
                        res.status(400).send("error" + err);
                    });
            } else {
                reparation
                    .update({
                        modele: req.body.modele,
                    })
                    .then((rep) => {
                        res.status(200).json({ reparation: rep });
                    })
                    .catch((err) => {
                        res.status(403).json("not updated");
                    });
            }
        })
        .catch((err) => {
            res.status(404).json("Not found");
        });
});

module.exports = router;
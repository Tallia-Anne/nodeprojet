const Express = require("express"),
    router = Express.Router(),
    bcrypt = require("bcrypt"),
    db = require("../database/db");

// permet de créer une commande
router.post("/naitre", (req, res) => {
    db.commande
        .findOne({
            where: { clientId: req.body.clientId, Status: 10 },
        })
        .then((commande) => {
            if (!commande) {
                console.log(commande);
                db.commande
                    .create(req.body)
                    .then((commmandeitem) => {
                        db.contenir
                            .create({
                                Status: 1,
                                qtn: req.body.qtn,
                                prix: req.body.prix,
                                produitId: req.body.produitId,
                                commandeId: commmandeitem.id,
                            })
                            .then((commande) => {
                                res.status(200).json({
                                    commandeId: commmandeitem,
                                    message: "ok",
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
                commande
                    .update({
                        Status: req.body.Status,
                    })
                    .then((rep) => {
                        res.status(200).json({ commande: rep });
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
router.get("/show", (req, res) => {
    db.commande
        .findAll({})
        .then((commande) => {
            if (commande) {
                res.json({
                    commande: commande,
                });
            } else {
                res.json({ error: "il n'y a pas de commande" });
            }
        })
        .catch((err) => {
            res.json("error" + err);
        });
});
router.get("/getshow/:id", (req, res) => {
    db.commande
        .findOne({
            where: { id: req.params.id },
            include: [{
                model: db.contenir,
            }, ],
        })
        .then((commmande) => {
            res.status(200).json({ commande: commmande });
        })
        .catch((err) => {
            res.json(err);
        });
});

module.exports = router;
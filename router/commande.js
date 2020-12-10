const Express = require("express"),
    router = Express.Router(),
    bcrypt = require("bcrypt"),
    db = require("../database/db");


router.post("/new", (req, res) => {
    var commande = { clientId: req.body.clientId, Status: 1 };
    db.commande.create(commande)
        .then((commande) => {
            for (let i = 0; i < req.body.panier.length; i++) {
                command.addProduits(req.body.panier[i].produitId, { through: { prix: req.body.panier[i].prix_unitaire, qtn: req.body.panier[i].quantite } })
                    .then(resp => {
                        res.json(resp)
                    })
                    .catch(err => {
                        res.json(err)
                    })
            }
        })
        .catch((err) => {
            res.json(err)
        })
});

// permet de créer une commande
router.post("/naitre", (req, res) => {
    db.commande
        // recuperer l'id du client
        .findOne({
            where: { clientId: req.body.clientId, Status: 10 },
        })
        //la commande existe déjà
        .then((commande) => {
            if (!commande) {
                console.log(commande);
                db.commande
                    // alors il va créer une commande
                    .create(req.body)
                    // la commmandeitem existe déjà
                    .then((commmandeitem) => {
                        //alors créer  contenir
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
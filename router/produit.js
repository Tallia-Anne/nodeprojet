const Express = require("express"),
    router = Express.Router(),
    { Op } = require("sequelize"),
    db = require("../database/db");

// cette route permet de créer un produit
router.post("/new", (req, res) => {
    //pouvoir le stoker
    var image = req.body.image;

    db.produit
        .findOne({
            // recuperer la reference du produit
            where: { ref: req.body.ref },
        })
        .then((produit) => {
            if (!produit) {
                db.produit
                    .create(req.body)
                    .then((produititem) => {
                        db.image
                            .create({
                                Status: 1,
                                image: req.body.image,
                                produitId: produititem.id,
                            })
                            .then((image) => {
                                res.status(200).json({
                                    produitId: produititem,
                                    image: image,
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
                produit
                    .update({
                        stock: req.body.stock,
                    })
                    .then((rep) => {
                        res.status(200).json({ produit: rep });
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

// cette route permet d'afficher tous les produits
router.get("/all", (req, res) => {
    db.produit
        .findAll({
            include: [{
                model: db.image,
            }, ],
        })
        .then((produits) => {
            if (produits) {
                res.status(200).json({
                    produits: produits,
                });
            } else {
                res.status(404).json("il n'a pas de produits");
            }
        })
        .catch((err) => {
            res.json(err);
        });
});

router.get("/limit/:limit", (req, res) => {
    db.produit
        .findAll({
            include: [{
                model: db.image,
            }, ],
            limit: parseInt(req.params.limit),
        })
        .then((produits) => {
            res.status(200).json({ produits: produits });
        })
        .catch((err) => {
            res.status(502).json("bad req" + err);
        });
});

router.get("/all/:limit/:offset", (req, res) => {
    db.produit
        .findAll({
            include: [{
                model: db.image,
            }, ],
            offset: parseInt(req.params.offset),
            limit: parseInt(req.params.limit),
        })
        .then((reponse) => {
            res.status(200).json({ produit: reponse });
        })
        .catch((err) => {
            res.json(err);
        });
});

// cette route permet d'ajouter une image
router.post("/addimage", (req, res) => {
    var id = req.body.id;
    db.image
        .create({
            image: req.body.image,
            produitId: req.body.id,
        })
        .then(() => {
            db.produit
                .findOne({
                    where: { id: id },
                    include: [{
                        model: db.image,
                    }, ],
                })
                .then((produit) => {
                    res.status(200).json({
                        produit: produit,
                    });
                })
                .catch((err) => {
                    res.json(err);
                });
        })
        .catch((err) => {
            res.json(err);
        });
});

router.get("/findBy/:nom", (req, res) => {
    db.produit
        .findAll({
            where: {
                nom: {
                    [Op.like]: "%" + req.params.nom,
                },
            },
            include: [{
                model: db.image,
            }, ],
        })
        .then((produits) => {
            res.status(200).json({ produits: produits });
        })
        .catch((err) => {
            res.json(err);
        });
});

router.get("/getById/:id", (req, res) => {
    db.produit
        .findOne({
            where: { id: req.params.id },
            include: [{
                model: db.image,
            }, ],
        })
        .then((produit) => {
            res.status(200).json({ produit: produit });
        })
        .catch((err) => {
            res.json(err);
        });
});
module.exports = router;
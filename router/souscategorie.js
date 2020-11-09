const Express = require("express"),
    router = Express.Router(),
    { Op } = require("sequelize"),
    db = require("../database/db");

// cette route permet de créer un souscategorie
router.post("/new", (req, res) => {
    db.souscategorie
        .findOne({
            where: {
                nom: req.body.nom,
                produitId: req.body.produitId,
                categorieId: req.body.categorieId,
            },
        })
        .then((souscategorie) => {
            if (!souscategorie) {
                db.souscategorie
                    .create(req.body)
                    .then((response) => res.json(response))
                    .catch((err) => {
                        res.json(err);
                    });
            } else {
                res.json("la souscatégorie existe déjà");
            }
        });
});

// cette route permet d'afficher tous les souscategories

router.get("/show", (req, res) => {
    db.souscategorie
        .findAll({})
        .then((souscategorie) => {
            if (souscategorie) {
                res.json({
                    souscategorie: souscategorie,
                });
            } else {
                res.json({ error: "Il n'y a pas de souscategorie" });
            }
        })
        .catch((err) => {
            res.json("error" + err);
        });
});

router.get("/findBy/:nom", (req, res) => {
    db.souscategorie
        .findOne({
            where: {
                nom: {
                    [Op.like]: "%" + req.params.nom,
                },
            },
        })
        .then((souscategorie) => {
            res.status(200).json({ categories: categories });
        })
        .catch((err) => {
            res.json(err);
        });
});

module.exports = router;
const express = require("express"),
    router = express.Router(),
    db = require("../database/db");

// Cette route permet créer une categorie
router.post("/new", (req, res) => {
    //recuperer le nom du categorie sera unique et l'id du garage
    db.categorie
        .findOne({
            where: { nom: req.body.nom, produitId: req.body.produitId },
        })
        // vient les recuperer
        .then((categorie) => {
            // categorie n'existe pas
            if (!categorie) {
                //categorie va le créer
                db.categorie
                    .create(req.body)
                    //vient le créer    // recevoir le message
                    .then((response) => res.json(response))
                    //attraper
                    .catch((err) => {
                        //recevoir le message d'erreur
                        res.json(err);
                    });
            } else {
                res.json("la catégorie existe déjà");
            }
        })
        .catch((err) => {
            res.json(err);
        });
});

router.get("/show", (req, res) => {
    db.categorie
        .findAll({})
        .then((categorie) => {
            if (categorie) {
                res.json({
                    categorie: categorie,
                });
            } else {
                res.json({ error: "il n'y a pas de categorie" });
            }
        })
        .catch((err) => {
            res.json("error" + err);
        });
});

module.exports = router;
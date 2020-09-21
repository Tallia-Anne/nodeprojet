const Express = require("express"),
    router = Express.Router(),
    db = require("../database/db");

// cette route permet de créer un souscategorie
router.post("/cree", (req, res) => {
    var image = req.body.image;
    console.log(req.body);
    db.souscategorie
        .findOne({
            // recuperer la reference du souscategorie
            where: { ref: req.body.ref },
        })
        .then((souscategorie) => {
            if (!souscategorie) {
                db.souscategorie
                    .create({
                        categorieId: req.body.idcategorid,
                        souscategorieId: categorieitem.id,
                    })
                    .then((souscategorieitem) => {
                        db.image
                            .create({
                                image: image,
                                souscategorieIdId: categorieitem.id,
                            })
                            .then(() => {
                                db.souscategorie
                                    .findOne({
                                        // recuperer la reference du souscategorie
                                        where: { id: itemcategorie.id },
                                        include: [{
                                            model: db.image,
                                        }, ],
                                    })
                                    // recuperer tous les informations
                                    .then((souscategorie) => {
                                        res.status(200).json({ souscategorie: souscategorie });
                                    })
                                    .catch((err) => {
                                        res.status(502).json(err);
                                    });
                            });
                    })
                    .catch((err) => {
                        res.json(err);
                    });
            } else {
                souscategorie
                    .update({
                        stock: req.body.stock,
                    })
                    .then((rep) => {
                        res.status(200).json({ souscategorie: rep });
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

// cette route permet d'afficher tous les souscategories
router.get("/afficher", (req, res) => {
    db.souscategorie
        .findAll({
            include: [{
                model: db.image,
            }, ],
        })
        .then((souscategories) => {
            if (souscategories) {
                res.status(200).json({
                    souscategories: souscategories,
                });
            } else {
                res.status(404).json("il n'a pas de souscategories");
            }
        })
        .catch((err) => {
            res.json(err);
        });
});

module.exports = router;
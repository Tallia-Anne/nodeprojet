const Express = require("express"),
    router = Express.Router(),
    db = require("../database/db");

// creer une nouvelle voiture
router.post("/new", (req, res) => {
    const marque = req.body.marque;
    const cardata = {
        marqueId: null,
        modele: req.body.modele,
        type_moteur: req.body.type_moteur,
        numero_plaque: req.body.numero_plaque,
        annee: req.body.annee,
        couleur: req.body.couleur,
        clientId: null,
    };
    db.client
        .findOne({
            where: { id: req.body.clientId },
        })
        .then((client) => {
            if (client) {
                cardata.clientId = client.id;
                db.marque
                    .findOne({ where: { marque: marque } })
                    .then((marque) => {
                        if (marque) {
                            cardata.marqueId = marque.id;
                            db.voiture
                                .findOne({
                                    where: { numero_plaque: cardata.numero_plaque },
                                })
                                .then((voiture) => {
                                    if (!voiture) {
                                        db.voiture
                                            .create(cardata)
                                            .then((voiture) => {
                                                res.json(voiture);
                                            })
                                            .catch((err) => {
                                                res.json(err);
                                            });
                                    } else {
                                        res.json("can not add voiture");
                                    }
                                });
                        } else {
                            res.json("marque not found");
                        }
                    })
                    .catch((err) => {
                        res.json(err);
                    });
            } else {
                res.json("not found");
            }
        })
        .catch((err) => {
            res.json(err);
        });
});

//ver

router.post("/ajouter", (req, res) => {
    // pour creer un client n'existe pas alors on va rajouter const data
    const clientdata = {
        nom: req.body.nom,
        prenom: req.body.prenom,
        email: req.body.email,
        tel: req.body.tel,
    };
    const marque = req.body.marque;
    const cardata = {
        marqueId: null,
        modele: req.body.modele,
        type_moteur: req.body.type_moteur,
        numero_plaque: req.body.numero_plaque,
        annee: req.body.annee,
        couleur: req.body.couleur,
        clientId: null,
    };
    db.client
        // permet d'obliger l'utilisateur à remplir ces coordonné
        .findOne({
            where: { email: clientdata.email },
        })
        .then((client) => {
            // si le client existe
            if (client) {
                // alors on affacter client.id dans cardata
                cardata.clientId = client.id;
                db.marque
                    .findOne({ where: { marque: marque } })
                    .then((marque) => {
                        // si le marque existe puis on verifier si possedent les données
                        if (marque) {
                            //alors  on affacter marque.id dans cardata
                            cardata.marqueId = marque.id;
                            db.voiture
                                .findOne({
                                    where: { numero_plaque: cardata.numero_plaque },
                                })
                                .then((voiture) => {
                                    // la voiture n'existe pas
                                    if (!voiture) {
                                        db.voiture
                                            //alors tu le creer
                                            .create(cardata)
                                            // tu la recuperer
                                            .then((voiture) => {
                                                //revoir la voiture
                                                res.json(voiture);
                                            })
                                            .catch((err) => {
                                                res.json(err);
                                            });
                                    } else {
                                        res.json("can not add voiture");
                                    }
                                });
                        } else {
                            res.json("marque not found");
                        }
                    })
                    .catch((err) => {
                        res.json(err);
                    });
            } else {
                db.client
                    .create(clientdata)
                    .then((client) => {
                        // tu vas rajouter client.id dans cardata
                        cardata.clientId = client.id;
                        db.marque
                            .findOne({
                                //utilise la const marque
                                where: { marque: marque },
                            })
                            .then((resmarque) => {
                                if (resmarque) {
                                    cardata.marqueId = resmarque.id;
                                    db.voiture
                                        .findOne({
                                            where: { numero_plaque: cardata.numero_plaque },
                                        })
                                        .then((car) => {
                                            // la voiture n'existe pas
                                            if (!car) {
                                                // alors créer une voiture
                                                db.voiture
                                                    .create(cardata)
                                                    // vient de creer la voiture
                                                    .then((voiture) => {
                                                        //recevoir la voiture
                                                        res.json(voiture);
                                                    })
                                                    .catch((err) => {
                                                        res.json(err);
                                                    });
                                            }
                                            // ne plus pas ajouter
                                            else {
                                                res.json("can't create voiture");
                                            }
                                        })
                                        .catch((err) => {
                                            res.json(err);
                                        });
                                    // si tu trouve pas la marque
                                } else {
                                    //alors on va creer une marque
                                    db.marque
                                        .create(marque)
                                        //si la marque existe pas
                                        .then((Marque) => {
                                            // marque.id sera stoker dans cardata
                                            cardata.marqueId = Marque.id;
                                            // recuperer le numero de plaque lier à la voiture (cardata)
                                            db.voiture
                                                .findOne({
                                                    where: { numero_plaque: cardata.numero_plaque },
                                                })
                                                .then((resvoiture) => {
                                                    // la voiture n'existe pas
                                                    if (!resvoiture) {
                                                        //alors tu va la creer
                                                        db.voiture
                                                            .create(cardata)
                                                            .then((voiture) => {
                                                                res.json(voiture);
                                                            })
                                                            .catch((err) => {
                                                                res.json(err);
                                                            });
                                                    } else {
                                                        res.json("can't create voiture");
                                                    }
                                                })
                                                .catch((err) => {
                                                    res.json(err);
                                                });
                                        })
                                        .catch((err) => {
                                            res.json(err);
                                        });
                                }
                            });
                    })
                    .catch((err) => {
                        res.json(voiture);
                    });
            }
        })
        .catch((err) => {
            res.json(err);
        });
});
// permet trouver la voiture allier à son numéro de plauqz
router.get("/findby/:numero_plaque", (req, res) => {
    db.voiture
        .findOne({
            include: [{
                    model: db.client,
                    attributes: {
                        exclude: ["created_at", "updated_at"],
                    },
                },
                {
                    model: db.marque,
                },
            ],
            attributes: {
                exclude: ["clientId", "marqueId", "created_at", "updated_at"],
            },
            where: { numero_plaque: req.params.numero_plaque },
        })
        .then((voiture) => {
            if (voiture) {
                let cardata = {
                    id: voiture.id,
                    modele: voiture.modele,
                    type_moteur: voiture.type_moteur,
                    numero_plaque: voiture.numero_plaque,
                    annee: voiture.annee,
                    couleur: voiture.couleur,
                    marque: voiture.tbl_marque.marque,
                    clientId: voiture.tbl_client.id,
                    //client: voiture.tbl_client
                    clientNom: voiture.tbl_client.nom,
                };
                res.json({
                    voiture: cardata,
                });
            } else {
                res.json("not found");
            }
        });
});

module.exports = router;
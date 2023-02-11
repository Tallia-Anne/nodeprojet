const express = require("express");
const { voiture } = require("../database/db");

/* 
Méthode de http:
 * GET : The GET method requests a representation of the specified resource. Requests using GET should only retrieve data and should have no other effect. (This is also true of some other HTTP methods.)[1] The W3C has published guidance principles on this distinction, saying, "Web application design should be informed by the above principles, but also by the relevant limitations."[22] See safe methods below.
 -> La méthode GET demande une représentation de la ressource spécifiée. Les demandes utilisant GET ne doivent que récupérer des données et ne doivent avoir aucun autre effet. (Ceci est également vrai pour certaines autres méthodes HTTP)[1] Le W3C a publié des principes directeurs sur cette distinction, disant que "la conception des applications web doit être guidée par les principes ci-dessus, mais aussi par les limitations pertinentes"[22] Voir les méthodes sûres ci-dessous.
 * HEAD : The HEAD method asks for a response identical to that of a GET request, but without the response body. This is useful for retrieving meta-information written in response headers, without having to transport the entire content.
 * POST : The POST method requests that the server accept the entity enclosed in the request as a new subordinate of the web resource identified by the URI. The data POSTed might be, for example, an annotation for existing resources; a message for a bulletin board, newsgroup, mailing list, or comment thread; a block of data that is the result of submitting a web form to a data-handling process; or an item to add to a database.[23]
 * PUT : The PUT method requests that the enclosed entity be stored under the supplied URI. If the URI refers to an already existing resource, it is modified; if the URI does not point to an existing resource, then the server can create the resource with that URI.[24]
 * DELETE : The DELETE method deletes the specified resource.
 * TRACE : The TRACE method echoes the received request so that a client can see what (if any) changes or additions have been made by intermediate servers.
 * OPTIONS : The OPTIONS method returns the HTTP methods that the server supports for the specified URL. This can be used to check the functionality of a web server by requesting '*' instead of a specific resource.
 * PATCH : The PATCH method applies partial modifications to a resource.
 *
 */
const router = express.Router();
//create db
const db = require("../database/db");
const route = require("./employer");

router.get("/All", (req, res) => {
    db.client
        .findAll({
            /* le  */
            attributes: {
                /* ajouter les champs */
                include: [],
                /* exclure un champs */
                exclude: [],
            },
        })
        .then((clients) => {
            if (clients) {
                //* envoyer le status 200 si tu as trouver le client dans la database */
                res.status(200).json({ clients: clients });
            } else {
                res.status(404).json("client not found");
            }
        })
        .catch((err) => {
            res.json(err);
        });
});

// add new client and voiture
router.post("/new", (req, res) => {
    const clientdata = {
        nom: req.body.nom,
        prenom: req.body.prenom,
        email: req.body.email,
        tel: req.body.tel,
    };
    const marque = {
        marque: req.body.marque,
    };
    const cardata = {
        marqueId: null,
        modele: req.body.modele,
        type_moteur: req.body.type_moteur,
        numero_plaque: req.body.numero_plaque,
        annee: req.body.annee,
        couleur: req.body.couleur,
        clientId: 0,
    };

    db.client
        .findOne({
            where: { email: req.body.email },
        })
        .then((client) => {
            // if client is not in base so
            if (!client) {
                // we create new client add data "clientdata"
                db.client
                    .create(clientdata)
                    // send back data client
                    .then((data) => {
                        // now we try to find if marque in base
                        cardata.clientId = data.id;
                        db.marque
                            .findOne({
                                // where marque = marque
                                where: { marque: req.body.marque },
                            })
                            .then((smarque) => {
                                if (!smarque) {
                                    db.marque
                                        .create(marque)
                                        .then((resmarque) => {
                                            cardata.marqueId = resmarque.id;
                                            db.voiture
                                                .findOne({
                                                    where: { numero_plaque: cardata.numero_plaque },
                                                })
                                                .then((voiture) => {
                                                    if (!Voiture) {
                                                        db.voiture
                                                            .create(cardata)
                                                            .then(() => {
                                                                db.client
                                                                    .findOne({
                                                                        include: [{
                                                                            model: db.voiture,
                                                                            through: { attributes: ["marqueId"] },
                                                                        }, ],
                                                                        where: { id: data.id },
                                                                    })
                                                                    .then((client) => {
                                                                        res.status(200).json({ client: client });
                                                                    })
                                                                    .catch((err) => {
                                                                        res.json(err);
                                                                    });
                                                            })
                                                            .catch((err) => {
                                                                res.json(err);
                                                            });
                                                    }
                                                })
                                                .catch((err) => {
                                                    res.json(err);
                                                });
                                        })
                                        .catch((err) => {
                                            res.json(err);
                                        });
                                } else {
                                    cardata.marqueId = smarque.id;
                                    db.voiture
                                        .create(cardata)
                                        .then(() => {
                                            db.client
                                                .findOne({
                                                    include: [{
                                                        model: db.voiture,
                                                        through: { attributes: ["marqueId"] },
                                                    }, ],
                                                    where: { id: data.id },
                                                })
                                                .then((client) => {
                                                    res.status(200).json({ client: client });
                                                })
                                                .catch((err) => {
                                                    res.json(err);
                                                });
                                        })
                                        .catch((err) => {
                                            res.json(err);
                                        });
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
        })
        .catch((err) => {
            res.json(err);
        });
});
// mettre à jour le client par rapport à l'id
router.put("/update/:id", (req, res) => {
    db.client
        //recuperer
        .findOne({
            // l'id du client
            where: { id: req.body.id },
        })
        // si le client existe
        .then((client) => {
            if (client) {
                //make update to the client database with body and id params
                client
                    .update({
                        nom: req.body.nom,
                        prenom: req.body.prenom,
                        email: req.body.email,
                        tel: req.body.tel,
                    }, {
                        returning: true,
                        plain: true,
                    })
                    .then((client) => {
                        //then find this you update to get back new data of your clients with new data
                        res.json(client);
                    })
                    .catch((err) => {
                        res.json("error" + err);
                    });
            } else {
                res.status(404).json("not found");
            }
        })
        .catch((err) => {
            res.json({
                error: "can't update client" + err,
            });
        });
});

// supprimer le client
router.delete("delete/:id", (req, res) => {
    db.client
        //recuperer le params de l'id
        .findOne({
            where: { id: req.params.id },
        })
        // si le client n'existe pas
        .then((client) => {
            if (client) {
                // alors il va détruire
                client
                    .destroy()
                    .then(() => {
                        res.json({ status: "client deleted" });
                    })
                    .catch((err) => {
                        res.json({
                            error: "error" + err,
                        });
                    });
            } else {
                res.json({
                    error: "this client not existe in your base",
                });
            }
        })
        .cacth((err) => {
            res.json({
                error: "error" + err,
            });
        });
});
//Afficher le client avec leurs voiture avec leur model
router.get("/getAll", (req, res) => {
    db.client
        //recuperer les clients
        .findAll({
            attributes: {
                // ajoute les champs
                include: [],

                // ne pas afficher l'id du client, date de mis à jour et la date de créaction
                exclude: ["clientId", "updated_at", "created_at"],
            },
            include: [
                //ajou
                {
                    model: db.voiture,
                    include: [{
                        model: db.marque,
                    }, ],
                    //relier avec la voiture
                    attributes: {
                        include: [],
                        // ne pas afficher l'id du client, date de mis à jour et la date de créaction
                        exclude: ["clientId", "updated_at", "created_at"],
                    },
                },
            ],
        })
        //si tu trouve les clients
        .then((clients) => {
            //affiche les clients
            res.json({ clients: clients });
        })
        //si tu ne trouve pas les clients alors tu affiche un message d'erreur
        .catch((err) => {
            res.json(err);
        });
});
module.exports = router;
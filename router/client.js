const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const db = require("../database/db");

process.env.SECRET_KEY = "secret";
// s'inscrit
router.post("/register", (req, res) => {
    db.client
        .findOne({
            // demander de recuperer l'email
            where: { email: req.body.email },
        })
        .then((client) => {
            if (!client) {
                const hash = bcrypt.hashSync(req.body.password, 10);
                req.body.password = hash;
                db.client
                    .create(req.body)
                    .then((itemclient) => {
                        res.status(200).json({
                            message: "Vous devez valider votre mail",
                            email: itemclient.email,
                        });
                    })
                    .catch((err) => {
                        res.json(err);
                    });
            } else {
                res.json("cette adresse mail et déja utilisée");
            }
        })
        .catch((err) => {
            res.json(err);
        });
});
// se connecter
router.post("/login", (req, res) => {
    db.client
        // on chercher l'utilisateur
        .findOne({ where: { email: req.body.email } })
        .then((client) => {
            console.log(client);
            // tu verifier le status de l'utilisateur
            if (client.Status === true) {
                if (bcrypt.compareSync(req.body.password, client.password)) {
                    let clientdata = {
                        nom: client.nom,
                        prenom: client.prenom,
                        email: client.email,
                        image: client.image,
                    };
                    //generer le token
                    let token = jwt.sign(clientdata, process.env.SECRET_KEY, {
                        expiresIn: 1440,
                    });
                    // envoyer le token
                    res.status(200).json({ token: token });
                } else {
                    res.json("error mail or error password");
                }
            } else {
                res.json({ message: "Vous devez valider votre mail" });
            }
        })
        .catch((err) => {
            res.json(err);
        });
});
//route: c'est le profile
router.get("/profile/:id", (req, res) => {
    db.client
        .findOne({
            where: { id: req.params.id },
        })
        .then((client) => {
            if (client) {
                let token = jwt.sign(client.dataValues, process.env.SECRET_KEY, {
                    expiresIn: 1440,
                });
                res.status(200).json({ token: token });
            } else {
                res.json("error le client n'est pas dans la base de donnée !!");
            }
        })
        .catch((err) => {
            res.json(err);
        });
});

router.put("/update/:id", (req, res) => {
    db.client
        .findOne({
            where: { id: req.params.id },
        })
        .then((client) => {
            if (client) {
                password = bcrypt.hashSync(req.body.password, 10);
                req.body.password = password;
                client
                    .update(req.body)
                    .then((clientitem) => {
                        db.client
                            .findOne({
                                where: { id: clientitem.id },
                            })
                            .then((client) => {
                                let token = jwt.sign(
                                    client.dataValues,
                                    process.env.SECRET_KEY, {
                                        expiresIn: 1440, // en second
                                    }
                                );
                                res.status(200).json({ token: token });
                            })
                            .catch((err) => {
                                res.status(402).send(err + "bad request");
                            });
                    })
                    .catch((err) => {
                        res.status(402).send("impossible de mettre à jour le client" + err);
                    });
            } else {
                res.json("client n'est pas dans la base");
            }
        })
        .catch((err) => {
            res.json(err);
        });
});
// route permet valider son adresse mail
router.post("/validemail", (req, res) => {
    db.client
        .findOne({
            // recuperer le email
            where: { email: req.body.email },
        })
        .then((client) => {
            if (client) {
                if (client.Status !== 1) {
                    // changer le status qui devient un compte valide et il peut l'utiliser
                    client
                        .update({
                            Status: 1,
                        })
                        // L'utilisateur va recevoir ce message
                        .then(() => {
                            res.json({
                                message: "votre email est validé",
                            });
                        })
                        .catch((err) => {
                            res.json(err);
                        });
                } else {
                    res.json("votre mail est déja validé");
                }
            } else {
                res.status(404).json("client not found !!!");
            }
        })
        .catch((err) => {
            res.json(err);
        });
});
// route permet faire mot de passe oublié
router.post("/forgetpassword", (req, res) => {
    var randtoken = require("rand-token");
    // ça generer le token
    var token = randtoken.generate(16);
    db.client
        .findOne({
            // recuperer l'adresse email
            where: { email: req.body.email },
        })
        .then((client) => {
            if (client) {
                client
                    .update({
                        forget: token,
                    })
                    .then((item) => {
                        var nodemailer = require("nodemailer");
                        var transporter = nodemailer.createTransport({
                            service: "gmail",
                            auth: {
                                user: "erinawambiekele@gmail.com",
                                pass: "tallia00",
                            },
                        });

                        var mailOptions = {
                            from: "erinewam@gmail.com",
                            to: item.email,
                            subject: "Sending Email using Node.js",
                            text: "http://localhost:8080/Mtp" + " " + item.forget,
                        };

                        transporter.sendMail(mailOptions, function(error, info) {
                            if (error) {
                                res.json(error);
                                console.log(error);
                            } else {
                                console.log("email sent" + info.response);
                                res.json("email sent" + info.response);
                            }
                        });
                    })
                    .catch((err) => {
                        res.json(err);
                    });
            } else {
                res.status(404).json("client not found");
            }
        })
        .catch((err) => {
            res.json(err);
        });
});
// route permet de mettre à jour le mot de passe
router.post("/updatepassword", (req, res) => {
    db.client
        .findOne({
            // recuperer le token du forget
            where: { forget: req.body.forget },
        })
        .then((client) => {
            if (client) {
                // hacher de mot de passe
                const hash = bcrypt.hashSync(req.body.password, 10);
                req.body.password = hash;
                // mettre à jour seulement le password de l'utilisateur
                client
                    .update({
                        password: req.body.password,
                        forget: null,
                    })

                .then(() => {
                        res.json({
                            message: "votre mot de passe est mis à jour",
                        });
                    })
                    .catch((err) => {
                        res.json(err);
                    });
            } else {
                res.json("link not validé");
            }
        })
        .catch((err) => {
            res.json(err);
        });
});
module.exports = router;
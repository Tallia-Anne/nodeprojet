const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const db = require("../database/db");

process.env.SECRET_KEY = "secret";
// s'inscrit
router.post("/register", (req, res) => {
    if ((req.body.role != "admin") && (req.body.role != "")) {
        role = "user"
    } else {
        role = "admin"
    }
    db.user.findOne({
            where: { email: req.body.email }
        })
        .then(user => {
            if (!user) {
                password = bcrypt.hashSync(req.body.password, 10);
                db.user.create({
                        nom: req.body.nom,
                        prenom: req.body.prenom,
                        email: req.body.email,
                        password: password,
                        role: role
                    })
                    .then((item) => {
                        var nodemailer = require("nodemailer");
                        var transporter = nodemailer.createTransport({
                            host: 'mail.afro-dream.fr.',
                            port: 587,
                            secure: false,
                            auth: {
                                user: "contact@afro-dream.fr",
                                pass: "TAllia00%%%%",
                            },
                            tls: {
                                rejectUnauthorized: false
                            }
                        });

                        var mailOptions = {
                            from: "contact@afro-dream.fr",
                            to: item.email,
                            subject: "Bienvenue dans Afro dream",

                            text: "http://localhost:8080/loginadmin/" +
                                " Pour se connecter dans l'espace admin " +
                                " " +
                                item.email,
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
                    .then(useritem => {
                        var data = {
                            id: useritem.id,
                            role: useritem.role
                        }
                        let token = jwt.sign(data,
                            process.env.SECRET_KEY, {
                                expiresIn: 1440
                            });

                        res.status(200).json({ auth: true, token: token })
                    })
                    .catch(err => {
                        res.status(401).json({ err })
                    })
            } else {
                res.json("user déja dans la base");
            }
        })
        .catch(err => {
            res.json({ error: err })
        })
});
// se connecter
router.post("/login", (req, res) => {
    console.log(req.body);
    db.user.findOne({
            where: { email: req.body.email }
        }).then(user => {
            if (user) {
                if (bcrypt.compareSync(req.body.password,
                        user.password)) {
                    var userdata = {
                        id: user.id,
                        role: user.role,
                        nom: user.nom,
                        prenom: user.prenom
                    }
                    let token = jwt.sign(userdata,
                        process.env.SECRET_KEY, {
                            expiresIn: 1440
                        });
                    res.status(200).json({ auth: true, token: token })
                } else {
                    res.json({
                        auth: false,
                        message: "error email or password"
                    })
                }
            } else {
                return res.status(404).json('user not found')
            }
        })
        .catch(err => {
            res.json(err)
        })
});
//route: c'est le profile
router.get("/profile/:id", (req, res) => {
    db.user
        .findOne({
            where: { id: req.params.id },
        })
        .then((user) => {
            if (user) {
                let token = jwt.sign(user.dataValues, process.env.SECRET_KEY, {
                    expiresIn: 1440,
                });
                res.status(200).json({ token: token });
            } else {
                res.json("error: le user n'est pas dans la base de donnée !!");
            }
        })
        .catch((err) => {
            res.json(err);
        });
});

router.put("/update/:id", (req, res) => {
    db.user.findOne({
            where: { id: req.params.id }
        })
        .then(user => {
            if (user) {
                password = bcrypt.hashSync(req.body.password, 10);
                req.body.password = password;
                user.update(req.body)
                    .then(useritem => {
                        db.user.findOne({
                                where: { id: useritem.id }
                            })
                            .then(user => {
                                let token = jwt.sign(user.dataValues, process.env.SECRET_KEY, {
                                    expiresIn: 1440 //in seconds
                                });
                                res.status(200).json({ token: token })
                            })
                            .catch(err => {
                                res.status(402).send(err + 'bad request')
                            })
                    })
                    .catch(err => {
                        res.status(402).send("impossible de mettre à jour le user" + err);
                    })
            } else {
                res.json("user n'est pas dans la base")
            }
        })
        .catch(err => {
            res.json(err);
        })
});
// route permet valider son adresse mail
router.post("/validemail", (req, res) => {
    db.user
        .findOne({
            // recuperer le email
            where: { email: req.body.email },
        })
        .then((user) => {
            if (user) {
                if (user.Status !== 1) {
                    // changer le status qui devient un compte valide et il peut l'utiliser
                    user
                        .update({
                            Status: 1,
                        })
                        // L'utilisateur va recevoir ce message
                        .then(() => {
                            res.json({
                                message: "votre compte a été activer",
                            });
                        })
                        .catch((err) => {
                            res.json(err);
                        });
                } else {
                    res.json("votre compte est déja validé");
                }
            } else {
                res.status(404).json("user not found !!!");
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
    db.user
        .findOne({
            // recuperer l'adresse email
            where: { email: req.body.email },
        })
        .then((user) => {
            if (user) {
                user
                    .update({
                        forget: token,
                    })
                    .then((item) => {
                        var nodemailer = require("nodemailer");
                        var transporter = nodemailer.createTransport({
                            host: 'mail.afro-dream.fr.',
                            port: 587,
                            secure: false,
                            auth: {
                                user: "contact@afro-dream.fr",
                                pass: "TAllia00%%%%",
                            },
                            tls: {
                                rejectUnauthorized: false
                            }
                        });

                        var mailOptions = {
                            from: "contact@afro-dream.fr",
                            to: item.email,
                            subject: "Afro Dream",

                            text: " Voici le lien pour mettre à jour " +
                                " " +
                                "https://afro-dream.fr/Mtp" +
                                " " +
                                " le code de mot de passe oublié:" +
                                " " +
                                item.forget,
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
                res.status(404).json("user not found");
            }
        })
        .catch((err) => {
            res.json(err);
        });
});
// route permet de mettre à jour le mot de passe
router.post("/updatepassword", (req, res) => {
    db.user
        .findOne({
            // recuperer le token du forget
            where: { forget: req.body.forget },
        })
        .then((user) => {
            if (user) {
                // hacher de mot de passe
                const hash = bcrypt.hashSync(req.body.password, 10);
                req.body.password = hash;
                // mettre à jour seulement le password de l'utilisateur
                user
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
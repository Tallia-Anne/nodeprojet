const express = require("express");
const db = require("../database/db");
const router = express.Router();

const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

process.env.SECRET_KEY = "secret";

router.post("/register", (req, res) => {
    db.emp
        .findOne({
            where: { email: req.body.email },
        })
        .then((employe) => {
            // si l'employer n'existe pas
            if (!employe) {
                const hash = bcrypt.hashSync(req.body.password, 10);
                req.body.password = hash;
                // creer un employe
                db.emp
                    .create(req.body)
                    //si tu reussite à creer un employer
                    .then((emp) => {
                        const employe = {
                            nom: emp.nom,
                            prenom: emp.prenom,
                            email: emp.email,
                            id: emp.id,
                        };
                        //generer le le token
                        let token = jwt.sign(employe, process.env.SECRET_KEY, {
                            // qui va expires dans 1440 secondes
                            expiresIn: 1440,
                        });
                        res.json({ token: token });
                    })
                    .catch((err) => {
                        res.json(err);
                    });
            } else {
                res.json({
                    error: "employe already exists",
                });
            }
        })
        .catch((err) => {
            res.json(err);
        });
});
/* Route: login pour se connecter  */
router.post("/login", (req, res) => {
    db.emp
        .findOne({ where: { email: req.body.email } })
        .then((emp) => {
            if (emp) {
                if (bcrypt.compareSync(req.body.password, emp.password)) {
                    const employe = {
                        nom: emp.nom,
                        prenom: emp.prenom,
                        email: emp.email,
                        id: emp.id,
                    };
                    let token = jwt.sign(employer, process.env.SECRET_KEY, {
                        expireIn: 1440,
                    });
                    res.json({
                        token: token,
                    });
                } else {
                    res.json("error mail or error password");
                }
            } else {
                res.json("user not found");
            }
        })
        .catch((err) => {
            res.json(err);
        });
});

router.get("/findBygarageID/:id", (req, res) => {
    db.emp
        .findAll({
            // afficher tous les emp sont dans garage
            where: { garageId: req.params.id },
        })
        .then((emp) => {
            res.json(emp);
        })
        .catch((err) => {
            res.json(err);
        });
});

//route: c'est le profile
router.get("/profile/:id", (req, res) => {
    db.emp
        .findOne({
            where: { id: req.params.id },
        })
        .then((employe) => {
            if (emp) {
                let token = jwt.sign(emp.dataValues, process.env.SECRET_KEY, {
                    expiresIn: 1440,
                });
                res.status(200).json({ token: token });
            } else {
                res.json("error: le emp n'est pas dans la base de donnée !!");
            }
        })
        .catch((err) => {
            res.json(err);
        });
});
// mettre à jour
router.put("/update/:id", (req, res) => {
    db.emp
        .findOne({
            where: { id: req.params.id },
        })
        .then((employe) => {
            if (employe) {
                password = bcrypt.hashSync(req.body.password, 10);
                req.body.password = password;
                db.emp
                    .update(req.body)
                    .then((employe) => {
                        res.json({ employe: employe });
                    })
                    .catch((err) => {
                        res.json(err);
                    });
            } else {
                res.json("employe not found");
            }
        })
        .catch((err) => {
            res.json(err);
        });
});
/*  router.delete("/delete/:id", (req, res) => {
    db.emp.findOne({ where: { id: req.params.id } })
        .then((emp) => {
            if (emp) {
                emp.destroy().then(() => {
                        res.json({ status: "employe deleted" });
                    })
                    .catch((err) => {
                        res.json(err);
                    });
            } else {
                res.json("employe not found");
            }
        })
        .catch((err) => {
            res.json(err);
        });
});
 */

router.delete("/delete/:id", (req, res) => {
    db.emp
        .destroy({
            where: { id: res.params.id },
        })
        .then((emp) => {
            if (emp) {
                res.json({ status: "employe deleted", emp });
            } else {
                res.json("employe not found");
            }
        })

    .catch((err) => {
        res.json(err);
    });
});
// trouver un emp par son email
router.get("/findByEmail/:email", (req, res) => {
    db.emp
        .findOne({ where: { email: req.params.email } })
        .then((employe) => {
            if (employe) {
                res.json({ employe: employe });
            } else {
                res.json({ employe: employe });
            }
        })
        .catch((err) => {
            res.json(err);
        });
});

// trouver un emp par son email
router.get("/all", (req, res) => {
    db.emp
        .findAll()
        .then((employes) => {
            if (employe) {
                res.json({ employe: employe });
            } else {
                res.json({ employe: employe });
            }
        })
        .catch((err) => {
            res.json(err);
        });
});
module.exports = router;
var express = require("express");
var router = express.Router();
var bcrypt = require("bcrypt");
var jwt = require("jsonwebtoken");
var db = require("../database/db");

process.env.SECRET_KEY = 'secret';

router.post("/register", (req, res) => {
    db.client.findOne({
            where: { email: req.body.email }
        })
        .then(client => {
            if (!client) {
                password = bcrypt.hashSync(req.body.password, 10);
                db.client.create({
                        email: req.body.email,
                        password: password
                    })
                    .then(clientitem => {
                        let token = jwt.sign(clientitem.dataValues,
                            process.env.SECRET_KEY, {
                                expiresIn: 1440
                            });

                        res.status(200).json({ token: token })
                    })
                    .catch(err => {
                        res.send(err)
                    })
            } else {
                res.json("client déja dans la base");
            }
        })
        .catch(err => {
            res.json({ error: err })
        })
});

router.get("/profile/:id", (req, res) => {
    db.client.findOne({
            where: { id: req.params.id }
        })
        .then(client => {
            if (client) {
                let token = jwt.sign(client.dataValues,
                    process.env.SECRET_KEY, {
                        expiresIn: 1440
                    });
                res.status(200).json({ token: token })
            } else {
                res.json("error le client n'a pas dans la base !!")
            }
        })
        .catch(err => {
            res.json(err)
        })
});

router.post("/login", (req, res) => {
    console.log(req.body);
    db.client.findOne({
            where: { email: req.body.email }
        }).then(client => {
            if (client) {
                if (bcrypt.compareSync(req.body.password,
                        client.password)) {
                    let token = jwt.sign(client.dataValues,
                        process.env.SECRET_KEY, {
                            expiresIn: 1440
                        });
                    res.status(200).json({ token: token })
                } else {
                    res.status(520).json("error email or password")
                }
            } else {
                return res.status(520).json('client not found')
            }
        })
        .catch(err => {
            res.json(err)
        })
});


router.put("/update/:id", (req, res) => {
    db.client.findOne({
            where: { id: req.params.id }
        })
        .then(client => {
            if (client) {
                password = bcrypt.hashSync(req.body.password, 10);
                req.body.password = password;
                client.update(req.body)
                    .then(clientitem => {
                        console.log(clientitem);
                        db.client.findOne({
                                where: { id: clientitem.id }
                            })
                            .then(client => {
                                let token = jwt.sign(client.dataValues,
                                    process.env.SECRET_KEY, {
                                        expiresIn: 1440 //s
                                    });
                                res.status(200).json({ token: token })
                            })
                            .catch(err => {
                                res.status(402).send(err + 'bad request')
                            })
                    })
                    .catch(err => {
                        res.status(402).send("impossible de metter a jour le client" + err);
                    })
            } else {
                res.json("client n'est pas dans la base ")
            }
        })
        .catch(err => {
            res.json(err);
        })
})





module.exports = router;
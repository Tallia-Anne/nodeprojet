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
      if (!employe) {
        const hash = bcrypt.hashSync(req.body.password, 10);
        req.body.password = hash;
        db.emp
          .create(req.body)
          .then((emp) => {
            const employe = {
              nom: emp.nom,
              prenom: emp.prenom,
              email: emp.email,
              id: emp.id,
            };
            let token = jwt.sign(employe, process.env.SECRET_KEY, {
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

module.exports = router;

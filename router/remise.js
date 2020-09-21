const Express = require("express"),
    router = Express.Router(),
    db = require("../database/db");

router.post("/donner", (req, res) => {
    var remise = {
        Date: req.body.Date,
        commandeId: 1,
    };
    db.remise
        .create(remise)
        .then((rep) => {
            res.json({ message: "ok", rep });
        })
        .catch((err) => {
            res.json({ error: "error" + err });
        });
});

router.get("/alls", (req, res) => {
    //{}  faire un objet
    db.remise
        .findAll({})
        // recuperer les remises
        .then((remise) => {
            //si existe la remises
            if (remise) {
                //  {} crée un objet
                res.json({
                    // remise va être convertir en .json
                    remise: remise,
                });
            } else {
                //si ne trouve pas alors il va afficher ce message
                res.json({ error: "404 not found" });
            }
        })
        .catch((err) => {
            res.json("error" + err);
        });
});

module.exports = router;
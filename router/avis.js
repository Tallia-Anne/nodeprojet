const Express = require("express"),
    router = Express.Router(),
    db = require("../database/db");

router.post("/ajouter", (req, res) => {
    //créaction d'une varaiable
    var avis = {
        // recuperer les élements qui se trouve body dans note
        notes: req.body.notes,

        commentaire: req.body.commentaire,
        //les avis sont associer avec le client
        clientId: 1,
    };
    //crée une nouvelle occurence( ajouter une nouvelle ligne)  qui va ajouter avis
    db.avis
        .create(avis)
        // l'avis existe
        .then((rep) => {
            // faire reference a rep then(rep)
            // on veut savoir s'il reussite à créer alors il va nous envoyer une réponse
            res.json({ message: "ok", rep });
        })
        .catch((err) => {
            // ne marche pas alors il va afficher error
            res.json({ error: "error" + err });
        });
});

router.get("/FindALL", (req, res) => {
    //{}  faire un objet
    db.avis
        .findAll({})
        // recuperer les remise
        .then((avis) => {
            //si existe remise
            if (avis) {
                //  {} crée un objet
                res.json({
                    // avis va être convertir en .json
                    avis: avis,
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

//DELETE//
// route permet de supprimer la remise  dans id
router.delete("/supprimer/:id", (req, res) => {
    //finOne: recuperer un élement
    db.remise
        .findOne({
            // chercher un élement par son id
            where: { id: req.params.id },
        })
        .then((remise) => {
            // si la remise est bien supprimer alors il va afficher ce message
            if (remise) {
                //  si remise existe
                //err devient automatique une variable ou une fonction et sera stocké
                // remise sera détruit
                router
                    .destroy()
                    .then(() => {
                        res.json("la remise est supprimer ");
                    })
                    // si ne trouve pas remise et attraper l'erreur et son type
                    .catch((err) => {
                        res.json("error" + err);
                    });
                // si
            } else {
                res.json({
                    error: "you can't delete this remise it not" +
                        "it not exist in you list of remise",
                });
            }
        })
        .catch((err) => {
            // renvoyer le message d'erreur
            res.json("error" + err);
        });
});

module.exports = router;
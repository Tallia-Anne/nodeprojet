const Express = require("express"),
    router = Express.Router(),
    db = require("../database/db");

/* ---------------------------------------------------------------- Newsletter  ---------------------------------------------------------------- */


// route permet faire mot de passe oublié
router.post("/sendnewsletter", (req, res) => {
    db.newsletter
        .findOne({
            // recuperer l'adresse email
            where: { email: req.body.email },
        })
        .then((newsletter) => {
            if (!newsletter) {
                db.newsletter
                    .create(req.body)
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

                            html: `<div  style="height:100vh; width: 100%; background-image: url(https://image.freepik.com/photos-gratuite/reglage-massage-thai-spa-compte-gouttes-bouteille-huile-serum_41929-2531.jpg); background-size: cover; background-position: center; background-repeat: no-repeat;">
                    
                            <div>
        
                            <br> <br>
                                <div>
                                    <h1 style=" font-family: 'Comic Sans MS'; font-weight: bold; text-align: center;font-size: 38px; color:#FFD700;"> Afro Dream</h1>
                                </div>
                            </div>
                           
                                 <br>
                                    <br>
                                    <h3 style="color:#FFFF; text-align:center; font-family: 'Comic Sans MS'; font-size: 25px; font-weight: bold;" > Vous venez nous rejoindre dans notre site E-commerce.<br>
                                    Vous retrouverez ci-dessous les informations concernant celui-ci : "https://afro-dream.fr/register"
                                    </h3>
                                
                                    <br>
                                    <p style="font-family: 'Comic Sans MS'; text-align: center;" >
                                    <span style="color:#fff">Voici les coordonnées email:</span> ${req.body.email}
                                    </p> 
                                    <br> 
                                    <h3 style="color:#fff; text-align:center; font-family: 'Comic Sans MS'; font-size: 17px; font-weight: bold;" >Merci et à très bientôt    <br>   <br>   <br> </h3>
                                  
                                    </div>`


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
                res.status(404).json("newsletter not found");
            }
        })
        .catch((err) => {
            res.json(err);
        });
});



module.exports = router;
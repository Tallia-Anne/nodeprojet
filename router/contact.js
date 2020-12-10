// cette route va permet d'envoyer un email
//route generique
const express = require("express");
const router = express.Router();



// route permet faire mot de passe oublié
router.post("/sendcontact", (req, res) => {
    db.contact
        .findOne({
            // recuperer l'adresse email
            where: { email: req.body.email },
        })
        .then((contact) => {
            if (!contact) {
                db.contact
                    .create(req.body)
                    .then((item) => {
                        var nodemailer = require("nodemailer");
                        var hbs = require("nodemailer-express-handlebars");
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
                            text: req.body.text,
                            attachments: [
                                { filename: 'back.jpg', path: '/back.jpg' }
                            ],
                            template: 'index'
                        };
                        transporter.use('compile', hbs({
                            viewEngine: "express-handlebars",
                            viewPath: 'views/'
                        }));

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
                res.status(404).json("contact not found");
            }
        })
        .catch((err) => {
            res.json(err);
        });
});


router.post("/sendmail", (req, res) => {
    const nodemailer = require("nodemailer");
    const hbs = require("nodemailer-express-handlebars");
    // créer un transporteur permet d'envoyer l'email
    var transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: "erinawambiekele@gmail.com",
            pass: "tallia00",
        },
    });
    var mailOption = {
        from: "erinawambiekele@gmail.com",
        to: req.body.email,
        subject: req.body.obj,
        // corps
        text: req.body.text,
        attachments: [
            { filename: 'back.jpg', path: '/back.jpg' }
        ],
        template: 'index'
    };
    transporter.use('compile', hbs({
        viewEngine: "express-handlebars",
        viewPath: '/views/'
    }))
    transporter.sendMail(mailOption, (error, info) => {
        if (error) {
            res.json(error);
            console.log(error);
        } else {
            console.log("email sent" + info.response);
            res.json("email sent" + info.response);
        }
    });
});
module.exports = router;
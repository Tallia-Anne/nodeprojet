const express = require("express");
const bodyparser = require("body-parser");
const cors = require("cors");

var port = 3000;
var hostname = "localhost";

var app = express();

app.use(cors());

app.use(bodyparser.json());
//Les information sur la manière dont est coder le fichier se trouve dans le header et cette ligne permet de savoir si il est bien encoder ou pas c'est ça, parce qu'elle vérifie le herder.
//header*

app.use(bodyparser.urlencoded({ extended: false }));

// importations des route

app.use("/client", require("../nodeprojet/router/client"));
app.use("/user", require("../nodeprojet/router/user"));
app.use("/produit", require("../nodeprojet/router/produit"));
app.use("/avis", require("../nodeprojet/router/avis"));
app.use("/souscategorie", require("../nodeprojet/router/souscategorie"));
app.use("/categorie", require("../nodeprojet/router/categorie"));
app.use("/commande", require("../nodeprojet/router/commande"));
app.use("/remise", require("../nodeprojet/router/remise"));
app.use("/newsletter", require("../nodeprojet/router/newsletter"));
app.use("/contact", require("../nodeprojet/router/contact"));



app.listen(port, hostname, function() {
    console.log("mon server fonction sur http://" + hostname + ":" + port + "\n");
});
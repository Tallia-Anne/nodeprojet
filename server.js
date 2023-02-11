const express = require("express");

const bodyparser = require("body-parser");
/* cors: partager les données */
const cors = require("cors");

var port = process.env.PORT || 3000;
var hostname = "localhost";

var app = express();
/* Autoriser le partage les ressouces    */
app.use(cors());
/* recevoirs sera tous les Json*/
app.use(bodyparser.json());
//Les information sur la manière dont est coder le fichier se trouve dans le header et cette ligne permet de savoir si il est bien encoder ou pas c'est ça, parce qu'elle vérifie le herder.
//header*
/* tous les données sera en json tu va les traité
et les donneés non json 
sera pas en json sera non traité */
app.use(bodyparser.urlencoded({ extended: false }));

// importations des route
app.use("/client", require("../nodeprojet/router/client"));
app.use("/employer", require("../nodeprojet/router/employer"));
app.use("/garage", require("../nodeprojet/router/garage"));
app.use("/atelier", require("../nodeprojet/router/atelier"));
app.use("/fournisseur", require("../nodeprojet/router/fournisseur"));
app.use("/piece", require("../nodeprojet/router/piece"));
app.use("/voiture", require("../nodeprojet/router/voiture"));
////////////////////////////////////   Lancer le server  //////////////////////////////////////////////////////////
app.listen(port, hostname, function() {
    console.log("mon server fonction sur http://" + hostname + ":" + port + "\n");
});
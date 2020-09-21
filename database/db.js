const Sequelize = require("sequelize");

const db = {};

const dbinfo = new Sequelize("e-commerce", "root", "", {
    host: "localhost",
    dialect: "mysql",
    port: 3306,
    pool: {
        max: 5,
        min: 0,
    },
});

dbinfo
    .authenticate()
    .then(() => {
        console.log("connection to the db");
    })
    .catch((err) => {
        console.error("unable to connect to the datase:" + err);
    });

// Importation des tables:

db.client = require("../models/Client")(dbinfo, Sequelize);

db.commande = require("../models/Commande")(dbinfo, Sequelize);

db.avis = require("../models/Avis")(dbinfo, Sequelize);

db.paiement = require("../models/Paiement")(dbinfo, Sequelize);

db.typepaiement = require("../models/Typepaiement")(dbinfo, Sequelize);

db.facture = require("../models/Facture")(dbinfo, Sequelize);

db.remise = require("../models/Remise")(dbinfo, Sequelize);

db.fournisseur = require("../models/Fournisseur")(dbinfo, Sequelize);

db.produit = require("../models/Produit")(dbinfo, Sequelize);

db.contenir = require("../models/Contenir")(dbinfo, Sequelize);

db.image = require("../models/Image")(dbinfo, Sequelize);

db.approvisionner = require("../models/Approvisionner")(dbinfo, Sequelize);

db.categorie = require("../models/Catégorie")(dbinfo, Sequelize);

db.souscategorie = require("../models/Souscatégorie")(dbinfo, Sequelize);

// Les relations:

db.client.hasMany(db.commande, { foreignKey: "clientId" });
db.client.hasMany(db.avis, { foreignKey: "clientId" });
db.client.hasMany(db.facture, { foreignKey: "clientId" });
db.produit.hasMany(db.image, { foreignKey: "produitId" });
db.produit.hasMany(db.categorie, { foreignKey: "produitId" });
db.produit.hasMany(db.souscategorie, { foreignKey: "produitId" });
db.categorie.hasMany(db.souscategorie, { foreignKey: "categorieId" });
db.commande.belongsTo(db.client, { foreignKey: "clientId" });
db.paiement.belongsTo(db.commande, { foreignKey: "commandeId" });
db.commande.hasMany(db.remise, { foreignKey: "commandeId" });
db.typepaiement.belongsTo(db.paiement, { foreignKey: "paiementId" });
db.paiement.hasMany(db.facture, { foreignKey: "paiementId" });
db.paiement.belongsTo(db.client, { foreignKey: "clientId" });

// Les tables intermediarres:
/* 1 */
db.commande.belongsToMany(db.produit, {
    through: "Contenirs",
    foreignKey: "commandeId",
});

db.produit.belongsToMany(db.commande, {
    through: "Contenir",
    foreignKey: "produitId",
});
/* 2 */
db.fournisseur.belongsToMany(db.produit, {
    through: "Approvisionner",
    foreignKey: "fournisseurId",
});
db.produit.belongsToMany(db.fournisseur, {
    through: "Approvisionner",
    foreignKey: "produitId",
});

db.dinfo = dbinfo;

db.Sequelize = Sequelize;

//dbinfo.sync({ force: true });

module.exports = db;
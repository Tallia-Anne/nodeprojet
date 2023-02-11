const Sequelize = require("sequelize");

const db = {};

const dbinfo = new Sequelize("mgarage", "root", "", {
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

/////////////////////////////// Les importations tes models ///////////////////////////
db.emp = require("../models/Employe")(dbinfo, Sequelize);
db.garage = require("../models/Garage")(dbinfo, Sequelize);
db.voiture = require("../models/Voiture")(dbinfo, Sequelize);
db.client = require("../models/Client")(dbinfo, Sequelize);
db.piece = require("../models/Pieces")(dbinfo, Sequelize);
db.fournisseur = require("../models/Fournisseur")(dbinfo, Sequelize);

db.reparation = require("../models/Reparation")(dbinfo, Sequelize);

db.paiement = require("../models/Paiement")(dbinfo, Sequelize);
db.atelier = require("../models/Atelier")(dbinfo, Sequelize);
db.marque = require("../models/Marque")(dbinfo, Sequelize);
db.typemoteur = require("../models/Typemoteur")(dbinfo, Sequelize);
db.modele = require("../models/Modele")(dbinfo, Sequelize);
db.annee = require("../models/Annee")(dbinfo, Sequelize);
db.typepiece = require("../models/TypePiece")(dbinfo, Sequelize);

db.reparation_has_pieces = require("../models/reparation_has_piece")(
    dbinfo,
    Sequelize
);

db.fournisseur_has_piece = require("../models/fournisseur_has_piece")(
    dbinfo,
    Sequelize
);
db.typereparation = require("../models/TypeReparation")(dbinfo, Sequelize);

////////////////////////  Fin d'importation des models  ///////////////////////////////////////////////////////////////////

/*
 * There are four type of associations available in Sequelize
 *
 * BelongsTo     :  associations are associations where the foreign key for the one-to-one relation exists on the source model.
 * HasOne        :  associations are associations where the foreign key for the one-to-one relation exists on the target model.
 * HasMany       :  associations are connecting one source with multiple targets. The targets however are again connected to exactly one specific source.
 * BelongsToMany :  associations are used to connect sources with multiple targets. Furthermore the targets can also have connections to multiple sources.
 *
 ** Start Relation **
 ***
 *
 *  the garage can have Many atelier : atelier: 1,1  garage : 1,N
 **/

///////////////////////// Les relations ////////////////////////////////////

db.garage.hasMany(db.atelier, { foreignKey: "garageId" });

db.atelier.hasOne(db.emp, { foreignKey: "atelierId" });

db.garage.hasOne(db.emp, { foreignKey: "garageId" });

db.client.hasMany(db.voiture, { foreignKey: "clientId" });

db.voiture.belongsTo(db.client, { foreignKey: "clientId" });

db.voiture.hasMany(db.reparation, { foreignKey: "voitureId" });
// this reparation is for this voiture
db.reparation.belongsTo(db.voiture, { foreignKey: "voitureId" });
// this emp make this reparation
db.emp.hasMany(db.reparation, { foreignKey: "employeId" });

//voiture has One marque
db.marque.hasOne(db.voiture, { foreignKey: "marqueId" });
db.voiture.belongsTo(db.marque, { foreignKey: "marqueId" });

db.marque.hasMany(db.modele, { foreignKey: "marqueId" });
db.modele.hasMany(db.voiture, { foreignKey: "modeleId" });
db.annee.hasMany(db.voiture, { foreignKey: "anneeId" });
db.typemoteur.hasMany(db.voiture, { foreignKey: "typemoteurId" });

//this piece has one marque
db.marque.hasOne(db.piece, { foreignKey: "marqueId" });
db.typemoteur.hasMany(db.piece, { foreignKey: "typemoteurId" });
db.modele.hasMany(db.voiture, { foreignKey: "modeleId" });
db.annee.hasMany(db.piece, { foreignKey: "anneeId" });

db.typereparation.hasOne(db.reparation, { foreignKey: "typereparationId" });

/////////////////////////////////////////////// fin des relation //////////////////////////////////////////////////////////////////

// Les relations de les tables intermediarre: many to many 1,N ET 1,N //////////////////////////////////////////////////////////
db.piece.belongsToMany(db.reparation, {
    through: "reparation_has_piece",
    foreignKey: "pieceId",
});
db.reparation.belongsToMany(db.piece, {
    through: "reparation_has_piece",
    foreignKey: "reparationId",
});
db.piece.belongsToMany(db.fournisseur, {
    through: "fournisseur_has_piece",
    as: "fournisseurhaspieces",
    foreignKey: "pieceId",
});
db.fournisseur.belongsToMany(db.piece, {
    through: "fournisseur_has_piece",
    as: "fournisseurhaspieces",
    foreignKey: "fournissseurId",
});
/////////////////////////////////////////////////////////////////////////////////////////////////////////

db.dinfo = dbinfo;

db.Sequelize = Sequelize;

//dbinfo.sync({ force: true });

module.exports = db;
// exporte table with all field
module.exports = (dbinfo, Sequelize) => {
    return dbinfo.define(
        "Souscategorie", {
            id: {
                type: Sequelize.DataTypes.INTEGER,

                primaryKey: true,

                autoIncrement: true,
            },

            nom: {
                type: Sequelize.DataTypes.STRING(75),
                allowNull: true,
            },
        }, {
            timestamps: true,

            underscored: true,
        }
    );
};
module.exports = (dbinfo, Sequelize) => {
    return dbinfo.define(
        "Categorie", {
            id: {
                type: Sequelize.DataTypes.INTEGER,

                primaryKey: true,

                autoIncrement: true,
            },

            nom: {
                type: Sequelize.DataTypes.STRING(45),
                allowNull: true,
            },
        }, {
            timestamps: true,

            underscored: true,
        }
    );
};
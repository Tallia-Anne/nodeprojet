// exporte table with all field
module.exports = (dbinfo, Sequelize) => {
    return dbinfo.define(
        "Produit", {
            id: {
                type: Sequelize.DataTypes.INTEGER,

                primaryKey: true,

                autoIncrement: true,
            },

            Status: {
                type: Sequelize.DataTypes.BOOLEAN,

                allowNull: true,
            },
            stock: {
                type: Sequelize.DataTypes.INTEGER(5),
            },
            nom: {
                type: Sequelize.DataTypes.STRING(75),
            },
            ref: {
                type: Sequelize.DataTypes.STRING(75),
            },
            typeproduit: {
                type: Sequelize.DataTypes.STRING(75),
            },
            prix: {
                type: Sequelize.DataTypes.DECIMAL(7, 2),
            },
            description: {
                type: Sequelize.DataTypes.TEXT,
            },
            composition: {
                type: Sequelize.DataTypes.STRING(1200),
            },
        }, {
            timestamps: true,

            underscored: true,
        }
    );
};
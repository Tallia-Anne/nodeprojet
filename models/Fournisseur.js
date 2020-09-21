module.exports = (dbinfo, Sequelize) => {
    return dbinfo.define(
        "Fournisseur", {
            id: {
                type: Sequelize.DataTypes.INTEGER,

                primaryKey: true,

                autoIncrement: true,
            },
            nom: {
                type: Sequelize.DataTypes.STRING(45),

                allowNull: true,
            },

            Status: {
                //set data type with max length
                type: Sequelize.DataTypes.BOOLEAN,
                // setting allowNull to false will add NOT NULL to the column, which means an error will be if you add info in this column
                allowNull: true,
            },
            email: {
                //set data type with max length
                type: Sequelize.DataTypes.STRING(255),
                // setting allowNull to false will add NOT NULL to the column, which means an error will be if you add info in this column
                allowNull: true,
            },

            Image: {
                type: Sequelize.DataTypes.STRING(255),
                allowNull: true,
            },
        }, {
            timestamps: true,

            underscored: true,
        }
    );
};
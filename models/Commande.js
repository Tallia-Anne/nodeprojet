module.exports = (dbinfo, Sequelize) => {
    return dbinfo.define(
        "Commande", {
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
                type: Sequelize.DataTypes.BOOLEAN,

                allowNull: true,
            },
            date: {
                type: Sequelize.DataTypes.DATE,
            },
        }, {
            timestamps: true,

            underscored: true,
        }
    );
};
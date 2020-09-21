module.exports = (dbinfo, Sequelize) => {
    return dbinfo.define(
        "Facture", {
            id: {
                type: Sequelize.DataTypes.INTEGER,

                primaryKey: true,

                autoIncrement: true,
            },

            Date: {
                type: Sequelize.DataTypes.DATE,
                allowNull: true,
            },
        }, {
            timestamps: true,

            underscored: true,
        }
    );
};
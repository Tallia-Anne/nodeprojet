module.exports = (dbinfo, Sequelize) => {
    return dbinfo.define("Contenir", {
        prix: {
            type: Sequelize.DataTypes.DECIMAL(7, 2),

            allowNull: true,
        },
        qtn: {
            type: Sequelize.DataTypes.INTEGER(2),
        },
    });
};
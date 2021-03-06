module.exports = (dbinfo, Sequelize) => {
    return dbinfo.define(
        "Commande", {
            id: {
                type: Sequelize.DataTypes.INTEGER,

                primaryKey: true,

                autoIncrement: true,
            },


            Status: {
                type: Sequelize.DataTypes.BOOLEAN,

                allowNull: true,
            },
        }, {
            timestamps: true,

            underscored: true,
        }
    );
};
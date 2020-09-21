module.exports = (dbinfo, Sequelize) => {
    return dbinfo.define(
        "Avis", {
            id: {
                type: Sequelize.DataTypes.INTEGER,

                primaryKey: true,

                autoIncrement: true,
            },

            notes: {
                type: Sequelize.DataTypes.STRING(255),
                allowNull: true,
            },
            commentaire: {
                type: Sequelize.DataTypes.TEXT,
                allowNull: true,
            },
        }, {
            timestamps: true,

            underscored: true,
        }
    );
};
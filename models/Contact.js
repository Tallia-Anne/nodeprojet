module.exports = (dbinfo, Sequelize) => {
    return dbinfo.define(
        "Contact", {
            id: {
                type: Sequelize.DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true,
            },

            email: {
                type: Sequelize.DataTypes.STRING(255),
                /*ne peut pas être nul et sera unique*/
                allowNull: false,
                unique: true,
            },
            nom: {
                type: Sequelize.DataTypes.STRING(45),
                allowNull: true
            },
            sujet: {
                type: Sequelize.DataTypes.STRING(45),
                allowNull: true
            },
            message: {
                type: Sequelize.DataTypes.TEXT,
                allowNull: true
            },

        }, {
            timestamps: true,
            underscored: true,
        }
    );
};
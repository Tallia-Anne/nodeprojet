module.exports = (dbinfo, Sequelize) => {
    return dbinfo.define(
        "Newsletter", {
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

        }, {
            timestamps: true,
            underscored: true,
        }
    );
};
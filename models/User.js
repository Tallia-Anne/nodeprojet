module.exports = (dbinfo, Sequelize) => {
    return dbinfo.define(
        "User", {
            id: {
                type: Sequelize.DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true,
            },
            nom: {
                type: Sequelize.DataTypes.STRING(45),
                allowNull: true
            },
            prenom: {
                type: Sequelize.DataTypes.STRING(45),
                allowNull: true
            },
            email: {
                type: Sequelize.DataTypes.STRING(255),
                /*ne peut pas être nul et sera unique*/
                allowNull: false,
                unique: true
            },
            password: {
                type: Sequelize.DataTypes.STRING(255),
                /*ne peut pas être nul et sera unique*/
                allowNull: false,

            },
            /*inserer une image (avatar) va covertir en binaire*/
            role: {
                type: Sequelize.DataTypes.STRING(45),
                allowNull: false,
            },

        }, {

            timestamps: true,
            underscored: true
        }
    );
};
module.exports = (dbinfo, Sequelize) => {
    return dbinfo.define(
        "Client", {
            id: {
                type: Sequelize.DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true,
            },
            nom: {
                type: Sequelize.DataTypes.STRING(45),
                allowNull: true,
            },
            prenom: {
                type: Sequelize.DataTypes.STRING(45),
                allowNull: true,
            },
            email: {
                type: Sequelize.DataTypes.STRING(255),
                /*ne peut pas être nul et sera unique*/
                allowNull: false,
                unique: true,
            },
            password: {
                type: Sequelize.DataTypes.STRING(255),
                /*ne peut pas être nul et sera unique*/
                allowNull: false,
                unique: true,
            },
            /*inserer une image (avatar) va covertir en binaire*/
            image: {
                type: Sequelize.DataTypes.TEXT,
                allowNull: true,
            },
            adresse: {
                type: Sequelize.DataTypes.TEXT,
                allowNull: true,
            },
            cp: {
                type: Sequelize.DataTypes.INTEGER(5),
                allowNull: true,
            },
            ville: {
                type: Sequelize.DataTypes.STRING(60),
                allowNull: true,
            },
            forget: {
                //set data type with max length
                type: Sequelize.DataTypes.STRING(60),
                // setting allowNull to false will add NOT NULL to the column, which means an error will be if you add info in this column
                allowNull: true,
            },
        }, {
            timestamps: true,
            underscored: true,
        }
    );
};
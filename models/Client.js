// exports table
module.exports = (dbinfo, Sequelize) => {
    return dbinfo.define(
        "tbl_client",
        {
            // field name
            id: {
                // set date type
                type: Sequelize.DataTypes.INTEGER,
                // set primaryKey
                primaryKey: true,
                // set autoIncrement
                autoIncrement: true
            },
            // field name
            nom: {
                // set data type with max length
                type: Sequelize.DataTypes.STRING(45),
                // setting allowNull to false will add NOT NULL to the column, which means an error will be if you add info in this column
                allowNull: false
            },
            //field name
            prenom: {
                // set data type with max length
                type: Sequelize.DataTypes.STRING(45),
                // setting allowNull to false will add NOT NULL to the column, which means an error will be if you add info in this column
                allowNull: false
            },
            // field name
            email: {
                //set data type with max length
                type: Sequelize.DataTypes.STRING(60),
                // setting allowNull to false will add NOT NULL to the column, which means an error will be if you add info in this column
                allowNull: false
            },
            // field name
            tel: {
                //set data type with max length
                type: Sequelize.DataTypes.STRING(15),
                // setting allowNull to false will add NOT NULL to the column, which means an error will be if you add info in this column
                allowNull: false
            },
        },
        {
            /**
             * By default, Sequelize will add the attributes createdAt and updatedAt to your model so you will be able to know when the database entry went into the db and when it was updated last.
             */
            timestamps: true,
            /**
             * Sequelize allow setting underscored option for Model. When true this option will set the field option on all attributes to the underscored version of its name.
             * This also applies to foreign keys generated by associations.
             * */

            underscored: true
        }
    );
};


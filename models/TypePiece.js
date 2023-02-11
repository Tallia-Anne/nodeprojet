module.exports = (dbinfo, Sequelize) => {
    return dbinfo.define(
        // table name
        "tbl_typepiece", {
            // field name
            id: {
                // set data type
                type: Sequelize.DataTypes.INTEGER,
                // set primaryKey
                primaryKey: true,
                // set autoIncrement
                autoIncrement: true,
            },
            // field name
            typepiece: {
                // set data type
                type: Sequelize.DataTypes.STRING(45),
                // unique = true
                unique: true,
            },
        }, {
            /**
             * By default, Sequelize will add the attributes createdAt and updatedAt to your model so you will be able to know when the database entry went into the db and when it was updated last.
             */
            timestamps: true,
            /**
             * Sequelize allow setting underscored option for Model. When true this option will set the field option on all attributes to the underscored version of its name.
             * This also applies to foreign keys generated by associations.
             * */

            underscored: true,
        }
    );
};
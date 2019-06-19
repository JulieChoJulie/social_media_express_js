module.exports = (sequelize, Datatypes) => {
    sequelize.define('post', {
        content: {
            type: Datatypes.STRING(40),
            allowNull: true,
            unique: true,
        },
        img: {
            type: Datatypes.STRING(15),
            allowNull: false,
        },
    }, {
        timestamps: true,
        paranoid: true,
    })
};
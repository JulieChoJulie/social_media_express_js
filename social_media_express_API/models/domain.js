module.exports = (sequelize, Datatypes) => (
    sequelize.define('domain', {
        host: {
            type: Datatypes.STRING(80),
            allowNull: false,
        },
        type: {
            type: Datatypes.STRING(10),
            allowNull: false,
        },
        clientSecret: {
            type: Datatypes.STRING(40),
            allowNull: false,
        },
    }, {
        validate: {
            unknownType(){
                console.log(this.type, this.type !== 'free', this.type !== 'premium');
                if (this.type !== 'free' && this.type !== 'premium') {
                    throw new Error ('type column should have either free or premium.');
                }
            },
        },
        timestamps: true,
        paranoid: true,
    })
);

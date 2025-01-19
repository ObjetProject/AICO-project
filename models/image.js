const Sequelize = require('sequelize');

class Image extends Sequelize.Model {
    static initiate(sequelize) {
      Image.init({
        img_num: {
            type: Sequelize.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true,
        },
        img_user: {
            type: Sequelize.INTEGER,
            allowNull: false,
        },
        img_name: {
            type: Sequelize.STRING(200),
            allowNull: false,
        },
        imghash_num: {
            type: Sequelize.INTEGER,
            allowNull: true,
        },
        img_date: {
            type: Sequelize.DATE,
            allowNull: false,
        },
        img_path: {
            type: Sequelize.STRING(500),
            allowNull: false,
        },
        }, {
            sequelize,
            tableName: 'image',
            timestamps: false,
            charset: 'utf8',
            collate: 'utf8_general_ci',
        });
    }

    static associate(db) {
        db.Image.belongsTo(db.User);
    };
    
}

module.exports = Image;
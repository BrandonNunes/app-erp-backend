'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
          await queryInterface.createTable('organizacoes', {
            id: {
              type: Sequelize.DataTypes.INTEGER,
              unique: true,
              allowNull: false,
              primaryKey: true,
              autoIncrement: true
            },
            razao_social: Sequelize.DataTypes.STRING(60),
            nome_fantasia: Sequelize.DataTypes.STRING(60),
            logo: {
              type: Sequelize.DataTypes.BLOB('long')
            },
            cpf_cnpj: {
              type: Sequelize.DataTypes.STRING(14),
              allowNull: false,
              unique: true
            },
            createdAt: {
              type: Sequelize.DataTypes.DATE,
              defaultValue: new Date()
            },
            updatedAt: {
              type: Sequelize.DataTypes.DATE,
              defaultValue: new Date()
            },

          })
  },

  async down (queryInterface, Sequelize) {
     await queryInterface.dropTable('organizacoes');
  }
};

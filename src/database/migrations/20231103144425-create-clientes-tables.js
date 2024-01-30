'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
     await queryInterface.createTable('clientes', {
       id: {
         type: Sequelize.DataTypes.UUIDV4,
         primaryKey: true,
         unique: true
       },
       nome: {
         type: Sequelize.DataTypes.STRING(200),
         allowNull: false
       },
       cpf: {
         type: Sequelize.DataTypes.STRING(11),
         allowNull: false
       },
       id_loja: {
         type: Sequelize.DataTypes.STRING,
         references: {
           model: {
             tableName: 'lojas',
           },
           key: 'id'
         }
       },
       telefone: Sequelize.DataTypes.STRING(13),
       ativo: {
         type: Sequelize.DataTypes.BOOLEAN,
         defaultValue: true
       },
       data_nascimento: Sequelize.DataTypes.DATE,
       cep: {
         type: Sequelize.DataTypes.STRING(8),
         allowNull: false
       },
       estado: {
         type: Sequelize.DataTypes.STRING(2),
         allowNull: false
       },
       cidade: {
         type: Sequelize.DataTypes.STRING(20),
         allowNull: false
       },
       bairro: {
         type: Sequelize.DataTypes.STRING(25),
         allowNull: false
       },
       rua: {
         type: Sequelize.DataTypes.STRING(20),
         allowNull: false
       },
       complemento: Sequelize.DataTypes.STRING(100),
       numero: {
         type: Sequelize.DataTypes.STRING(11),
         defaultValue: 'S/N'
       },

       createdAt: {
         type: Sequelize.DataTypes.DATE,
         defaultValue: new Date()
       },
       updatedAt: {
         type: Sequelize.DataTypes.DATE,
         defaultValue: new Date()
       },

     });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable('clientes');
  }
};

'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('lojas', {
      id: {
        type: Sequelize.DataTypes.UUIDV4,
        unique: true,
        allowNull: false,
        primaryKey: true
      },
      id_organizacao: {
        type: Sequelize.DataTypes.NUMBER,
        allowNull: false,
        references: {
          model: {
            tableName: 'organizacoes',
          },
          key: 'id'
        }
      },
      logo: {
        type: Sequelize.DataTypes.BLOB('long')
      },
      tipo_registro: {
        type: Sequelize.DataTypes.ENUM({values: ["PF", "PJ"]}),
        allowNull: false
      },
      razao_social: Sequelize.DataTypes.STRING(60),
      nome_fantasia: Sequelize.DataTypes.STRING(60),
      cpf_cnpj: {
        type: Sequelize.DataTypes.STRING(14),
        allowNull: false,
        unique: true
      },
      nome: Sequelize.DataTypes.STRING(60),
      telefone1: {
        type: Sequelize.DataTypes.STRING(13),
        allowNull: false
      },
      telefone2: Sequelize.DataTypes.STRING(13),
      ativo: {
        type: Sequelize.DataTypes.BOOLEAN,
        defaultValue: true
      },
      simples_nacional: Sequelize.DataTypes.BOOLEAN,
      regime_normal: Sequelize.DataTypes.BOOLEAN,
      sublimite_receita: Sequelize.DataTypes.BOOLEAN,
      contribuinte_ipi: Sequelize.DataTypes.BOOLEAN,
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
      matrix: {
        type: Sequelize.DataTypes.BOOLEAN,
        defaultValue: false
      },
      id_matrix: {
        type: Sequelize.DataTypes.STRING,
        references: {
          model: {
            tableName: 'lojas',
          },
          key: 'id'
        }
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
    await queryInterface.dropTable('lojas');
  }
};

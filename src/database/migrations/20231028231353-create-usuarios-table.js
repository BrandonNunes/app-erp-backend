'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {

    await queryInterface.createTable('usuarios', {
      id: {
        type: Sequelize.DataTypes.UUIDV4,
        primaryKey: true,
        unique: true
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
      nome: {
        type: Sequelize.DataTypes.STRING(100),
        allowNull: false
      },
      email: {
        type: Sequelize.DataTypes.STRING(100),
        allowNull: false,
        unique: true
      },
      senha: {
        type: Sequelize.DataTypes.STRING,
        allowNull: false,
      },
      cpf: {
        type: Sequelize.DataTypes.STRING(11)
      },
      data_nascimento: {
        type: Sequelize.DataTypes.DATE
      },
      telefone: {
        type: Sequelize.DataTypes.STRING(13)
      },
      origem: {
        type: Sequelize.DataTypes.STRING(50)
      },
      ativo: {
        type: Sequelize.DataTypes.BOOLEAN,
        defaultValue: true
      },
      trocar_senha_prox_login: {
        type: Sequelize.DataTypes.BOOLEAN,
        defaultValue: false
      },
      foto: {
        type: Sequelize.DataTypes.BLOB('long'),
        defaultValue: null
      },
      super_usuario: {
        type: Sequelize.DataTypes.BOOLEAN,
        defaultValue: false
      },
      admin: {
        type: Sequelize.DataTypes.BOOLEAN,
        defaultValue: false
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
    await queryInterface.createTable('usuarios_lojas', {
      id: {
        type: Sequelize.DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      id_usuario: {
        type: Sequelize.DataTypes.UUIDV4,
        allowNull: false,
        references: {
          model: {
            tableName: 'usuarios',
          },
          key: 'id'
        }
      },
      id_loja: {
        type: Sequelize.DataTypes.UUIDV4,
        allowNull: false,
        references: {
          model: {
            tableName: 'lojas',
          },
          key: 'id'
        }
      }
    })

  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable('usuarios');
    await queryInterface.dropTable('usuarios_lojas');
  }
};

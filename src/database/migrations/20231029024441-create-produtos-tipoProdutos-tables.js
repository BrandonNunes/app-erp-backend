'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
        await queryInterface.createTable('tipo_produto', {
          id: {
            type: Sequelize.DataTypes.INTEGER,
            primaryKey: true,
            unique: true,
            autoIncrement: true
          },
          descricao: {
            type: Sequelize.DataTypes.STRING(50),
            allowNull: false
          },
          id_organizacao: {
            type: Sequelize.DataTypes.INTEGER,
            allowNull: false,
            references: {
              model: {
                tableName: 'organizacoes'
              },
              key: 'id'
            }
          },
          id_loja: {
            type: Sequelize.DataTypes.STRING,
            allowNull: true,
            references: {
              model: {
                tableName: 'lojas'
              },
              key: 'id'
            }
          },
          ativo: {
            type: Sequelize.DataTypes.BOOLEAN,
            defaultValue: true
          },
          fixo: {
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
        })

        await queryInterface.createTable('produtos', {
          id: {
            type: Sequelize.DataTypes.UUIDV4,
            primaryKey: true,
            unique: true
          },
          codigo_produto: {
            type: Sequelize.DataTypes.STRING(12)
          },
          descricao: {
            type: Sequelize.DataTypes.STRING(100),
            allowNull: false
          },
          id_tipo_produto: {
            type: Sequelize.DataTypes.INTEGER,
            allowNull: false,
            references: {
              model: {
                tableName: 'tipo_produto'
              },
              key: 'id'
            }
          },
          id_organizacao: {
            type: Sequelize.DataTypes.INTEGER,
            allowNull: false,
            references: {
              model: {
                tableName: 'organizacoes'
              },
              key: 'id'
            }
          },
          id_loja: {
            type: Sequelize.DataTypes.UUIDV4,
            allowNull: true,
            references: {
              model: {
                tableName: 'lojas'
              },
              key: 'id'
            }
          },
          produto_padrao: {
            type: Sequelize.DataTypes.BOOLEAN,
            defaultValue: false
          },
          ativo: {
            type: Sequelize.DataTypes.BOOLEAN,
            defaultValue: true
          },
          valor_minimo: {
            type: Sequelize.DataTypes.DECIMAL,
            allowNull: false
          },
          valor_padrao: {
            type: Sequelize.DataTypes.DECIMAL,
            allowNull: false
          },
          valor_maximo: {
            type: Sequelize.DataTypes.DECIMAL,
            allowNull: false
          },
          codigoEAN: Sequelize.DataTypes.STRING(13),
          foto: Sequelize.DataTypes.BLOB,
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
    await queryInterface.dropTable('tipo_produto');
    await queryInterface.dropTable('produtos');
  }
};

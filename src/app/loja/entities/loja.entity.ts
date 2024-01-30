import {
    BeforeCreate, BeforeUpdate,
    BelongsTo,
    BelongsToMany,
    Column,
    CreatedAt,
    DataType,
    ForeignKey, HasMany,
    Model,
    Table, UpdatedAt
} from 'sequelize-typescript';
import { v4 as uuidv4 } from 'uuid';
import {OrganizacaoModel} from "../../organizacao/entities/organizacao.entity";
import {ProdutoModel} from "../../product/entities/produto.entity";

@Table({tableName: 'lojas'})
export class LojaModel extends Model {
    @Column({ primaryKey: true, type: DataType.UUIDV4 })
    id: string;

    @ForeignKey(() => OrganizacaoModel)
    @Column
    id_organizacao: number;
    @Column({allowNull: false, type: DataType.ENUM({ values: ["PJ", "PF"] })})
    tipo_registro: string;
    @Column({ allowNull: true ,defaultValue: null })
    razao_social: string;
    @Column({ allowNull: true ,defaultValue: null })
    nome_fantasia: string;
    @Column({ allowNull: false})
    cpf_cnpj: string;
    @Column
    nome: string;
    @Column({allowNull: false})
    telefone1: string;
    @Column
    telefone2: string;
    @Column({defaultValue: true})
    ativo: boolean;
    @Column({defaultValue: false})
    simples_nacional: boolean;
    @Column({defaultValue: false})
    regime_normal: boolean;
    @Column({defaultValue: false})
    sublimite_receita: boolean;
    @Column({defaultValue: false})
    contribuinte_ipi: boolean;
    @Column({allowNull: false})
    cep: string;
    @Column({allowNull: false})
    estado: string;
    @Column({allowNull: false})
    cidade: string;
    @Column({allowNull: false})
    bairro: string;
    @Column({allowNull: false})
    rua: string;
    @Column({defaultValue: 'S/N'})
    numero: string;
    @Column
    complemento: string;
    @Column({defaultValue: false})
    matrix: boolean;

    @ForeignKey(() => LojaModel)
    @Column({defaultValue: null})
    id_matrix: string;

    @CreatedAt
    createdAt: Date
    @UpdatedAt
    updateddAt: Date

    @BelongsTo(() => OrganizacaoModel)
    organizacao: OrganizacaoModel

    @HasMany(() => ProdutoModel)
    produtos: ProdutoModel[]

    @BeforeCreate
    static autoUUID(loja: LojaModel) {
        loja.id = uuidv4();
    }
    @BeforeCreate
    static removeNoNumbersCPFCNPJ(loja: LojaModel) {
        loja.cpf_cnpj = loja.cpf_cnpj.replace(/[\D]+/g,'')
    }
    @BeforeUpdate
    static removeNoNumbersUpdateCPFCNPJ(loja: LojaModel) {
        loja.cpf_cnpj = loja.cpf_cnpj.replace(/[^\d]+/g,'')
    }
}

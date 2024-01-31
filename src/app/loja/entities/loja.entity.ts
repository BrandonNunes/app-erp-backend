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

@Table({tableName: 'empresas', timestamps: false})
export class LojaModel extends Model {
    @Column({ primaryKey: true })
    empresa: number;
   // @ForeignKey(() => OrganizacaoModel)
    @Column({field: 'idOrganizacao'})
    id_organizacao: number;
    // @Column({allowNull: false, type: DataType.ENUM({ values: ["PJ", "PF"] })})
    // tipo_registro: string;
    @Column({ allowNull: false})
    razao_social: string;
    @Column({ allowNull: false })
    nome_fantasia: string;
    @Column({ allowNull: false, field: 'cnpj_cpf'})
    cpf_cnpj: string;
    @Column
    fone_ddd1: string;
    @Column
    telefone1: string;
    @Column
    situacao: string;
    // @Column({defaultValue: false})
    // simples_nacional: boolean;
    // @Column({defaultValue: false})
    // regime_normal: boolean;
    // @Column({defaultValue: false})
    // sublimite_receita: boolean;
    @Column({defaultValue: false})
    contribuinte_ipi: boolean;
    @Column
    id_regime_tributario: number;
    @Column
    guid_logo: string;
    @Column
    guid: string;
    // @Column({defaultValue: false})
    // matrix: boolean;

    // @ForeignKey(() => LojaModel)
    // @Column({defaultValue: null})
    // id_matrix: string;
    //
    // @CreatedAt
    // createdAt: Date
    // @UpdatedAt
    // updateddAt: Date
    //
    // @BelongsTo(() => OrganizacaoModel)
    // organizacao: OrganizacaoModel
    //
    // @HasMany(() => ProdutoModel)
    // produtos: ProdutoModel[]

    // @BeforeCreate
    // static autoUUID(loja: LojaModel) {
    //     loja.id = uuidv4();
    // }
    // @BeforeCreate
    // static removeNoNumbersCPFCNPJ(loja: LojaModel) {
    //     loja.cpf_cnpj = loja.cpf_cnpj.replace(/[\D]+/g,'')
    // }
    // @BeforeUpdate
    // static removeNoNumbersUpdateCPFCNPJ(loja: LojaModel) {
    //     loja.cpf_cnpj = loja.cpf_cnpj.replace(/[^\d]+/g,'')
    // }
}

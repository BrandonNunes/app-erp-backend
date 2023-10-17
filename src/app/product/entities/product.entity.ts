import {
    BelongsTo,
    BelongsToMany,
    Column,
    CreatedAt,
    DataType,
    ForeignKey,
    HasMany,
    Model,
    Table, UpdatedAt
} from 'sequelize-typescript';
import {EmpresaModel} from "../../business/entities/company.entity";
import {OrganizationModel} from "../../business/entities/organizacao.entity";
import {GrupoProdutoModel} from "./grupoProduto.entity";


@Table({ tableName: 'produtos' })
export class ProductModel extends Model {

    @Column({ primaryKey: true, autoIncrement: true })
    id: number

    @Column
    cod_produto: string;

    @ForeignKey(() => EmpresaModel)
    @Column
    id_empresa: number;

    @Column
    descricao: string;

   @ForeignKey(() => GrupoProdutoModel)
    @Column
    id_grupo: number;

    @Column({ defaultValue: true })
    ativo: boolean;

    @Column
    valor_minimo: number;

    @Column
    valor_padrao: number;

    @Column
    valor_maximo: number;

    @Column
    codigoEAN: string;

    @Column
    guid: string

    @Column
    guid_foto: string;

    @CreatedAt
    createdAt: Date

    @UpdatedAt
    updatedAt: Date

    // @BelongsTo(() => EmpresaModel, )
    // empresa: EmpresaModel;


}

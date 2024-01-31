import {
    BeforeCreate,
    BelongsTo,
    BelongsToMany,
    Column, CreatedAt,
    DataType,
    ForeignKey,
    HasMany,
    HasOne,
    Model,
    Table, UpdatedAt
} from 'sequelize-typescript';
import {LojaModel} from "../../loja/entities/loja.entity";
import {OrganizacaoModel} from "../../organizacao/entities/organizacao.entity";
import {TipoProdutoModel} from "./tipo_produto.entity";
import {v4 as uuidV4} from "uuid";

@Table({ tableName: 'produtos' })
export class ProdutoModel extends Model {

    @Column({ primaryKey: true, type: DataType.UUIDV4 })
    id: string;

    @Column({allowNull: false})
    codigo_produto: string;

    @Column({allowNull: false})
    descricao: string;

    @ForeignKey(() => TipoProdutoModel)
    @Column
    id_tipo_produto: string;

    @ForeignKey(() => OrganizacaoModel)
    @Column
    id_organizacao:  number;

    @ForeignKey(() => LojaModel)
    @Column
    id_loja: string;

    @Column({defaultValue: false})
    produto_padrao: boolean

    @Column({defaultValue: true})
    ativo: boolean;

    @Column
    valor_minimo: number;

    @Column
    valor_padrao: number;

    @Column
    valor_maximo: number;

    @Column
    codigoEAN: string;

    @Column({defaultValue: null})
    foto: string;

    @CreatedAt
    createdAt: Date

    @UpdatedAt
    updatedAt: Date

    @BelongsTo(() => LojaModel)
    loja: LojaModel

    @BeforeCreate
    static autoUUID(prod: ProdutoModel) {
        prod.id = uuidV4();
    }
}

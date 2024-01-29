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
import { v4 as uuidV4 } from 'uuid'
import {LojaModel} from "../../loja/entities/loja.entity";
import {OrganizacaoModel} from "../../organizacao/entities/organizacao.entity";

@Table({ tableName: 'tipo_produto' })
export class TipoProdutoModel extends Model {

    @Column({ primaryKey: true, type: DataType.INTEGER, autoIncrement: true })
    id: string;

    @Column
    descricao: string;

    @ForeignKey(() => OrganizacaoModel)
    @Column
    id_organizacao:  number;

    @ForeignKey(() => LojaModel)
    @Column
    id_loja: string;

    @Column({defaultValue: true})
    ativo: boolean;

    @Column({defaultValue: false})
    fixo: boolean;

    @CreatedAt
    createdAt: Date

    @UpdatedAt
    updatedAt: Date

    // @BeforeCreate
    // static autoUUID(tipoProd: TipoProdutoModel) {
    //     tipoProd.id = uuidV4();
    // }


}

import {
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

@Table({ tableName: 'organizacao', timestamps: false })
export class OrganizacaoModel extends Model {

    @Column({ primaryKey: true, autoIncrement: true })
    id: number;

    @Column({allowNull: false})
    descricao: string;

    @Column({allowNull: true, defaultValue: null, field: 'idcontrato'})
    id_contrato: string;

    @Column({allowNull: true, defaultValue: new Date()})
    datacadastro: Date

    // @HasMany(() => LojaModel)
    // lojas: LojaModel[];

}

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

@Table({ tableName: 'organizacoes' })
export class OrganizacaoModel extends Model {

    @Column({ primaryKey: true, autoIncrement: true })
    id: number;

    @Column({allowNull: false})
    razao_social: string;

    @Column({allowNull: false})
    nome_fantasia: string;

    @Column({allowNull: true, defaultValue: null})
    cpf_cnpj: string;

    @Column({allowNull: true, defaultValue: null})
    logo: string;

    @CreatedAt
    createdAt: Date

    @UpdatedAt
    updatedAt: Date

    @HasMany(() => LojaModel)
    lojas: LojaModel[];

}

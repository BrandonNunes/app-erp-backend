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


@Table({ tableName: 'grupo_produtos' })
export class GrupoProdutoModel extends Model {

    @Column({ primaryKey: true, autoIncrement: true })
    id: number

    @ForeignKey(() => EmpresaModel)
    @Column
    id_empresa: number;

    @Column
    descricao: string;

    @Column({ defaultValue: true })
    ativo: boolean;

    @CreatedAt
    createdAt: Date

    @UpdatedAt
    updatedAt: Date

}

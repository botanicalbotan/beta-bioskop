import { BaseModel, HasMany, column, hasMany } from '@ioc:Adonis/Lucid/Orm'
import Kursi from './Kursi'

export default class Template extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public node: string

  @column()
  public col: number

  @column()
  public row: number

  @hasMany(() => Kursi)
  public kursis: HasMany<typeof Kursi>
}

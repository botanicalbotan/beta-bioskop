// import { DateTime } from 'luxon'
import { BaseModel, HasMany, column, hasMany } from '@ioc:Adonis/Lucid/Orm'
import Film from './Film'

export default class Genre extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public genre: string

  @hasMany(() => Film)
  public films: HasMany<typeof Film>
}

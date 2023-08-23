// import { DateTime } from 'luxon'
import { BaseModel, HasMany, column, hasMany } from '@ioc:Adonis/Lucid/Orm'
import Film from './Film'

export default class RatingSensor extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public nama: string

  @column()
  public namaSingkat: string

  @column()
  public keterangan: string
  

  @hasMany(() => Film)
  public films: HasMany<typeof Film>
}

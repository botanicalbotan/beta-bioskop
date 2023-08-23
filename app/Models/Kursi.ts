import { DateTime } from 'luxon'
import { BaseModel, belongsTo, BelongsTo, column, hasMany, HasMany } from '@ioc:Adonis/Lucid/Orm'
import Template from './Template'
import Studio from './Studio'
import Reservasi from './Reservasi'

export default class Kursi extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public pubId: string

  @column()
  public privId: string

  @column()
  public harga: number

  @column()
  public isKursi: boolean
  
  @column()
  public templateId: number

  @belongsTo(() => Template)
  public template: BelongsTo<typeof Template>

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime


  @column()
  public studioId: number

  @belongsTo(() => Studio)
  public studio: BelongsTo<typeof Studio>
  
  @hasMany(() => Reservasi)
  public jadwals: HasMany<typeof Reservasi>
}

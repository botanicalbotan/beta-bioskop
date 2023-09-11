import { DateTime } from 'luxon'
import { BaseModel, BelongsTo, HasMany, belongsTo, column, hasMany } from '@ioc:Adonis/Lucid/Orm'
import Film from './Film'
import Studio from './Studio'
import Reservasi from './Reservasi'
import Invoice from './Invoice'

export default class Jadwal extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column.dateTime({})
  public filmMulai: DateTime

  @column.dateTime({})
  public filmSelesai: DateTime

  @column.dateTime({})
  public postInterlude: DateTime

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime


  @column()
  public filmId: number

  @belongsTo(() => Film)
  public film: BelongsTo<typeof Film>

  @column()
  public studioId: number

  @belongsTo(() => Studio)
  public studio: BelongsTo<typeof Studio>

  @hasMany(() => Invoice)
  public invoices: HasMany<typeof Invoice>

  @hasMany(() => Reservasi)
  public reservasis: HasMany<typeof Reservasi>
}

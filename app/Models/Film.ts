import { DateTime } from 'luxon'
import { BaseModel, BelongsTo, HasMany, belongsTo, column, hasMany } from '@ioc:Adonis/Lucid/Orm'
import RatingSensor from './RatingSensor'
import Genre from './Genre'
import Jadwal from './Jadwal'

export default class Film extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public nama: string

  @column()
  public deskripsi: string

  @column()
  public starring: string

  @column()
  public direktor: string

  @column()
  public durasi: number

  @column.date()
  public tanggalMulaiTayang: DateTime

  @column.date()
  public tanggalSelesaiTayang: DateTime

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @column()
  public ratingSensorId: number

  @belongsTo(() => RatingSensor)
  public ratingSensor: BelongsTo<typeof RatingSensor>

  @column()
  public genreId: number

  @belongsTo(() => Genre)
  public genre: BelongsTo<typeof Genre>
  
  @hasMany(() => Jadwal)
  public jadwals: HasMany<typeof Jadwal>
}

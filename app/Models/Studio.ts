import { DateTime } from 'luxon'
import { BaseModel, BelongsTo, HasMany, belongsTo, column, hasMany } from '@ioc:Adonis/Lucid/Orm'
import Kursi from './Kursi'
import TierStudio from './TierStudio'
import Jadwal from './Jadwal'

export default class Studio extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public nama: string

  @column()
  public col: number

  @column()
  public row: number

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime


  @column()
  public tierStudioId: number

  @belongsTo(() => TierStudio)
  public tierStudio: BelongsTo<typeof TierStudio>

  @hasMany(() => Kursi)
  public kursis: HasMany<typeof Kursi>

  @hasMany(() => Jadwal)
  public jadwals: HasMany<typeof Jadwal>
}

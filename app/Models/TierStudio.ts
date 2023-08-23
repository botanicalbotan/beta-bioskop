import { DateTime } from 'luxon'
import { BaseModel, HasMany, column, hasMany } from '@ioc:Adonis/Lucid/Orm'
import Studio from './Studio'

export default class TierStudio extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public nama: string

  @column()
  public deskripsi: string

  @column()
  public hargaReguler: number

  @column()
  public hargaFriday: number

  @column()
  public hargaWeekend: number

  @hasMany(() => Studio)
  public films: HasMany<typeof Studio>

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}

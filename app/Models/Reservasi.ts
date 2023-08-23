import { DateTime } from 'luxon'
import { BaseModel, BelongsTo, belongsTo, column } from '@ioc:Adonis/Lucid/Orm'
import Jadwal from './Jadwal'
import Kursi from './Kursi'

export default class Reservasi extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public hargaTiketBase: number

  @column()
  public hargaTiketAkhir: number

  @column()
  public metodeBayar: string

  @column()
  public validasiBayar: string

  @column()
  public token: string

  @column()
  public isUsed: boolean

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime


  @column()
  public jadwalId: number

  @belongsTo(() => Jadwal)
  public jadwal: BelongsTo<typeof Jadwal>

  @column()
  public kursiId: number

  @belongsTo(() => Kursi)
  public kursi: BelongsTo<typeof Kursi>
}

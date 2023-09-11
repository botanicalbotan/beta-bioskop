import { DateTime } from 'luxon'
import { BaseModel, BelongsTo, ManyToMany, belongsTo, column, manyToMany } from '@ioc:Adonis/Lucid/Orm'
import Jadwal from './Jadwal'
import Kursi from './Kursi'
import Kupon from './Kupon'
import User from './User'

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
  public userId: number

  @belongsTo(() => User)
  public user: BelongsTo<typeof User>

  @column()
  public jadwalId: number

  @belongsTo(() => Jadwal)
  public jadwal: BelongsTo<typeof Jadwal>

  // jadinya make N-to-N tanpa perantara aja
  @manyToMany(() => Kursi, {
    pivotTable: 'reservasi_kursis',
    localKey: 'id',
    pivotForeignKey: 'reservasi_id',
    relatedKey: 'id',
    pivotRelatedForeignKey: 'kursi_id',
  })
  public kursis: ManyToMany<typeof Kursi>

  // jadinya make N-to-N tanpa perantara aja
  @manyToMany(() => Kupon, {
    pivotTable: 'pake_kupons',
    localKey: 'id',
    pivotForeignKey: 'reservasi_id',
    relatedKey: 'id',
    pivotRelatedForeignKey: 'kupon_id',
  })
  public kupons: ManyToMany<typeof Kupon>
}

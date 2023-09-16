import { DateTime } from 'luxon'
import { BaseModel, BelongsTo, ManyToMany, belongsTo, column, manyToMany } from '@ioc:Adonis/Lucid/Orm'
import Kursi from './Kursi'
import User from './User'
import Jadwal from './Jadwal'

export default class Kuncikur extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public hargaLock: number

  @column.dateTime()
  public lockUntil: DateTime

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @column()
  public jadwalId: number

  @belongsTo(() => Jadwal)
  public jadwal: BelongsTo<typeof Jadwal>

  @column()
  public userId: number

  @belongsTo(() => User)
  public user: BelongsTo<typeof User>

   // jadinya make N-to-N tanpa perantara aja
   @manyToMany(() => Kursi, {
    pivotTable: 'kuncikur_kursis',
    localKey: 'id',
    pivotForeignKey: 'kuncikur_id',
    relatedKey: 'id',
    pivotRelatedForeignKey: 'kursi_id',
  })
  public kursis: ManyToMany<typeof Kursi>
}

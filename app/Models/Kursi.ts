import { DateTime } from 'luxon'
import { BaseModel, belongsTo, BelongsTo, column, hasMany, HasMany, manyToMany, ManyToMany } from '@ioc:Adonis/Lucid/Orm'
import Template from './Template'
import Studio from './Studio'
import Reservasi from './Reservasi'
import Kuncikur from './Kuncikur'

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

  // jadinya make N-to-N tanpa perantara aja
  @manyToMany(() => Kuncikur, {
    pivotTable: 'kuncikur_kursis',
    localKey: 'id',
    pivotForeignKey: 'kursi_id',
    relatedKey: 'id',
    pivotRelatedForeignKey: 'kuncikur_id',
  })
  public kuncikurs: ManyToMany<typeof Kuncikur>

  // jadinya make N-to-N tanpa perantara aja
  @manyToMany(() => Reservasi, {
    pivotTable: 'reservasi_kursis',
    localKey: 'id',
    pivotForeignKey: 'kursi_id',
    relatedKey: 'id',
    pivotRelatedForeignKey: 'reservasi_id',
  })
  public reservasis: ManyToMany<typeof Reservasi>
}

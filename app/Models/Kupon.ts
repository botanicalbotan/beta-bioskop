import { DateTime } from 'luxon'
import { BaseModel, ManyToMany, column, manyToMany } from '@ioc:Adonis/Lucid/Orm'
import Reservasi from './Reservasi'

export default class Kupon extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  // INI MASIH MAKE MODEL TIPE 1
  @column()
  public nama: string

  @column()
  public kode: string | null

  @column()
  public maxRedeem: number

  @column()
  public jumlahRedeem: number

  @column()
  public isPersen: boolean

  @column()
  public nominal: number

  // data ini bikin ragu dah, bisa diilangin
  @column()
  public isValid: boolean

  @column.date()
  public expiredAt: DateTime

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  // jadinya make N-to-N tanpa perantara aja
  @manyToMany(() => Reservasi, {
    pivotTable: 'pake_kupons',
    localKey: 'id',
    pivotForeignKey: 'kupon_id',
    relatedKey: 'id',
    pivotRelatedForeignKey: 'reservasi_id',
  })
  public kupons: ManyToMany<typeof Reservasi>
}

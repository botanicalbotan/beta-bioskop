import { DateTime } from 'luxon'
import { BaseModel, HasMany, column, hasMany } from '@ioc:Adonis/Lucid/Orm'
import Reservasi from './Reservasi'
import Kuncikur from './Kuncikur'

export default class User extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public nama: string

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
  
  @hasMany(() => Reservasi)
  public jadwals: HasMany<typeof Reservasi>

  @hasMany(() => Kuncikur)
  public kuncikurs: HasMany<typeof Kuncikur>
}

import { BaseModel, column } from '@ioc:Adonis/Lucid/Orm'

export default class VaBankDebit extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public nama: string

  @column()
  public noVa: string
}

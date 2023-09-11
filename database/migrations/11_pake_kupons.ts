import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'pake_kupons'
  // INI JADI TABEL N-TO-N Reservasi ke Kupon

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')

      table.integer('kupon_id').unsigned().references('kupons.id').notNullable()
      table.integer('reservasi_id').unsigned().references('reservasis.id').notNullable()
    })
  }

  public async down () {
    this.schema.dropTable(this.tableName)
  }
}

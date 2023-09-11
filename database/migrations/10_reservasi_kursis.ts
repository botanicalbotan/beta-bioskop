import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'reservasi_kursis'
  // INI JADI TABEL N-TO-N Reservasi ke Kursi

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')

      table.integer('reservasi_id').unsigned().references('reservasis.id').notNullable()
      table.integer('kursi_id').unsigned().references('kursis.id').notNullable()
    })
  }

  public async down () {
    this.schema.dropTable(this.tableName)
  }
}

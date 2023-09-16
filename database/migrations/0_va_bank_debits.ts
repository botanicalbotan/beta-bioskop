import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'va_bank_debits'
  // INI SEMENTARA
  // gambaran kedepannya cek discord

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.string('nama', 50).notNullable()
      table.string('no_va', 50).notNullable()
    })
  }

  public async down () {
    this.schema.dropTable(this.tableName)
  }
}

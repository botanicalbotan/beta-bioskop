import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'rating_sensors'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')

      // liat ILF
      table.string('nama', 25).notNullable()
      table.string('nama_singkat', 5).notNullable()
      table.string('keterangan', 50).notNullable()
    })
  }

  public async down () {
    this.schema.dropTable(this.tableName)
  }
}

import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'genres'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.string('genre', 20).notNullable()
    })
  }

  public async down () {
    this.schema.dropTable(this.tableName)
  }
}

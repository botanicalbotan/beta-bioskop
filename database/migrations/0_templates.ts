import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'templates'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.string('node', 5).notNullable()
      table.integer('col').notNullable()
      table.integer('row').notNullable()
    })
  }

  public async down () {
    this.schema.dropTable(this.tableName)
  }
}

import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'kursis'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.string('pub_id', 10).notNullable()
      table.string('priv_id', 15).notNullable()
      table.integer('template_id').unsigned().references('templates.id').notNullable()
      table.integer('harga').notNullable()

      table.integer('studio_id').unsigned().references('studios.id').notNullable()
      // bingung
      table.boolean('is_kursi').notNullable().defaultTo(false)

      /**
       * Uses timestamptz for PostgreSQL and DATETIME2 for MSSQL
       */
      table.timestamps(true, true)

    })
  }

  public async down () {
    this.schema.dropTable(this.tableName)
  }
}

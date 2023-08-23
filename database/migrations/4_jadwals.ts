import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'jadwals'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.datetime('film_mulai').notNullable()
      table.datetime('film_selesai').notNullable()
      table.dateTime('post_interlude').notNullable()

      table.integer('film_id').unsigned().references('films.id').notNullable()
      table.integer('studio_id').unsigned().references('studios.id').notNullable()

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

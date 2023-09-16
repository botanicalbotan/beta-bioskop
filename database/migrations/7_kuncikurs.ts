import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'kuncikurs'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.integer('harga_lock').notNullable()
      table.datetime('lock_until').notNullable()

      table.integer('jadwal_id').unsigned().references('jadwals.id').notNullable()
      table.integer('user_id').unsigned().references('users.id').notNullable()
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

import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'tier_studios'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.string('nama', 20).notNullable()
      table.string('deskripsi', 50).notNullable()
      table.integer('harga_reguler').notNullable().unsigned().defaultTo(0)
      table.integer('harga_friday').notNullable().unsigned().defaultTo(0)
      table.integer('harga_weekend').notNullable().unsigned().defaultTo(0)

      // ntar perlu bioskop id juga
      
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

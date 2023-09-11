import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'kupons'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      
      // INI MASIH MAKE MODEL KUPON TIPE 1, BAKAL ADA UPDATE
      table.string('nama', 40).notNullable()
      table.string('kode', 40).nullable().unique()
      table.integer('max_redeem').notNullable().defaultTo(0)
      table.integer('jumlah_redeem').notNullable().defaultTo(0)
      table.boolean('is_persen').notNullable().defaultTo(0)
      table.integer('nominal').notNullable()
      table.date('expired_at').notNullable()

      // data ini bikin ragu dah, bisa diilangin
      table.boolean('is_valid').notNullable().defaultTo(1)
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

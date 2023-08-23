import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'reservasis'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.integer('harga_tiket_base').notNullable()
      table.integer('harga_tiket_akhir').notNullable()

      // this BS, cuma iseng aja
      table.string('metode_bayar', 20).notNullable()
      table.string('validasi_bayar').notNullable()

      // buat nyocokin pas dateng ke tempat
      table.string('token').notNullable()
      table.boolean('is_used').notNullable().defaultTo(0)

      table.integer('kursi_id').unsigned().references('kursis.id').notNullable()
      table.integer('jadwal_id').unsigned().references('jadwals.id').notNullable()

      // sementara masih bukan FK
      table.integer('penonton_id').unsigned().notNullable().defaultTo(1)
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

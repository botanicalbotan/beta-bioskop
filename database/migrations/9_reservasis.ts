import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'reservasis'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.integer('harga_tiket_base').notNullable()
      table.integer('harga_tiket_akhir').notNullable()
      table.integer('ongkos_layanan').notNullable()
      table.integer('jadwal_id').unsigned().references('jadwals.id').notNullable()
      table.integer('user_id').unsigned().references('users.id').notNullable()

      // entah redundan apa ngga
      table.datetime('lock_until').notNullable()
      // kalau dicek ampe abis waktunya kok lom dibayar, status locknya dilepas
      table.boolean('is_active').notNullable().defaultTo(1) // cukup ngecek sini aja jadinya
      table.boolean('is_paid').notNullable().defaultTo(0)

      // this BS, aslinya ga gini. Tapi intinya pembayaran lah
      // ohya, ini sementara cuma buat debit transfer dulu aja
      table.string('metode_bayar', 20).notNullable()
      table.string('no_transaksi', 20).notNullable()
      table.string('no_va', 20).notNullable() // token

      // buat nyocokin pas dateng ke tempat, mungkin
      table.string('redeem_token').nullable()
      table.boolean('is_used').notNullable().defaultTo(0)
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

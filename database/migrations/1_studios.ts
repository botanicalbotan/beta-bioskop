import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'studios'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.string('nama', 30).notNullable()
      table.integer('row').notNullable()
      table.integer('col').notNullable()

      table.integer('tier_studio_id').unsigned().references('tier_studios.id').notNullable()      

      // sementara, tp udah diganti
      // table.enum('tier', ['reguler', 'gold']).notNullable()

      // sementara, mungkin bisa stay atau ganti
      // table.integer('harga_tiket').unsigned().notNullable().defaultTo(0)

      // ntar ada bioksop id juga
      // data2 yang disini belom semua lengkap, cek draw.io


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

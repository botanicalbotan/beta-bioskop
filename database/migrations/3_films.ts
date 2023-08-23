import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'films'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.string('nama', 30).notNullable()
      table.string('deskripsi', 50).notNullable()
      table.string('starring').notNullable()
      table.string('direktor').notNullable()
      table.integer('durasi').notNullable().defaultTo(0)

      table.date('tanggal_mulai_tayang').notNullable()
      table.date('tanggal_selesai_tayang').notNullable()
      
      table.integer('rating_sensor_id').unsigned().references('rating_sensors.id').notNullable()      
      table.integer('genre_id').unsigned().references('genres.id').notNullable()      

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

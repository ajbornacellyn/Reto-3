import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class Books extends BaseSchema {
  protected tableName = 'books'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id');
      table.string('titulo', 200).notNullable();
      table.integer('autor').unsigned().notNullable();
      table.string('editorial', 180).notNullable();
      table.string('formato', 180).notNullable();
      table.integer('paginas').unsigned().notNullable();
      table.integer('id_usuario').unsigned().notNullable();
      table.timestamps(true);
    })
  }

  public async down () {
    this.schema.dropTable(this.tableName)
  }
}

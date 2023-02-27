import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class UsersSchema extends BaseSchema {
  protected tableName = 'users'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').primary()
      table.string('name',180).notNullable()
      table.string('email', 255).notNullable()
      table.string('password', 180).notNullable()
      table.integer('perfil_usuario').unsigned().unique().index("perfil_usuario")
      table.foreign('perfil_usuario').references('perfils.id').onDelete('CASCADE')
      table.string('identificacion_tipo').notNullable()
      table.integer('identificacion_no').notNullable()
      table.string('direccion', 180).notNullable()
      table.string('barrio', 180).notNullable()
      table.string('municipio', 180).notNullable()
      table.string('departamento', 180).notNullable()
      table.string('remember_me_token').nullable()
      table.timestamps(true)
    })
  }

  public async down () {
    this.schema.dropTable(this.tableName)
  }
}

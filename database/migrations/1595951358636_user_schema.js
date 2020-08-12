'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class UserSchema extends Schema {
  up () {
    this.create('users', (table) => {
      table.increments()
      table.string('username', 12).notNullable().unique().onDelete('CASCADE')
      table.string('name', 25).notNullable()
      table.string('avatar', 300).notNullable().defaultTo('https://res.cloudinary.com/scute/image/upload/v1595981235/recursos/30-307416_profile-icon-png-image-free-download-searchpng-employee_ogifkm.png')    
      table.string('avatarpublicid').notNullable()
      table.string('number', 15).notNullable()
      table.text('location', 100)
      table.text('bio', 100).nullable()
      table.string('cumpleaños',8).nullable()
      table.string('email', 80).notNullable().unique()
      table.string('password', 120).notNullable()
      table.integer('cv_id').references('id').inTable('curriculos').unsigned().notNullable()
      table.timestamps()
    })
  }

  down () {
    this.drop('users')
  }
}

module.exports = UserSchema

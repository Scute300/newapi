'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class BanlistSchema extends Schema {
  up () {
    this.create('banlists', (table) => {
      table.increments()
      table.integer('user_id').unsigned().notNullable()
      table.text('email').notNullable()
      table.timestamps()
    })
  }

  down () {
    this.drop('banlists')
  }
}

module.exports = BanlistSchema

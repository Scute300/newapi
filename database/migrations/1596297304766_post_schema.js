'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class PostSchema extends Schema {
  up () {
    this.create('posts', (table) => {
      table.increments()
      table.integer('user_id').unsigned()
      table.text('type', 15).notNullable()
      table.text('name', 150).notNullable()
      table.text('location', 90).notNullable()
      table.text('text', 1500).notNullable()
      table.text('price',100)
      table.text('category', 40)
      table.text('status', 5)
      table.timestamps()
    })
  }

  down () {
    this.drop('posts')
  }
}

module.exports = PostSchema

'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class PostimagesSchema extends Schema {
  up () {
    this.create('postimages', (table) => {
      table.increments()
      table.integer('post_id')
      table.text('url', 300).notNullable()
      table.string('publicid',100).notNullable()
      table.timestamps()
    })
  }

  down () {
    this.drop('postimages')
  }
}

module.exports = PostimagesSchema

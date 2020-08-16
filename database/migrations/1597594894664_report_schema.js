'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class ReportSchema extends Schema {
  up () {
    this.create('reports', (table) => {
      table.increments()
      table.integer('reportante_id').unsigned()
      table.integer('post_id').unsigned().references('id').inTable('posts').onDelete('CASCADE')
      table.string('report', 350).notNullable()
      table.timestamps()
    })
  }

  down () {
    this.drop('reports')
  }
}

module.exports = ReportSchema

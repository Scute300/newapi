'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class ReportSchema extends Schema {
  up () {
    this.table('reports', (table) => {
      table.integer('reportante_id').unsigned()
      table.integer('post_id').unsigned().references('id').inTable('posts').onDelete('CASCADE')
      table.string('report', 350).notNullable()
      // alter table
    })
  }

  down () {
    this.table('reports', (table) => {
      // reverse alternations
    })
  }
}

module.exports = ReportSchema

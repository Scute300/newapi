'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class CvreportSchema extends Schema {
  up () {
    this.create('cvreports', (table) => {
      table.increments()
        table.integer('user_id').unsigned()
        table.integer('curriculo_id').unsigned()
        table.string('report', 350).notNullable()
      table.timestamps()
    })
  }

  down () {
    this.drop('cvreports')
  }
}

module.exports = CvreportSchema

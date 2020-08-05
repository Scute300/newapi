'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class CurriculumSchema extends Schema {
  up () {
    this.create('curricula', (table) => {
      table.increments()
      table.integer('user_id').references('id').inTable('users').unsigned().notNullable()
      table.string('cvlink', 300).notNullable()
      table.timestamps()
    })
  }

  down () {
    this.drop('curricula')
  }
}

module.exports = CurriculumSchema

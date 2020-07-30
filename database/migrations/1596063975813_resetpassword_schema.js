'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class ResetpasswordSchema extends Schema {
  up () {
    this.create('resetpasswords', (table) => {
      table.increments()
      table.string('email')
      table.string('token')
      table.timestamps()
    })
  }

  down () {
    this.drop('resetpasswords')
  }
}

module.exports = ResetpasswordSchema

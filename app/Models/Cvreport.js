'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class Cvreport extends Model {
    curriculo(){
        return this.belongsTo('App/Models/Curriculo')
    }
}

module.exports = Cvreport

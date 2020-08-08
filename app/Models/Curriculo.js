'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class Curriculo extends Model {
    user(){
        return this.belongsTo('App/Models/User')
    }
    cvreports(){
        return this.hasMany('App/Models/Cvreport')
    }
}

module.exports = Curriculo

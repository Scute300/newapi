'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class Postimage extends Model {
    post(){
        this.belongsTo('App/Models/Post')
    }
}

module.exports = Postimage

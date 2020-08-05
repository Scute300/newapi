'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class Post extends Model {
    user(){
        this.belongsTo('App/Models/User')
    }
    images(){
        this.hasMany('App/Models/Postimage')
    }
}

module.exports = Post

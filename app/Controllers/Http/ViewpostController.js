'use strict'

const PostController = require("./PostController")

const Post = use('App/Models/Post')

class ViewpostController {
    async getonepost({params, response}){

        
        const post = await Post.query()
        .where('id', params.id)
        .with('user')
        .with('images')
        .firstOrFail()


        if (post == null){
            return response.status(404).json({
                status : 'wrong',
                message: 'Contenido no encontrado'
            })
        } else{
            return response.json({
                status : 'sure',
                data: post
            })
        }
    }
}

module.exports = ViewpostController

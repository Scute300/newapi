'use strict'

const PostController = require("./PostController")

const Post = use('App/Models/Post')

class ViewpostController {
    async getonepost({params, response}){
        try{
        
            const post = await Post.query()
            .where('id', params.id)
            .with('user')
            .with('images')
            .firstOrFail()
            
            return response.status.json({
                status : 'sure',
                data: post })


        }catch(error){

            return response.status(404).json({
                status : 'wrong',
                message: 'Contenido no encontrado'
            })
        }
    }
}

module.exports = ViewpostController

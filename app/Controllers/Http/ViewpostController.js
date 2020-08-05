'use strict'

const PostController = require("./PostController")

const Post = use('App/Models/Post')
const Postimage = use('App/Models/Postimage')
const Cloudinary = use('Cloudinary');


class ViewpostController {
    async getonepost({params, response}){
        try{
        
            const post = await Post.query()
            .where('id', params.id)
            .with('user')
            .with('images')
            .firstOrFail()
            
            return response.json({
                status : 'sure',
                data: post 
            })


        }catch(error){

            return response.status(404).json({
                status : 'wrong',
                message: error
            })
        }
    }
    async deletepost({auth, params, response}){

        const post = await Post.findBy('id', params.id)
        const postjson = post.toJSON()

        if(auth.current.user.id == postjson.user_id){
            
            let imageposts = []
            
            const images = await Postimage.query()
            .where('post_id', postjson.id)
            .fetch()

            const pimages = images.toJSON()
    
            imageposts.push({pimages})
            console,log(imageposts)
            for (let imagepost of imageposts) {
                await Cloudinary.v2.uploader.destroy(imagepost.publicid)
            }

            await post.delete() 

            return response.json({
                status: 'sure',
                data: 'Eliminado'
            })
        } else {
            return response.status(401).json({
                status: 'sure',
                message: 'No estás autorizado para esto'
            })
        }
    }
}

module.exports = ViewpostController

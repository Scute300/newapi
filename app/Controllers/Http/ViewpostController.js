'use strict'

const PostController = require("./PostController")
const Report = use('App/Models/Report')
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
    
            console.log(pimages)
            for (let pimage of pimages) {
                await Cloudinary.v2.uploader.destroy(pimage.publicid)
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

    async getallposts({auth, params, response, request}){
        
        const data = request.only(['foo']);
        const page = parseInt(data.foo , 10);

        const posts = await Post.query
        .where('category', params.category)
        .wereNot('user_id', auth.current.user.id)
        .with('user')
        .with('images')
        .orderBy('created_at', 'DESC')
        .paginate(page, 3)

        return response.json({
            status: 'sure',
            data: posts
        })
    }
    
    async report({auth, request, response, params}){
         const data = request.only(['report'])
         const report = await new Report()

         report.user_id = auth.current.user.id
         report.report = data.report
         report.post_id = params.id

         return response.json({
             status: 'sure',
             data :'Se ha enviado el reporte y se atenderá en breve'
         })
    }
}

module.exports = ViewpostController

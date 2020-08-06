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
        
        const pagedata = request.only(['foo']);
        const page = parseInt(pagedata.foo , 10);

        const posts = await Post.query()
        .where('type', params.type)
        .with('user')
        .with('images')
        .orderBy('created_at', 'DESC')
        .paginate(page, 3)

        
        const aposts = await posts.toJSON()
        let allposts = aposts.data 
        let data = []


        for (let post of allposts) {
            let location = post.location
            if(post.user.location !== null){
                location = post.user.location
            }            
            let image = data.image[0]
            let fpost = {username : post.user.username, location : location,
                        avatar: post.user.avatar, postname : post.name,
                        image: image.url , type: post.type, category: post.category,
                        price : post.price, status: post.status, id: post.id, creado : post.created_at
                        }

            data.push(fpost)
        }


        return response.json({
            status: 'sure',
            data: data
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

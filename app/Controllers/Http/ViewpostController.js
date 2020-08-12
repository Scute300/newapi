'use strict'

const PostController = require("./PostController")
const Report = use('App/Models/Report')
const Post = use('App/Models/Post')
const Postimage = use('App/Models/Postimage')
const Cvreport = use('App/Models/Cvreport')
const Cloudinary = use('Cloudinary');
const { validate } = use('Validator')


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
    async finder ({request, response}){
        const data = request.only('type', 'price', 'operador', 'category')

    }
    async deletepost({auth, params, response}){

        const post = await Post.findBy('id', params.id)
        const postjson = post.toJSON()

        if(auth.current.user.id == postjson.user_id){
            
            
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

    async getallposts({params, response, request}){
        
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
            let image = post.images[0]
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

    async find({request, response}){
        const parameters = request.only(['precio', 'type', 
                                        'category', 'status', 'find', 'page', 'isadvancesearch'])
        const page = parseInt(parameters.page , 10);
        const price = parseFloat(parameters.precio, 10)
        
        console.log(parameters)

        const rules = {
            precio: 'number',
            type: 'string|min:7|max:10',
            category: 'max:150',
            status : 'max:5',
            find: 'required|max:150',
            page: 'required|number',
            isadvancesearch: 'required'
        }

        const messages = {
            required: 'Es necesario llenar todos los campos',
            'find.max' : 'El nombre de lo que buscas no debe exceder los 100 caracteres',
          }

        const validation = await validate(parameters, rules, messages)
        if(validation.fails()){

        const message = validation.messages()
        let error = message[0]
        return response.status(400).json({
            status: 'wrong',
            message: error.message
        })


        } else{
            let posts = undefined
                if(parameters.isadvancesearch == 'true'){
                    switch(parameters.type){
                        case 'listado':
                            posts = await Post.query()
                            .where('type', parameters.type)
                            .where('category', parameters.category)
                            .where('status', parameters.status)
                            .where('name', 'like', '%' + parameters.find + '%')
                            .with('user')
                            .with('images')
                            .orderBy('created_at', 'DESC')
                            .paginate(page, 3)
                        break
                        case 'negocio':
                            posts = await Post.query()
                            .where('type', parameters.type)
                            .where('category', parameters.category)
                            .where('name', 'like', '%' + parameters.find + '%')
                            .with('user')
                            .with('images')
                            .orderBy('created_at', 'DESC')
                            .paginate(page, 3)
                        break
                        case('servicio'):
                            posts = await Post.query()
                            .where('type', parameters.type)
                            .where('category', parameters.category)
                            .where('name', 'like', '%' + parameters.find + '%')
                            .with('user')
                            .with('images')
                            .orderBy('created_at', 'DESC')
                            .paginate(page, 3)
                        break
                        case 'vacante': 
                            posts = await Post.query()
                            .where('type', parameters.type)
                            .where('name', 'like', '%' + parameters.find + '%')
                            .with('user')
                            .with('images')
                            .orderBy('created_at', 'DESC')
                            .paginate(page, 3)
                        break
                    } 
                }else if(parameters.isadvancesearch == 'false') {
                    switch(parameters.type){
                        case 'listado':
                            posts = await Post.query()
                            .where('type', parameters.type)
                            .where('name', 'like', '%' + parameters.find + '%')
                            .with('user')
                            .with('images')
                            .orderBy('created_at', 'DESC')
                            .paginate(page, 3)
                        break
                        case 'negocio':
                            posts = await Post.query()
                            .where('type', parameters.type)
                            .where('name', 'like', '%' + parameters.find + '%')
                            .with('user')
                            .with('images')
                            .orderBy('created_at', 'DESC')
                            .paginate(page, 3)
                        break
                        case('servicio'):
                            posts = await Post.query()
                            .where('type', parameters.type)
                            .where('name', 'like', '%' + parameters.find + '%')
                            .with('user')
                            .with('images')
                            .orderBy('created_at', 'DESC')
                            .paginate(page, 3)
                        break
                        case 'vacante': 
                            posts = await Post.query()
                            .where('type', parameters.type)
                            .where('name', 'like', '%' + parameters.find + '%')
                            .with('user')
                            .with('images')
                            .orderBy('created_at', 'DESC')
                            .paginate(page, 3)
                        break
                    }   
                }

            const aposts = await posts.toJSON()
            
            let allposts = aposts.data 

            let data = []


            for (let post of allposts) {
                let location = post.location

                if(post.user.location !== null){
                    location = post.user.location
                }  
                console.log(post)
                
                let myprice = parseFloat(post.price, 10)
                if(myprice < price){
                    let image = post.images[0]
                    let fpost = {username : post.user.username, location : location,
                                avatar: post.user.avatar, postname : post.name,
                                image: image.url , type: post.type, category: post.category,
                                price : post.price, status: post.status, id: post.id, creado : post.created_at
                                }

                    data.push(fpost)
                }
            }


            return response.json({
                status: 'sure',
                data: data
            })
        }


    }
    
    async report({auth, request, response, params}){
        const data = request.only(['report'])

        const rules = {
            report: 'max:350|string|required'
        }

        const messages = {
            required: 'Es necesario llenar todos los campos',
            max:'Tu reporte no puede exceder 350 caracteres'
        }

        const validation = await validate(data, rules, messages)
        if(validation.fails()){

            const message = validation.messages()
            let error = message[0]

            return response.status(400).json({
                status: 'wrong',
                message: error.message
            })

        } else{ 
            const report = await new Report()

            report.reportante_id = auth.current.user.id
            report.report = data.report
            report.post_id = params.id

            return response.json({
                status: 'sure',
                data :'Se ha enviado el reporte y se atenderá en breve'
            })
        }
    }

    async myposts({auth, params, response}){
        
        const user = auth.current.user

        const posts = await Post.query()
        .where('user_id', user.id)
        .with('user')
        .with('images')
        .orderBy('created_at', 'DESC')
        .paginate(params.page, 3)

        
        const aposts = await posts.toJSON()
        let allposts = aposts.data 
        let data = []


        for (let post of allposts) {
            let location = post.location
            if(post.user.location !== null){
                location = post.user.location
            }            
            let image = post.images[0]
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
    
    async reportcv({auth, request, response, params}){
         const data = request.only(['report'])

        const rules = {
            report: 'max:350|string|required'
        }

        const messages = {
            required: 'Es necesario llenar todos los campos',
            max:'Tu reporte no puede exceder 350 caracteres'
        }

        const validation = await validate(data, rules, messages)
        if(validation.fails()){

            const message = validation.messages()
            let error = message[0]

            return response.status(400).json({
                status: 'wrong',
                message: error.message
            })

        } else{

            const report = await new Cvreport()

            report.reportante_id = auth.current.user.id
            report.report = data.report
            report.curriculo_id = params.id

            return response.json({
                status: 'sure',
                data :'Se ha enviado el reporte y se atenderá en breve'
            })
        }
    }
}

module.exports = ViewpostController

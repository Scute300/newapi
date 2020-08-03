'use strict'
const User = use('App/Models/User')
const Post = use('App/Models/Post')
const Postimage = use('App/Models/Postimage')
const { validate } = use('Validator')
const Cloudinary = use('Cloudinary')
const fs = use('fs');
const path = use('path')
const key = use("App/petras-a108b-9387b564933a");
const {Storage} = require('@google-cloud/storage');
const axios = use('axios')


class PostController { 
    async post ({auth, request, response}){
        const data = request.only(['text', 'name', 'images', 'location' , 'type', 'category', 'price', 'status'])
        if(data.type == 'listado'){
        const rules = {
            text: 'required|string|max:1500|min:300',
            name: 'required|string|min:10|max:150',
            images: 'required',
            location : 'required|max:90|string',
            type: 'required|string|min:7|max:10',
            category: 'required|max:150',
            price: 'required|max:100',
            status : 'required|max:5'
        }

        const messages = {
            required: 'Es necesario llenar todos los campos',
            'price.required' : 'si no deseas especificar el precio pon cero',
            'images.required' : 'Necesitas subir al menos una imagen',
            'text.min': 'El post debe tener al menos 300 catacteres',
            'text.max':'El post no debe exceder los 1500 caracteres',
            'name.min': 'Nombre debe tener al menos 10 caracteres',
            'name.max': 'Nombre no puede tener más de 150 caracters',
            'price.min' : 'El precio no debe exceder los 100 caracteres',
          }

          const validation = await validate(data, rules, messages)
          if(validation.fails()){

            const message = validation.messages()
            let error = message[0]
            return response.status(400).json({
                status: 'wrong',
                message: error.message
            })

          } else {
              const post = await new Post()
              post.user_id = auth.current.user.id
              post.name = data.name
              post.type = data.type
              post.location = data.location
              post.price = data.price
              post.category = data.category
              post.text = data.text
              post.status = data.status
              await post.save()
              
              const posto = post.toJSON()

              for (let image of data.images) {
                const pick = image['base64'];
                const resultado = await Cloudinary.v2.uploader.upload(pick);
    
                const postimage = await new Postimage()
                postimage.post_id = posto.id
                postimage.url = resultado.secure_url
                postimage.publicid = resultado.public_id
                await postimage.save()
              }

              return response.json({
                  status : 'sure',
                  data: post
              })

          }
        }else if(data.type == 'negocio' || data.type == 'servicio'){
            const rules = {
                text: 'required|string|max:1500|min:300',
                name: 'required|string|min:10|max:150',
                images: 'required',
                location : 'required|max:90|string',
                type: 'required|string|min:7|max:10',
                category: 'required|max:150'
            }
    
            const messages = {
                required: 'Es necesario llenar todos los campos',
                'images.required' : 'Necesitas subir al menos una imagen',
                'text.min': 'El post debe tener al menos 300 catacteres',
                'text.max':'El post no debe exceder los 1500 caracteres',
                'name.min': 'Nombre debe tener al menos 20 caracteres',
                'name.max': 'Nombre no puede tener más de 150 caracters',
              }
    
              const validation = await validate(data, rules, messages)
              if(validation.fails()){
    
                const message = validation.messages()
                let error = message[0]
                return response.status(400).json({
                    status: 'wrong',
                    message: error.message
                })
    
              } else {
                  const post = await new Post()
                  post.user_id = auth.current.user.id
                  post.name = data.name
                  post.type = data.type
                  post.location = data.location
                  post.category = data.category
                  post.text = data.text
                  await post.save()
                  
                  const posto = post.toJSON()
    
                  for (let image of data.images) {
                    const pick = image['base64'];
                    const resultado = await Cloudinary.v2.uploader.upload(pick);
        
                    const postimage = await new Postimage()
                    postimage.post_id = posto.id
                    postimage.url = resultado.secure_url
                    postimage.publicid = resultado.public_id
                    await postimage.save()
                  }
    
                  return response.json({
                      status : 'sure',
                      data: post
                  })
    
            }
            
        } else if(data.type == 'vacante'){
            const rules = {
                text: 'required|string|max:1500|min:300',
                name: 'required|string|min:10|max:150',
                images: 'required',
                location : 'required|max:90|string',
                type: 'required|string|min:7|max:10',
                price: 'required|max:100'
            }
    
            const messages = {
                required: 'Es necesario llenar todos los campos',
                'price.required' : 'si no deseas especificar el precio pon cero',
                'images.required' : 'Necesitas subir al menos una imagen',
                'text.min': 'El post debe tener al menos 300 catacteres',
                'text.max':'El post no debe exceder los 1500 caracteres',
                'name.min': 'Nombre debe tener al menos 10 caracteres',
                'name.max': 'Nombre no puede tener más de 150 caracters',
                'price.min' : 'El precio no debe exceder los 100 caracteres',
              }
    
              const validation = await validate(data, rules, messages)
              if(validation.fails()){
    
                const message = validation.messages()
                let error = message[0]
                return response.status(400).json({
                    status: 'wrong',
                    message: error.message
                })
    
              } else {
                  const post = await new Post()
                  post.user_id = auth.current.user.id
                  post.name = data.name
                  post.type = data.type
                  post.location = data.location
                  post.price = data.price
                  post.text = data.text
                  await post.save()
                  
                  const posto = post.toJSON()
    
                  for (let image of data.images) {
                    const pick = image['base64'];
                    const resultado = await Cloudinary.v2.uploader.upload(pick);
        
                    const postimage = await new Postimage()
                    postimage.post_id = posto.id
                    postimage.url = resultado.secure_url
                    postimage.publicid = resultado.public_id
                    await postimage.save()
                  }
    
                  return response.json({
                      status : 'sure',
                      data: post
                  })
    
              }
        }
    }
    
    async curriculum({auth, request,  response}){
     const data = request.all()
     let trys = data.curriculum._parts
     console.log(trys)
      try{
        const gc = await new Storage({
          KeyFilename: key,
          projectId: 'petras-a108b'
        })
        const d = gc.bucket('bucketpruebasbusco')
        console.log(d)
}catch(error){
  console.log(error)
}
    }
}

module.exports = PostController

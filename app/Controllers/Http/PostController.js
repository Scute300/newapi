'use strict'
const User = use('App/Models/User')
const Post = use('App/Models/Post')
const Postimage = use('App/Models/Postimage')
const { validate } = use('Validator')
const Cloudinary = use('Cloudinary');
const path = use('path')
const {Storage} = require('@google-cloud/storage');
var multer  = use('multer')
var upload = multer({ dest: 'uploads/' })
const {createWriteStream} = use("fs")
const path = use('path')
const GOOGLE_CLOUD_PROJECT_ID = "busco-285406"
const GOOGLE_CLOUD_KEYFILE= path.join('app/Controllers/Http/busco-285406-038aaa64cff9.json')
 

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
    async curriculum ({auth, response, request}) {
      await request.multipart.file('cv', {}, (file) => {
        const gc = await new Storage({
          projectId: GOOGLE_CLOUD_PROJECT_ID,
          keyFilename: GOOGLE_CLOUD_KEYFILE,
        })
    
        const bucked = gc.bucket('rootbusco')
        const cloud = bucked.file(auth.current.user.username)
    
        await file.stream.pipe(cloud.createWriteStream({
          resumable: false,
          gzip: true,
          metadata: {
            contentType: file.stream.headers['content-type']
          }
        }))
      }).then( response =>{
        console.log(response)
      })

    
     
      // Set the callback to process fields manually
      request.multipart.field((name, value) => {
      console.log(name,value); 
      });
     
      // Start the process
      await request.multipart.process()
      return response.json({
        status:'sure',
        data: 'shure'
      })
    
    }
}

module.exports = PostController

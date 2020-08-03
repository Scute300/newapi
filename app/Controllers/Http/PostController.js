'use strict'
const User = use('App/Models/User')
const Post = use('App/Models/Post')
const Postimage = use('App/Models/Postimage')
const { validate } = use('Validator')
const Cloudinary = use('Cloudinary')
const fs = use('fs');
const {Storage} = use('@google-cloud/storage');
const path = use('path')


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
    
    async curriculum({auth, request, response}){
      const gc = new Storage({
        keyfilename : {
          type: "service_account",
          project_id: "petras-a108b",
          private_key_id: "776bf147ea41a1b1a5dd5c5792231d9877a22a65",
          private_key: "-----BEGIN PRIVATE KEY-----\nMIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQDtdpdcEC9pc2sW\n0mYQ57TJdHOD6dSMsJaFidSIXSIF5zgBkjN+3c24e60Cb1MigwD+HU8HV3R4DPlb\nrUBL9/HRzRE3NzQLYzEVdVp4VHK+TdgE247wbTH8m2ZN2262iT7ZyZWAOXX61uls\nrQUssohu/9/B5cAMxNWyTihIOI2t6ZuDJq8A4on+LloDbrG236KNn2PF4xJBwjEx\npZaA77Hc8CK1Y51KZkQacuLJ2ii8dRoUKhy7RxA+h6OvjQvHj9+q1parY2cWALcM\nauD+zt1kYX9I1TyYOCN7IpyAkqFFEmZmapzQhQwquQpKagIXUNNGcajskSVdkazd\nI4Ch2CwJAgMBAAECggEABNwcuGZfZgfV7Ptk2ds4HLhcpdo6/p8dkYGS3zCSwe6r\nu4J/ucy1yV0Emyxmlen68vhsFeEhEdToJIts6bEbGplZDRl83+/JgSAr+BL4XzMu\nJNlOeVauw3X1t8myIBu6dNAWlm92nenYkKAQ30uPFcB4VppKXiiIHBRT6Dh6E9FO\nRRB0Bo29JiltFFdC12VykMElVGfGKAJTgfXQBJFgup5wv8l/4J7TnMjllTjSurZc\nVvDugy8tNv0bzPHP3ncq0HeJhDQDhl7KhYNKffk+VokMT7A0F4xkIArlz6x+867f\nYq4bvmVTXnw3nIv3dnVLk1Lj1FtMB18N8AudsEZpRQKBgQD4p4vfAMFdhH6mjfdr\n9pMoDCXGIrxkm+T8eAY1Y+Kl59Wqcr8VvRo5ebxfivp7/AJPpQdh2jLNZz5K7NT6\nRZBF03AH0w/8eQTFtzq61Wd2sKuoZgNG2I+FP76fVRtbh3cidgCNNgeVRKuHcUyV\n51nq20TL9L2Gkl2HIoMuFaSAFQKBgQD0emk3vDnaLtorp2hyDMf6A47hn7IYPZtC\nIGQSWyZ4g3UoGb/vaIQo2+E+jwIKRQkvDwe7MOu4nzSVHLDyS7zW8Nyo8qjhl9Fy\nonooHYZz9jON7gffwDwHjiy2lUplDmyiEvZczurgPtZI0mtwBN/zIddfkbyMGrtF\nD1ApV1xFJQKBgEc98eRF2iEKKiNcP4yOTCFIQbZgE2wcAmKXnOfFI5X3M4+varI2\nyQG4sFELh7LoRF0/YjsWAkI5l25uJqNCNRDcgJetUEI9BjIDym7nX8pw2e3YtI2i\n1JQP7HTINJtn16lm98d9uHR7BU48Fv5IF8ojYrWw/HBHFUb3i3AzwTr1AoGBAOLM\nxNud1JWiLWeeEHjtfn9j2aNaQR/X1zbLUcrtoIzgd0lSSgrRjPlSsm0UwjHAxbpQ\nWT3BLozBtUg3q7e7p15HaI2bQCy4aOfN70FT0q21UzJyBf//GDFyJezkJnYFoaXh\nrYd/tcl+wdAg1ObAvvmRBXp1etMG4YA5qoYPs1u5AoGBAMkdyUNCpp78Wa8gDrGP\nyOe4sy5zzW1F5WP/wDPeCRukLAOuO1moQ/QCO/7TqGeTLPGZ3vOU9i2dQr6pcPY6\nUJtVdlTnokalhQlzsIiqKh1bkYXE/V2zdvzr90h/4vbKlw1cIPueSGOf8wvMJdEK\nJl3sXxY1eUr3zRM32ODE3S07\n-----END PRIVATE KEY-----\n",
          client_email: "newbucketbuscar@petras-a108b.iam.gserviceaccount.com",
          client_id: "109218366904810076878",
          auth_uri: "https://accounts.google.com/o/oauth2/auth",
          token_uri: "https://oauth2.googleapis.com/token",
          auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs",
          client_x509_cert_url: "https://www.googleapis.com/robot/v1/metadata/x509/newbucketbuscar%40petras-a108b.iam.gserviceaccount.com"
        }
        ,
        project_id : 'petras-a108b'
      })
      gc.getBuckets().then(x => console.log(x))
    }
}

module.exports = PostController

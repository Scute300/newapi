'use strict'
const User = use('App/Models/User')
const Post = use('App/Models/Post')
const Postimage = use('App/Models/Postimage')
const { validate } = use('Validator')
const Cloudinary = use('Cloudinary')
const fs = use('fs');
const {Storage} = use('@google-cloud/storage');
const path = use('path')

const keys = {
    type: "service_account",
    project_id: "intense-howl-247800",
    private_key_id: "e345fd9380e87d7d1edf0095c69d45180727e354",
    private_key: "-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQDH1B8odRceGFWt\nfBxlnoA9+mUFEhcZXCx0yV3KRYT1SxVWrG8ClmkSJkZ4dogtkBE/1nsNiEzT7P28\ngWuEzvw5YlLnAZu7+BEUmc2IMa7mPlo7aNwZ986XC8vb+lBkOPi9UTXzZmXon+Z7\nhZR1FKNq0w7Rqft6p7aZ7iAuFOsZrqkRABKXUzGq8gPvwCjUHeZp+uMb/RQAg3/N\niZMntpGb4px/0QymAhpaBGeBC+l3egjfCXNP2TD8EXZg97V86bG9uDmw1RdVpgvr\nNppTW8Bn99oZnN1FJzys4DpT1o0PiW2jhbj26UChXk2KGYo9O5Egjn2Rltd4Wl9J\ns592Hhc/AgMBAAECggEACld3LVf7HXGcZGE7GCPRP9GbDxRoT1f32r25I3Zyu/TX\nq96oHKy9z1SmoZOnskP1nAEHDdtg0xOGysSyMBfyzSswFXY0tD32FFYAPMh3v+WT\n6woMzp6rHiITAx6XQxQA4BbLk7TqYdUQGNvbf1KMHNXDckk5gSocRycgCF3tWXX2\nkzmecvavFbLfcA/XR7imQnuLuF9cLuw77cGxIa8ClYiM1mtZrGPJpVZ0tCccS9XY\nCQH6bKNOtG26F4+nAcAtEyl+7GNtv7zKuudIW0X1sc/pQqdVn3xJLZDrY+WFU8BD\n4SJeqN8fjQffpWkbJ/Gm5ePZnxRi1Zl/JtrZhGJfAQKBgQDvUdqHomJobh9LbJ+q\nUebjRdELO40Q/wl/iAZS4jTwhFbrR6xX2RVBdcgtcCSeRA3fbbLcv94p9fBBK1sX\ndxABOKcTQEamoTQwx1DRCJq+/oXAWxshX/LMg5g+Y/+mHA/+42sO2DvsmiVZbmYb\n7SJj5HuGCCrv4yqEaaIFvt+lfwKBgQDVwaIxRDb/o6CgGDfbE+oXPaWGlQzrx8Id\niUGEoxalV6jXiDjiXZ/8fzdkogIFsI322e2hV3T8IcPmNI2FnO7N4HXPUz6Ncw++\nDN10C82MTwldKEg4alVcdj1o4xyoymFfSlbu4jmI2eoU8Pd4J1KFBJLXkl7Xtj4u\npqP/8wfuQQKBgC3eYWUXsYbUfHkHU77gPcGXsw5VFp+IUji4SIYARydGJiaoMRcR\nS2qleX2D/fC7mHEXZG289IbUVX0YIzhnIJErW5JsAl6TjR5ARXQbExXCUL5id9u4\nuR+LpVVn8yrSPBqdWfqZZTre/IOcjkOR+sJsm2RAEoKx5odEe8JgKBtfAoGBAKnk\n6j3QIwqSiiNUvGhi7qckN0C9jPSF49JH+owqd+BYyPjt65B3q6YrkuJoJcVR67Ps\nyIN5GKEhUSvSTz2IWwHFSr3LQyd38WYzoXwPuYKwexfQ4X39ffUsgWixQmEh4by0\nQF5D7kjIMtYMJBUa4+qXlQLD8p/u2IOJrUXMa1xBAoGALyUYP0lz8l1/iThPGj0V\nvmbP2L5WC1A5YbCCn5DoYUVjvVEv/D/AMBqb+7TkFpfJLBJ1SbqrjaZ20HStLfGD\nJINa6ukUJ14GY6X2qfkw5JLYxxddsXmXC4JTJ70mtzxOl1DW6KednY39bOTnLPql\nN7TekvjGgcv3RPZpHDTMA9U=\n-----END PRIVATE KEY-----\n",
    client_email: "buscodeveloper@intense-howl-247800.iam.gserviceaccount.com",
    client_id: "102917404767801708120",
    auth_uri: "https://accounts.google.com/o/oauth2/auth",
    token_uri: "https://oauth2.googleapis.com/token",
    auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs",
    client_x509_cert_url: "https://www.googleapis.com/robot/v1/metadata/x509/buscodeveloper%40intense-howl-247800.iam.gserviceaccount.com"
  }
  


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
        keyfilename : path.join(__dirname, '../../petras-a108b-776bf147ea41.json'),
        project_id : 'petras-a108b'
      })
       function listBuckets() {
        try {
          const results = await gc.getBuckets();
      
          const [buckets] = results;
      
          console.log('Buckets:');
          buckets.forEach((bucket) => {
            console.log(bucket.name);
          });
        } catch (err) {
          console.error('ERROR:', err);
        }
      }
      listBuckets();
      
    }
}

module.exports = PostController

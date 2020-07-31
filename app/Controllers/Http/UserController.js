'use strict'
const User = use('App/Models/User')
const { validate } = use('Validator')
const Mail = use('Mail')
const PasswordReset = use('App/Models/Resetpassword')
const randomString = require('random-string')
const Cloudinary = use('Cloudinary')


class UserController {

    async signup ({ request, auth, response }) {
		// get user data from signup form
		const userData = request.only(['name', 'username', 'email','number','password']);
		//console.log(userData);
            const rules = {
                name: 'required|string|max:25',
                username: 'required|string|max:15|unique:users,username',
                email: 'required|string|min:10|max:50|unique:users,email',
                number : 'required|string|min:8|max:12',
                password: 'required|string|min:8|max:20'
            }

            const messages = {
                required: 'Es necesario llenar todos los campos',
                'name.alpha':'Nombre no puede contener simbolos',
                'name.max': 'Nombre debe ser menor a 25 caracteres',
                'username.max' : 'Username debe ser menor a 15 caracteres',
                'username.unique' : 'Este nombre de usuario ya está ocupado',
                'email.unique': 'Este correo ya está registrado',
                'email.min':'Correo no puede ser inferior a 10 caracteres',
                'email.max' : 'Correo no puede ser mayor a 50 caracteres',
                'number.max': 'Excedes el numero de caracteres en numero',
                'number.min': 'Escribe tu numero correctamente',
                'password.min' : 'Contraseña debe tener al menos 8 caracteres',
                'password.max' : 'Contraseña no puede ser mayor a 20 caracteres'
              }
              
            const validation = await validate(userData, rules, messages)
            if (validation.fails()){
                const message = validation.messages()
                let error = message[0]
                return response.status(400).json({
                    status: 'wrong',
                    message: error.message
                })
            } else {
                // save user to database
            console.log(4)
             try{
                let user = await new User()
                user.username = userData.username.replace(/ /g, "_")
                user.name = userData.name
                user.email = userData.email
                user.number= userData.number
                user.password = userData.password
                user.avatarpublicid = 0
                await user.save();


                // generate JWT token for user
                console.log("Creating token");
                const token = await auth.generate(user)
                console.log("Success");
                

                return response.json({
                    status: 'success',
                    data: token
                })
}catch(error){console.log(error)}
            }
	}

    async login ({ request, auth, response }) {
        try {
            const data = request.only(['email','password'])

            const rules = {
                email: 'required|string|max:60|min:10',
                password: 'string|required|min:8|max:50',
            }

            const messages = {
                required: 'Porfavor, llena los campos correctamente',
                'email.min':'Correo no puede ser inferior a 10 caracteres',
                'email.max' : 'Correo no puede ser mayor a 60 caracteres',
                'password.min' : 'Contraseña debe tener al menos 8 caracteres',
                'password.max' : 'Contraseña no puede ser mayor a 20 caracteres'
              }


            const validation = await validate(data, rules, messages)

            if(validation.fails()){

                const message = validation.messages()
                let error = message[0]

                return response.status(400).json({
                    status: 'wrong',
                    message: error
                })
            } else {
// validate the user credentials and generate a JWT token
                const token = await auth.attempt(
                    data.email, data.password
                )

                return response.json({
                    status: 'success',
                    data: token
                })

                }
        } catch (error) {
            console.log(error)
            response.status(400).json({
                status: 'error',
                message: 'Contraseña o E-mail incorrecto'
            })
        }
    }

    async resetpasswordbyemail({request, response}){
        const data = request.only(['email'])

        const rules = {
            email: 'required|string|',
        }

        const messages = {
            required: 'Porfavor, llena el campo correctamente',
            string: 'Porfavor, llena el campo correctamente'
          }


          const validation = await validate(data, rules, messages)

          if(validation.fails()){

              const message = validation.messages()
              let error = message[0]

              return response.status(400).json({
                  status: 'wrong',
                  message: error
              })
          } else {
              try{
                const user = await User.findBy('email', data.email)
                await PasswordReset.query().where('email', user.email).delete()


                const { token } = await PasswordReset.create({
                    email: user.email,
                    token: randomString({ length: 40 })
                })

                const mailData = {
                    user: user.toJSON(),
                    token
                }

                await Mail.send('auth.emails.password_reset', mailData, message => {
                    message
                    .to(user.email)
                    .from('noreply@busco.com')
                    .subject('Password reset link')
                })

                return response.json({
                    status: 'sure',
                    message :'Se te han enviado instrucciones para reestablecer tu contraseña'
                })

              }catch(error){
                return response.status(404).json({
                    status : 'wrong',
                    message: 'Usuario no encontrado'
                })
              }
          }


    }


//Metodo "me"
    async me ({ auth, response }) {
        const user = await User.query()
            .where('id', auth.current.user.id)
            .firstOrFail()

            

        return response.json({
            status: 'success',
            data: user
        })

    }
    async updateProfilePic({ request, auth, response }) {
        try{
            const user = auth.current.user
            const userData = request.only(['avatar']);
            
            if(user.avatar !== 'https://res.cloudinary.com/scute/image/upload/v1566358443/recursos/default_hduxaa.png'){
            
            const image = user.avatarpublicid
            await Cloudinary.v2.uploader.destroy(image)

            }
            const avatar = userData['avatar'];
            const resultado = await Cloudinary.v2.uploader.upload(avatar);

            user.avatar = resultado.secure_url
            user.avatarpublicid = resultado.public_id
            await user.save()

            return response.json({
                status: 'success',
                data: user
            })
        }catch(error){
            console.log(error)
            return response.status(404).json({
                status: 'wrong',
                message: 'No puedes actualizar por ahora'
            })
        }
    }

    async ubicacion({auth,request,response}){
        try{
            const location = request.only(['location'])

            const rules = {
                location: 'required|string|max:80',
            }
            const messages ={
                required: 'Necesitar poner los datos correctos',
                string: 'Aqui no puedes poner numeros u otros datos',
                max: 'El numero esperado se excede'
            }

            const validation = await validate(location, rules, messages)
            if(validation.fails()){

                const message = validation.messages()
                let error = message[0]

                return response.status(400).json({
                    status: 'wrong',
                    message: error.message
                })
            } else {
                const me = auth.current.user
                const user = await User.findBy('id', me.id)
                user.location = data.location
                await user.save()
                return response.json({
                    response : 'sure',
                    data : user
                })
            }
        }catch(error){
            consolelog(error)
            return response.status(400).json({
                status: 'wrong',
                message: error.message
            })
        }
    }
    
}

module.exports = UserController

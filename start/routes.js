'use strict'

const { RouteGroup, route } = require('@adonisjs/framework/src/Route/Manager')

/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| Http routes are entry points to your web application. You can create
| routes for different URLs and bind Controller actions to them.
|
| A complete guide on routing is available here.
| http://adonisjs.com/docs/4.1/routing
|
*/

/** @type {typeof import('@adonisjs/framework/src/Route/Manager')} */
const Route = use('Route')

Route.get('/', () => {
  return { greeting: 'Hello world in JSON' }
})

Route.group(() => {
  Route.post('/signup', 'UserController.signup')
  Route.post('/login', 'UserController.login') 
})
.prefix('api/v1')



Route.group(() => {
  Route.get('/me', 'UserController.me')
})
.prefix('api/v2')
.middleware('auth')

Route.group(()=>{
  Route.put('/changeavatar', 'UserController.updateProfilePic')
  Route.put('/changelocation', 'UserController.ubicacion')
  Route.put('/updateprofile', 'UserController.editprofile')
  Route.post('/verify', 'UserController.verifypassword')
  Route.put('/modifyemail', 'UserController.modifyemail')
  Route.put('/modifypassword', 'UserController.modifypassword')
})
.prefix('api/v2/account')
.middleware('auth')

Route.group(()=>{
  Route.post('/newpost', 'PostController.post')
})
.prefix('api/v2/post')
.middleware('auth')

Route.post('/curriculum', 'PostController.curriculum')
'use strict'

const { RouteGroup, route } = require('@adonisjs/framework/src/Route/Manager')

const {Storage} = require('@google-cloud/storage');
const {createWriteStream} = use("fs")
const path = use('path')

const GOOGLE_CLOUD_PROJECT_ID = "busco-285406"
const GOOGLE_CLOUD_KEYFILE= path.join('app/Controllers/Http/busco-285406-038aaa64cff9.json')




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
  Route.get('/onepost/:id', 'ViewpostController.getonepost')
  Route.get('/posts/:type', 'ViewpostController.getallposts')
  Route.post('/find', 'ViewpostController.find')
  Route.get('/curriculums/:page', 'CurriculoController.getcurriculums')
  Route.get('/curriculum/:id', 'CurriculoController.getonecv')
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
  Route.post('/newcv', 'PostController.postcv')
  Route.delete('/deletepost/:id', 'ViewpostController.deletepost')
  Route.post('report/:id', 'ViewpostController.report')
  Route.post('reportcv/:id', 'ViewpostController.reportcv')
  Route.get('/myposts/:page', 'ViewpostController.myposts')
})
.prefix('api/v2/post')
.middleware('auth')

Route.group(()=>{
  Route.get('/getreports/:type', 'PanelController.getreports')
  Route.delete('/deletereport/:id', 'PanelController.deletepost')
  Route.get('/reportante/:id', 'PanelController.viewreportante')
  Route.delete('/deletecvreports/:id', 'PanelController.deletecvpost')
  Route.get('/viewcvreportante/:id', 'PanelController.viewcvreportante')
  Route.delete('/deleteuser/:id', 'PanelController.deleteuser')

})
.prefix('api/v2/panel')
.middleware('auth')


Route.post('/curriculum', async ({response, request }) => {
  // Set the callback to process the 'profile_pic' file manually
  let r = ''
  request.multipart.file('cv', {types: ["pdf"]}, async (file) => {
    const gc = await new Storage({
      projectId: GOOGLE_CLOUD_PROJECT_ID,
      keyFilename: GOOGLE_CLOUD_KEYFILE,
    })

    const bucked = gc.bucket('rootbusco')
    const cloud = bucked.file(file.stream.filename)
    r = file.stream.filename
    await file.stream.pipe(cloud.createWriteStream({
      resumable: false,
      gzip: true,
      metadata: {
        contentType: file.stream.headers['content-type']
      }
    }))
  
})
 
  // Set the callback to process fields manually
  request.multipart.field((name, value) => {
  console.log(name,value); 
  });
 
  // Start the process
  await request.multipart.process();

  return response.json({
    status: 'sure',
    data : `https://storage.googleapis.com/rootbusco/${r}`
  })

})

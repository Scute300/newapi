'use strict'
const User = use('App/Models/User')
const Report = use('App/Models/Report')
const Cvreport = use('App/Models/Cvreport')

class PanelController {

    async getreports({auth,request, response, params}){
        const data = request.only(['page'])
        const user = auth.current.user
        if(user.username == 'RootAdmin'){
            let reports = undefined
            switch(params.type){
                case 'reports':
                    reports = await Report.query()
                    .with('post', builder => {
                        builder.with('user')
                    })
                    .paginate(data.page, 3)
        
                    return response.json({
                        status: 'sure',
                        data : reports
                    })
                break
                case 'curriculums':
                    reports = await Cvreport.query()
                    .with('post', builder => {
                        builder.with('user')
                    })
                    .paginate(data.page, 3)
        
                    return response.json({
                        status: 'sure',
                        data : reports
                    })
                break
            }
        } else {
            return response.status(414).json({
                status : 'wrong',
                data: 'no autorizado'
            })
        }
    }

    async deletepost ({auth, response, params}){
        const user = auth.current.user
        
        if(user.username == 'RootAdmin'){

            const post = await Post.findBy('id', params.id)
            await post.delete()
            
            return response.json({
                status:'sure',
                data: 'Moderado'
            })

        }else {
            return response.status(401).json({
                status: 'unautorized',
                data: 'wrong'
            })
        }
    }

    async viewreportante({auth,params,response}){
        const user = await auth.current.user
        if(user.username == 'RootAdmin'){
            const report = await Report.findBy('id', params.id)
            
            const rjson = await report.toJSON()

            const reportante = await User.findBy('id', rjson.reportante_id)

            return response.json({
                status: 'sure',
                data: reportante
            })
        }else {
            return response.status(401).json({
                status: 'unautorized',
                data: 'wrong'
            })
        }
    
    }

    async deletecvpost ({auth, response, params}){
        const user = auth.current.user
        
        if(user.username == 'RootAdmin'){

            const post = await Cvpost.findBy('id', params.id)
            await post.delete()
            
            return response.json({
                status:'sure',
                data: 'Moderado'
            })

        }else {
            return response.status(401).json({
                status: 'unautorized',
                data: 'wrong'
            })
        }
    }

    async viewcvreportante({auth,params,response}){
        const user = await auth.current.user
        if(user.username == 'RootAdmin'){
            const report = await Cvreport.findBy('id', params.id)
            
            const rjson = await report.toJSON()

            const reportante = await User.findBy('id', rjson.reportante_id)

            return response.json({
                status: 'sure',
                data: reportante
            })
        }else {
            return response.status(401).json({
                status: 'unautorized',
                data: 'wrong'
            })
        }
    
    }

    async deleteuser({auth, params, response}){
        const user = auth.current.user

        if(user.username == 'RootAdmin'){
            const u = await User.findBy('id', params.id)
            await u.delete()


            return response.json({
                status: 'sure',
                data: 'Usuario eliminado'
            })
        }else {
            return response.status(401).json({
                status: 'unautorized',
                data: 'wrong'
            })
        }
    }

}

module.exports = PanelController

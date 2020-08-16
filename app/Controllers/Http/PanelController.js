'use strict'
const User = use('App/Models/User')
const Report = use('App/Models/Report')
const Cvreport = use('App/Models/Cvreport')
const Post = use('App/Models/Post')
const Postimage = use('App/Models/Postimage')
const Cloudinary = use('Cloudinary');

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
                        builder.with('images')
                    })
                    .paginate(data.page, 3)
        
                    return response.json({
                        status: 'sure',
                        data : reports
                    })
                break
                case 'curriculums':
                    reports = await Cvreport.query()
                    .with('curriculo')
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
            
            const images = await Postimage.query()
            .where('post_id', params.id)
            .fetch()

            const pimages = await images.toJSON()
    
            for (let pimage of pimages) {
                await Cloudinary.v2.uploader.destroy(pimage.publicid)
            }

            const delimages = await Postimage
            .query()
            .where('post_id', params.id)
            .delete()
            
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

    async deleteuser({auth, params, response}){
        const user = auth.current.user

        if(user.username == 'RootAdmin'){

            const posts = await Post.query()
            .where('user_id', params.id)
            .with('images')
            .fetch()
            
            const pobjects = await posts.toJSON()

            let images = []


            for (let pobject of pobjects) {
                await pobject.images.concat(images)
            }


            for (let image of images) {
                await Cloudinary.v2.uploader.destroy(image.publicid)
            }

            for (let upobject of pobjects) {
                const deletimages = await Postimage.query()
                .where('post_id', upobject.id)
                .delete()
            }

            const deleteposts = await Post.query()
            .where('user_id', params.id)
            .delete()


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

    async getonecv({params, auth, request, response}){
        const data = request.only('type')
        const user = auth.current.user
        if(user.username == 'RootAdmin'){
            let report = ''
            let reportante = ''
            switch(data.type){
    
                case 'post':
                    report = await Report.query()
                    .where('id', params.id)
                    .with('post', builder => {
                        builder.with('user')
                        builder.with('images')
                    })
                    .first()
                    let reporto = await report.toJSON()

                    reportante = await User.query()
                    .where('id', reporto.reportante_id)
                    .first()

                    let oreportante = reportante.toJSON()

                    let finalresponse = {report : report, reportante : oreportante}

                    return response.json({
                        status: 'sure',
                        data: finalresponse
                    })
                break
                case 'cvreports':
                    report = await Cvreport.query()
                    .where('id', params.id)
                    .with('curriculo')
                    .first()

                    let reportcvo = await report.toJSON()

                    cvreportante = await User.query()
                    .where('id', reportcvo.reportante_id)
                    .first()

                    let ocvreportante = cvreportante.toJSON()

                    let cvfinalresponse = {report : report, reportante : ocvreportante}

                    return response.json({
                        status: 'sure',
                        data: cvfinalresponse
                    })
                break
            }

        }else{
            return response.status(401).json({
                data: 'wrong',
                status: 'no autorizado'
            })
        }
    }

}

module.exports = PanelController

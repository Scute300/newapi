'use strict'
const Curriculo = use('App/Models/Curriculo')
const User = use('App/Models/User')

class CurriculoController {
    async getcurriculums({params, response}){
        const users = await User.query()
        .whereNotNull('cv_id')
        .paginate(params.page, 3)

        return response.json({
            status: 'sure',
            data: users
        })
        
    }

    async getonecv({params, response}){
        const cv = await User.query()
        .where('id', params.id)
        .with('curriculo')
        .fetch()


        return response.json({
            status: 'sure',
            data: cv
        })
    }
}

module.exports = CurriculoController

'use strict'
const Curriculo = use('App/Models/Curriculo')
const User = use('App/Models/User')

class CurriculoController {
    async getcurriculums({params, response}){
        const users = await User.query()
        .whereNotNull('cv_id')
        .paginate(page, 3)

        return response.json({
            status: 'sure',
            data: users
        })
        
    }
}

module.exports = CurriculoController

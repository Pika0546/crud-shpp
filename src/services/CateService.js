const {models} = require('../models');
const Util = require('../util/Utility');

class CateService{
    getAll(){
        return models.category.findAll({raw:true});
    }

    findSlug(cat){
        return models.category.findOne({
            raw: true,
            where:{
                catSlug: cat
            }
        })
    }
}

module.exports = new CateService;
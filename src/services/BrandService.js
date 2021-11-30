const {models} = require('../models');
const Util = require('../util/Utility');

class BrandService{
    getAll(){
        return models.brand.findAll({raw:true});
    }

    findSlug(brand){
        return models.brand.findOne({
            raw: true,
            where:{
                brandSlug: brand
            }
        })
    }
}

module.exports = new BrandService;
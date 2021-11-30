const {models} = require('../models');
const Util = require('../util/Utility');
const { Op } = require("sequelize");
class ProductService{

	list(limit, page, name, brandIDs, catIDs, genderIDs, price){
        if(name){
            return models.product.findAll({
                offset: (page - 1)*limit, 
                limit: limit, 
                raw:true,
            });
        }else{
            const arrPro = [
                models.brand.findAll({
                    attributes: ['brandID']
                }),
                models.category.findAll({
                    attributes: ['catID']
                })
            ]
            return Promise.all(arrPro)
                .then(([brandIDList, catIDList])=>{
                
                    if(brandIDs.length < 1){
                        brandIDs=brandIDList.map(brand=>{
                            return brand.dataValues.brandID
                        })
                    }
                    if(catIDs.length < 1){
                        catIDs=catIDList.map(cat=>{
                            return cat.dataValues.catID
                        })
                    }
                    if(genderIDs.length < 1){
                        genderIDs = [0,1,2];
                    }
                    if(price.length < 1){
                        price[0] = 1;
                        price[1] = 200;
                    }
                    let minPrice = price[0];
                    let maxPrice = price[1];
                    
                    let n = brandIDs.length;
                    for(let i = 0 ; i< n ; i++){
                        brandIDs[i] = parseInt(brandIDs[i])
                    }
                    n = catIDs.length;
                    for(let i = 0 ; i< n ; i++){
                        catIDs[i] = parseInt(catIDs[i])
                    }
                    n = genderIDs.length;
                    for(let i = 0 ; i< n ; i++){
                        genderIDs[i] = parseInt(genderIDs[i])
                    }
                    console.log("jaja");
                    console.log(brandIDs);
                    console.log(catIDs);
                    console.log(genderIDs);
                    console.log(price);
                    return models.product.findAll({
                        offset: (page - 1)*limit, 
                        limit: limit, 
                        raw:true,
                        where:{
                            brandID: brandIDs,
                            catID: catIDs,
                            sex: genderIDs,
                            price:{
                                [Op.gte]:minPrice
                            },
                            price:{
                                [Op.lte]:maxPrice
                            }
                        }
                    });
                })
        }
    }

    getImageLink(id){
        return models.imagelink.findAll(
			{attributes: ['proImage'],
			where: {proID:id}, raw:true})
    }

    getProductTotal(name, brandIDs, catIDs, genderIDs, price){
        if(name){
            return models.product.count();
        }
        else{
            const arrPro = [
                models.brand.findAll({
                    attributes: ['brandID']
                }),
                models.category.findAll({
                    attributes: ['catID']
                })
            ]
            return Promise.all(arrPro)
                .then(([brandIDList, catIDList])=>{
                    if(brandIDs.length < 1){
                        brandIDs=brandIDList.map(brand=>{
                            return brand.dataValues.brandID
                        })
                    }
                    if(catIDs.length < 1){
                        catIDs=catIDList.map(cat=>{
                            return cat.dataValues.catID
                        })
                    }
                    if(genderIDs < 1){
                        genderIDs = [0,1,2];
                    }
                    if(price.length < 1){
                        price[0] = 0;
                        price[1] = 200;
                    }
                    let minPrice = price[0];
                    let maxPrice = price[1];
                    return models.product.count({
                        raw:true,
                        where:{
                            brandID: brandIDs,
                            catID: catIDs,
                            sex: genderIDs,
                            price:{
                                [Op.gte]:minPrice
                            },
                            price:{
                                [Op.lte]:maxPrice
                            }
                        }
                    });
                })
        }
     
    }

    getProductDetail(id){
			return models.detail.findAll({
				raw:true,
				where:{
					proID: id,
				}
			})
    }

    getCateName(id){
        return models.category.findOne({
            raw:true,
            where: {
                catID: id,
            }
        })
    }

    listByGender(limit, page, gender){
            return models.product.findAll({
                offset: (page - 1)*limit, 
                limit: limit, 
                raw:true,
                where:{
                    sex: gender,
                }
            });
        }
    
     getProductTotalGender(gender){
        return models.product.count({
            where: {
                sex: gender
            }
        });
        }
        
    listByBrand(limit, page, brand){
        return models.product.findAll({
            offset: (page - 1)*limit, 
            limit: limit, 
             raw:true,
            where:{
                 brandID: brand,
            }
        });
    }


    getProductTotalBrand(id){
        return models.product.count({
            where: {
                 brandID: id,
            }
        });
        }
    

    getBrandID(name){
        return models.brand.findOne({
            raw:true,
            attributes: ['brandID'],
            where: {
                brandSlug: name,
            }
        })
    }

    getCateID(name){
        return models.category.findOne({
            raw:true,
            attributes: ['CatID'],
            where: {
                catSlug: name,
            }
        })
    }

    listByCate(limit, page, cate){
        return models.product.findAll({
            offset: (page - 1)*limit, 
            limit: limit, 
             raw:true,
            where:{
                 CatID: cate,
            }
        });
    }


    getProductTotalCate(id){
        return models.product.count({
            where: {
                 catID: id,
            }
        });
        }
}

module.exports = new ProductService;
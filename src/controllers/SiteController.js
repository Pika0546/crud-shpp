const BrandService = require("../services/BrandService");
const CateService = require("../services/CateService");


class SiteController{

    //[GET] /
    index(req, res, next){
        const arr = [
            BrandService.getAll(),
            CateService.getAll(),

        ]
        Promise.all(arr)
        .then(([navBrands, navCates])=>{
            res.render('home', {
                navBrands,
                navCates
            });
        })
        // BrandService.getAll()
        // .then(brands=>{
        //     res.render('home', {
        //         brands
        //     });

        // })
    }

    contact(req, res, next){
        const arr = [
            BrandService.getAll(),
            CateService.getAll(),

        ]
        Promise.all(arr)
        .then(([navBrands, navCates])=>{
            res.render('contact', {
                navBrands,
                navCates
            });
        })
    }

}

module.exports = new SiteController;
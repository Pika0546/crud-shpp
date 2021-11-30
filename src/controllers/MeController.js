const BrandService = require("../services/BrandService");
const CateService = require("../services/CateService");

class MeController{
    //[GET] /me/cart
    showCart(req, res, next){
        const arr = [
            BrandService.getAll(),
            CateService.getAll(),

        ]
        Promise.all(arr)
        .then(([navBrands, navCates])=>{
            res.render('me/cart', {
                navBrands,
                navCates
            });
        })
    }

    //[GET] /me/checkout
    checkout(req, res, next){
        const arr = [
            BrandService.getAll(),
            CateService.getAll(),

        ]
        Promise.all(arr)
        .then(([navBrands, navCates])=>{
            res.render('me/checkout', {
                navBrands,
                navCates
            });
        })
    }

    //[GET] /me/profile
    profile(req, res, next){
        const arr = [
            BrandService.getAll(),
            CateService.getAll(),

        ]
        Promise.all(arr)
        .then(([navBrands, navCates])=>{
            res.render('me/profile', {
                navBrands,
                navCates
            });
        })
    }


    //[GET] /me/change-password
    changePassword(req, res, next){
        const arr = [
            BrandService.getAll(),
            CateService.getAll(),

        ]
        Promise.all(arr)
        .then(([navBrands, navCates])=>{
            res.render('me/change-password', {
                navBrands,
                navCates
            });
        })
    }
    //[GET] /me/order
    showOrder(req, res, next){
        const arr = [
            BrandService.getAll(),
            CateService.getAll(),

        ]
        Promise.all(arr)
        .then(([navBrands, navCates])=>{
            res.render('me/order', {
                navBrands,
                navCates
            });
        })
    }

     //[GET] /me/order/:id
     showOrderDetail(req, res, next){
        const arr = [
            BrandService.getAll(),
            CateService.getAll(),

        ]
        Promise.all(arr)
        .then(([navBrands, navCates])=>{
            res.render('me/order-detail', {
                navBrands,
                navCates
            });
        })
    }
}

module.exports = new MeController;
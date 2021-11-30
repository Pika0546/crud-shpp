const BrandService = require("../services/BrandService");
const CateService = require("../services/CateService");

class AccountController{
    //[GET] /register-login
    registerLogin(req, res, next){
        const arr = [
            BrandService.getAll(),
            CateService.getAll(),
        ]
        Promise.all(arr)
        .then(([navBrands, navCates])=>{
            res.render('register-login', {
                navBrands,
                navCates
            });
        })
    }

    //[GET] /forgot-password
    forgotPassword(req, res, next){
        const arr = [
            BrandService.getAll(),
            CateService.getAll(),

        ]
        Promise.all(arr)
        .then(([navBrands, navCates])=>{
            res.render('forgot-password', {
                navBrands,
                navCates
            });
        })
    }

      //[GET] /verification-code
    verificationCode(req, res, next){
        const arr = [
            BrandService.getAll(),
            CateService.getAll(),

        ]
        Promise.all(arr)
        .then(([navBrands, navCates])=>{
            res.render('verification-code', {
                navBrands,
                navCates
            });
        })
    }


     //[GET] /new-password
     newPassword(req, res, next){
        const arr = [
            BrandService.getAll(),
            CateService.getAll(),

        ]
        Promise.all(arr)
        .then(([navBrands, navCates])=>{
            res.render('new-password', {
                navBrands,
                navCates
            });
        })
    }

     //[GET] /register-success
     registerSuccess(req, res, next){
        const arr = [
            BrandService.getAll(),
            CateService.getAll(),

        ]
        Promise.all(arr)
        .then(([navBrands, navCates])=>{
            res.render('register-success', {
                navBrands,
                navCates
            });
        })
    }

}

module.exports = new AccountController;
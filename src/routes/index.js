const accountRouter = require('./account');
const siteRouter = require('./site');
// const productsRouter = require('./products');
const meRouter = require('./me');
const shopRouter = require('./shop');
const BrandService = require('../services/BrandService');
const CateService = require('../services/CateService');

function route(app){
    app.use('/me', meRouter);
    app.use('/shop', shopRouter);
    app.use('/account', accountRouter);
    // app.use('/products', productsRouter);
    app.use('/', siteRouter);
    app.use(function (req, res, next) {
        res.status(404);
        const arr = [
            BrandService.getAll(),
            CateService.getAll(),

        ]
        Promise.all(arr)
        .then(([navBrands, navCates])=>{
            res.render('404', {
                navBrands,
                navCates
            });
        })
    });
}

module.exports = route;

const ProductService = require('../services/ProductService');
const CateService = require('../services/CateService');
const util = require('../util/Utility');
const product = require('../models/product');
const category = require('../models/category');
const { getDataSlug } = require('../util/Utility');
const BrandService = require('../services/BrandService');


let maximumPagination=5;
let currentPage=1;
let nextPage=1;
let prevPage=1;
let totalPage=1;
const itemPerPage=9;

class ShopController{

    shop(req, res, next){
        //Dùng query lấy page

        const pageNumber=req.query.page;
		const genderIDs = (req.query.genders) ? req.query.genders : [];
		const brandIDs = (req.query.brands) ? req.query.brands : [];
		const catIDs = (req.query.categories) ? req.query.categories : [];
		const priceStr = req.query.price;
		let price;
		if(priceStr){
			price = priceStr.split(",");
			const n = price.length;
			if(n > 0){
				for(let i = 0 ; i < n ; i++){
					price[i] = parseInt(price[i]);
				}
			}
		}else{
			price = [];
		}
        currentPage =(pageNumber && !Number.isNaN(pageNumber)) ? parseInt(pageNumber) : 1;
        currentPage = (currentPage > 0) ? currentPage : 1;
        currentPage = (currentPage <= totalPage) ? currentPage : totalPage;
		currentPage = (currentPage < 1) ? 1: currentPage;
        const productPromises=[
            ProductService.list(itemPerPage,currentPage, null, brandIDs, catIDs, genderIDs, price),
            ProductService.getProductTotal(null, brandIDs, catIDs, genderIDs, price),
        ]

        //đợi promises
        Promise.all(productPromises)
        .then(result=>{
            let products=result[0];
            const totalProduct=result[1];
			console.log(products);
            //Lấy max số trang
            totalPage=Math.ceil(totalProduct/itemPerPage);

            let paginationArray = [];

            let pageDisplace = Math.min(totalPage - currentPage + 2, maximumPagination);
            if(currentPage === 1){
                pageDisplace -= 1;
            }
            for(let i = 0 ; i < pageDisplace; i++){
                if(currentPage === 1){
                    paginationArray.push({
                        page: currentPage + i,
                        isCurrent:  (currentPage + i)===currentPage
                    });
                }
                else{
                    paginationArray.push({
                        page: currentPage + i - 1,
                        isCurrent:  (currentPage + i - 1)===currentPage
                    });
                }
            }
            if(pageDisplace < 2){
                paginationArray=[];
            }

            //Lấy được product
            //Giờ lấy detail của cái product đó

            const productLength=products.length;
            let detailPromises=[];
           // console.log(products);
            for (let i=0;i<productLength;i++){
                detailPromises.push(ProductService.getImageLink(products[i].proID));
                detailPromises.push(ProductService.getProductDetail(products[i].proID));
                detailPromises.push(ProductService.getCateName(products[i].catID))
            }
            
            //Chuẩn bị render
            Promise.all(detailPromises)
            .then(result=>{
            
				for (let i=0;i<productLength;i++){
					products[i].image=result[i*3][0].proImage;
					products[i].detail=result[i*3+1];
					products[i].cate=result[i*3+2].catName;
				}
				const arr = [
					BrandService.getAll(),
					CateService.getAll(),
				]

				const brandQuery=brandIDs.map(id=>{
					return{
						brandID: id,
					}
				})
				const catQuery=catIDs.map(id=>{
					return{
						catID: id,
					}
				})
				const genderQuery=genderIDs.map(id=>{
					return{
						genderID: id,
					}
				})

				const priceQuery = price.join(",");
				let startNumber = (currentPage - 1)*itemPerPage + 1;
                let endNumber = startNumber+products.length - 1;
				if(endNumber === 0){
					startNumber = 0;
				}
				Promise.all(arr)
				.then(([navBrands, navCates])=>{
					res.render("shop/shop",{
						brandIDs,
						catIDs,
						genderIDs,
						total: totalProduct,
                        startNumber,
                        endNumber,
						navCates,
						navBrands,
						products,
						currentPage,
						genderQuery,
						brandQuery,
						catQuery,
						priceQuery,
						totalPage,
						paginationArray,
						prevPage: (currentPage > 1) ? currentPage - 1 : 1,
						nextPage: (currentPage < totalPage) ? currentPage + 1 : totalPage
					})
				})
            })
            .catch(err=>{
                console.log(err);
                next();
            })
        })
        .catch(err=>{
            console.log(err);
            next();
        })
    }

    //Xem chi tiết sản phẩm
     //[GET] /:brand/:gender/:category/:id
    fullview(req, res, next){
        res.render("shop/fullview");
    }


    shopByCategory(req, res, next){
        const brand = req.params.brand;
        const gender = req.params.gender;
        const category = req.params.category;
		BrandService.findSlug(brand)
		.then(result=>{
			if(!result && brand !== 'all'){
				next();
			}else{
				if(gender !== "women" &&
					gender !== "men"&&
					gender !== "unisex" &&
					gender !== "all"){
					next();
				}else {
					CateService.findSlug(category)
					.then(result=>{
						if(!result && category !== "all"){
							next();
						}
						else{
							let brandUI = "";
							let genderUI = "";
							let categoryUI = "";
							
							if(category === "all"){
								if(gender === "all"){
									if(brand === "all"){
										res.redirect("/shop");
									}else{
										res.redirect("/shop/" + brand);
									}
								}
								else{
										res.redirect("/shop/" + brand + "/" + gender);
								}
							}
							else{
								if(brand === "all"){
									brandUI = null;
								}else{
									brandUI = util.getUIBrandName(brand);
								}
		
								if(gender === "all"){
									genderUI = null;
								}else{
									genderUI = util.getUIgender(gender);
								}
								categoryUI = util.getUICategory(category);
		
								shopbycate(req,res,next,brand,gender,category);
		
							}
						}
					})
					.catch(err=>{
						console.log(err);
						next()
					})
				}
			}
		})
		.catch(err=>{
			console.log(err);
			next()
		})
    }


    //[GET] /:brand/:gender
    shopByGender(req, res, next){
        const brand = req.params.brand;
        const gender = req.params.gender;
		BrandService.findSlug(brand)
		.then(result=>{
			if(!result && brand!=="all"){
				next()

			}else{
				if(gender !== "women" &&
					gender !== "men"&&
					gender !== "unisex" &&
					gender !== "all"){
				next();
			}else{
					if(brand === 'all'){
						if(gender === 'all'){
							res.redirect("/shop");
						}
						else{
							shopbysex(req,res,next,gender,brand); 
						}
					}
					else{
						if(gender === 'all'){
							res.redirect("/shop/" + brand);
						}
						else{
							const arr = [
								BrandService.getAll(),
								CateService.getAll(),
							]
							Promise.all(arr)
							.then(([navBrands, navCates])=>{
								res.render("shop/" + gender,{
									navCates,
									navBrands,
									brand : util.getUIBrandName(brand),
									gender : util.getUIgender(gender),
									link: "/shop/" +brand + "/" +gender
								})
							})
						}
					}
				}
			}
		})
		.catch(err=>{
			console.log(err);
			next()
		})
    }

    //Hàm này render ra tất cả sản phẩm của một :brand
    //[GET] /:brand
    shopByBrand(req, res, next){
        const brand = req.params.brand;
		BrandService.findSlug(brand)
		.then(result=>{
			if(!result && brand!=="all"){
				next()

			}else{
				if(brand === "all"){
					res.redirect("/shop");
				}
				shopbybrand(req,res,next,brand);
			}
		})
		.catch(err=>{
			console.log(err);
			next()
		})
    }
}

function shopbycate(req,res,next,brand,gender,category) {
	//Dùng query lấy page
	const pageNumber=req.query.page;
	let name=null;
	const genderIDs = (req.query.genders) ? req.query.genders : [];
	const brandIDs = (req.query.brands) ? req.query.brands : [];
	const priceStr = req.query.price;
	let price;
	if(priceStr){
		price = priceStr.split(",");
		const n = price.length;
		if(n > 0){
			for(let i = 0 ; i < n ; i++){
				price[i] = parseInt(price[i]);
			}
		}
	}else{
		price = [];
	}
	currentPage =(pageNumber && !Number.isNaN(pageNumber)) ? parseInt(pageNumber) : 1;
	currentPage = (currentPage > 0) ? currentPage : 1;
	currentPage = (currentPage <= totalPage) ? currentPage : totalPage;
	currentPage = (currentPage < 1) ? 1: currentPage;

	let cateID=0;

	const catePormises=[
		ProductService.getCateID(category),
	]

	Promise.all(catePormises)
	.then(resultID=>{
		cateID=resultID[0].CatID;

	const productPromises=[
		ProductService.list(itemPerPage,currentPage, null, brandIDs, [cateID], genderIDs, price),
		ProductService.getProductTotal(null, brandIDs, [cateID], genderIDs, price),
	]

	//đợi promises
	Promise.all(productPromises)
	.then(result=>{
		let products=result[0];
		const totalProduct=result[1];

		
	  
		//Lấy max số trang
		totalPage=Math.ceil(totalProduct/itemPerPage);

		let paginationArray = [];

		let pageDisplace = Math.min(totalPage - currentPage + 2, maximumPagination);
		if(currentPage === 1){
			pageDisplace -= 1;
		}
		for(let i = 0 ; i < pageDisplace; i++){
			if(currentPage === 1){
				paginationArray.push({
					page: currentPage + i,
					isCurrent:  (currentPage + i)===currentPage
				});
			}
			else{
				paginationArray.push({
					page: currentPage + i - 1,
					isCurrent:  (currentPage + i - 1)===currentPage
				});
			}
		}
		if(pageDisplace < 2){
			paginationArray=[];
		}


		//Lấy được product
		//Giờ lấy detail của cái product đó

		const productLength=products.length;
		let detailPromises=[];
		
		for (let i=0;i<productLength;i++){
			detailPromises.push(ProductService.getImageLink(products[i].proID));
			detailPromises.push(ProductService.getProductDetail(products[i].proID));
			detailPromises.push(ProductService.getCateName(products[i].catID));
		}
		
		//Chuẩn bị render
		Promise.all(detailPromises)
		.then(result=>{
		
				for (let i=0;i<productLength;i++){
					products[i].image=result[i*3][0].proImage;
					products[i].detail=result[i*3+1];
					products[i].cate=result[i*3+2].catName;
				}
				const arr = [
					BrandService.getAll(),
					CateService.getAll(),
		
				]
				const brandQuery=brandIDs.map(id=>{
					return{
						brandID: id,
					}
				})
				const genderQuery=genderIDs.map(id=>{
					return{
						genderID: id,
					}
				})

				const priceQuery = price.join(",");
				let startNumber = (currentPage - 1)*itemPerPage + 1;
                let endNumber = startNumber+products.length - 1;
				if(endNumber === 0){
					startNumber = 0;
				}
				Promise.all(arr)
				.then(([navBrands, navCates])=>{
					res.render("shop/category",{
						brandIDs,
						genderIDs,
						brandQuery,
						genderQuery,
						priceQuery,
						startNumber,
						endNumber,
						totalProduct,
						navCates,
						navBrands,
						products,
						currentPage,
						totalPage,
						paginationArray,
						prevPage: (currentPage > 1) ? currentPage - 1 : 1,
						nextPage: (currentPage < totalPage) ? currentPage + 1 : totalPage,
						brand: getDataSlug(brand),
						gender: getDataSlug(gender),
						category: getDataSlug(category),
						link: "/shop/" +brand + "/" +gender + "/" + category
					})
				})
				// res.render("shop/category",{
				// 	products,
				// 	currentPage,
				// 	totalPage,
				// 	paginationArray,
				// 	prevPage: (currentPage > 1) ? currentPage - 1 : 1,
				// 	nextPage: (currentPage < totalPage) ? currentPage + 1 : totalPage,
				// 	brand: getDataSlug(brand),
				// 	gender: getDataSlug(gender),
				// 	category: getDataSlug(category),
				// 	link: "/shop/" +brand + "/" +gender + "/" + category
				// })
				    
		})
		.catch(err=>{
			console.log(err);
			next();
		})


	})
	.catch(err=>{
		console.log(err);
		next();
	})
	})
	.catch(err=>{
		console.log(err);
		next();
	})


	
}

function shopbybrand(req,res,next,brand) {
	//Dùng query lấy page
	const pageNumber=req.query.page;
	let name=null;
	const genderIDs = (req.query.genders) ? req.query.genders : [];
	const catIDs = (req.query.categories) ? req.query.categories : [];
	const priceStr = req.query.price;
	currentPage =(pageNumber && !Number.isNaN(pageNumber)) ? parseInt(pageNumber) : 1;
	currentPage = (currentPage > 0) ? currentPage : 1;
	currentPage = (currentPage <= totalPage) ? currentPage : totalPage;
	currentPage = (currentPage < 1) ? 1: currentPage;
	let brandID=0;
	const brandPormises=[
		ProductService.getBrandID(brand),
	]
	let price;
	if(priceStr){
		price = priceStr.split(",");
		const n = price.length;
		if(n > 0){
			for(let i = 0 ; i < n ; i++){
				price[i] = parseInt(price[i]);
			}
		}
	}else{
		price = [];
	}
	Promise.all(brandPormises)
	.then(resultID=>{
		brandID=resultID[0].brandID;
		const productPromises=[
			// ProductService.listByBrand(itemPerPage,currentPage,brandID),
			// ProductService.getProductTotalBrand(brandID),
			ProductService.list(itemPerPage,currentPage, null, [brandID], catIDs, genderIDs, price),
            ProductService.getProductTotal(null, [brandID], catIDs, genderIDs, price),
		]
		//đợi promises
		Promise.all(productPromises)
		.then(result=>{
			let products=result[0];
			const totalProduct=result[1];

			//Lấy max số trang
			totalPage=Math.ceil(totalProduct/itemPerPage);

			let paginationArray = [];

			let pageDisplace = Math.min(totalPage - currentPage + 2, maximumPagination);
			if(currentPage === 1){
				pageDisplace -= 1;
			}
			for(let i = 0 ; i < pageDisplace; i++){
				if(currentPage === 1){
					paginationArray.push({
						page: currentPage + i,
						isCurrent:  (currentPage + i)===currentPage
					});
				}
				else{
					paginationArray.push({
						page: currentPage + i - 1,
						isCurrent:  (currentPage + i - 1)===currentPage
					});
				}
			}
			if(pageDisplace < 2){
				paginationArray=[];
			}

			const productLength=products.length;
			let detailPromises=[];

			for (let i=0;i<productLength;i++){
				detailPromises.push(ProductService.getImageLink(products[i].proID));
				detailPromises.push(ProductService.getProductDetail(products[i].proID));
				detailPromises.push(ProductService.getCateName(products[i].catID));
			}

			//Chuẩn bị render
			Promise.all(detailPromises)
			.then(result=>{
				for (let i=0;i<productLength;i++){
					products[i].image=result[i*3][0].proImage;
					products[i].detail=result[i*3+1];
					products[i].cate=result[i*3+2].catName;
				}
				const arr = [
					BrandService.getAll(),
					CateService.getAll(),
				]
				const catQuery=catIDs.map(id=>{
					return{
						catID: id,
					}
				})
				const genderQuery=genderIDs.map(id=>{
					return{
						genderID: id,
					}
				})

				const priceQuery = price.join(",");
				let startNumber = (currentPage - 1)*itemPerPage + 1;
                let endNumber = startNumber+products.length - 1;
				if(endNumber === 0){
					startNumber = 0;
				}
				Promise.all(arr)
				.then(([navBrands, navCates])=>{
					res.render('shop/brand',{
						catIDs,
						genderIDs,
						navCates,
						startNumber,
						endNumber,
						catQuery,
						total: totalProduct,
						navBrands,
						genderQuery,
						priceQuery,
						products,
						currentPage,
						totalPage,
						paginationArray,
						prevPage: (currentPage > 1) ? currentPage - 1 : 1,
						nextPage: (currentPage < totalPage) ? currentPage + 1 : totalPage,
						brand : util.getDataSlug(brand),
						brandUI: util.getUIBrandName(brand),
						link: "/shop/" + brand
					})
				})

			})
			.catch(err=>{
				console.log(err);
				next();
			})

		})
		.catch(err=>{
			console.log(err);
			next();
		})
	})
	.catch(err=>{
		console.log(err);
		next();
	})


	
}

function shopbysex(req,res,next,gender,brand) {
	//Dùng query lấy page
	const pageNumber=req.query.page;
	let name=null;
	
	let sex=2;
	if (gender==="women")
		sex=1;
	if (gender==="men")
		sex=0;

	currentPage =(pageNumber && !Number.isNaN(pageNumber)) ? parseInt(pageNumber) : 1;
	currentPage = (currentPage > 0) ? currentPage : 1;
	currentPage = (currentPage <= totalPage) ? currentPage : totalPage;
	currentPage = (currentPage < 1) ? 1 : currentPage;
	const brandIDs = (req.query.brands) ? req.query.brands : [];
	const catIDs = (req.query.categories) ? req.query.categories : [];
	const priceStr = req.query.price;
	let price;
	if(priceStr){
		price = priceStr.split(",");
		const n = price.length;
		if(n > 0){
			for(let i = 0 ; i < n ; i++){
				price[i] = parseInt(price[i]);
			}
		}
	}else{
		price = [];
	}
	const productPromises=[
		ProductService.list(itemPerPage,currentPage, null, brandIDs, catIDs, [sex], price),
		ProductService.getProductTotal(null, brandIDs, catIDs, [sex], price),
	]


	//đợi promises
	Promise.all(productPromises)
	.then(result=>{
		let products=result[0];
		const totalProduct=result[1];
		//Lấy max số trang
		totalPage=Math.ceil(totalProduct/itemPerPage);

		let paginationArray = [];

		let pageDisplace = Math.min(totalPage - currentPage + 2, maximumPagination);
		if(currentPage === 1){
			pageDisplace -= 1;
		}
		for(let i = 0 ; i < pageDisplace; i++){
			if(currentPage === 1){
				paginationArray.push({
					page: currentPage + i,
					isCurrent:  (currentPage + i)===currentPage
				});
			}
			else{
				paginationArray.push({
					page: currentPage + i - 1,
					isCurrent:  (currentPage + i - 1)===currentPage
				});
			}
		}
		if(pageDisplace < 2){
			paginationArray=[];
		}


		//Lấy được product
		//Giờ lấy detail của cái product đó

		const productLength=products.length;
		let detailPromises=[];

		
		for (let i=0;i<productLength;i++){
			detailPromises.push(ProductService.getImageLink(products[i].proID));
			detailPromises.push(ProductService.getProductDetail(products[i].proID));
			detailPromises.push(ProductService.getCateName(products[i].catID))
		}

		//Chuẩn bị render
		Promise.all(detailPromises)
		.then(result=>{
		
				for (let i=0;i<productLength;i++){
					products[i].image=result[i*3][0].proImage;
					products[i].detail=result[i*3+1];
					products[i].cate=result[i*3+2].catName;
				}
				const arr = [
					BrandService.getAll(),
					CateService.getAll(),
				]

				const catQuery=catIDs.map(id=>{
					return{
						catID: id,
					}
				})
				const brandQuery=brandIDs.map(id=>{
					return{
						brandID: id,
					}
				})

				const priceQuery = price.join(",");
				let startNumber = (currentPage - 1)*itemPerPage + 1;
                let endNumber = startNumber+products.length - 1;
				if(endNumber === 0){
					startNumber = 0;
				}
				Promise.all(arr)
				.then(([navBrands, navCates])=>{
					res.render('shop/gender',{
						brandIDs,
						catIDs,
						brandQuery,
						catQuery,
						startNumber,
						endNumber,
						totalProduct,
						navCates,
						navBrands,
						products,
						currentPage,
						totalPage,
						paginationArray,
						prevPage: (currentPage > 1) ? currentPage - 1 : 1,
						nextPage: (currentPage < totalPage) ? currentPage + 1 : totalPage,
						brand : util.getUIBrandName(brand),
						brandSlug: brand,
						genderSlug: gender,
						gender : util.getUIgender(gender),
						link: "/shop/" +brand + "/" +gender
					})
				})
		})
		.catch(err=>{
			console.log(err);
			next();
		})


	})
	.catch(err=>{
		console.log(err);
		next();
	})
}


module.exports = new ShopController;
class Utility{
    capitalizeFirstLetter(string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }
    
    getUIBrandName(brand){
        const tokens= brand.split('-').map(str => {
            return this.capitalizeFirstLetter(str);
        });
        const result = tokens.join(" ");
        return result;
    }
    
    getDataSlug(data){
        let str = data.toLowerCase();
        let tokens = str.split(" ");
        return tokens.join("-");
    }


    getUIgender(gender){
        return this.capitalizeFirstLetter(gender);
    }

    getUICategory(category){
        return this.capitalizeFirstLetter(category);
    }
}

module.exports = new Utility;
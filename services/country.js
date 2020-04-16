const getCountryList = (callback) => {
    const fs = require("fs");
    const path = require("path");
    try {
        const obj = JSON.parse(fs.readFileSync(path.join("helpers","listcountry.json"), "utf8"));
        callback (null, obj)
    } catch (error) {
        callback(error, null)
    }
}

module.exports = [
    {
        name: "services.country.getCountryList",
        method: getCountryList
    }
]

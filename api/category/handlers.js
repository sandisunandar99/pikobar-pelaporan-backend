const replyHelper = require('../helpers')

module.exports = (server) => {
    function constructCategoryResponse(category) {
        let jsonCategory = {
            status: 200,
            message: "Success",
            data: category
        }
        return jsonCategory
    }

    return {
        /**
         * GET /api/category
         * @param {*} request
         * @param {*} reply
         */
        async getListCategory(request,reply){
            server.methods.services.category.listCategory(
                request.query,
                (err, result) => {
                    if (err) return reply(replyHelper.constructErrorResponse(err)).code(422)
                    return reply(
                        constructCategoryResponse(result)
                    ).code(200)
                }
            )
        }
    }
}
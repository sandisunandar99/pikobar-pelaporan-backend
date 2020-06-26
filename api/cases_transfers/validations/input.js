const Joi = require('joi')
const { validateOptions, HeadersPayLoad } = require('../../validations')
const _ = require('lodash')

const CaseTransferPayload = Joi.object().keys({
    transfer_to_unit_id: Joi.string().required(),
    transfer_to_unit_name: Joi.string().required(),
    transfer_comment: Joi.string().allow('', null).optional().default(null),
})

const CaseTransferActionPayload = Joi.object().keys({
    transfer_comment: Joi.string().allow('', null).optional().default(null),
})

const CaseParamsValidations = {
    params: {
        id: Joi.string().required()
    }
}

const TransferActionParamsValidations = {
    params: {
        id: Joi.string().required(),
        transferId: Joi.string().required(),
        action: Joi.string().valid('approve','decline','abort').required(),
    }
}

const TransferCaseListParamValidations = {
    params: {
        type: Joi.string().valid('in','out').required(),
    },
    options: validateOptions.options,
    failAction: validateOptions.failAction
}

const CaseTransferPayloadValidations = Object.assign({
    payload: CaseTransferPayload,
    headers: HeadersPayLoad,
    options: validateOptions.options,
    failAction: validateOptions.failAction
}, CaseParamsValidations)

const CaseTransferActPayloadValidations = Object.assign({
    payload: CaseTransferActionPayload,
    headers: HeadersPayLoad,
    options: validateOptions.options,
    failAction: validateOptions.failAction
}, TransferActionParamsValidations)

module.exports = {
    CaseTransferPayloadValidations,
    CaseTransferActPayloadValidations,
    TransferCaseListParamValidations,
}

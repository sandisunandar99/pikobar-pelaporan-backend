const {
    _toString, _toDateString, _toUnsignedInt, getStringValueByIndex, getTransformedAge, trueOrFalse, findReference, getArrayValues,
  yesNoUnknown,
} = require('../../../helpers/cases/sheet/helper')


const conf = require('./config.json')
const getters = {}

getters.getNum = (data) => {
  return _toString(data[conf.cell.num])
}


module.exports = getters
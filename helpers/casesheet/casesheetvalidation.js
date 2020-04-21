const validate = async (payload, Joi, rules, label, helper, Case) => {
    let results = []
    let objError = {}
    let strErrors = ''

    for (let i in payload) {
      let propErr = {}
      let errors = []

      const result = Joi.validate(payload[i], rules.caseSchemaValidation)
    
      if (result.error!==null) {
        strErrors += '[row_' + (parseInt(i)+1).toString() + ']'
        for (e in result.error.details) {
            let messg = result.error.details[e].message
            let prop = messg.substr(1, messg.lastIndexOf('"')-1)

            // transform label
            if (messg.replace && label[prop]) {
                messg = messg.replace(prop, label[prop])
                prop = label[prop]
            }

            if (!Array.isArray(propErr[prop])) {
                propErr[prop] = []
            }

            if (propErr[prop].includes) {
                if (propErr[prop].includes(messg)) {
                    continue
                }
            }

            strErrors += messg + ', '
            propErr[prop].push(messg)
        }   
      }

      // is address_district_code exist?
      const code = payload[i].address_district_code
      const isDistrictCodeValid = await helper.isDistrictCodeValid(code)
      
      if (!isDistrictCodeValid) {
        let prop = 'address_district_code'
            prop = label[prop]
        let messg = `\"${prop}"\ Invalid/Not found`

        if (!Array.isArray(propErr[prop])) {
            propErr[prop] = []
        }
        propErr[prop].push(messg)
        strErrors += messg
      }

      const nik = payload[i].nik
      const isCaseExist = await Case.find({nik: nik}).countDocuments()

      if (isCaseExist) {
        let prop = 'nik'
        prop = label[prop]
        let messg = `\"${prop}"\ Already exists`

        if (!Array.isArray(propErr[prop])) {
            propErr[prop] = []
        }
        propErr[prop].push(messg)
        strErrors += messg
      }

      strErrors += '\n'
      if (Object.keys(propErr).length !== 0) {
        errors.push(propErr)
      }

      if (errors.length) {
        objError[(parseInt(i)+9).toString()] = errors
      }
    }

    // transform error response
    for (i in objError) {
      let rowDetail = {}
      let rowErrors = []
      let err = objError[i] || []

      for (j in err) {
        let errs = err[j] || {}
        
        for (k in errs) {
          let desc = ''
          let  transform = {}
          if (errs[k].join) {
            desc = errs[k].join(',')
          }
          transform.columnName = k
          transform.description = desc
          rowErrors.push(transform)
        }

      }
      
      rowDetail.rowNumber = i
      rowDetail.data = rowErrors
      results.push(rowDetail)
    }

    return results
}

module.exports = {
    validate,
}
const Case = require('../models/Case')
const custom = require('../helpers/custom')
const History = require('../models/History')
const paginate = require('../helpers/paginate')
const { CRITERIA } = require('../helpers/constant')
const CloseContact = require('../models/CloseContact')
const DistrictCity = require('../models/DistrictCity')
const filters = require('../helpers/filter/closecontactfilter')
const Validate = require('../helpers/cases/revamp/handlerpost')
const {
  transformInspectionSupport,
  transformTravelingHis,
  transformClosecontact,
} = require('../helpers/closecontact/transformer')

async function index (query, authorized, callback) {
  try {
    const sorts = (query.sort == "desc" ? { createdAt: "desc" } : custom.jsonParse(query.sort))
    const options = paginate.optionsLabel(query, sorts, ['case', 'createdBy'])
    const params = filters.filterCloseContact(query, authorized)
    const search_params = filters.filterSearch(query)
    const result = CloseContact.find(params).or(search_params).where('delete_status').ne('deleted')
    const paginateResult = await CloseContact.paginate(result, options)
    const response = {
      itemsList: paginateResult.itemsList.map(res => res.toJSONList()),
      _meta: paginateResult._meta
    }
    return callback(null, response)
  } catch (e) {
    return callback(e, null)
  }
}

async function getByCase (caseId, callback) {
  try {
    const results = await CloseContact.find({
      case: caseId,
      delete_status: { $ne: 'deleted' }
    }).populate(['case', 'createdBy'])

    return callback(null, results.map(res => res.toJSONList()))
  } catch (e) {
    return callback(e, null)
  }
}

async function show (id, callback) {
  try {
    let result = await CloseContact
      .findById(id)
      .where('delete_status').ne('deleted')
      .populate(['case', 'latest_history'])

    result = result ? result.toJSONFor() : null
    return callback(null, result)
  } catch (e) {
    return callback(e, null)
  }
}

async function create (caseId, authorized, raw_payload, callback) {
  try {
    const { latest_history, ...payload } = raw_payload
    let result = new CloseContact(Object.assign(payload, {
      case: caseId,
      createdBy: authorized,
      is_reported: true
    }))

    result = await result.save()
    return callback(null, result)
  } catch (e) {
    return callback(e, null)
  }
}

async function update (id, authorized, raw_payload, callback) {
  try {
    const { latest_history, ...payload } = raw_payload
    const result = await CloseContact.findByIdAndUpdate(id,
      { $set: { ...payload, updatedBy: authorized } },
      { new: true })

    return callback(null, result)
  } catch (e) {
    return callback(e, null)
  }
}

async function softDelete (id, authorized, callback) {
  try {
    const payload = custom.deletedSave({}, authorized)
    const result = await CloseContact.findByIdAndUpdate(id, payload)
    return callback(null, result)
  } catch (e) {
    return callback(e, null)
  }
}

// temporary func, delete after migrate
const syncCase = async (services, callback) => {
  const result = await CloseContact.find({
    delete_status: { $ne: "deleted" },
    is_migrated: { $ne: true }
  }).populate(['case', 'latest_history', 'createdBy'])

  let processed = 0, succeed = 0;
  const total = result.length

  for (let i = 0; i < total; i++) {
    const res = result[i]

    processed++;

    try {
      let foundedCase = null
      if (res.nik) {
        foundedCase = await Case.findOne({
          nik: res.nik
        })
      }

      if (!res.address_district_code || !res.case || !res.createdBy) {
        await CloseContact.updateOne(
          { _id: res._id },
          { $set: {
              migration_note: "INVALID_DISTRICT_CODE||CASE_N_CREATOR_NOT_FOUND"
            }
          }
        )
      }

      if (foundedCase) {
        await CloseContact.updateOne(
          { _id: res._id },
          { $set: {
              is_case_exists: true,
            }
          }
        )
      }

      if (foundedCase || !res.address_district_code || !res.case || !res.createdBy) {
        printProgress( ((processed / total) * 100), ((succeed / total) * 100) )
        continue
      }

      const pre = {
        count_case: {},
        count_case_pending: {},
        case_count_outside_west_java: {},
      }

      await services.cases.getCountByDistrict(
        res.address_district_code,
        (err, res) => {
          if (err) throw new Error
          pre.count_case = res
        })

      // prepare mapping
      const lastHis = res.latest_history || {}

      // transform inspection support
      const inspects = transformInspectionSupport(lastHis)

      // transoform to traveling history
      const travels = transformTravelingHis(res)

      const mappedToCasePayload = {
        verified_status: 'verified',
        interviewers_name: res.interviewer_name,
        interview_date: res.contact_tracing_date,
        is_nik_exists: res.is_nik_exists,
        nik: res.nik,
        name: res.name,
        is_phone_number_exists: res.is_phone_number_exists,
        phone_number: res.phone_number,
        nationality: 'WNI',
        gender: res.gender,
        birth_date: res.birth_date,
        age: res.age,
        month: res.month,
        address_district_code: res.address_district_code,
        address_district_name: res.address_district_name,
        address_subdistrict_code: res.address_subdistrict_code,
        address_subdistrict_name: res.address_subdistrict_name,
        address_village_code: res.address_village_code,
        address_village_name: res.address_village_name,
        rt: parseInt(res.address_rw) || null,
        rw: parseInt(res.address_rt) || null,
        occupation: res.travel_occupation,
        office_address: res.travel_address_office,
        first_symptom_date: lastHis.symptoms_date,
        diagnosis: lastHis.symptoms,
        diagnosis_other: lastHis.symptoms_other,
        inspection_support: inspects,
        travelling_history_before_sick_14_days: !!travels.length,
        travelling_history: travels,
        final_result: '5',
        current_location_type: 'RUMAH',
        current_location_address: res.address_street,
        current_location_village_code: res.address_village_code,
        current_location_subdistrict_code: res.address_subdistrict_code,
        current_location_district_code: res.address_district_code,
        status: CRITERIA.CLOSE,
        input_source: 'sync-from-closecontact',
        is_reported: res.is_reported,
        origin_closecontact: true,
        author: res.createdBy,
        relation: res.relationship,
        relation_other: res.relationship_other,
        activity: res.activity,
        activity_others: res.activity_other,
        first_contact_date: res.start_contact_date,
        last_contact_date: res.end_contact_date,
        status_identity: 1,
        status_clinical: 1,
        status_inspection_support: inspects.length ? 1: 0,
        status_travel_import: travels.length ? 1 : 0,
        status_travel_local: 0,
        status_travel_public: 0,
        status_transmission: 0,
        status_exposurecontact: 0,
        status_closecontact: 0,
        createdAt: res.createdAt,
        updatedAt: res.createdAt,
      }

      const preCreate = { cases: res.case }
      let insertedCase = null
      await services.cases.closecontact.create(
        services, preCreate, Object.assign(res.createdBy, { role: 'dinkeskota' }), [ mappedToCasePayload ],
        (err, result) => {
          // console.log("ERR A:", err)
          if (err) throw new Error
          insertedCase = result
        })

      // update flag is_migrated true
      // console.log("inserted", insertedCase)
      await CloseContact.updateOne(
        { _id: res._id },
        { $set: {
            is_migrated: true,
            caseCreated: insertedCase._id
          }
        }
      )
      succeed++;
      printProgress( ((processed / total) * 100), ((succeed / total) * 100) )
      // console.log("migrated")
    } catch (e) {
      console.log("ERR", e)
      callback(e, null)
    }
  }

  callback(null, true)
}

const printProgress = (progress, succeed) => {
  process.stdout.clearLine()
  process.stdout.cursorTo(0)
  process.stdout.write(`Progress: ${progress} % || succeed: ${succeed} %`)
}

module.exports = [
  {
    name: 'services.closeContacts.index',
    method: index
  },
  {
    name: 'services.closeContacts.getByCase',
    method: getByCase
  },
  {
    name: 'services.closeContacts.show',
    method: show
  },
  {
    name: 'services.closeContacts.create',
    method: create
  },
  {
    name: 'services.closeContacts.update',
    method: update
  } ,
  {
    name: 'services.closeContacts.delete',
    method: softDelete
  },
  {
    name: 'services.closeContacts.syncCase',
    method: syncCase
  },
]

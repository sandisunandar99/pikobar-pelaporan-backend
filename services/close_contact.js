const Case = require('../models/Case')
const custom = require('../helpers/custom')
const History = require('../models/History')
const paginate = require('../helpers/paginate')
const { CRITERIA } = require('../helpers/constant')
const CloseContact = require('../models/CloseContact')
const DistrictCity = require('../models/DistrictCity')
const filters = require('../helpers/filter/closecontactfilter')
const Validate = require('../helpers/cases/revamp/handlerpost')

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
const syncCase = async (callback) => {
  const result = await CloseContact.find({
    delete_status: { $ne: "deleted" },
    is_migrated: { $ne: true }
  }).populate(['case', 'latest_history'])

  let promise = Promise.resolve()

  for (i in result) {
    const res = result[i]
    promise = promise.then(async () => {
      let foundedCase = null
      if (res.nik || res.phone_number) {
        foundedCase = await Case.findOne({
          phone_number: res.phone_number
        })
      }

      if (!res.address_district_code) {
        await CloseContact.findOneAndUpdate(
          { _id: res._id },
          { $set: {
              migration_note: "INVALID_DISTRICT_CODE"
            }
          }, { upsert: true, new: true })
      }

      if (foundedCase) {
        await CloseContact.findOneAndUpdate(
          { _id: res._id },
          { $set: {
              is_case_exists: true,
            }
          }, { upsert: true, new: true })
      }

      if (!foundedCase && res.address_district_code) {

          const code = res.address_district_code
          const dinkes = await DistrictCity.findOne({ kemendagri_kabupaten_kode: code})
          const districtCases = await Case.findOne({ address_district_code: code, verified_status: 'verified' }).sort({id_case: -1})

          let pre = {
            count_case: {
              prov_city_code: code,
              dinkes_code: dinkes.dinkes_kota_kode,
              count_pasien: districtCases ? (Number(districtCases.id_case.substring(12)) + 1) : 1
            },
            count_case_pending: {}
          }

          // generate idcase
          const idCase = Validate.generateIdCase(res.createdBy, pre)

          // prepare mapping
          const lastHis = res.latest_history || {}

          // transform inspection support
          const inspects = []

          if (lastHis.test_nasopharyngeal_swab) {
            inspects.push({
              specimens_type: 'Swab Nasofaring',
              inspection_date: lastHis.test_nasopharyngeal_swab_date,
              inspection_location: null,
              get_specimens_to: null,
              inspection_result: lastHis.test_nasopharyngeal_swab_result,
              inspection_type: 'lab_cofirm',
            })
          }

          if (lastHis.test_orofaringeal_swab) {
            inspects.push({
              specimens_type: 'Swab Orofaring',
              inspection_date: lastHis.test_orofaringeal_swab_date,
              inspection_location: null,
              get_specimens_to: null,
              inspection_result: lastHis.test_orofaringeal_swab_result,
              inspection_type: 'lab_cofirm',
            })
          }

          if (lastHis.test_serum) {
            inspects.push({
              specimens_type: 'Serum',
              inspection_date: null,
              inspection_location: null,
              get_specimens_to: null,
              inspection_result: null,
              inspection_type: 'other_checks',
            })
          }

          // transoform to traveling history
          const travels = []
          if (res.travel_is_went_abroad) {
            travels.push({
              travelling_type: "Dari Luar Negeri",
              travelling_visited: res.travel_visited_country,
              travelling_city: null,
              travelling_date: res.travel_country_depart_date,
              travelling_arrive: res.travel_country_return_date,
            })
          }

          if (res.travel_is_went_other_city) {
            travels.push({
              travelling_type: "Dari Luar Kota",
              travelling_visited: res.travel_visited_city,
              travelling_city: res.travel_visited_city,
              travelling_date: res.travel_city_depart_date,
              travelling_arrive: res.travel_city_depart_date,
            })
          }

          // transform close_contact_premier
          const premierContacts = []
          if (res.case) {
            premierContacts.push({
              close_contact_id_case: res.case.id_case,
              close_contact_name: res.case.name,
              close_contact_phone: res.case.phone_number,
              close_contact_criteria: res.case.status,
              close_contact_birth_date: res.case.birth_date,
              close_contact_age: res.case.age,
              close_contact_gender: res.case.gender,
              close_contact_address_street: res.case.address_street,
              close_contact_relation: res.relationship,
              close_contact_activity: res.activity_other,
              close_contact_first_date: res.createdAt,
              close_contact_last_date: res.createdAt,
            })
          }

          const mappedToCasePayload = {
            verified_status: 'verified',
            interviewers_name: res.interviewer_name,
            interview_date: res.contact_tracing_date,
            is_nik_exists: res.is_nik_exists,
            nik: res.nik,
            name: res.name,
            is_phone_number_exists: res.is_phone_number_exists,
            phone_number: res.phone_number,
            gender: this.gender,
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
            close_contact_premier: premierContacts,
            final_result: '5',
            current_location_type: 'RUMAH',
            current_location_address: res.address_street,
            current_location_village_code: res.address_village_code,
            current_location_subdistrict_code: res.address_subdistrict_code,
            current_location_district_code: res.address_district_code,
            status: CRITERIA.CLOSE,
            input_source: 'sync-from-closecontact',
            is_reported: true,
            origin_closecontact: true,
            author: res.createdBy,
          }

          const newCase = new Case({
            id_case: idCase,
            ...mappedToCasePayload,
          })
          const insertedCase = await newCase.save()
          console.log("INSERTED_CASE", insertedCase)

          // insert history
          const newHistory = new History({
            case: insertedCase._id,
            ...mappedToCasePayload,
          })

          // console.log("HISTORY", newHistory)
          const insertedHistory = await newHistory.save(res)
          console.log("INSERTED_HIS", insertedHistory)

          const updatedLastHis = await Case.findOneAndUpdate({ _id: insertedCase._id },
            { $set: { last_history: insertedHistory._id } }, { upsert: true, new: true })
          console.log("UPDATED_LASTHIS", updatedLastHis)

          // update flag is_migrated true
          console.log("inserted", insertedCase)
          const isMigrated = await CloseContact.findOneAndUpdate(
            { _id: res._id },
            { $set: {
                is_migrated: true,
                caseCreated: insertedCase._id
              }
            }, { upsert: true, new: true })
          console.log("isMigrated", isMigrated)
      }
      return new Promise(resolve => resolve())
    })
  }

  promise
  .then(() => callback(null, null))
  .catch(err => callback(err, null))
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

var dt, conf, registeredDiagnosis, unknownDiagnosis

const init = (value, config) => {
    dt = value
    conf = config
    registeredDiagnosis = []
    unknownDiagnosis = []
}

const getIdCaseNational = () => {
    return _toString(dt[conf.cell.id_case_national])
}

const getIdCaseRelated = () => {
    if (!dt[conf.cell.id_case_related]) return null
    if (! _toString(dt[conf.cell.id_case_related].split)) return null
    return _toString(dt[conf.cell.id_case_related].split('|')[0] || null)
}

const getNameCaseRelated = () => {
    if (!dt[conf.cell.id_case_related]) return null
    if (!_toString(dt[conf.cell.id_case_related].split)) return null
    return _toString(dt[conf.cell.id_case_related].split('|')[1] || null)
}

const getName = () => {
    return _toString(dt[conf.cell.name]) || undefined
}

const getNik = () => {
    return _toString(dt[conf.cell.nik]) || null
}

const getBirthDate = () => {
    return _toDateString(dt[conf.cell.birth_date])
}

const getAge = () => {
    if (dt[conf.cell.age] === '' || dt[conf.cell.age] === null) return null
    let age = _toUnsignedInt(dt[conf.cell.age]) || '0'
    return _toString(age)
}

const getGender = () => {
    if (!dt[conf.cell.gender]) return undefined
    return dt[conf.cell.gender] == 'Perempuan' ? 'P' : 'L'
}

const getPhoneNumber = () => {
    return _toString(dt[conf.cell.phone_number])
}

const getAddressStreet = () => {
    return _toString(dt[conf.cell.address_street])
}

const getAddressProvinceCode = () => {
    return '32'
}

const getAddressProvinceName = () => {
    return 'Jawa Barat'
}

const getAddressDistrictCode = () => {
    if (!dt[conf.cell.address_district_code]) return undefined
    return _toString(dt[conf.cell.address_district_code].split('-')[1] || null)
}

const getAddressDistrictName = () => {
    if (!dt[conf.cell.address_district_code]) return undefined
    return _toString(dt[conf.cell.address_district_code].split('-')[0] || null)
}

const getAddressSubdistrictCode = () => {
    if (!dt[conf.cell.address_subdistrict_code]) return undefined
    return _toString(dt[conf.cell.address_subdistrict_code].split('-')[1] || null)
}

const getAddressSubdistrictName = () => {
    if (!dt[conf.cell.address_subdistrict_code]) return undefined
    return _toString(dt[conf.cell.address_subdistrict_code].split('-')[0] || null)
}

const getAddressVillageCode = () => {
    if (!dt[conf.cell.address_village_code]) return undefined
    return _toString(dt[conf.cell.address_village_code].split('-')[1] || null)
}

const getAddressVillageName = () => {
    if (!dt[conf.cell.address_village_code]) return undefined
    return _toString(dt[conf.cell.address_village_code].split('-')[0] || null)
}

const getNationality = () => {
    return _toString(dt[conf.cell.nationality]) || undefined
}

const getNationalityName = () => {
    return _toString(dt[conf.cell.nationality_name])
}

const getOccupation = () => {
    return _toString(dt[conf.cell.occupation])
}

const getOfficeAddress = () => {
    return _toString(dt[conf.cell.office_address])
}

const getStatus = () => {
    if (!dt[conf.cell.status]) return undefined

    let status = _toString(dt[conf.cell.status]) 

    if (status && status.toUpperCase) {
        status = status.toUpperCase()
    }
    return status || undefined
}

const getStage = () => {
    if (!dt[conf.cell.stage]) return undefined
    let stage = _toString(dt[conf.cell.stage])
    if (stage === 'Proses') return '0'
    else if (stage === 'Selesai') return '1'
    else return ''
}

const getFinalResult = () => {
    if(!dt[conf.cell.final_result]) return null
    const result = _toString(dt[conf.cell.final_result])
    
    let resultCode = null

    const status = getStatus()

    if (status === 'OTG' || status === 'ODP') {
        return null
    }

    if (result == 'Sembuh') {
        resultCode = '1'
    } else if (result == 'Meninggal') {
        resultCode = '2'
    } if (result == 'Negatif' && status !== 'POSITIF') {
        resultCode = '0'
    }

    return resultCode
}

const getReportSource = () => {
    return _toString(dt[conf.cell.report_source])
}

const getDiagnosis = () => {
    if (!dt[conf.cell.diagnosis]) return []
    let diagnosis = dt[conf.cell.diagnosis].split(',')

    for (i in diagnosis) {
        let diagnose = _toString(diagnosis[i])
        if (diagnose.trim) {
            diagnose = diagnose.trim()
        }

        if (refDiagnosis.includes(diagnose)) {
            registeredDiagnosis.push(diagnose)
        } else {
            unknownDiagnosis.push(diagnose)
        }
    }

    return registeredDiagnosis || []
}

const getDiagnosisOther = () => {
    let otherDiagnosis = _toString(dt[conf.cell.diagnosis_other])
    if (unknownDiagnosis && unknownDiagnosis.join) {
        if (otherDiagnosis) {
            otherDiagnosis += ' ' + unknownDiagnosis.join(',')
        } else {
            otherDiagnosis = unknownDiagnosis.join(',')
        }
    }
    return otherDiagnosis || null
}

const getFirstSymptomDate = () => {
    return _toDateString(dt[conf.cell.first_symptom_date])
}

const getHistoryTracing = () => {
    return []
}

const isWentAbroad = () => {
    return dt[conf.cell.is_went_abroad] == 'Dari luar negeri'
}

const getVisitedCountry = () => {
    return isWentAbroad() ? _toString(dt[conf.cell.visited_country]) : null
}

const getReturnDate = () => {
    if (!dt[conf.cell.return_date]) return null
    // console.log(dt[conf.cell.return_date])
    let returnDate = _toDateString(dt[conf.cell.return_date])
    return returnDate
}

const isWentOtherCity = () => {
    return dt[conf.cell.is_went_other_city] == 'Dari luar kota'
}

const getVisitedCity = () => {
    return isWentOtherCity() ? _toString(dt[conf.cell.visited_city]) : null
}

const isContactWithPositive = () => {
    return dt[conf.cell.is_contact_with_positive] == 'Kontak erat'
}

const getHistoryNotes = () => {
    return null
}

const getCurrentLocationType = () => {
    if (!dt[conf.cell.current_location_type]) return undefined
    return dt[conf.cell.current_location_type] == 'Ya' ? 'RS' : 'RUMAH'
}

const getCurrentHospitalId = () => {
    if (!dt[conf.cell.current_hospital_id]) return null
    return dt[conf.cell.current_hospital_id].split('-')[1] || null
}

const getCurrentLocationAddress = () => {
    if (dt[conf.cell.current_location_type] == 'Ya') {
        if (!dt[conf.cell.current_hospital_id]) return null
        return dt[conf.cell.current_hospital_id].split('-')[0] || null
    } else {
        return dt[conf.cell.current_location_address]
    }
}

const getCurrentLocationDistrictCode = () => {
    if (!dt[conf.cell.current_location_district_code]) return null
    return _toString(dt[conf.cell.current_location_district_code].split('-')[1] || null)
}

const getCurrentLocationSubdistrictCode = () => {
    if (!dt[conf.cell.current_location_subdistrict_code]) return null
    return _toString(dt[conf.cell.current_location_subdistrict_code].split('-')[1] || null)
}

const getCurrentLocationVillageCode = () => {
    if (!dt[conf.cell.current_location_village_code]) return null
    return _toString(dt[conf.cell.current_location_village_code].split('-')[1] || null)
}

const getOtherNotes = () => {
    return _toString(dt[conf.cell.other_notes])
}

const getLastChanged = () => {
    return new Date()
}

const isSampleTaken = () => {
    return dt[conf.cell.is_sample_taken] === 'Ya'
}

const _toString = (value) => {
    if (value && value.toString) {
        return value.toString()
    }

    return value
}

const _toDateString = (value) => {
    if (!value) return null
    return new Date((value - (25567 + 1))*86400*1000) || null
}

const _toUnsignedInt = (value) => {

    if (value && value.parseToInt) {
        return Math.abs(value.parseToInt())
    } else if (value && typeof value === 'number') {
        return Math.abs(value)
    }

    return value
}

const isRowFilled = () => {
    const c = conf.cell
    if (dt[c.name] || dt[c.nik] || dt[c.birth_date] || dt[c.gender] || dt[c.address_province_code])
    {
        return true
    }

    return false
}

const refDiagnosis = [
    'Suhu tubuh >= 38°C',
    'Suhu tubuh < 38°C',
    'Batuk',
    'Pilek', 
    'Sakit Tenggorokan',
    'Sakit Kepala',
    'Sesak Napas',
    'Menggigil', 
    'Lemah (malaise)',
    'Nyeri Otot',
    'Mual atau Muntah',
    'Nyeri Abdomen',
    'Diare'
]

module.exports = {
    init,
    getIdCaseNational,
    getIdCaseRelated,
    getNameCaseRelated,
    getName,
    getNik,
    getBirthDate,
    getAge,
    getGender,
    getPhoneNumber,
    getAddressStreet,
    getAddressProvinceCode,
    getAddressProvinceName,
    getAddressDistrictCode,
    getAddressDistrictName,
    getAddressSubdistrictCode,
    getAddressSubdistrictName,
    getAddressVillageCode,
    getAddressVillageName,
    getNationality,
    getNationalityName,
    getOccupation,
    getOfficeAddress,
    getStatus,
    getStage,
    getFinalResult,
    getReportSource,
    getDiagnosis,
    getDiagnosisOther,
    getFirstSymptomDate,
    getHistoryTracing,
    isWentAbroad,
    getVisitedCountry,
    getReturnDate,
    isWentOtherCity,
    getVisitedCity,
    isContactWithPositive,
    getHistoryNotes,
    getCurrentLocationType,
    getCurrentHospitalId,
    getCurrentLocationAddress,
    getCurrentLocationDistrictCode,
    getCurrentLocationSubdistrictCode,
    getCurrentLocationVillageCode,
    getOtherNotes,
    getLastChanged,
    isSampleTaken,
    isRowFilled,
}

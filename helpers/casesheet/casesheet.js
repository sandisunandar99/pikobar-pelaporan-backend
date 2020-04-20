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
    return _toString(dt[conf.cell.id_case_related].split('-')[0] || null)
}

const getNameCaseRelated = () => {
    if (!dt[conf.cell.id_case_related]) return null
    if (!_toString(dt[conf.cell.id_case_related].split)) return null
    return _toString(dt[conf.cell.id_case_related].split('-')[1] || null)
}

const getName = () => {
    return _toString(dt[conf.cell.name])
}

const getNik = () => {
    return _toString(dt[conf.cell.nik])
}

const getBirthDate = () => {
    return _toString(dt[conf.cell.birth_date])
}

const getAge = () => {
    return _toUnsignedInt(dt[conf.cell.age])
}

const getGender = () => {
    return dt[conf.cell.gender] == 'Perempuan' ? 'P' : 'L'
}

const getPhoneNumber = () => {
    return _toString(dt[conf.cell.phone_number])
}

const getAddressStreet = () => {
    return _toString(dt[conf.cell.address_street])
}

const getAddressProvinceCode = () => {
    return '35'
}

const getAddressProvinceName = () => {
    return 'Jawa Barat'
}

const getAddressDistrictCode = () => {
    if (!dt[conf.cell.address_district_code]) return null
    return _toString(dt[conf.cell.address_district_code].split('-')[1] || null)
}

const getAddressDistrictName = () => {
    if (!dt[conf.cell.address_district_code]) return null
    return _toString(dt[conf.cell.address_district_code].split('-')[0] || null)
}

const getAddressSubdistrictCode = () => {
    if (!dt[conf.cell.address_subdistrict_code]) return null
    return _toString(dt[conf.cell.address_subdistrict_code].split('-')[1] || null)
}

const getAddressSubdistrictName = () => {
    if (!dt[conf.cell.address_subdistrict_code]) return null
    return _toString(dt[conf.cell.address_subdistrict_code].split('-')[0] || null)
}

const getAddressVillageCode = () => {
    if (!dt[conf.cell.address_village_code]) return null
    return _toString(dt[conf.cell.address_village_code].split('-')[1] || null)
}

const getAddressVillageName = () => {
    if (!dt[conf.cell.address_village_code]) return null
    return _toString(dt[conf.cell.address_village_code].split('-')[0] || null)
}

const getNationality = () => {
    return _toString(dt[conf.cell.nationality])
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
    return _toString(dt[conf.cell.status])
}

const getStage = () => {
    return _toString(dt[conf.cell.stage])
}

const getFinalResult = () => {
    return _toString(dt[conf.cell.final_result])
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
    return dt[conf.cell.first_symptom_date]
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
    let returnDate = _toString(dt[conf.cell.return_date])
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
    return //todo
}

const getCurrentLocationType = () => {
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

const _toUnsignedInt = (value) => {

    if (value && value.parseToInt) {
        return Math.abs(value.parseToInt())
    } else if (value && typeof value === 'number') {
        return Math.abs(value)
    }

    return value
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
}

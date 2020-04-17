var dt, conf

const init = (value, config) => {
    dt = value
    conf = config
}

const getIdCaseNational = () => {
    return _toString(dt[conf.cell.id_case_national])
}

const getIdCaseRelated = () => {
    return _toString(dt[conf.cell.id_case_related].split('-')[0] || null)
}

const getNameCaseRelated = () => {
    return _toString(dt[conf.cell.id_case_related].split('-')[1] || null)
}

const getName = () => {
    return _toString(dt[conf.cell.name])
}

const getNik = () => {
    return _toString(dt[conf.cell.nik])
}

const getBirthDate = () => {
    return dt[conf.cell.birth_date]
}

const getAge = () => {
    return _toInt(dt[conf.cell.age])
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
    return _toString(dt[conf.cell.address_district_code].split('-')[0] || null)
}

const getAddressDistrictName = () => {
    return _toString(dt[conf.cell.address_district_code].split('-')[1] || null)
}

const getAddressSubdistrictCode = () => {
    return _toString(dt[conf.cell.address_subdistrict_code].split('-')[0] || null)
}

const getAddressSubdistrictName = () => {
    return _toString(dt[conf.cell.address_subdistrict_code].split('-')[1] || null)
}

const getAddressVillageCode = () => {
    return _toString(dt[conf.cell.address_village_code].split('-')[0] || null)
}

const getAddressVillageName = () => {
    return _toString(dt[conf.cell.address_village_code].split('-')[1] || null)
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
    return conf.cell.office_address
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
    return conf.cell.report_source //todo
}

const getDiagnosis = () => {
    return dt[conf.cell.diagnosis].split(',')
}

const getDiagnosisOther = () => {
    return conf.cell.diagnosis_other //todo
}

const getFirstSymptomDate = () => {
    return conf.cell.first_symptom_date //todo
}

const getHistoryTracing = () => {
    return []
}

const isWentAbroad = () => {
    return false //todo
}

const getVisitedCountry = () => {
    return conf.cell.visited_country //todo
}

const getReturnDate = () => {
    return conf.cell.return_date //todo
}

const isWentOtherCity = () => {
    return false //todo
}

const getVisitedCity = () => {
    return conf.cell.visited_city //todo
}

const isContactWithPositive = () => {
    return false //todo
}

const getHistoryNotes = () => {
    return //todo
}

const getCurrentLocationType = () => {
    return dt[conf.cell.current_location_type] ? 'RS' : 'RUMAH'
}

const getCurrentHospitalId = () => {
    return dt[conf.cell.current_hospital_id].split('-')[0] || null
}

const getCurrentLocationAddress = () => {
    return dt[conf.cell.current_location_address] 
        ? dt[conf.cell.current_hospital_id].split('-')[1] || null
        : 'todo home street'
}

const getCurrentLocationDistrictCode = () => {
    return _toString(dt[conf.cell.current_location_district_code].split('-')[0] || null)
}

const getCurrentLocationSubdistrictCode = () => {
    return _toString(dt[conf.cell.current_location_subdistrict_code].split('-')[0] || null)
}

const getCurrentLocationVillageCode = () => {
    return _toString(dt[conf.cell.current_location_village_code].split('-')[0] || null)
}

const getOtherNotes = () => {
    return conf.cell.other_notes //todo
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

const _toInt = (value) => {
    if (value && value.parseToInt) {
        return value.parseToInt()
    }

    return value
}

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

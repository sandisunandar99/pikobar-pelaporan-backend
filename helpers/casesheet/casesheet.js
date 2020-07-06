var dt, conf, registeredDiagnosis, unknownDiagnosis
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

const _toString = (value) => {
    if (value && value.toString) return value.toString()
    return value
}
const _toDateString = (value) => {
    if (!value) return null
    return new Date((value - (25567 + 1))*86400*1000) || null
}
const _toUnsignedInt = (value) => {
    if (value && value.parseToInt) return Math.abs(value.parseToInt())
    else if (value && typeof value === 'number') return Math.abs(value)
    return value
}

module.exports = {
    init: (value, config) => {
        dt = value, conf = config, registeredDiagnosis = [], unknownDiagnosis = []
    },
    getIdCaseNational: () => {
        return _toString(dt[conf.cell.id_case_national])
    },
    getIdCaseRelated: () => {
        if (!dt[conf.cell.id_case_related]) return null
        if (! _toString(dt[conf.cell.id_case_related].split)) return null
        return _toString(dt[conf.cell.id_case_related].split('|')[0] || null)
    },
    getNameCaseRelated: () => {
        if (!dt[conf.cell.id_case_related]) return null
        if (!_toString(dt[conf.cell.id_case_related].split)) return null
        return _toString(dt[conf.cell.id_case_related].split('|')[1] || null)
    },
    getName: () => {
        return _toString(dt[conf.cell.name]) || undefined
    },
    getNik: () => {
        return _toString(dt[conf.cell.nik]) || null
    },
    getBirthDate: () => {
        return _toDateString(dt[conf.cell.birth_date])
    },
    getAge: () => {
        if (dt[conf.cell.age] === '' || dt[conf.cell.age] === null) return null
        let age = _toUnsignedInt(dt[conf.cell.age]) || '0'
        return _toString(age)
    },
    getGender: () => {
        if (!dt[conf.cell.gender]) return undefined
        return dt[conf.cell.gender] == 'Perempuan' ? 'P' : 'L'
    },
    getPhoneNumber: () => {
        return _toString(dt[conf.cell.phone_number])
    },
    getAddressStreet: () => {
        return _toString(dt[conf.cell.address_street])
    },
    getAddressProvinceCode: () => {
        return '32'
    },
    getAddressProvinceName: () => {
        return 'Jawa Barat'
    },
    getAddressDistrictCode: () => {
        if (!dt[conf.cell.address_district_code]) return undefined
        return _toString(dt[conf.cell.address_district_code].split('-')[1] || null)
    },
    getAddressDistrictName: () => {
        if (!dt[conf.cell.address_district_code]) return undefined
        return _toString(dt[conf.cell.address_district_code].split('-')[0] || null)
    },
    getAddressSubdistrictCode: () => {
        if (!dt[conf.cell.address_subdistrict_code]) return undefined
        return _toString(dt[conf.cell.address_subdistrict_code].split('-')[1] || null)
    },
    getAddressSubdistrictName: () => {
        if (!dt[conf.cell.address_subdistrict_code]) return undefined
        return _toString(dt[conf.cell.address_subdistrict_code].split('-')[0] || null)
    },
    getAddressVillageCode: () => {
        if (!dt[conf.cell.address_village_code]) return undefined
        return _toString(dt[conf.cell.address_village_code].split('-')[1] || null)
    },
    getAddressVillageName: () => {
        if (!dt[conf.cell.address_village_code]) return undefined
        return _toString(dt[conf.cell.address_village_code].split('-')[0] || null)
    },
    getNationality: () => {
        return _toString(dt[conf.cell.nationality]) || undefined
    },
    getNationalityName: () => {
        return _toString(dt[conf.cell.nationality_name])
    },
    getOccupation: () => {
        return _toString(dt[conf.cell.occupation])
    },
    getOfficeAddress: () => {
        return _toString(dt[conf.cell.office_address])
    },
    getStatus: () => {
        if (!dt[conf.cell.status]) return undefined
        let status = _toString(dt[conf.cell.status])
        if (status && status.toUpperCase) {
            status = status.toUpperCase()
        }
        return status || undefined
    },
    getStage: () => {
        if (!dt[conf.cell.stage]) return undefined
        let stage = _toString(dt[conf.cell.stage])
        if (stage === 'Proses') return '0'
        else if (stage === 'Selesai') return '1'
        else return ''
    },
    getFinalResult: () => {
        if(!dt[conf.cell.final_result]) return null

        let resultCode = null
        const status = this.getStatus
        const result = _toString(dt[conf.cell.final_result])

        if (status === 'OTG' || status === 'ODP') return null

        if (result == 'Sembuh') resultCode = '1'
        else if (result == 'Meninggal') resultCode = '2'
        if (result == 'Negatif' && status !== 'POSITIF') resultCode = '0'

        return resultCode
    },
    getReportSource: () => {
        return _toString(dt[conf.cell.report_source])
    },
    getDiagnosis: () => {
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
    },
    getDiagnosisOther: () => {
        let otherDiagnosis = _toString(dt[conf.cell.diagnosis_other])
        if (unknownDiagnosis && unknownDiagnosis.join) {
            if (otherDiagnosis) {
                otherDiagnosis += ' ' + unknownDiagnosis.join(',')
            } else {
                otherDiagnosis = unknownDiagnosis.join(',')
            }
        }
        return otherDiagnosis || null
    },
    getFirstSymptomDate: () => {
        return _toDateString(dt[conf.cell.first_symptom_date])
    },
    getHistoryTracing: () => {
        return []
    },
    isWentAbroad: () => {
        return dt[conf.cell.is_went_abroad] == 'Dari luar negeri'
    },
    getVisitedCountry: () => {
        return this.isWentAbroad ? _toString(dt[conf.cell.visited_country]) : null
    },
    getReturnDate: () => {
        if (!dt[conf.cell.return_date]) return null
        return _toDateString(dt[conf.cell.return_date])
    },
    isWentOtherCity: () => {
        return dt[conf.cell.is_went_other_city] == 'Dari luar kota'
    },
    getVisitedCity: () => {
        return this.isWentOtherCity ? _toString(dt[conf.cell.visited_city]) : null
    },
    isContactWithPositive: () => {
        return dt[conf.cell.is_contact_with_positive] == 'Kontak erat'
    },
    getHistoryNotes: () => {
        return null
    },
    getCurrentLocationType: () => {
        if (!dt[conf.cell.current_location_type]) return undefined
        return dt[conf.cell.current_location_type] == 'Ya' ? 'RS' : 'RUMAH'
    },
    getCurrentHospitalId: () => {
        if (!dt[conf.cell.current_hospital_id]) return null
        return dt[conf.cell.current_hospital_id].split('-')[1] || null
    },
    getCurrentLocationAddress: () => {
        if (dt[conf.cell.current_location_type] == 'Ya') {
            if (!dt[conf.cell.current_hospital_id]) return null
            return dt[conf.cell.current_hospital_id].split('-')[0] || null
        } else {
            return dt[conf.cell.current_location_address]
        }
    },
    getCurrentLocationDistrictCode: () => {
        if (!dt[conf.cell.current_location_district_code]) return null
        return _toString(dt[conf.cell.current_location_district_code].split('-')[1] || null)
    },
    getCurrentLocationSubdistrictCode: () => {
        if (!dt[conf.cell.current_location_subdistrict_code]) return null
        return _toString(dt[conf.cell.current_location_subdistrict_code].split('-')[1] || null)
    },
    getCurrentLocationVillageCode: () => {
        if (!dt[conf.cell.current_location_village_code]) return null
        return _toString(dt[conf.cell.current_location_village_code].split('-')[1] || null)
    },
    getOtherNotes: () => {
        return _toString(dt[conf.cell.other_notes])
    },
    getLastChanged: () => {
        return new Date()
    },
    isSampleTaken: () => {
        return dt[conf.cell.is_sample_taken] === 'Ya'
    },
    isRowFilled: () => {
        const c = conf.cell
        if (dt[c.name] || dt[c.nik] || dt[c.birth_date] || dt[c.gender] || dt[c.address_province_code]) return true
        else return false
    }
}

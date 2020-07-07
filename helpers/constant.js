module.exports = {
    "VERIFIED_STATUS":{
        "PENDING": "pending",
        "VERIFIED": "verified",
    },
    "ROLE":{
        "ADMIN": "superadmin",
        "KOTAKAB": "dinkeskota",
        "FASKES": "faskes",
    },
    "CASE":{
        "CODE": "covid-",
        "PRE": "precovid-"
    },
    GENDER: {
        MALE: 'L',
        FEMALE: 'P'
    },
    DEFAULT_PROVINCE: {
        CODE: '32',
        NAME: 'JAWA BARAT'
    },
    ERRORS: {
        INVALID: {
            PARAMS_VALUE:  'Invalid params value'
        }
    },
    HTTP: {
        OK: 200,
        CREATED: 201,
        UNPROCESSABLE_ENTITY: 422,
        INTERNAL_SERVER_ERROR: 500
    },
    REF: {
        CLOSE_CONTACT: {
            TYPES: {
                OTHER: '1',
                HOME: '2',
                OFFICER: '3'
            },
            PLACES: {
                OTHER: '1',
                HOME: '2',
                WORK: '3',
                TOUR: '4',
                MEDICAL: '5'
            }
        }
    }
}
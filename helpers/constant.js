module.exports = {
    GENDER: {
        MALE: 'L',
        FEMALE: 'P'
    },
    DEFAULT_PROVINCE: {
        CODE: '32',
        NAME: 'JAWA BARAT'
    },
    HTTP: {
        OK: 200,
        CREATED: 201,
        UNPROCESSABLE_ENTITY: 422,
        INTERNAL_SERVER_ERROR: 500
    },
    MONGOOSE_SCHEMA: {
        TYPE: {
            ARRAY: {
                DEFAULT: {
                    type: Array,
                    default: []
                }
            },
            BOOLEAN: {
                DEFAULT: {
                    type: Boolean,
                    default: false
                }
            },
            DATE: {
                DEFAULT: {
                    type: Date,
                    default: null
                },
            },
            NUMBER: {
                DEFAULT: {
                    type: Number,
                    default: 0
                }
            },
            STRING: {
                DEFAULT: {
                    type: String,
                    default: null
                },
                DEFAULT_VALUE: (value) => {
                    return {
                        type: String,
                        default: value
                    }
                },
                ENUM: (values) => {
                    return {
                        type: String,
                        enux: values
                    }
                },
                REQUIRED: {
                    type: String,
                    required: true
                }
            },
        }
    }
}
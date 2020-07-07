module.exports = {
    MONGOOSE_SCHEMA: {
        TYPE: {
            ARRAY: {
                DEFAULT: {
                    type: Array,
                    default: []
                },
                REQUIRED: {
                    type: Array,
                    required: true
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
                NOW: {
                    type: Date,
                    default: Date.now()
                },
                REQUIRED: {
                    type: Date,
                    required: true
                }
            },
            NUMBER: {
                DEFAULT: {
                    type: Number,
                    default: 0
                },
                REQUIRED: {
                    type: Number,
                    required: true
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
            }
        }
    }
}
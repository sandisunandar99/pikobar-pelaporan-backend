const importConfigRdt = {
    auth: 'jwt',
    description: 'RDT import',
    tags: ['api', 'rdt'],
    payload: {
      maxBytes: 1000 * 1000 * 25,
      output: 'stream',
      parse: true,
      allow: 'multipart/form-data'
    }
}


exports.config = importConfigRdt
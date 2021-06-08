const { ucwords, deletedSave } = require("../helpers/custom")

describe('helpers custom testing ', () => {
  it('uppercase word', () => {
    const strUpper = ucwords('data')
    expect(strUpper).toBe('Data')
    expect(strUpper).toBe('Data')
  })
})

describe('helpers custom testing ', () => {
  it('delete save object', () => {
    expect(deletedSave({})).toHaveProperty('delete_status')
    expect(deletedSave({})).toHaveProperty('deletedAt')
    expect(deletedSave({})).toHaveProperty('deletedBy')
  })
})
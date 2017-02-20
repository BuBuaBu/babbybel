import defImport from './import-ref'
import * as wildcardImport from './import-ref'
import {f1, f2} from './import-ref'
import {f1 as f1Alias} from './import-ref'

const chai = require('chai')
const dirtyChai = require('dirty-chai')

chai.use(dirtyChai)

const expect = chai.expect

describe('import', () => {
  it('imports default', () => {
    expect(defImport).to.eql({f1: 'val1', f2: 'val2', f3: 'val3'})
  })
  it('imports wildcard', () => {
    expect(wildcardImport).to.eql({f1: 'val1', f2: 'val2', f3: 'val3'})
  })
  it('imports sparse', () => {
    expect(f1).to.eql('val1')
    expect(f2).to.eql('val2')
  })
  it('imports sparse with alias', () => {
    expect(f1Alias).to.eql('val1')
  })
})

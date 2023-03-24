/* eslint-disable no-unused-expressions */
/* eslint-disable no-undef */
const fs = require('fs')
const chai = require('chai')
const glob = require('glob')
const cheerio = require('cheerio')
const { expect } = chai

describe('Blogger template', () => {
  const files = glob.sync('./dist/*.xml')

  files.forEach((file) => {
    const template = fs.readFileSync(file, 'utf-8')
    const $ = cheerio.load(template, { xmlMode: true })

    it('should start with <?xml version="1.0" encoding="UTF-8" ?>', function () {
      expect(template.startsWith('<?xml version="1.0" encoding="UTF-8" ?>')).to.be.true
    })

    it('should contain a <b:skin> tag', function () {
      expect(template).to.include('<b:skin>')
    })

    it('should contain at least one <b:section> tag with a unique id attribute', function () {
      const sections = $('b\\:section')
      const idList = []

      expect(sections.length).to.be.greaterThan(0)

      sections.each(function () {
        const id = $(this).attr('id')
        expect(id).to.exist
        expect(idList).not.to.contain(id)
        idList.push(id)
      })
    })
  })
})

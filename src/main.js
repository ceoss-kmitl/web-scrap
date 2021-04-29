const axios = require('axios')
const iconv = require('iconv-lite')
const cheerio = require('cheerio')
const fs = require('fs')
const path = require('path')

const URL =
  'http://www.reg.kmitl.ac.th/teachtable_v20/teachtable_show.php?midterm=0&faculty_id=01&dept_id=05&curr_id=19&curr2_id=06&year=2563&semester=1'

async function scrap() {
  // Get html from website
  const response = await axios.get(URL, { responseType: 'arraybuffer' })
  const data = iconv.decode(response.data, 'TIS-620')

  // Create cheerio root
  const $ = cheerio.load(data)

  // Scrapping algorithm
  const tableList = $('table.hoverTable')
  const result = tableList.toArray().map((table, index) => {
    let subjectList = []
    let subject = {}

    $(table)
      .find('a[title="ดูรายละเอียดวิชานี้"]')
      .closest('tr')
      .toArray()
      .forEach((row) => {
        const columnList = $(row).find('td').toArray()
        const subjectId = $(columnList[0]).text().trim()

        // Found new subject. Push prev subject to subjectList
        // then reset the subject to the new one
        if (subjectId !== '' && subject.subjectId !== subjectId) {
          if (subject.subjectId) subjectList.push(subject)

          subject = {
            subjectId,
            subjectName: $(columnList[2]).text().trim(),
            credit: $(columnList[4]).text().trim(),
            sectionList: [],
          }
        }

        // Add section into subject
        subject.sectionList.push({
          section: $(columnList[6]).text().trim(),
          time: $(columnList[10]).text().trim(),
          room: $(columnList[12]).text().trim(),
          teacher: $(columnList[16]).text().trim(),
        })
      })

    return {
      year: index + 1,
      subjectList,
    }
  })

  // Write file
  // const resultPath = path.resolve(__dirname, './result.json')
  // const resultData = JSON.stringify(result, ' ', 2)
  // fs.writeFileSync(resultPath, resultData)
  return result
}

module.exports = scrap

const axios = require('axios')
const iconv = require('iconv-lite')
const cheerio = require('cheerio')

const URL =
  'http://www.reg.kmitl.ac.th/teachtable_v20/teachtable_show.php?midterm=0&faculty_id=01&dept_id=05&curr_id=19&curr2_id=06&year=2563&semester=1'

async function main() {
  // Get html from website
  const response = await axios.get(url, { responseType: 'arraybuffer' })
  const data = iconv.decode(response.data, 'TIS-620')

  // Create cheerio root
  const $ = cheerio.load(data)
}

main()

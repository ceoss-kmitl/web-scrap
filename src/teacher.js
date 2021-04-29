const scrap = require('./main')

async function extractTeacherData() {
  const result = await scrap()

  console.log(result)
}

extractTeacherData()

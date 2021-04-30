const scrap = require('./main')
const fs = require('fs')
const path = require('path')

async function extractTeacherData() {
  const data = await scrap()

  const complexTeacherList = data
    .flatMap((d) =>
      d.subjectList.flatMap((subject) =>
        subject.sectionList.flatMap((section) => section.teacher)
      )
    )
    .filter((t) => t.length)

  const result = []
  complexTeacherList.forEach((c) => {
    const teacherList = c.split(',')
    teacherList.forEach((t) => {
      const tmp = t.split('.')

      const title =
        (tmp.length === 2 ? tmp[0] : tmp.slice(0, -1).join('.')) + '.'

      const name = tmp[tmp.length - 1]
        .split(' ')
        .filter((t) => t.length)
        .join(' ')

      result.push({
        id: 0,
        title: title.trim(),
        name: name.trim(),
        isExcutive: false,
      })
    })
  })

  // Write file
  const resultPath = path.resolve(__dirname, './teacher.json')
  const resultData = JSON.stringify(result, ' ', 2)
  fs.writeFileSync(resultPath, resultData)
}

extractTeacherData()

/*
{
  teacherId
  title
  teacherName
  IsExecutive
}
*/

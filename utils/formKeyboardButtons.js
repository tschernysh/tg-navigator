const { Config } = require('../config')

const formKeyboardButtons = (buttonsList, categoryPage) => {


  const tableCells = Math.ceil(buttonsList.length / Config().CATEGORY_COLUMN_COUNT / Config().CATEGORY_ROW_COUNT)
  const tableSize = (Config().CATEGORY_COLUMN_COUNT * Config().CATEGORY_ROW_COUNT)
  const keyboardList = []


  for (let i = 0; i < Config().CATEGORY_ROW_COUNT; i++) {
    keyboardList.push([])
    for (let j = 0; j < Config().CATEGORY_COLUMN_COUNT; j++) {
      const currentElement = i * Config().CATEGORY_COLUMN_COUNT + (categoryPage * tableSize) + j
      if (!buttonsList[currentElement]) break
      keyboardList[i].push({
        text: buttonsList[currentElement].name,
        callback_data: buttonsList[currentElement].code
      })
    }
  }
  return keyboardList
}

module.exports.formKeyboardButtons = formKeyboardButtons

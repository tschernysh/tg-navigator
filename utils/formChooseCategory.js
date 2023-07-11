const Categories = require('../config/categories.json')
const ActiveChannels = require('../config/activeChannelsList.json')
const { Config } = require('../config')

const formChooseCategory = (currentLanguage, categoryPage) => {

  console.log(currentLanguage)
  const availableCategoriesList = Object.keys(ActiveChannels.language[currentLanguage].categories)
  const categoriesFullNameList = Categories.categories

  const categoriesList = categoriesFullNameList.filter(el => availableCategoriesList.includes(el.code))
  console.log(categoriesList)

  const tableCells = Math.ceil(categoriesList.length / Config().CATEGORY_COLUMN_COUNT / Config().CATEGORY_ROW_COUNT)
  const tableSize = (Config().CATEGORY_COLUMN_COUNT * Config().CATEGORY_ROW_COUNT)
  const keyboardCategoryList = []

  for (let i = 0; i < Config().CATEGORY_ROW_COUNT; i++) {
    keyboardCategoryList.push([])
    for (let j = 0; j < Config().CATEGORY_COLUMN_COUNT; j++) {
      const currentElement = i * Config().CATEGORY_COLUMN_COUNT + (categoryPage * tableSize) + j
      if (!categoriesList[currentElement]) break
      keyboardCategoryList[i].push({
        text: categoriesList[currentElement].name,
        callback_data: categoriesList[currentElement].code
      })
    }
  }

  if (keyboardCategoryList.length >= keyboardCategoryList) {

    if (categoryPage === 0) {
      keyboardCategoryList.push([])
      keyboardCategoryList[keyboardCategoryList.length - 1].push({
        text: `${categoryPage + 1}/${tableCells}`,
        callback_data: 'nothing'
      })
      keyboardCategoryList[keyboardCategoryList.length - 1].push({
        text: `>>`,
        callback_data: 'categoryNext'
      })
    } else if (categoryPage + 1 === tableCells) {
      keyboardCategoryList.push([])
      keyboardCategoryList[keyboardCategoryList.length - 1].push({
        text: `<<`,
        callback_data: 'categoryPrev'
      })
      keyboardCategoryList[keyboardCategoryList.length - 1].push({
        text: `${categoryPage + 1}/${tableCells}`,
        callback_data: 'nothing'
      })
    } else {
      keyboardCategoryList.push([])
      keyboardCategoryList[keyboardCategoryList.length - 1].push({
        text: `<<`,
        callback_data: 'categoryPrev'
      })
      keyboardCategoryList[keyboardCategoryList.length - 1].push({
        text: `${categoryPage + 1}/${tableCells}`,
        callback_data: 'nothing'
      })
      keyboardCategoryList[keyboardCategoryList.length - 1].push({
        text: `>>`,
        callback_data: 'categoryNext'
      })
    }
  }
  console.log(keyboardCategoryList)
  return keyboardCategoryList
}

module.exports.formChooseCategory = formChooseCategory


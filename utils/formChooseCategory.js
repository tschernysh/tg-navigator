const Categories = require('../config/categories.json')
const ActiveChannels = require('../config/activeChannelsList.json')
const { Config } = require('../config')
const { formKeyboardButtons } = require('./formKeyboardButtons')

const formChooseCategory = (currentLanguage, categoryPage) => {

  console.log(currentLanguage.language_code)
  const availableCategoriesList = Object.keys(ActiveChannels.language[currentLanguage.language_code].categories)
  const categoriesFullNameList = Categories.categories

  const categoriesList = categoriesFullNameList.filter(el => availableCategoriesList.includes(el.code))
  console.log(categoriesList)

  const keyboardCategoryList = formKeyboardButtons(categoriesList, categoryPage)

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
  keyboardCategoryList.unshift([{ text: currentLanguage.greet_menu, callback_data: 'menu' }])
  console.log(keyboardCategoryList)
  return keyboardCategoryList
}

module.exports.formChooseCategory = formChooseCategory


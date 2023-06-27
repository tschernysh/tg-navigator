const TelegramBot = require('node-telegram-bot-api');
const { Config } = require('./config');
const English = require('./config/languages/eng.json')
const Ukrainian = require('./config/languages/ua.json')

const bot = new TelegramBot(Config().NAVIGATOR_TOKEN, { polling: true })
let selectedLanguage = English


const chooseUserLanguage = (msg) => {
  console.log('MESSAGE DATA', msg)
  const chatId = msg.chat.id;
  bot.deleteMessage(chatId, msg.message_id)
  let botMessageId
  const options = {
    reply_markup: JSON.stringify({
      inline_keyboard: [
        [{ text: 'English🇬🇧', callback_data: 'language_eng' }, { text: 'Українська🇺🇦', callback_data: 'language_ua' }],
      ]
    })
  }
  bot.sendMessage(chatId, selectedLanguage.start_selectLanguage, options)
    .then((sentMessage) => {
      botMessageId = sentMessage.message_id;
    })
    .catch((error) => {
      console.error('Помилка під час відправлення повідомлення:', error);
    });
}
/*
bot.on('callback_query', (query) => {
  const chatId = query.message.chat.id;
  const data = query.data;

  // Виконайте відповідні дії в залежності від значення data
  if (data === 'language_eng') {
    selectedLanguage = English
    bot.sendMessage(chatId, selectedLanguage.start_selectedLanguage);
  } else if (data === 'language_ua') {
    selectedLanguage = Ukrainian
    bot.sendMessage(chatId, selectedLanguage.start_selectedLanguage);
  }
  const greetPicture = 'assets/musashi.jpeg'; // Шлях до файлу зображення
  bot.sendPhoto(chatId, greetPicture)
    .then(() => {
      console.log('Картинка успішно відправлена');
      const options = {
        reply_markup: JSON.stringify({
          inline_keyboard: [
            [{ text: selectedLanguage.greet_chooseCategory, callback_data: 'chooseCategory' }],
          ]
        })
      }
      bot.sendMessage(chatId, selectedLanguage.greet_botDescription, options)
    })
    .catch((error) => {
      console.error('Помилка під час відправлення картинки:', error);
    });
  // Відправте відповідь на callback_query для позначення обробленої події
  bot.answerCallbackQuery(query.id);
});
}
*/

bot.on('callback_query', (query) => {

  const chatId = query.message.chat.id;
  const data = query.data;
  const greetPicture = 'assets/tgnavigator.jpg'; // Шлях до файлу зображення

  switch (data) {
    case 'chooseCategory':

      const categoriesObject = selectedLanguage.categories
      console.log(categoriesObject)
      const categoriesList = Object.values(categoriesObject)
      tableRows = Math.ceil(categoriesList.length / Config().CATEGORY_COLUMN_COUNT)
      const keyboardCategoryList = []

      for (let i = 0; i < tableRows; i++) {
        keyboardCategoryList.push([])
        for (let j = 0; j < Config().CATEGORY_COLUMN_COUNT; j++) {
          if (!categoriesList[i * Config().CATEGORY_COLUMN_COUNT + j]) break
          keyboardCategoryList[i].push({
            text: categoriesList[i * Config().CATEGORY_COLUMN_COUNT + j],
            callback_data: categoriesList[i * Config().CATEGORY_COLUMN_COUNT + j]
          })
        }
      }

      console.log(keyboardCategoryList)


      const options = {
        reply_markup: JSON.stringify({
          inline_keyboard: keyboardCategoryList
        })
      }
      bot.sendMessage(chatId, selectedLanguage.greet_chooseCategory, options)
      break
    case 'language_eng':
      selectedLanguage = English
      bot.sendMessage(chatId, selectedLanguage.start_selectedLanguage);

      bot.sendPhoto(chatId, greetPicture)
        .then(() => {
          console.log('Картинка успішно відправлена');
          const options = {
            reply_markup: JSON.stringify({
              inline_keyboard: [
                [{ text: selectedLanguage.greet_chooseCategory, callback_data: 'chooseCategory' }],
              ]
            })
          }
          bot.sendMessage(chatId, selectedLanguage.greet_botDescription, options)
        })
        .catch((error) => {
          console.error('Помилка під час відправлення картинки:', error);
        });
      break
    // Відправте відповідь на callback_query для позначення обробленої події
    case 'language_ua':
      selectedLanguage = Ukrainian
      bot.sendMessage(chatId, selectedLanguage.start_selectedLanguage);

      bot.sendPhoto(chatId, greetPicture)
        .then(() => {
          console.log('Картинка успішно відправлена');
          const options = {
            reply_markup: JSON.stringify({
              inline_keyboard: [
                [{ text: selectedLanguage.greet_chooseCategory, callback_data: 'chooseCategory' }],
              ]
            })
          }
          bot.sendMessage(chatId, selectedLanguage.greet_botDescription, options)
        })
        .catch((error) => {
          console.error('Помилка під час відправлення картинки:', error);
        });
      // Відправте відповідь на callback_query для позначення обробленої події
      break
  }

  bot.answerCallbackQuery(query.id);
})

bot.onText(/\/start/, (msg) => {
  chooseUserLanguage(msg)
});

bot.onText(/\/language/, (msg) => {
  chooseUserLanguage(msg)
});


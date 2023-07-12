const TelegramBot = require('node-telegram-bot-api');
const { Config } = require('./config');
const English = require('./config/languages/eng.json')
const Ukrainian = require('./config/languages/ua.json');
const Categories = require('./config/categories.json')
const PostExample = require('./config/postExample.json')
const ActiveChannels = require('./config/activeChannelsList.json')
const NeedSubscribeChannels = require("./config/needSubscribeChannels.json")
const { getCategories, getPosts, getChannels } = require('./api/api');
const { formChooseCategory } = require('./utils/formChooseCategory');
const { getPhoto } = require('./utils/getPhoto');

const bot = new TelegramBot(Config().NAVIGATOR_TOKEN, { polling: true })
let categoryPage = 0
let currentCategoryChooseMsgId = 0
let selectedLanguage = Ukrainian
let currentCategory = ''
let userNeedToSubscribe = false

let currentRedirectLink = ''


const chooseUserLanguage = (msg) => {
  console.log('MESSAGE DATA', msg)
  const chatId = msg.chat.id;
  bot.deleteMessage(chatId, msg.message_id)
  let botMessageId
  //{ text: 'English🇬🇧', callback_data: 'language_eng' }, 
  const options = {
    reply_markup: JSON.stringify({
      inline_keyboard: [
        [{ text: 'Українська🇺🇦', callback_data: 'language_ua' }],
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
bot.on('callback_query', async (query) => {

  const chatId = query.message.chat.id;
  const chatUsername = '@' + query.message.chat.username
  const data = query.data;
  const greetPicture = 'assets/tgnavigator.jpg'; // Шлях до файлу зображення
  console.log(query)
  switch (data) {
    case 'checkChannels':
      const subscribeChannelsList = NeedSubscribeChannels.channels

      let accessDenied = false

      let currentUserSubscribed
      console.log('data to check: ', subscribeChannelsList[2].channelId, query.from.id)
      try {
        currentUserSubscribed = await bot.getChatMember(subscribeChannelsList[2].channelId, query.from.id)
      } catch (error) {
        console.log(error.message)
      }
      console.log('currentUserSubscribed: ', currentUserSubscribed)
      if (!currentUserSubscribed || currentUserSubscribed.status === 'left' || currentUserSubscribed.status === 'kicked') {
        accessDenied = true
        break
      }
      console.log('access denied', accessDenied)
      if (accessDenied) {
        sendChannelsToSubscribe(chatId)
      } else {
        sendGreetingMenu(chatId, greetPicture)
      }


      break
    case 'chooseCategory':

      const options = {
        reply_markup: JSON.stringify({
          inline_keyboard: formChooseCategory(selectedLanguage.language_code, categoryPage)
        })
      }
      bot.sendMessage(chatId, selectedLanguage.greet_chooseCategory, options)
        .then((sentMessage) => {
          currentCategoryChooseMsgId = sentMessage.message_id;
          console.log(sentMessage.message_id)
        })
        .catch((error) => {
          console.error('Помилка під час відправлення повідомлення:', error);
        });
      break
    case 'language_eng':
      selectedLanguage = English
      bot.sendMessage(chatId, selectedLanguage.start_selectedLanguage);

      bot.sendPhoto(chatId, greetPicture, { caption: selectedLanguage.greet_botDescription })
        .then(() => {
          console.log('Картинка успішно відправлена');
          const options = {
            reply_markup: JSON.stringify({
              inline_keyboard: [
                [{ text: selectedLanguage.greet_chooseCategory, callback_data: 'chooseCategory' }],
              ]
            })
          }
          bot.sendMessage(chatId, selectedLanguage.greet_menu, options)
        })
        .catch((error) => {
          console.error('Помилка під час відправлення картинки:', error);
        });
      break
    // Відправте відповідь на callback_query для позначення обробленої події
    case 'language_ua':
      selectedLanguage = Ukrainian
      bot.sendMessage(chatId, selectedLanguage.start_selectedLanguage);

      if (userNeedToSubscribe) {
        sendChannelsToSubscribe(chatId)
      } else {
        sendGreetingMenu(chatId, greetPicture)
      }
      break
    case 'categoryNext':

      const nextOptions = {
        reply_markup: {
          inline_keyboard: formChooseCategory(categoryPage + 1)
        }
      }
      console.log(nextOptions)
      bot.editMessageText(selectedLanguage.greet_chooseCategory, { chat_id: chatId, message_id: currentCategoryChooseMsgId, ...nextOptions })
        .then((sentMessage) => {
          currentCategoryChooseMsgId = sentMessage.message_id;
          console.log(sentMessage.message_id)
        })
        .catch((error) => {
          console.error('Помилка під час відправлення повідомлення:', error);
        });
      categoryPage += 1
      break
    case 'categoryPrev':

      const prevOptions = {
        reply_markup: {
          inline_keyboard: formChooseCategory(categoryPage - 1)
        }
      }
      bot.editMessageText(selectedLanguage.greet_chooseCategory, { chat_id: chatId, message_id: currentCategoryChooseMsgId, ...prevOptions })
        .then((sentMessage) => {
          currentCategoryChooseMsgId = sentMessage.message_id;
          console.log(sentMessage.message_id)
        })
        .catch((error) => {
          console.error('Помилка під час відправлення повідомлення:', error);
        });

      categoryPage -= 1
      break
    case Categories.categories.reduce((acc, curr) => {
      if (curr.code === data) return curr.code
      else return acc
    }):
      await sendFeedPost(chatId, data)
      break
    case 'like':
      await sendFeedPost(chatId, currentCategory)
      break
    case 'dislike':
      await sendFeedPost(chatId, currentCategory)
      break
    case 'redirect':
      console.log(currentRedirectLink)
      bot.sendMessage(chatId, currentRedirectLink, { reply_to_message_id: query.message.message_id });

  }

  bot.answerCallbackQuery(query.id);
})

const sendFeedPost = async (chatId, category) => {
  const categoryChannelsList = ActiveChannels.language[selectedLanguage.language_code].categories[category]
  if (!categoryChannelsList) return
  let currentChannelId

  if (categoryChannelsList.length === 1) {
    currentChannelId = categoryChannelsList[0]
  } else {
    currentChannelId = categoryChannelsList[Math.round(Math.random() * categoryChannelsList.length - 1)]
  }

  console.log(categoryChannelsList, currentChannelId)

  let postAmount = 0

  switch (currentChannelId) {
    case '@exoncenter_channel_uk':
      postAmount = 802
      break
    case '@bedaocom':
      postAmount = 5525
      break
    case '@tiktel_traffic':
      postAmount = 57
      break
    case '1919668934':
      postAmount = 212
      break
    default:
      break
  }

  const messageIdToSend = Math.round(Math.random() * postAmount) || 1
  console.log('message id to send: ', messageIdToSend)

  const options = {
    reply_markup: JSON.stringify({
      inline_keyboard: [
        [{ text: '⬅️', callback_data: `chooseCategory` },
        { text: '👍', callback_data: `like` },
        { text: '👎', callback_data: `dislike` },
        { text: '🔗', callback_data: `redirect` }
        ],
      ],
    })
  }

  bot.copyMessage(chatId, currentChannelId, messageIdToSend, options)
    .then((response) => {
      console.log('success')
    })
    .catch((error) => {
      sendFeedPost(chatId, category)
      console.log('copy error', error.message)
    })
  currentRedirectLink = Config().TELEGRAM_BASE_URL + currentChannelId.replace('@', '') + '/' + messageIdToSend
  currentCategory = category
}

const sendGreetingMenu = (chatId, greetPicture) => {
  bot.sendPhoto(chatId, greetPicture, { caption: selectedLanguage.greet_botDescription })
    .then(() => {
      console.log('Картинка успішно відправлена');
      const options = {
        reply_markup: JSON.stringify({
          inline_keyboard: [
            [{ text: selectedLanguage.greet_chooseCategory, callback_data: 'chooseCategory' }],
          ]
        })
      }
      bot.sendMessage(chatId, selectedLanguage.greet_menu, options)
    })
    .catch((error) => {
      console.error('Помилка під час відправлення картинки:', error);
    });
}

const sendChannelsToSubscribe = (chatId) => {

  const listOfChannels = NeedSubscribeChannels.channels.map((el, index) => (index + 1 + ': ' + el.link)).join("\n")

  const textToSubscribe = `${selectedLanguage.greet_needSubscribe}

${listOfChannels}`

  const subscribeOptions = {
    reply_markup: JSON.stringify({
      inline_keyboard: [
        [{ text: selectedLanguage.greet_continue, callback_data: 'checkChannels' }],
      ]
    })
  }

  bot.sendMessage(chatId, textToSubscribe, subscribeOptions);


}

bot.onText(/\/start/, (msg) => {
  userNeedToSubscribe = true
  chooseUserLanguage(msg)
});

bot.onText(/\/language/, (msg) => {
  chooseUserLanguage(msg)
});


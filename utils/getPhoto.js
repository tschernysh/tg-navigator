const { Config } = require("../config");

const getPhoto = (bot, chatId, chatUsername, messageId, currentChat) => {
  console.log(currentChat, `@${chatId}`, messageId)
  bot.copyMessage(currentChat, `@${chatId}`, messageId)
    .then((copiedMessage) => {
      // The copiedMessage variable contains the details of the copied message
      console.log('Copied message:', copiedMessage);
    })
    .catch((error) => {
      console.error('Error copying the message:', error);
    });
}

module.exports.getPhoto = getPhoto

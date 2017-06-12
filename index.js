var memoizeFormatConstructor = require('intl-format-cache');
var MessageFormat = require('intl-messageformat');

const getMessageFormat = memoizeFormatConstructor(MessageFormat);

var globalLocale = '';
var messages = {};

module.exports.defineMessages = function(messages) {
  return messages;
};

module.exports.addMessages = function(locale, dict) {
  if (!locale) {
    throw new Error('Undefined locale: ' + locale);
  }
  messages[locale] = Object.keys(dict).reduce(function(next, key) {
    next[key] = dict[key];
    return next;
  }, messages[locale] || {});
};

module.exports.getLocale = function() {
  return globalLocale;
};

module.exports.setLocale = function(locale) {
  globalLocale = locale;
};

module.exports.formatMessage = function(message, values, opt_locale) {
  if (!message || !message.id) {
    throw new Error('Undefined message id: ' + message);
  }
  if (!message.defaultMessage) {
    throw new Error('Undefined defaultMessage id: ' + id);
  }

  var locale = opt_locale || globalLocale;
  if (messages[locale] && messages[locale][message.id]) {
    return getMessageFormat(messages[locale][message.id], locale).format(values);
  }
  return getMessageFormat(message.defaultMessage, locale).format(values);
};

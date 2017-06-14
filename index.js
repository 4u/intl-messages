var memoizeFormatConstructor = require('intl-format-cache');
var MessageFormat = require('intl-messageformat');

const getMessageFormat = memoizeFormatConstructor(MessageFormat);

var defaultLocale = 'en';
var globalLocale = '';
var defaultMessages = {};
var messages = {};

module.exports.defineMessages = function(messages) {
  Object.keys(messages).reduce(function(next, id) {
    var message = messages[id];
    if (!message || !message.id) {
      throw new Error('Message has no id: ' + JSON.stringify(message));
    }
    if (message.defaultMessage === undefined) {
      throw new Error('Default message is required: ' + JSON.stringify(message));
    }
    if (next[message.id] && process.env.NODE_ENV !== 'production') {
      console.warn('Duplicate message with id `' + message.id + '`.');
    }
    next[message.id] = message.defaultMessage;
    return next;
  }, defaultMessages);
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

module.exports.getMessages = function(locale) {
  if (locale === defaultLocale) {
    return defaultMessages;
  }
  return messages[locale];
};

module.exports.getDefaultLocale = function() {
  return defaultLocale;
};

module.exports.setDefaultLocale = function(locale) {
  defaultLocale = locale;
};

module.exports.getLocale = function() {
  return globalLocale;
};

module.exports.setLocale = function(locale) {
  globalLocale = locale;
};

module.exports.formatMessage = function(obj, values, opt_locale) {
  if (!obj || !obj.id) {
    throw new Error('Undefined message id: ' + JSON.stringify(obj));
  }
  if (obj.defaultMessage === undefined) {
    throw new Error('Default message is required: ' + JSON.stringify(obj));
  }

  var id = obj.id;
  var message = obj.defaultMessage;
  var locale = opt_locale || globalLocale;

  if (locale !== defaultLocale) {
    if (messages[locale] && messages[locale][id]) {
      message = messages[locale][id];
    } else if (process.env.NODE_ENV !== 'production') {
      console.warn('Message with id `' + id + '` is not deifned for `' + locale + '` locale.');
    }
  }
  if (!message && process.env.NODE_ENV !== 'production') {
    console.warn('Message with id `' + id + '` is not exist.');
    return '[undefined]';
  }
  return getMessageFormat(message, locale).format(values);
};

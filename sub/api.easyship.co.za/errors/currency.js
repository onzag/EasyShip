var generator = require('./generator/generator.js');
module.exports = generator(
	'CurrencyAlreadyExists',
	'CurrencyValidationError',
	'InvalidCurrencyID'
);

export default function useFormat(locale) {
	const number = (value, decimals = 2) => new Intl.NumberFormat(locale, {
		style: 'decimal',
		maximumFractionDigits: decimals,
	}).format(value);

	return { number };
}

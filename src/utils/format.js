export default function useFormat(locale) {
	const round = (value, decimals = 0) => Math.round(value * 10 ** decimals) / 10 ** decimals;

	const number = (value, decimals = 2) => new Intl.NumberFormat(locale, {
		style: 'decimal',
		maximumFractionDigits: decimals,
	}).format(value);

	return { number, round };
}

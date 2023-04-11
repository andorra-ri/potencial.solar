// Format number according to specific local and decimals
export const numberFormatter = locale => (value, decimals = 2) => new Intl.NumberFormat(locale, {
  style: 'decimal',
  maximumFractionDigits: decimals,
}).format(value);

// Group a array of items by an attribute. Provide merge function
export const groupBy = (items, attribute, merge) => Object.values(
  items.reduce((acc, item) => {
    acc[item[attribute]] = merge(acc[item[attribute]] || {}, item);
    return acc;
  }, {}),
);

// Averaged item price across its lifespan
export const getMeanPrice = (basePrice, incrementRatio, lifespan) => (
  [...Array(lifespan - 1)].reduce(acc => {
    acc.current *= 1 + incrementRatio;
    acc.sum += acc.current;
    return acc;
  }, { sum: basePrice, current: basePrice }).sum / lifespan
);

// Find the limit cost of an item from a list of costs based on its value
export const findCost = (costs, value) => costs.find(([limit]) => value <= limit)[1];

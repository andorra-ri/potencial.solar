// Format number according to specific local and decimals
export const numberFormatter = (locale: string) => (
  (value: number, decimals = 2) => new Intl.NumberFormat(locale, {
    style: 'decimal',
    maximumFractionDigits: decimals,
  }).format(value)
);

// Group an array of items by any of its attributes
export const groupBy = <T extends object>(items: T[], attribute: keyof T) => {
  const grouped = items.reduce((acc, item) => {
    const key = item[attribute];
    acc.set(key, [...(acc.get(key) || []), item]);
    return acc;
  }, new Map<T[keyof T], T[]>());
  return [...grouped.values()];
};

// Averaged item price across its lifespan
export const getMeanPrice = (basePrice: number, incrementRatio: number, lifespan: number) => (
  [...Array(lifespan - 1)].reduce(acc => {
    acc.current *= 1 + incrementRatio;
    acc.sum += acc.current;
    return acc;
  }, { sum: basePrice, current: basePrice }).sum / lifespan
);

// Find the limit cost of an item from a list of costs based on its value
export const findCost = (costs: [number, number][], value: number) => {
  const [, cost] = costs.find(([limit]) => value <= limit) || costs[costs.length - 1];
  return cost;
};

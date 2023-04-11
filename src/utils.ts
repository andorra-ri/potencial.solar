// Format number according to specific local and decimals
export const numberFormatter = (locale: string) => (
  (value: number, decimals = 2) => new Intl.NumberFormat(locale, {
    style: 'decimal',
    maximumFractionDigits: decimals,
  }).format(value)
);

// Group a array of items by an attribute. Provide merge function
export const groupBy = <T extends object, V extends object>(
  items: T[],
  attribute: keyof T,
  merge: (merged: V, item: T) => V,
) => {
  const grouped = items.reduce((acc, item) => {
    const key = item[attribute];
    acc.set(key, merge(acc.get(key) || {} as V, item));
    return acc;
  }, new Map<T[keyof T], V>());
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

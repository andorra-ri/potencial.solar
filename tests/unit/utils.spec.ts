import { describe, it, expect } from 'vitest';
import { numberFormatter, groupBy, getMeanPrice, findCost, toFeatureCollection, Deferred } from '/@/utils';

describe('Utils', () => {
  it('should format a number with appropriate locale', () => {
    const round = numberFormatter('ca');
    expect(round(1043.341, 2)).toBe('1.043,34');
  });

  it('should group array of object by attribute', () => {
    const items = [
      { name: 'item1', attr: 20 },
      { name: 'item2', attr: 23 },
      { name: 'item3', attr: 21 },
      { name: 'item4', attr: 23 },
    ];
    const grouped = groupBy(items, 'attr');
    expect(grouped).toHaveLength(3);
    expect(grouped[0]).toHaveLength(1);
    expect(grouped[1]).toHaveLength(2);
    expect(grouped[2][0].attr).toBe(21);
  });

  it('should get the mean price of a regular price increment during lifespan', () => {
    const basePrice = 100; // 100€
    const incrementRatio = 0.05; // 5%/year
    const lifespan = 4; // years
    expect(getMeanPrice(basePrice, incrementRatio, lifespan)).toBe(107.753125);
  });

  it('should find the threshold cost of an item', () => {
    // First value of array is value threshold, second is price per that range
    const costs = [[2, 1.50], [6, 1.3], [20, 1.15]] as [number, number][];
    expect(findCost(costs, 4)).toBe(1.3);
    expect(findCost(costs, 12)).toBe(1.15);
  });

  it('should convert an array of items that contain a geometry into a FeatureCollection', () => {
    const item = { geometry: { type: 'Point', coordinates: [1.5, 42.5] }, attr1: 'Attr 1', attr2: 30 };
    const items = [item, item, item, item];
    const featureCollection = toFeatureCollection(items);
    expect(featureCollection.type).toBe('FeatureCollection');
    expect(featureCollection.features).toHaveLength(4);
    expect(Object.keys(featureCollection.features[0].properties)).toHaveLength(2);
  });

  it('should create, resolve and reset a deferred object', async () => {
    const deferred = new Deferred<number>();
    setTimeout(() => deferred.resolve(1), 100);
    const value1 = await deferred.promise;
    expect(value1).toBe(1);
    deferred.reset();
    setTimeout(() => deferred.resolve(2), 100);
    const value2 = await deferred.promise;
    expect(value2).toBe(2);
  });
});

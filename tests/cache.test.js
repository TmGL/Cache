const Cache = require('../src');
// import Cache from '../src';

test('testing basic map methods', () => {
    const cache = new Cache();
    init(cache);

    expect(cache.get('k1')).toStrictEqual('v1');
    expect(cache.has('k1')).toBeTruthy();
    expect(cache.has('invalid key')).toBeFalsy();
    expect(cache.size).toStrictEqual(3);

    cache.delete('k1');
    expect(cache.get('k1')).toBeUndefined();
    expect(cache.has('k1')).toBeFalsy();
    expect(cache.size).toStrictEqual(2);

    cache.clear();
    expect(cache.get('k2')).toBeUndefined();
    expect(cache.has('k2')).toBeFalsy();
    expect(cache.size).toStrictEqual(0);
});

test('testing array methods', () => {
    const cache = new Cache();
    init(cache);

    const expectedFilter = new Cache().set('k1', 'v1').set('k2', 'v2');
    expect(cache.filter(value => value.includes('v'))).toStrictEqual(expectedFilter);

    expect(cache.some(value => value.includes('v'))).toBeTruthy();
    expect(cache.some(value => value.includes('false'))).toBeFalsy();

    expect(cache.position('k1', 'key')).toStrictEqual(1);
    expect(cache.position('v2', 'value')).toStrictEqual(2);

    cache.clear();
    cache.set('k1', 'v1');

    const concatTester = new Cache().set('k2', 'v2');
    const joined = cache.concat(concatTester);
    expect(joined.array('key')).toStrictEqual(['k1', 'k2']);
    expect(joined.size).toStrictEqual(2);

    cache.clear();
    init(cache);

    expect(cache.find(key => key.includes('1'), 'key')).toStrictEqual('k1');
    expect(cache.find(value => value.includes('a'), 'value')).toStrictEqual('anomaly');
});

test('testing miscellaneous methods', () => {
    const cache = new Cache();
    init(cache);

    expect(cache.array('key')).toStrictEqual(['k1', 'k2', 'k3']);
    expect(cache.array('value')).toStrictEqual(['v1', 'v2', 'anomaly']);

    expect(cache.first('key')).toStrictEqual('k1');
    expect(cache.first('value')).toStrictEqual('v1');
    expect(cache.last('key')).toStrictEqual('k3');
    expect(cache.last('value')).toStrictEqual('anomaly');

    cache.set('k4', 'v4');

    const expectedBulkDelete = new Cache([['k3', 'anomaly'], ['k4', 'v4']]);
    expect(cache.bulkDelete('k1', 'k2')).toStrictEqual(expectedBulkDelete);

    cache.clear();
    init(cache);

    const expectedHardFilter = new Cache([['k1', 'v1'], ['k2', 'v2']]);
    cache.hardFilter(value => value.includes('v'));
    expect(cache).toStrictEqual(expectedHardFilter);

    expect(Cache.isCache(cache)).toBeTruthy();
    expect(Cache.isCache('this is not a cache')).toBeFalsy();

    // cloning cache
    cache.clear();
    init(cache);
    
    const cache1 = cache.clone();
    expect(cache).toStrictEqual(cache1);

    // if cache equals another cache
    const cache2 = cache.clone();
    cache2.delete('k1');
    cache2.set('k1', 'v1');

    expect(cache.equals(cache1, true)).toBeTruthy();
    expect(cache.equals(cache2, true)).toBeFalsy();
    expect(cache.equals(cache2, false)).toBeTruthy();
});

/**
 * @param {Cache} cache 
 * @returns {Cache}
 */
function init(cache) {
    cache.set('k1', 'v1');
    cache.set('k2', 'v2');
    cache.set('k3', 'anomaly');
    return cache;
}
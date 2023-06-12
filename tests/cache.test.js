const Cache = require('../src');
// import Cache from '../src';

describe('basic map methods', () => {
    const cache = init(new Cache);
	
	test('setting keys and values', () => {
		cache.set('k4', 'v4');
    	expect(cache.has('k4')).toBeTruthy();
    	expect(cache.get('k4')).toStrictEqual('v4');
	});
	
	test('deleting keys', () => {
		cache.delete('k1');
    	expect(cache.get('k1')).toBeUndefined();
    	expect(cache.has('k1')).toBeFalsy();
	    expect(cache.size).toStrictEqual(3);
	});
 
	test('checking if keys exist, and if values can be retrieved', () => {
		expect(cache.get('k2')).toStrictEqual('v2');
    	expect(cache.has('k2')).toBeTruthy();
    	expect(cache.has('invalid key')).toBeFalsy();
    	expect(cache.size).toStrictEqual(3);
	});
    
	test('clearing cache', () => {
		cache.clear();
    	expect(cache.get('k2')).toBeUndefined();
    	expect(cache.has('k2')).toBeFalsy();
    	expect(cache.size).toStrictEqual(0);
	});
});

test('positions of keys/values', () => {	
	const cache = init(new Cache());
    expect(cache.position('k2')).toStrictEqual(2);
    expect(cache.position('anomaly', 'v')).toStrictEqual(3);
    expect(cache.position('invalid key')).toStrictEqual(-1);
});

describe('custom map methods', () => {
	const cache = init(new Cache());
	
	test('setting multiple elements at once', () => {
    	cache.multiSet(new Cache([['foo', 'bar']]), [['hello', 'world']], new Map().set('k4', 'v4'));
    	expect(cache.size).toStrictEqual(6);
    	expect(cache.get('foo')).toStrictEqual('bar');
    	expect(cache.get('hello')).toStrictEqual('world');
    	expect(cache.get('k4')).toStrictEqual('v4');
	});
	
	test('setting an element in a certain position', () => {
		cache.setAt('k0', 'v0', 1, false);
    	expect(cache.get('k0')).toStrictEqual('v0');
    	expect(cache.position('anomaly', 'v')).toStrictEqual(4);
    	expect(cache.size).toStrictEqual(7);
	});
	
	test('setting element, delete overlapping element', () => {
    	cache.setAt('k4', 'v4', 5, true);
    	expect(cache.size).toStrictEqual(6);
    	expect(cache.get('k4')).toStrictEqual('v4');
	});
	
	test('setting multiple elements at certain position', () => {
    	cache.multiSetAt(1, false, new Map().set('k-2', 'v-2'), [['k-1', 'v-1']]);
    	expect(cache.size).toStrictEqual(8);
    	expect(cache.get('k-1')).toStrictEqual('v-1');
    	expect(cache.get('k-2')).toStrictEqual('v-2');
    	expect(cache.position('v-1', 'v')).toStrictEqual(2);
    	expect(cache.position('v0', 'v')).toStrictEqual(2+1);
	});
	
	test('setting multiple elements at certain positions, deleting overlapping elements', () => {
		cache.multiSetAt(6, true, [['k3', 'v3']], new Map().set('k4', 'v4').set('k5', 'v5'));
    	expect(cache.size).toStrictEqual(8);
    	expect(cache.position('k5')).toStrictEqual(cache.size);
    	expect(cache.get('k4')).toStrictEqual('v4');
    	expect(cache.position('k3')).toStrictEqual(6);
	});
	
	test('deleting multiple elements at once', () => {
		cache.bulkDelete('k-1', 'k-2');
    	expect(cache.size).toStrictEqual(6);
    	expect(cache.has('k-2')).toBeFalsy();
    	expect(cache.position('k-1')).toStrictEqual(-1);
	});
	
	test('getting keys from values', () => {
		expect(cache.getKey('v2')).toStrictEqual('k2');
    	expect(cache.getKey('v7')).toBeUndefined();
	});
	
	test('checking if value exists', () => {
		expect(cache.hasValue('v4')).toBeTruthy();
    	expect(cache.hasValue('invalid value')).toBeFalsy();
	});
	
	test('resetting cache', () => {
		cache.reset(init(new Cache));
		expect(cache.size).toStrictEqual(3);
		expect(cache.position('k1')).toStrictEqual(1);
		expect(cache.get('k3')).toStrictEqual('anomaly');
	});
});

describe('further map methods', () => {
	const cache = init(new Cache());

	test('converting cache to string', () => {
		expect(cache.toString()).toStrictEqual('{ "k1": "v1", "k2": "v2", "k3": "anomaly" }');
	});

	test('converting cache to array', () => {
		expect(cache.array('keys')).toStrictEqual(['k1', 'k2', 'k3']);
		expect(cache.array('values')).toStrictEqual(['v1', 'v2', 'anomaly']);
		expect(cache.array('both')).toStrictEqual([['k1', 'v1'], ['k2', 'v2'], ['k3', 'anomaly']]);
	});
	
	test('first and last values', () => {
		expect(cache.first('k')).toStrictEqual('k1');
		expect(cache.first('v')).toStrictEqual('v1');
		expect(cache.last('k')).toStrictEqual('k3');
		expect(cache.last('5[fs$')).toStrictEqual('anomaly');
	});
	
	test('cloning cache', () => {
		const cache1 = cache.clone();
		expect(cache1.size).toStrictEqual(cache.size);
		expect(cache1.toString()).toStrictEqual(cache.toString());
		expect(cache1).toStrictEqual(cache);
	});
	
	test('checking if two caches are equal', () => {
		const cache1 = init(new Cache());
		expect(cache.equals(cache1)).toBeTruthy();
		expect(cache.equals(new Cache().set('foo', 'bar'))).toBeFalsy();
	});
	
	test('checking if an item is a cache', () => {
		expect(Cache.isCache(cache)).toBeTruthy();
		expect(Cache.isCache('this is a cache')).toBeFalsy();
	});
});

describe('static methods to make a new cache', () => {
	const cache = init(new Cache);
	
	test('Cache.of', () => {
		expect(Cache.of(['k1', 'v1'], ['k2', 'v2'], ['k3', 'anomaly'])).toStrictEqual(cache);
	});
	
	test('Cache.from', () => {
		expect(Cache.from([['k1', 'v1'], ['k2', 'v2'], ['k3', 'anomaly']])).toStrictEqual(cache);
	});
});

describe('filtering cache methods', () => {
	const cache = init(new Cache());
	
	test('filter, without modifying cache', () => {
		const filtered = cache.filter((value) => value.startsWith('v')); 
		expect(filtered.size).toStrictEqual(2);
		expect(filtered.has('v3')).toBeFalsy();
		expect(cache.size).toStrictEqual(3);
	});
	
	test('filter, modifying cache', () => {
		cache.hardFilter((value, key) => key.includes('1'));
		expect(cache.size).toStrictEqual(1);
		expect(cache.has('k2')).toBeFalsy();
		expect(cache.get('k1')).toStrictEqual('v1');
	});
});

describe('tests on elements', () => {
	const cache = init(new Cache());
	
	test('if some elements pass a test', () => {
		expect(cache.some((value, key) => key.startsWith('k'))).toBeTruthy();
		expect(cache.some((value) => value.startsWith('v'))).toBeTruthy();
	});
	
	test('if all elements pass a test', () => {
		expect(cache.every((value, key) => key.startsWith('k'))).toBeTruthy();
		expect(cache.every((value) => value.startsWith('v'))).toBeFalsy();
	});
});

describe('finding elements', () => {
	const cache = init(new Cache()).set('k4', 'v4');
	
	test('find first to pass test', () => {
		expect(cache.find(key => key.startsWith('k'), 'key')).toStrictEqual('k1');
		expect(cache.find(value => parseInt(value.slice(1)) > 2, 'value')).toStrictEqual('v4');
	});
	
	test('find first to pass test from end', () => {
		cache.set('k2', 'anomalous');
		expect(cache.findLast(key => key.startsWith('a'), 'value')).toStrictEqual('anomaly');
	});
});

describe('reversing cache', () => {
	const cache = init(new Cache());
	const expectedReverse = Cache.of(['k3', 'anomaly'], ['k2', 'v2'], ['k1', 'v1']);
	
	test('without modifying original cache', () => {
		const reversed = cache.toReversed();
		expect(reversed).toStrictEqual(expectedReverse);
		// expect(reversed).not.toStrictEqual(cache); # bug with jest?
	});
	
	test('modifying original cache', () => {
		const reversed = cache.reverse();
		expect(reversed).toStrictEqual(expectedReverse);
		expect(reversed).toStrictEqual(cache);
	});
});

describe('combining caches', () => {
	const cache = init(new Cache());
	const cache2 = Cache.of(['k4', 'v4'], ['k5', 'v5']);
	
	test('without modifying original cache', () => {
		const concatenated = cache.concat(cache2, [['k6', 'v6']]);
		expect(concatenated.size).toStrictEqual(6);
		expect(concatenated.has('k5')).toBeTruthy();
		expect(concatenated.get('k4')).toStrictEqual('v4');
		expect(concatenated.position('k6')).toStrictEqual(6);
		expect(cache).not.toStrictEqual(concatenated);
	});
	
	test('modifying original cache', () => {
		cache.join(cache2, [['k6', 'v6']]);
		expect(cache.size).toStrictEqual(6);
		expect(cache.has('k5')).toBeTruthy();
		expect(cache.get('k4')).toStrictEqual('v4');
		expect(cache.position('k6')).toStrictEqual(6);
	});
});

test('getting element at cache', () => {
	const cache = init(new Cache());
	
	expect(cache.at(3, 'key')).toStrictEqual('k3');
	expect(cache.at(2, 'value')).toStrictEqual('v2');
	expect(cache.at(1, 'both')).toStrictEqual(['k1', 'v1']);
});

describe('reducing cache to a single value', () => {
	const cache = Cache.of([1, 2], [2, 4], [3, 6]);
	
	test('reduce from the left', () => {
		expect(cache.reduce((val, acc) => val + acc, 'k')).toStrictEqual(6);
		expect(cache.reduce((val, acc) => val + acc, 'v')).toStrictEqual(12);
		
		const reduceDouble = cache.reduce((acc, val, index) => {
			if (index == 1) {
				return acc * 2 + val * 2;
			}
			return acc + val * 2;
		}, 'v');
		
		expect(reduceDouble).toStrictEqual(24);
	});
		
	test('reduce from the right', () => {
		cache.reset([['R', 1], ['A', 2], ['B', 3]]);

		const fn = (acc, val, index) => {
    		if (!acc) {
       			return val;
   			}
   			return acc + val
		}
		
		const leftTest = cache.reduce(fn, 'k');
		const rightTest = cache.reduceRight(fn, 'k');
		
		expect(rightTest).toStrictEqual('BAR');
		expect(rightTest).not.toStrictEqual(leftTest);
		expect(leftTest).toStrictEqual('RAB');
	});
});

test('mapping elements of cache', () => {
	const cache = init(new Cache());
	
	const m = cache.map((element, index) => {
		const key = parseInt(element[0].substring(1));
		let value = parseInt(element[1].substring(1)) * 2
		if (index == 3) value = element[1].charAt(0);
		return [key, value];
	});
	
	expect(m.every((v, key) => !isNaN(key))).toBeTruthy();
	expect(m.get(3)).toStrictEqual('a');
	expect(m.size).toStrictEqual(cache.size);
	expect(m.position(4, 'value')).toStrictEqual(2);
});

test('slicing a cache', () => {
	const cache = init(new Cache()).multiSet([['k4', 'v4'], ['k5', 'v5']]);
	
	expect(cache.slice(2, 4)).toStrictEqual(Cache.of(['k3', 'anomaly'], ['k4', 'v4']));
	expect(cache.slice(1)).toStrictEqual(Cache.of(['k2', 'v2'], ['k3', 'anomaly'], ['k4', 'v4'], ['k5', 'v5']));
});

test('splicing a cache', () => {
	const cache = new Cache([
		['k1', 'v1'],
		['k3', 'anomaly'],
		['k4', 'v4'],
		['k6', 'v6']
	]);
	
	cache.splice(2, 0, [['k2', 'v2']]);
	expect(cache.size).toStrictEqual(5);
	expect(cache.get('k2')).toStrictEqual('v2');
	expect(cache.position('k2', 'key')).toStrictEqual(2);

	cache.splice(5, 1, [['k5', 'v5']]);
	expect(cache.size).toStrictEqual(5);
	expect(cache.get('k5')).toStrictEqual('v5');
	expect(cache.has('k6')).toBeFalsy();;
});

test('filling a cache\'s values', () => {
	const cache = init(new Cache());
	
	cache.fill(0, 1, 3);
	expect(cache.size).toStrictEqual(3);
	expect(cache.every(v => v === 0)).toBeTruthy();
	expect(cache.position('k1')).toStrictEqual(1);
	expect(cache.position('k2')).toStrictEqual(2);
	
	cache.reset(init(new Cache), [
		['k4', 'anomaly'],
		['k5', 'anomaly'],
		['k6', 'v6']
	]);
	
	cache.fill(0, 3, 5);
	expect(cache.size).toStrictEqual(6);
	expect(cache.some(v => !isNaN(v))).toBeTruthy();
	expect(cache.get('k4')).toStrictEqual(0);
	expect(cache.get('k6')).toStrictEqual('v6');
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
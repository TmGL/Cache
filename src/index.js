class Cache extends Map {
    constructor(entries) {
        super(entries);
    }

    /**
    * Sets a new key in the cache, and assigns a value to it.
    * @param {*} key The key to add to the cache.
    * @param {*} value The value of the key.
    * @returns {Cache} The cache object.
    * @example cache.set('foo', 'bar');
    */
    set(key, value) {
        return super.set(key, value);
    }

    /**
     * Sets multiple elements into the cache, using one or more iterables.
     * @param {IterableIterator<[any, any]>} iterables The elements to add to the cache.
     * @returns {Cache} The cache object.
     * @example cache.set(otherCache, [['foo', 'bar'], ['hello', 'world']]);
     */
    multiSet(...iterables) {
        iterables.forEach(iterable => {
            for (const element of iterable) {
                this.set(element[0], element[1]);
            }
        });
        return this;
    }

    /**
     * Identical to Cache.set, but adds the element in a certain position.
     * @param {*} newKey The key to add to the cache.
     * @param {*} newValue The value of the key.
     * @param {Number} position The position to add the element to. 
     * @param {Boolean} remove Whether or not to delete the element at the given position, defaults to false.
     * @returns {Cache} A reference to the cache object.
     * @example cache.set('foo', 'bar', 3, true);
     */
    setAt(newKey, newValue, position, remove = false) {
        const cache = new Cache();
        this.forEach((value, key) => {
            if (this.position(value) === position) {
                cache.set(newKey, newValue);
                if (!remove) {
                    cache.set(key, value);
                }
            } else {
                cache.set(key, value);
            }
        });
        this.clear();
        this.multiSet(cache);
        return this;
    }

    /**
    * Removes an element from the cache and returns true if it was removed successfually, or false otherwise. 
    * @param {*} key The key of the element to remove.
    * @returns {Boolean} Returns true if the element was deleted successfully.
    * @example cache.delete('foo');
    */
    delete(key) {
        return super.delete(key);
    }

    /**
    * Returns the value from the given key, or undefined if it doesn't exist. 
    * @param {*} key The key of the value to get.
    * @returns {*} The value of the provided key.
    * @example cache.get('foo');
    */
    get(key) {
        return super.get(key);
    }

    /**
     * Returns the key of the given value, or undefined if it doesn't exist.
     * @param {*} value The value of the key to get.
     * @returns {*} The key of the provided value.
     * @example cache.getKey('bar');
     */
    getKey(value) {
        return this.find(key => this.get(key) === value, 'key');
    }

    /**
     * Returns true if the specified key exists in the cache, returns false otherwise. 
     * @param {*} key The key to check for in the cache.
     * @returns {Boolean} Whether or not the key is present.
     * @example cache.has('foo');
     */
    has(key) {
        return super.has(key);
    }

    /**
     * Returns true if the specified value exists in the cache, returns false otherwise.
     * @param {*} value The value to check for in the cache.
     * @returns {Boolean} Whether or not the value is present.
     * @example cache.hasValue('bar');
     */
    hasValue(value) {
        return this.find(key => this.get(key) === value, 'k') !== undefined ? true : false;
    }

    /**
     * Deletes all elements in the cache.
     * @returns {void}
     * @example cache.clear();
     */
    clear() {
        return super.clear();
    }

    /**
     * Returns an iterable of key-value pairs for every entry in the map.
     * @returns {IterableIterator<[any, any]>} The iterator of the cache.
     * @example cache.entries();
     */
    entries() {
        return super.entries();
    }

    /**
     * Returns an iterable of the keys in the cache.
     * @returns {IterableIterator<any>}
     * @example cache.keys();
     */
    keys() {
        return super.keys();
    }

    /**
     * Returns an iterable of the values in the cache.
     * @returns {IterableIterator<any>}
     * @example cache.values();
     */
    values() {
        return super.values();
    }

    /**
     * Executes a provided function once per each key/value pair in the Map, in insertion order.
     * @param {*} callbackFn The function that accepts up to three arguments; executes for each entry in the cache.
     * @param {*} thisArg An object to which the this keyword can refer in the callback function.
     * @returns {void} 
     */
    forEach(callbackFn, thisArg) {
        return super.forEach(callbackFn, thisArg);
    }

    /**
     * Returns the elements of the cache that meet the condition specified in the callback function.
     * @param {Function} predicate  A function that accepts up to three arguments and should return a boolean. The predicate function is called one time for each element in the cache.
     * @param {*} thisArg An object to which the this keyword can refer in the predicate function.
     * @returns {Cache}
     * @example cache.filter(value => value.includes('foo'));
     */
    filter(predicate, thisArg = undefined) {
        if (thisArg) predicate = predicate.bind(thisArg);
        const filtered = new Cache();
        this.forEach((value, key) => {
            if (predicate(value, key, this)) filtered.set(key, value);
        });
        return filtered;
    }

    /**
     * Identical to Cache.filter, but modifies the original cache. 
     * @param {Function} predicate A function that accepts up to three argument and should return a boolean. The predicate function is called for each element in the cache until the predicate returns true.
     * @param {*} thisArg 
     * @returns {Cache}
     * @example cache.hardFilter(value => value.includes('foo'));
     */
    hardFilter(predicate, thisArg) {
        const filtered = this.filter(predicate, thisArg);
        this.clear();
        this.multiSet(filtered?.entries());
        return this;
    }

    /**
     * Determines whether the specified callback function returns true for any element in the cache.
     * @param {Function} predicate A function that accepts up to three argument and should return a boolean. The predicate function is called for each element in the cache until the predicate returns true.
     * @param {*} thisArg An object to which the this keyword can refer in the predicate function.
     * @returns {Boolean} 
     * @example cache.some(value => value.includes('foo'));
     */
    some(predicate, thisArg = undefined) {
        if (thisArg) predicate = predicate.bind(thisArg);
        let result = false;
        this.forEach((value, key) => {
            if (predicate(value, key, this)) result = true;
        })
        return result;
    }

    /**
     * Determines whether the specified callback function returns true for all elements in the cache.
     * @param {Function} predicate A function that accepts up to three arguments and should return a boolean. The predicate function is called for each element in the cache until the predicate returns false, or until the end of the cache.
     * @param {*} thisArg An object to which the this keyword can refer in the predicate function.
     * @returns {Boolean}
     * @example cache.every(value => value.includes('foo'));
     */
    every(predicate, thisArg = undefined) {
        if (thisArg) predicate = predicate.bind(thisArg);
        let result = true;
        this.forEach((value, key) => {
            if (!predicate(value, key, this)) result = false;
        });
        return result;
    }

    /**
     * Returns the value of the first element in the cache where the callback function returns true, and undefined otherwise.
     * @param {Function} predicate The predicate function is called for each element of the cache, until it finds one where the predicate returns true. If the element is found, it returns it. Otherwise, it returns undefined.
     * @param {String} type A string which shows whether to look for a key or a value in the cache.
     * @param {*} thisArg An object to which the this keyword can refer in the predicate function.
     * @returns {*}
     * @example cache.find(value => value.includes('foo'));
     */
    find(predicate, type = 'value', thisArg = undefined) {
        const arr = this.array(type);
        return arr.find(predicate, thisArg);
    }

    /**
     * Identical to Cache.find, but iterates in the reverse order instead.
     * @param {Function} predicate The predicate function is called for each element of the cache, until it finds one where the predicate returns true. If the element is found it returns it, otherwise it returns undefined.
     * @param {String} type A string which shows whether to look for a key or a value in the cache.
     * @param {*} thisArg An object to which the this keyword can refer in the predicate function.
     * @returns {*}
     * @example cache.findLast(value => value.includes('foo'));
     */
    findLast(predicate, type = 'value', thisArg = undefined) {
        const arr = this.array(type);
        return arr.findLast(predicate, thisArg);
    }

    /**
     * Returns the position of the provided key or value, or -1 if it isn't found.
     * @param {String} type A string which shows whether to look for a key or a value in the cache.
     * @param {*} searchElement The key or value to locate in the cache.
     * @returns {Number}
     * @example cache.position('foo', 'value');
     */
    position(searchElement, type = 'value') {
        let index = this.array(type).indexOf(searchElement);
        return index === -1 ? index : index + 1;
    }

    /**
     * Reverses the elements in the cache in place and returns it. 
     * @returns {Cache} Reference to the new cache.
     * @example cache.reverse();
     */
    reverse() {
        const reversed = Array.from(this.entries()).reverse();
        this.clear();
        for (let x of reversed) {
            this.set(x[0], x[1]);
        }
        return this;
    }

    /**
     * Identical to Cache.reverse(), but does not modify the original cache.
     * @returns {Cache} A reversed copy of the cache.
     * @example cache.hardReverse();
     */
    toReversed() {
        const reversed = new Cache();
        const arr = this.array('key').reverse();
        arr.forEach(key => {
            reversed.set(key, this.get(key));
        });
        return reversed;
    }

    /**
     * Joins the current cache with the others provided, to make a new cache. Does not modify the original cache.
     * @param  {...Cache} items Additional caches and/or items to add to the end of the cache.
     * @returns {Cache} The new cache.
     * @example cache.concat(cache1, [['foo', 'bar']]);
     */
    concat(...items) {
        const joined = this.clone();
        items.forEach((item) => {
            const cache = new Cache(item);
            joined.multiSet(cache);
        });
        return joined;
    }

    /**
     * Identical to cache.concat, but modifies the original cache and returns it.
     * @param  {...Cache} items Additional caches and/or items to add to the end of the cache.
     * @returns {Cache} Reference to the new cache.
     * @example cache.join(cache1, [['foo', 'bar']]);
     */
    join(...items) {
        items.forEach(item => {
            const cache = new Cache(item);
            this.multiSet(cache);
        });
        return this;
    }

    /**
     * Creates a new cache from the given arguments.
     * @param {*} The elements to create a cache.  
     * @returns {Cache}
     * @example Cache.of(['foo', 'bar'], ['hello', 'world']);
     */
    static of(...items) {
        return new Cache(items);
    }

    /**
     * Creates a new cache from the given iterable.
     * @param {IterableIterator<[any, any]>} entries The iterable to create the cache.
     * @param {Function} mapFn A function to call on every element of the cache, where the return value is instead added to the cache. There can be 2 parameters: the element and the index.
     * @returns {Cache} The new cache.
     * @example Cache.from([['foo', 'bar'], ['hello', 'world']]);
     */
    static from(entries, mapFn, thisArg) {
        if (thisArg) mapFn = mapFn.bind(thisArg);
        if (mapFn) {
            const cache = new Cache();
            let index = 1;
            for (let x of entries) {
                const update = mapFn(x, index);
                if (update !== undefined) {
                    cache.set(update[0], update[1]);
                }
                index++;
            }
            return cache;
        } else return new Cache(entries);
    }

    /**
     * Determines the key at the specified index of the cache, returns a new cache of the key and value.
     * @param {Number} index The index of the key.
     * @returns {Cache} A new cache of the key and value.
     * @example cache.at(3);
     */
    at(index) {
        const arr = this.array();
        const key = arr.at(index);
        return Cache.of([key, this.get(key)]);
    }

    /**
     * The provided callback function executes on each key or value in the cache, accumulating the cache to a single value.
     * @param {Function} callbackFn The function to run on each element in the cache. The function should have 2 parameters: the accumulator and current value.
     * @param {String} type Whether to reduce the keys or values.
     * @param {*} initialValue The first value to be used as the accumulator on the first call.
     * @returns {Number}
     * @example cache.reduce((acc, val) => acc + val, 'key', 10)
       */
    reduce(callbackFn, type = 'value', initialValue = undefined) {
        const arr = this.array(type);
        return arr.reduce(callbackFn, initialValue);
    }

    /**
     * Identical to Cache.reduce, but iterates in the reverse order.
     * @param {Function} callbackFn The function to run on each element in the cache.
     * @param {String} type Whether to reduce the keys or values.
     * @param {*} initialValue The first value to be used as the accumulator on the first call.
     * @returns {Number}
     * @example cache.reduceRight((acc, val) => acc + val, 'key', 10)
       */
    reduceRight(callbackFn, type = 'value', initialValue = undefined) {
        const arr = this.array(type);
        return arr.reduceRight(callbackFn, initialValue);
    }

    /**
     * Creates a new cache from the results of the function executed on every element.
     * @param {Function} callbackFn The function to execute on each element in the cache.
     * @param {*} thisArg An object to which the this keyword can refer in the callback function.
     * @returns {Cache} The new cache.
     * @example cache.map(x => x[0] * 2);
     */
    map(callbackFn, thisArg) {
        if (thisArg) callbackFn = callbackFn.bind(thisArg);
        const cache = new Cache();
        let index = 1
        for (let x of this) {
            const toMap = callbackFn(x, index, this);
            if (toMap !== undefined) {
                cache.set(toMap[0], toMap[1]);
            }
            index++;
        }
        return cache;
    }

    /**
     * Creates a new cache by removing a portion of the current cache.
     * @param {Number} start The position to start the extraction.
     * @param {Number} end The position to end the extraction.
     * @returns {Cache} The new cache, containing the extracted elements.
     * @example cache.slice(2, 4);
     */
    slice(start, end) {
        const cache = new Cache();
        this.forEach((value, key) => {
            const pos = this.position(key, 'k');
            if (pos < start || pos > end) {
                cache.set(key, value);
            }
        });
        return cache;
    }

    /**
     * Changes a portion of the cache by removing or replacing existing elements.
     * @param {Number} start The position to start changing the cache.
     * @param {Number} deleteCount How many elements to remove.
     * @param  {...any[]} items The elements to add to the cache.
     * @returns {Cache} A reference to the cache.
     * @example cache.splice(1, 3, [['foo', 'bar']], otherCache);
     */
    splice(start, deleteCount, ...items) {
        const cache = new Cache();
        this.forEach((value, key) => {
            const pos = this.position(key, 'k');
            if (pos < start) {
                cache.set(key, value);
            } else {
                if (items.length !== 0) {
                    for (const x of items) {
                        cache.set(x[0], x[1]);
                    }
                }
                if (pos + items.length > cache.size + deleteCount) {
                    cache.set(key, value);
                }
            }
        });
        this.clear();
        this.multiSet(cache.entries());
        return this;
    }

    /**
     * Changes all of the values between the given position to a static value. This modifies the orginal cache.
     * @param {*} newValue The value to fill the cache with.
     * @param {Number} start The position to start filling from.
     * @param {Number} end The position to stop filling.
     * @returns {Cache} A reference to the cache.
     * @example cache.fill('bar', 2, 4);
     */
    fill(newValue, start = 0, end = 0) {
        const cache = new Cache();
        this.forEach((value, key) => {
            const pos = this.position(key, 'k');
            if (pos < start || pos > end) {
                cache.set(key, value);
            } else {
                cache.set(key, newValue);
            }
        });
        this.clear();
        this.multiSet(cache.entries());
        return this;
    }
    /**
    * Returns an array of either the key or value, from the provided argument (default is value).
    * @param {String} type A string which shows whether to make the array with the cache's keys, values or a 2D array with both.
    * @returns {Array}
    * @example cache.array('keys');
    */
    array(type = 'value') {
        type = type ? type.toLowerCase() : undefined;
        switch (type) {
            case 'keys':
            case 'key':
            case 'ke':
            case 'k':
                return Array.from(this.keys());

            default:
                return Array.from(this.values());
        }
    }

    /**
    * Returns the first key or value in the cache depending on the argument (default is value), or undefined if the cache is empty.
    * @param {String} type A string which shows whether to return the first key or value in the cache.
    * @returns {*}
    * @example cache.first('value');
    */
    first(type = 'value') {
        return this.array(type).shift();
    }

    /**
     * Returns the last key or value in the cache depending on the argument (default is value), or undefined if the cache is empty.
     * @param {String} type A string which shows whether to return the last key or value in the cache.
     * @returns {*}
     * @example cache.last('value');
     */
    last(type = 'value') {
        return this.array(type).pop();
    }

    /**
     * Returns a random key or value depending on the argument (default is value) from the cache, or undefined if the cache is empty.
     * @param {String} type A string which shows whether to return a random key or value in the cache.
     * @returns {Cache}
     * @example cache.random('value');
     */
    random(type = 'value') {
        const arr = this.array(type);
        if (!arr.length) {
            return undefined;
        }
        return arr[Math.floor(Math.random() * arr.length)];
    }

    /**
     * Deletes multiple elements in the cache from the provided positions and/or keys.
     * @param  {...*} keys 
     * @returns {Cache}
     * @example cache.bulkdDelete('foo', 'bar', 'hello world');
     */
    bulkDelete(...keys) {
        keys.forEach((key) => {
            super.delete(key);
        });
        return this;
    }

    /**
     *  Creates an exact replica of the cache.
     * @returns {Cache} 
     * @example const clone = cache.clone()
     */
    clone() {
        return new Cache(this);
    }

    /**
     * Checks if two caches are equal.
     * @param {Cache} cache The item to compare with this cache.
     * @param {Boolean} order Whether or not to check the order of the caches are the same; defaults to true.
     * @returns {Boolean}
     * @example cache.equals(new Cache([['foo', 'bar']]));
    */
    equals(cache, order = true) {
        if (!Cache.isCache(cache)) return false;
        if (this.size !== cache.size) return false;
        if (order) {
            const c1 = JSON.stringify(Object.fromEntries(this));
            const c2 = JSON.stringify(Object.fromEntries(cache));
            if (c1 === c2) {
                return true;
            } else return false;
        } else {
            const keys = cache.array('k');
            keys.forEach((key) => {
                this.delete(key);
            });
            if (this.size === 0) {
                return true;
            } else return false;
        }
    }

    /**
     * Displays the cache as a string.
     * @returns {String} The cache as a string.
     * @example cache.toString();
     */
    toString() {
        const arr = [];
        for (const x of this.entries()) {
            arr.push(`${x[0]}: ${x[1]}`);
        }
        let str = '{ ';
        for (const x of arr) {
            if (arr[arr.length - 1] === x) {
                str = str + x + ' }';
            } else {
                str = str + x + ', ';
            }
        }
        return str;
    }

    /**
     * Returns true if the provided argument is a Cache, or false otherwise.
     * @param {*} maybeCache The item that may or may not be a cache.
     * @returns {Boolean}
     * @example Cache.isCache(cache);
     */
    static isCache(maybeCache) {
        return maybeCache instanceof Cache;
    }

    /**
     * Returns the number of elements in the cache.
     * @returns {Number}
     * @example cache.size();
     */
    get size() {
        return super.size;
    }
}

module.exports = Cache;
class Cache extends Map {
    constructor(entries) {
        super(entries);
    }

    /**
    * Sets the value for the key in the cahce.
    * @param {*} key 
    * @returns {Cache} 
    * @example cache.set('foo', 'bar');
    */
    set(key, value) {
        return super.set(key, value);
    }

    /**
    * Removes an element from the cache and returns true if it was removed successfually, or false otherwise. 
    * @param {*} key
    * @returns {boolean} returns true if the element was deleted
    * @param cache.delete('foo');
    */
    delete(key) {
        return super.delete(key);
    }

    /**
    * Returns the value from the key, or undefined if it doesn't exist. 
    * @param {*} key
    * @returns {*}
    * @example cache.get('foo');
    */
    get(key) {
        return super.get(key);
    }

    /**
    * Returns true if the key exists in the cache, returns false otherwise. 
    * @param {*} key
    * @returns {boolean}
    * @example cache.has('foo');
    */
    has(key) {
        return super.has(key);
    }

    /**
     * Deletes all elements in the cache.
     * @returns {void}
     * @example cache.clear()
     */
    clear() {
        return super.clear();
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
        return filtered.size ? filtered : undefined;
    }

    /**
     * Determines whether the specified callback function returns true for any element in the cache.
     * @param {Function} predicate A function that accepts up to three argument and should return a boolean. The predicate function is called for each element in the cache until the predicate returns true.
     * @param {*} thisArg An object to which the this keyword can refer in the predicate function.
     * @returns {boolean} 
     * @example cache.some(value => value.includes('foo'))
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
     * @returns {boolean}
     * @example cache.every(value => value.includes('foo'))
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
     * @param {string} type A string which shows whether to look for a key or a value in the cache.
     * @param {Function} predicate The predicate function is called for each element of the cache, until it finds one where the predicate returns true. If the element is found, it returns it. Otherwise, it returns undefined.
     * @param {*} thisArg An object to which the this keyword can refer in the predicate function.
     * @returns {*}
     * @example cache.find('value', value => value.includes('foo'));
     */
    find(type = "value", predicate, thisArg = undefined) {
        const arr = this.array(type);
        return arr.find(predicate, thisArg);
    }

    /**
     * Returns the position of the first occurance of the provided key or value, or -1 if it isn't found.
     * @param {string} type A string which shows whether to look for a key or a value in the cache.
     * @param {*} searchElement The key/value to locate in the cache.
     * @returns {number}
     * @example cache.position('value', 'foo')
     */
    position(type = "value", searchElement) {
        let index = this.array(type).indexOf(searchElement);
        return index === -1 ? index : index + 1;
    }

    /**
     * Reverses the elements in the cache in place and returns it. 
     * @returns {Cache}
     * @example cache.reverse()
     */
    reverse() {
        const reversed = new Cache();
        const arr = this.array('key').reverse();
        arr.forEach(key => {
            reversed.set(key, this.get(key));
        });
        return reversed;
    }

    /**
     * Joins the current cache with the others provided, to make a new cache.
     * @param  {...Cache} items Additional caches and/or items to add to the end of the cache.
     * @returns {Cache} 
     * @example cache.concat(cache1, array1)
     */
    concat(...items) {
        const joined = new Cache(this);
        items.forEach((item) => {
            const cache = new Cache(item);
            cache.forEach((value, key) => {
                joined.set(key, value);
            });
        });
        return joined;
    }

    /**
    * Returns an array of either the key or value, from the provided argument (default is value).
    * @param {string} type A string which shows whether to make the array with the cache's keys or values.
    * @returns {Array}
    * @example cache.array('key')
    */
    array(type = "value") {
        type = type ? type.toLowerCase() : undefined;
        switch (type) {
            case "keys":
            case "key":
            case "ke":
            case "k":
                return Array.from(this.keys());

            case "values":
            case "value":
            case "val":
            case "v":
            default:
                return Array.from(this.values());
        }
    }

    /**
    * Returns the first key or value in the cache depending on the argument (default is value), or undefined if the cache is empty.
    * @param {string} type A string which shows whether to return the first key or value in the cache.
    * @returns {*}
    * @example cache.first('value')
    */
    first(type = "value") {
        return this.array(type).shift();
    }

    /**
     * Returns the last key or value in the cache depending on the argument (default is value), or undefined if the cache is empty.
     * @param {string} type A string which shows whether to return the last key or value in the cache.
     * @returns {*}
     * @example cache.last('value')
     */
    last(type = "value") {
        return this.array(type).pop();
    }

    /**
     * Returns a random key or value depending on the argument (default is value) from the cache, or undefined if the cache is empty.
     * @param {string} type A string which shows whether to return a random key or value in the cache.
     * @returns {Cache}
     * @example cache.random('value')
     */
    random(type = "value") {
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
     * @example cache.bulkdDelete('foo', 'bar', 'hello world')
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
	 * Creates an exact replica of the cache.
	 * @returns {Cache} 
	 * @example const clone = cache.clone();
	*/
	}

    /**
     * Does the same thing as Cache.filter, but modifies the original cache. 
     * @param {Function} predicate 
     * @param {*} thisArg 
     * @returns {Cache}
     * @example cache.hardFilter(value => value.includes('foo'));
     */
    hardFilter(predicate, thisArg) {
        const filtered = this.filter(predicate, thisArg);
        this.clear();
        filtered.forEach((value, key) => {
            this.set(key, value);
        });
        return this;
    }

    /**
     * Returns true if the provided argument is a Cache, or false otherwise.
     * @param {*} maybeCache 
     * @returns {boolean}
     */
    static isCache(maybeCache) {
        return maybeCache instanceof Cache;
    }

    /**
     * Returns the number of elements in the cache.
     * @returns {number}
     */
    get size() {
        return super.size;
    }
}

module.exports = Cache;
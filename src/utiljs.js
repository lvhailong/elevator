'use strict';

if (typeof GJS === "undefined") {
    var GJS = {};
}

var arrayUtil = {}; // Utilities for working with JS arrays
var stringUtil = {}; // Utilities for working with JS strings
var objectUtil = {}; // Utilities for working with JS objects

/**
 * Count the number of matches in an array.
 * @param {Array} array Array to check.
 * @param {function} matchFunc Function that takes one array item and returns true if it should be counted.
 * @return {number} The number of matching entries.
 */
arrayUtil.count = function(array, matchFunc) {
    return array.filter(matchFunc).length;
};

/**
 * Filter an array by removing elements that are found in the other array.
 * @param {Array} array Array to filter.
 * @param {Array} arrayToRemove Values to remove from the first array.
 * @return {Array} A new array with the filtered elements.
 */
arrayUtil.filterArray = function(array, arrayToRemove) {
    return array.filter(function(value) {
        return arrayToRemove.indexOf(value) < 0;
    });
};

/**
 * @param {Array} array Array to shuffle.
 * @return {Array} A shuffled copy of the array.
 */
arrayUtil.shuffle = function(array) {
    array = array.slice(0);
    var currentIndex = array.length, temporaryValue, randomIndex;

    // While there remain elements to shuffle...
    while (0 !== currentIndex) {
        // Pick a remaining element...
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;

        // And swap it with the current element.
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }
    return array;
};

/**
 * @param {Array} array Array to shuffle.
 * @param {number} maxSubsetLength Maximum subset to return.
 * @return {Array} A random subset of the array containing at most maxSubsetLength elements.
 */
arrayUtil.randomSubset = function(array, maxSubsetLength) {
    var shuffled = arrayUtil.shuffle(array);
    return shuffled.splice(0, maxSubsetLength);
};

/**
 * @param {Array} array Array to shuffle.
 * @return {Object} A random item from the array.
 */
arrayUtil.randomItem = function(array) {
    var index = Math.floor(Math.random() * array.length);
    return array[index];
};

/**
 * Set a property in all elements in an array to a certain value.
 * @param {Array} array Array to edit.
 * @param {string} key Property to set in all elements.
 * @param {Object} value A value to set to the property in all elements.
 */
arrayUtil.setPropertyInAll = function(array, key, value) {
    for (var i = 0; i < array.length; ++i) {
        array[i][key] = value;
    }
};

/**
 * Stable sort an array in place.
 * @param {Array} array Array to sort.
 * @param {function} compareFunction Function as in Array.prototype.sort.
 * @return {Array} The sorted array.
 */
arrayUtil.stableSort = function(array, compareFunction) {
    if (array.length < 2) {
        return array;
    }
    var merge = function(left, right) {
        var result  = [];
        var l = 0;
        var r = 0;

        while (l < left.length && r < right.length) {
            if (compareFunction(left[l], right[r]) <= 0) {
                result.push(left[l]);
                ++l;
            } else {
                result.push(right[r]);
                ++r;
            }
        }
        result = result.concat(left.slice(l));
        result = result.concat(right.slice(r));
        return result;
    };
    
    var middle = Math.floor(array.length / 2);
    var left = array.slice(0, middle);
    var right = array.slice(middle);
    arrayUtil.stableSort(left, compareFunction);
    arrayUtil.stableSort(right, compareFunction);
    var spliceParams = [0, array.length]; // First two parameters of splice()
    var merged = merge(left, right);
    spliceParams = spliceParams.concat(merged);
    array.splice.apply(array, spliceParams);
    return array;
};

/**
 * @param {string} string Input string.
 * @return {string} String with the first letter capitalized.
 */
stringUtil.capitalizeFirstLetter = function(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
};



/**
 * Initialize an object with default values.
 * @param {Object} obj Object to set properties on.
 * @param {Object} defaults Default properties. Every property needs to have a default value here.
 * @param {Object} options Options to override the default properties.
 */
objectUtil.initWithDefaults = function(obj, defaults, options) {
    for(var key in defaults) {
        if (!options.hasOwnProperty(key)) {
            obj[key] = defaults[key];
        } else {
            obj[key] = options[key];
        }
    }
};

/**
 * Create a wrapper for an object that forwards method calls and set/get on properties.
 * @param {Object} toWrap Object to wrap.
 * @param {function()=} excludeFromForwarding Function that takes a key string and returns true if it should be
 *                      excluded from forwarding. Defaults to not excluding anything.
 * @return {Object} Wrapped object.
 */
objectUtil.wrap = function(toWrap, excludeFromForwarding) {
    if (excludeFromForwarding === undefined) {
        excludeFromForwarding = function() { return false; };
    }
    var wrapper = {};
    for (var prop in toWrap) {
        (function(p) {
            if (!excludeFromForwarding(p)) {
                if (typeof toWrap[p] == 'function') {
                    wrapper[p] = function() {
                        toWrap[p].apply(toWrap, arguments); 
                    };
                } else  {
                    Object.defineProperty(wrapper, p, {
                        get: function() { return toWrap[p]; },
                        set: function(v) { toWrap[p] = v; }
                    });
                }
            }
        })(prop);
    }
    return wrapper;
};


/**
 * Request fullscreen on a given element.
 * @param {HTMLElement} elem Element to make fullscreen.
 */
GJS.requestFullscreen = function(elem) {
    if (elem.requestFullscreen) {
        elem.requestFullscreen();
    } else if (elem.msRequestFullscreen) {
        elem.msRequestFullscreen();
    } else if (elem.mozRequestFullScreen) {
        elem.mozRequestFullScreen();
    } else if (elem.webkitRequestFullscreen) {
        elem.webkitRequestFullscreen();
    }
};

/**
 * Exit fullscreen.
 */
GJS.exitFullscreen = function() {
    if(document.exitFullscreen) {
        document.exitFullscreen();
    } else if(document.mozCancelFullScreen) {
        document.mozCancelFullScreen();
    } else if(document.webkitExitFullscreen) {
        document.webkitExitFullscreen();
    }
};

/**
 * @param {function} listener Listener to call when fullscreen state changes.
 */
GJS.addFullscreenChangeListener = function(listener) {
    document.addEventListener('fullscreenchange', listener);
    document.addEventListener('mozfullscreenchange', listener);
    document.addEventListener('webkitfullscreenchange', listener);
};

/**
 * @return {boolean} True if document is currently fullscreen.
 */
GJS.isFullscreen = function() {
    if (document.fullscreenElement ||
        document.webkitFullscreenElement ||
        document.mozFullScreenElement ||
        document.webkitCurrentFullScreenElement)
    {
        return true;
    }
    return false;
};


/**
 * Change 'state' property of an object and set its 'stateTime' property to zero. Meant for very simple state machines.
 * @param {Object} that Object to set state on.
 * @param {Object} state State to set.
 */
var changeState = function(that, newState) {
    that.state = newState;
    that.stateTime = 0.0;
};

/**
 * Change an attribute of an object closer to zero by a certain delta value.
 * @param {Object} that Object to set state on.
 * @param {string} key Property name to set. Note: always refer to properties changed by this function with [] notation
 * if you want Closure compiler compatibility.
 * @param {number} delta How much to change that[key].
 */
var propertyToZero = function(that, key, delta) {
    propertyToValue(that, key, 0, delta);
};

/**
 * Change an attribute of an object closer to a target value by a certain delta value.
 * @param {Object} that Object to set state on.
 * @param {string} key Property name to set. Note: always refer to properties changed by this function with [] notation
 * if you want Closure compiler compatibility.
 * @param {number} value Value that[key] should approach.
 * @param {number} delta How much to change that[key].
 */
var propertyToValue = function(that, key, value, delta) {
    if (that[key] > value) {
        that[key] -= delta;
        if (that[key] < value)
            that[key] = value;
    }
    if (that[key] < value) {
        that[key] += delta;
        if (that[key] > value)
            that[key] = value;
    }
};

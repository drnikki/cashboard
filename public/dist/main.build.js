require.config({
    paths: {
        almond: "vendor/bower/almond/almond",
        underscore: "vendor/bower/lodash/dist/lodash.underscore",
        jquery: "vendor/bower/jquery/jquery",
        backbone: "vendor/bower/backbone/backbone",
        text: "vendor/lib/require.text",
        handlebars: "vendor/lib/handlebars",
        viewsPath: "modules/views",
        events: "modules/events"
    },
    shim: {
        backbone: {
            deps: [ "jquery", "underscore" ],
            exports: "Backbone"
        },
        handlebars: {
            exports: "Handlebars"
        }
    }
}), define("config", function() {}), function() {
    var undefined, idCounter = 0, indicatorObject = {}, keyPrefix = +(new Date) + "", reInterpolate = /<%=([\s\S]+?)%>/g, reNoMatch = /($^)/, reUnescapedString = /['\n\r\t\u2028\u2029\\]/g, argsClass = "[object Arguments]", arrayClass = "[object Array]", boolClass = "[object Boolean]", dateClass = "[object Date]", funcClass = "[object Function]", numberClass = "[object Number]", objectClass = "[object Object]", regexpClass = "[object RegExp]", stringClass = "[object String]", objectTypes = {
        "boolean": !1,
        "function": !0,
        object: !0,
        number: !1,
        string: !1,
        "undefined": !1
    }, stringEscapes = {
        "\\": "\\",
        "'": "'",
        "\n": "n",
        "\r": "r",
        "	": "t",
        "\u2028": "u2028",
        "\u2029": "u2029"
    }, root = objectTypes[typeof window] && window || this, freeExports = objectTypes[typeof exports] && exports && !exports.nodeType && exports, freeModule = objectTypes[typeof module] && module && !module.nodeType && module, moduleExports = freeModule && freeModule.exports === freeExports && freeExports, freeGlobal = objectTypes[typeof global] && global;
    freeGlobal && (freeGlobal.global === freeGlobal || freeGlobal.window === freeGlobal) && (root = freeGlobal);
    function baseIndexOf(array, value, fromIndex) {
        var index = (fromIndex || 0) - 1, length = array ? array.length : 0;
        while (++index < length) if (array[index] === value) return index;
        return -1;
    }
    function compareAscending(a, b) {
        var ac = a.criteria, bc = b.criteria;
        if (ac !== bc) {
            if (ac > bc || typeof ac == "undefined") return 1;
            if (ac < bc || typeof bc == "undefined") return -1;
        }
        return a.index - b.index;
    }
    function escapeStringChar(match) {
        return "\\" + stringEscapes[match];
    }
    function noop() {}
    var arrayRef = [], objectProto = Object.prototype, oldDash = root._, reNative = RegExp("^" + String(objectProto.valueOf).replace(/[.*+?^${}()|[\]\\]/g, "\\$&").replace(/valueOf|for [^\]]+/g, ".+?") + "$"), ceil = Math.ceil, floor = Math.floor, hasOwnProperty = objectProto.hasOwnProperty, now = reNative.test(now = Date.now) && now || function() {
        return +(new Date);
    }, push = arrayRef.push, toString = objectProto.toString, unshift = arrayRef.unshift, nativeBind = reNative.test(nativeBind = toString.bind) && nativeBind, nativeCreate = reNative.test(nativeCreate = Object.create) && nativeCreate, nativeIsArray = reNative.test(nativeIsArray = Array.isArray) && nativeIsArray, nativeIsFinite = root.isFinite, nativeIsNaN = root.isNaN, nativeKeys = reNative.test(nativeKeys = Object.keys) && nativeKeys, nativeMax = Math.max, nativeMin = Math.min, nativeRandom = Math.random, nativeSlice = arrayRef.slice, isIeOpera = reNative.test(root.attachEvent), isV8 = nativeBind && !/\n|true/.test(nativeBind + isIeOpera);
    function lodash(value) {
        return value instanceof lodash ? value : new lodashWrapper(value);
    }
    function lodashWrapper(value, chainAll) {
        this.__chain__ = !!chainAll, this.__wrapped__ = value;
    }
    lodashWrapper.prototype = lodash.prototype;
    var support = {};
    (function() {
        var object = {
            "0": 1,
            length: 1
        };
        support.fastBind = nativeBind && !isV8, support.spliceObjects = (arrayRef.splice.call(object, 0, 1), !object[0]);
    })(1), lodash.templateSettings = {
        escape: /<%-([\s\S]+?)%>/g,
        evaluate: /<%([\s\S]+?)%>/g,
        interpolate: reInterpolate,
        variable: ""
    };
    function baseCreateCallback(func, thisArg, argCount) {
        if (typeof func != "function") return identity;
        if (typeof thisArg == "undefined") return func;
        switch (argCount) {
          case 1:
            return function(value) {
                return func.call(thisArg, value);
            };
          case 2:
            return function(a, b) {
                return func.call(thisArg, a, b);
            };
          case 3:
            return function(value, index, collection) {
                return func.call(thisArg, value, index, collection);
            };
          case 4:
            return function(accumulator, value, index, collection) {
                return func.call(thisArg, accumulator, value, index, collection);
            };
        }
        return bind(func, thisArg);
    }
    function baseFlatten(array, isShallow, isArgArrays, fromIndex) {
        var index = (fromIndex || 0) - 1, length = array ? array.length : 0, result = [];
        while (++index < length) {
            var value = array[index];
            if (value && typeof value == "object" && typeof value.length == "number" && (isArray(value) || isArguments(value))) {
                isShallow || (value = baseFlatten(value, isShallow, isArgArrays));
                var valIndex = -1, valLength = value.length, resIndex = result.length;
                result.length += valLength;
                while (++valIndex < valLength) result[resIndex++] = value[valIndex];
            } else isArgArrays || result.push(value);
        }
        return result;
    }
    function baseIsEqual(a, b, stackA, stackB) {
        if (a === b) return a !== 0 || 1 / a == 1 / b;
        var type = typeof a, otherType = typeof b;
        if (a === a && (!a || !objectTypes[type]) && (!b || !objectTypes[otherType])) return !1;
        if (a == null || b == null) return a === b;
        var className = toString.call(a), otherClass = toString.call(b);
        if (className != otherClass) return !1;
        switch (className) {
          case boolClass:
          case dateClass:
            return +a == +b;
          case numberClass:
            return a != +a ? b != +b : a == 0 ? 1 / a == 1 / b : a == +b;
          case regexpClass:
          case stringClass:
            return a == String(b);
        }
        var isArr = className == arrayClass;
        if (!isArr) {
            if (hasOwnProperty.call(a, "__wrapped__ ") || b instanceof lodash) return baseIsEqual(a.__wrapped__ || a, b.__wrapped__ || b, stackA, stackB);
            if (className != objectClass) return !1;
            var ctorA = a.constructor, ctorB = b.constructor;
            if (ctorA != ctorB && !(isFunction(ctorA) && ctorA instanceof ctorA && isFunction(ctorB) && ctorB instanceof ctorB)) return !1;
        }
        stackA || (stackA = []), stackB || (stackB = []);
        var length = stackA.length;
        while (length--) if (stackA[length] == a) return stackB[length] == b;
        var result = !0, size = 0;
        stackA.push(a), stackB.push(b);
        if (isArr) {
            size = b.length, result = size == a.length;
            if (result) while (size--) if (!(result = baseIsEqual(a[size], b[size], stackA, stackB))) break;
            return result;
        }
        return forIn(b, function(value, key, b) {
            if (hasOwnProperty.call(b, key)) return size++, !(result = hasOwnProperty.call(a, key) && baseIsEqual(a[key], value, stackA, stackB)) && indicatorObject;
        }), result && forIn(a, function(value, key, a) {
            if (hasOwnProperty.call(a, key)) return !(result = --size > -1) && indicatorObject;
        }), result;
    }
    function baseUniq(array, isSorted, callback) {
        var index = -1, indexOf = getIndexOf(), length = array ? array.length : 0, result = [], seen = callback ? [] : result;
        while (++index < length) {
            var value = array[index], computed = callback ? callback(value, index, array) : value;
            if (isSorted ? !index || seen[seen.length - 1] !== computed : indexOf(seen, computed) < 0) callback && seen.push(computed), result.push(value);
        }
        return result;
    }
    function createAggregator(setter) {
        return function(collection, callback, thisArg) {
            var result = {};
            callback = createCallback(callback, thisArg, 3);
            var index = -1, length = collection ? collection.length : 0;
            if (typeof length == "number") while (++index < length) {
                var value = collection[index];
                setter(result, value, callback(value, index, collection), collection);
            } else forOwn(collection, function(value, key, collection) {
                setter(result, value, callback(value, key, collection), collection);
            });
            return result;
        };
    }
    function createBound(func, bitmask, partialArgs, partialRightArgs, thisArg, arity) {
        var isBind = bitmask & 1, isBindKey = bitmask & 2, isCurry = bitmask & 4, isCurryBound = bitmask & 8, isPartial = bitmask & 16, isPartialRight = bitmask & 32, key = func;
        if (!isBindKey && !isFunction(func)) throw new TypeError;
        isPartial && !partialArgs.length && (bitmask &= -17, isPartial = partialArgs = !1), isPartialRight && !partialRightArgs.length && (bitmask &= -33, isPartialRight = partialRightArgs = !1);
        if (isBind && !(isBindKey || isCurry || isPartialRight) && (support.fastBind || nativeBind && isPartial)) {
            if (isPartial) {
                var args = [ thisArg ];
                push.apply(args, partialArgs);
            }
            var bound = isPartial ? nativeBind.apply(func, args) : nativeBind.call(func, thisArg);
        } else bound = function() {
            var args = arguments, thisBinding = isBind ? thisArg : this;
            if (isCurry || isPartial || isPartialRight) {
                args = nativeSlice.call(args), isPartial && unshift.apply(args, partialArgs), isPartialRight && push.apply(args, partialRightArgs);
                if (isCurry && args.length < arity) return bitmask |= 16, createBound(func, isCurryBound ? bitmask : bitmask & -4, args, null, thisArg, arity);
            }
            isBindKey && (func = thisBinding[key]);
            if (this instanceof bound) {
                thisBinding = createObject(func.prototype);
                var result = func.apply(thisBinding, args);
                return isObject(result) ? result : thisBinding;
            }
            return func.apply(thisBinding, args);
        };
        return bound;
    }
    function createObject(prototype) {
        return isObject(prototype) ? nativeCreate(prototype) : {};
    }
    nativeCreate || (createObject = function(prototype) {
        if (isObject(prototype)) {
            noop.prototype = prototype;
            var result = new noop;
            noop.prototype = null;
        }
        return result || {};
    });
    function escapeHtmlChar(match) {
        return htmlEscapes[match];
    }
    function getIndexOf() {
        var result = (result = lodash.indexOf) === indexOf ? baseIndexOf : result;
        return result;
    }
    function unescapeHtmlChar(match) {
        return htmlUnescapes[match];
    }
    function isArguments(value) {
        return value && typeof value == "object" && typeof value.length == "number" && toString.call(value) == argsClass || !1;
    }
    isArguments(arguments) || (isArguments = function(value) {
        return value && typeof value == "object" && typeof value.length == "number" && hasOwnProperty.call(value, "callee") || !1;
    });
    var isArray = nativeIsArray || function(value) {
        return value && typeof value == "object" && typeof value.length == "number" && toString.call(value) == arrayClass || !1;
    }, shimKeys = function(object) {
        var index, iterable = object, result = [];
        if (!iterable) return result;
        if (!objectTypes[typeof object]) return result;
        for (index in iterable) hasOwnProperty.call(iterable, index) && result.push(index);
        return result;
    }, keys = nativeKeys ? function(object) {
        return isObject(object) ? nativeKeys(object) : [];
    } : shimKeys, htmlEscapes = {
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#x27;"
    }, htmlUnescapes = invert(htmlEscapes), reEscapedHtml = RegExp("(" + keys(htmlUnescapes).join("|") + ")", "g"), reUnescapedHtml = RegExp("[" + keys(htmlEscapes).join("") + "]", "g");
    function assign(object) {
        if (!object) return object;
        for (var argsIndex = 1, argsLength = arguments.length; argsIndex < argsLength; argsIndex++) {
            var iterable = arguments[argsIndex];
            if (iterable) for (var key in iterable) object[key] = iterable[key];
        }
        return object;
    }
    function clone(value) {
        return isObject(value) ? isArray(value) ? nativeSlice.call(value) : assign({}, value) : value;
    }
    function defaults(object) {
        if (!object) return object;
        for (var argsIndex = 1, argsLength = arguments.length; argsIndex < argsLength; argsIndex++) {
            var iterable = arguments[argsIndex];
            if (iterable) for (var key in iterable) typeof object[key] == "undefined" && (object[key] = iterable[key]);
        }
        return object;
    }
    var forIn = function(collection, callback) {
        var index, iterable = collection, result = iterable;
        if (!iterable) return result;
        if (!objectTypes[typeof iterable]) return result;
        for (index in iterable) if (callback(iterable[index], index, collection) === indicatorObject) return result;
        return result;
    }, forOwn = function(collection, callback) {
        var index, iterable = collection, result = iterable;
        if (!iterable) return result;
        if (!objectTypes[typeof iterable]) return result;
        for (index in iterable) if (hasOwnProperty.call(iterable, index) && callback(iterable[index], index, collection) === indicatorObject) return result;
        return result;
    };
    function functions(object) {
        var result = [];
        return forIn(object, function(value, key) {
            isFunction(value) && result.push(key);
        }), result.sort();
    }
    function has(object, property) {
        return object ? hasOwnProperty.call(object, property) : !1;
    }
    function invert(object) {
        var index = -1, props = keys(object), length = props.length, result = {};
        while (++index < length) {
            var key = props[index];
            result[object[key]] = key;
        }
        return result;
    }
    function isBoolean(value) {
        return value === !0 || value === !1 || toString.call(value) == boolClass;
    }
    function isDate(value) {
        return value ? typeof value == "object" && toString.call(value) == dateClass : !1;
    }
    function isElement(value) {
        return value ? value.nodeType === 1 : !1;
    }
    function isEmpty(value) {
        if (!value) return !0;
        if (isArray(value) || isString(value)) return !value.length;
        for (var key in value) if (hasOwnProperty.call(value, key)) return !1;
        return !0;
    }
    function isEqual(a, b) {
        return baseIsEqual(a, b);
    }
    function isFinite(value) {
        return nativeIsFinite(value) && !nativeIsNaN(parseFloat(value));
    }
    function isFunction(value) {
        return typeof value == "function";
    }
    isFunction(/x/) && (isFunction = function(value) {
        return typeof value == "function" && toString.call(value) == funcClass;
    });
    function isObject(value) {
        return !!value && !!objectTypes[typeof value];
    }
    function isNaN(value) {
        return isNumber(value) && value != +value;
    }
    function isNull(value) {
        return value === null;
    }
    function isNumber(value) {
        return typeof value == "number" || toString.call(value) == numberClass;
    }
    function isRegExp(value) {
        return value && objectTypes[typeof value] ? toString.call(value) == regexpClass : !1;
    }
    function isString(value) {
        return typeof value == "string" || toString.call(value) == stringClass;
    }
    function isUndefined(value) {
        return typeof value == "undefined";
    }
    function omit(object) {
        var indexOf = getIndexOf(), props = baseFlatten(arguments, !0, !1, 1), result = {};
        return forIn(object, function(value, key) {
            indexOf(props, key) < 0 && (result[key] = value);
        }), result;
    }
    function pairs(object) {
        var index = -1, props = keys(object), length = props.length, result = Array(length);
        while (++index < length) {
            var key = props[index];
            result[index] = [ key, object[key] ];
        }
        return result;
    }
    function pick(object) {
        var index = -1, props = baseFlatten(arguments, !0, !1, 1), length = props.length, result = {};
        while (++index < length) {
            var prop = props[index];
            prop in object && (result[prop] = object[prop]);
        }
        return result;
    }
    function values(object) {
        var index = -1, props = keys(object), length = props.length, result = Array(length);
        while (++index < length) result[index] = object[props[index]];
        return result;
    }
    function contains(collection, target) {
        var indexOf = getIndexOf(), length = collection ? collection.length : 0, result = !1;
        return length && typeof length == "number" ? result = indexOf(collection, target) > -1 : forOwn(collection, function(value) {
            return (result = value === target) && indicatorObject;
        }), result;
    }
    var countBy = createAggregator(function(result, value, key) {
        hasOwnProperty.call(result, key) ? result[key]++ : result[key] = 1;
    });
    function every(collection, callback, thisArg) {
        var result = !0;
        callback = createCallback(callback, thisArg, 3);
        var index = -1, length = collection ? collection.length : 0;
        if (typeof length == "number") {
            while (++index < length) if (!(result = !!callback(collection[index], index, collection))) break;
        } else forOwn(collection, function(value, index, collection) {
            return !(result = !!callback(value, index, collection)) && indicatorObject;
        });
        return result;
    }
    function filter(collection, callback, thisArg) {
        var result = [];
        callback = createCallback(callback, thisArg, 3);
        var index = -1, length = collection ? collection.length : 0;
        if (typeof length == "number") while (++index < length) {
            var value = collection[index];
            callback(value, index, collection) && result.push(value);
        } else forOwn(collection, function(value, index, collection) {
            callback(value, index, collection) && result.push(value);
        });
        return result;
    }
    function find(collection, callback, thisArg) {
        callback = createCallback(callback, thisArg, 3);
        var index = -1, length = collection ? collection.length : 0;
        if (typeof length != "number") {
            var result;
            return forOwn(collection, function(value, index, collection) {
                if (callback(value, index, collection)) return result = value, indicatorObject;
            }), result;
        }
        while (++index < length) {
            var value = collection[index];
            if (callback(value, index, collection)) return value;
        }
    }
    function findWhere(object, properties) {
        return where(object, properties, !0);
    }
    function forEach(collection, callback, thisArg) {
        var index = -1, length = collection ? collection.length : 0;
        callback = callback && typeof thisArg == "undefined" ? callback : baseCreateCallback(callback, thisArg, 3);
        if (typeof length == "number") {
            while (++index < length) if (callback(collection[index], index, collection) === indicatorObject) break;
        } else forOwn(collection, callback);
    }
    function forEachRight(collection, callback) {
        var length = collection ? collection.length : 0;
        if (typeof length == "number") {
            while (length--) if (callback(collection[length], length, collection) === !1) break;
        } else {
            var props = keys(collection);
            length = props.length, forOwn(collection, function(value, key, collection) {
                return key = props ? props[--length] : --length, callback(collection[key], key, collection) === !1 && indicatorObject;
            });
        }
    }
    var groupBy = createAggregator(function(result, value, key) {
        (hasOwnProperty.call(result, key) ? result[key] : result[key] = []).push(value);
    }), indexBy = createAggregator(function(result, value, key) {
        result[key] = value;
    });
    function invoke(collection, methodName) {
        var args = nativeSlice.call(arguments, 2), index = -1, isFunc = typeof methodName == "function", length = collection ? collection.length : 0, result = Array(typeof length == "number" ? length : 0);
        return forEach(collection, function(value) {
            result[++index] = (isFunc ? methodName : value[methodName]).apply(value, args);
        }), result;
    }
    function map(collection, callback, thisArg) {
        var index = -1, length = collection ? collection.length : 0;
        callback = createCallback(callback, thisArg, 3);
        if (typeof length == "number") {
            var result = Array(length);
            while (++index < length) result[index] = callback(collection[index], index, collection);
        } else result = [], forOwn(collection, function(value, key, collection) {
            result[++index] = callback(value, key, collection);
        });
        return result;
    }
    function max(collection, callback, thisArg) {
        var computed = -Infinity, result = computed, index = -1, length = collection ? collection.length : 0;
        if (!callback && typeof length == "number") while (++index < length) {
            var value = collection[index];
            value > result && (result = value);
        } else callback = createCallback(callback, thisArg, 3), forEach(collection, function(value, index, collection) {
            var current = callback(value, index, collection);
            current > computed && (computed = current, result = value);
        });
        return result;
    }
    function min(collection, callback, thisArg) {
        var computed = Infinity, result = computed, index = -1, length = collection ? collection.length : 0;
        if (!callback && typeof length == "number") while (++index < length) {
            var value = collection[index];
            value < result && (result = value);
        } else callback = createCallback(callback, thisArg, 3), forEach(collection, function(value, index, collection) {
            var current = callback(value, index, collection);
            current < computed && (computed = current, result = value);
        });
        return result;
    }
    function pluck(collection, property) {
        var index = -1, length = collection ? collection.length : 0;
        if (typeof length == "number") {
            var result = Array(length);
            while (++index < length) result[index] = collection[index][property];
        }
        return result || map(collection, property);
    }
    function reduce(collection, callback, accumulator, thisArg) {
        if (!collection) return accumulator;
        var noaccum = arguments.length < 3;
        callback = baseCreateCallback(callback, thisArg, 4);
        var index = -1, length = collection.length;
        if (typeof length == "number") {
            noaccum && (accumulator = collection[++index]);
            while (++index < length) accumulator = callback(accumulator, collection[index], index, collection);
        } else forOwn(collection, function(value, index, collection) {
            accumulator = noaccum ? (noaccum = !1, value) : callback(accumulator, value, index, collection);
        });
        return accumulator;
    }
    function reduceRight(collection, callback, accumulator, thisArg) {
        var noaccum = arguments.length < 3;
        return callback = baseCreateCallback(callback, thisArg, 4), forEachRight(collection, function(value, index, collection) {
            accumulator = noaccum ? (noaccum = !1, value) : callback(accumulator, value, index, collection);
        }), accumulator;
    }
    function reject(collection, callback, thisArg) {
        return callback = createCallback(callback, thisArg, 3), filter(collection, function(value, index, collection) {
            return !callback(value, index, collection);
        });
    }
    function sample(collection, n, guard) {
        var length = collection ? collection.length : 0;
        typeof length != "number" && (collection = values(collection));
        if (n == null || guard) return collection ? collection[random(length - 1)] : undefined;
        var result = shuffle(collection);
        return result.length = nativeMin(nativeMax(0, n), result.length), result;
    }
    function shuffle(collection) {
        var index = -1, length = collection ? collection.length : 0, result = Array(typeof length == "number" ? length : 0);
        return forEach(collection, function(value) {
            var rand = random(++index);
            result[index] = result[rand], result[rand] = value;
        }), result;
    }
    function size(collection) {
        var length = collection ? collection.length : 0;
        return typeof length == "number" ? length : keys(collection).length;
    }
    function some(collection, callback, thisArg) {
        var result;
        callback = createCallback(callback, thisArg, 3);
        var index = -1, length = collection ? collection.length : 0;
        if (typeof length == "number") {
            while (++index < length) if (result = callback(collection[index], index, collection)) break;
        } else forOwn(collection, function(value, index, collection) {
            return (result = callback(value, index, collection)) && indicatorObject;
        });
        return !!result;
    }
    function sortBy(collection, callback, thisArg) {
        var index = -1, length = collection ? collection.length : 0, result = Array(typeof length == "number" ? length : 0);
        callback = createCallback(callback, thisArg, 3), forEach(collection, function(value, key, collection) {
            result[++index] = {
                criteria: callback(value, key, collection),
                index: index,
                value: value
            };
        }), length = result.length, result.sort(compareAscending);
        while (length--) result[length] = result[length].value;
        return result;
    }
    function toArray(collection) {
        return isArray(collection) ? nativeSlice.call(collection) : collection && typeof collection.length == "number" ? map(collection) : values(collection);
    }
    function where(collection, properties, first) {
        return first && isEmpty(properties) ? undefined : (first ? find : filter)(collection, properties);
    }
    function compact(array) {
        var index = -1, length = array ? array.length : 0, result = [];
        while (++index < length) {
            var value = array[index];
            value && result.push(value);
        }
        return result;
    }
    function difference(array) {
        var index = -1, indexOf = getIndexOf(), length = array.length, flattened = baseFlatten(arguments, !0, !0, 1), result = [];
        while (++index < length) {
            var value = array[index];
            indexOf(flattened, value) < 0 && result.push(value);
        }
        return result;
    }
    function first(array, callback, thisArg) {
        var n = 0, length = array ? array.length : 0;
        if (typeof callback != "number" && callback != null) {
            var index = -1;
            callback = createCallback(callback, thisArg, 3);
            while (++index < length && callback(array[index], index, array)) n++;
        } else {
            n = callback;
            if (n == null || thisArg) return array ? array[0] : undefined;
        }
        return nativeSlice.call(array, 0, nativeMin(nativeMax(0, n), length));
    }
    function flatten(array, isShallow) {
        return baseFlatten(array, isShallow);
    }
    function indexOf(array, value, fromIndex) {
        if (typeof fromIndex == "number") {
            var length = array ? array.length : 0;
            fromIndex = fromIndex < 0 ? nativeMax(0, length + fromIndex) : fromIndex || 0;
        } else if (fromIndex) {
            var index = sortedIndex(array, value);
            return array[index] === value ? index : -1;
        }
        return baseIndexOf(array, value, fromIndex);
    }
    function initial(array, callback, thisArg) {
        var n = 0, length = array ? array.length : 0;
        if (typeof callback != "number" && callback != null) {
            var index = length;
            callback = createCallback(callback, thisArg, 3);
            while (index-- && callback(array[index], index, array)) n++;
        } else n = callback == null || thisArg ? 1 : callback || n;
        return nativeSlice.call(array, 0, nativeMin(nativeMax(0, length - n), length));
    }
    function intersection(array) {
        var args = arguments, argsLength = args.length, index = -1, indexOf = getIndexOf(), length = array ? array.length : 0, result = [];
        outer : while (++index < length) {
            var value = array[index];
            if (indexOf(result, value) < 0) {
                var argsIndex = argsLength;
                while (--argsIndex) if (indexOf(args[argsIndex], value) < 0) continue outer;
                result.push(value);
            }
        }
        return result;
    }
    function last(array, callback, thisArg) {
        var n = 0, length = array ? array.length : 0;
        if (typeof callback != "number" && callback != null) {
            var index = length;
            callback = createCallback(callback, thisArg, 3);
            while (index-- && callback(array[index], index, array)) n++;
        } else {
            n = callback;
            if (n == null || thisArg) return array ? array[length - 1] : undefined;
        }
        return nativeSlice.call(array, nativeMax(0, length - n));
    }
    function lastIndexOf(array, value, fromIndex) {
        var index = array ? array.length : 0;
        typeof fromIndex == "number" && (index = (fromIndex < 0 ? nativeMax(0, index + fromIndex) : nativeMin(fromIndex, index - 1)) + 1);
        while (index--) if (array[index] === value) return index;
        return -1;
    }
    function range(start, end, step) {
        start = +start || 0, step = +step || 1, end == null && (end = start, start = 0);
        var index = -1, length = nativeMax(0, ceil((end - start) / step)), result = Array(length);
        while (++index < length) result[index] = start, start += step;
        return result;
    }
    function rest(array, callback, thisArg) {
        if (typeof callback != "number" && callback != null) {
            var n = 0, index = -1, length = array ? array.length : 0;
            callback = createCallback(callback, thisArg, 3);
            while (++index < length && callback(array[index], index, array)) n++;
        } else n = callback == null || thisArg ? 1 : nativeMax(0, callback);
        return nativeSlice.call(array, n);
    }
    function sortedIndex(array, value, callback, thisArg) {
        var low = 0, high = array ? array.length : low;
        callback = callback ? createCallback(callback, thisArg, 1) : identity, value = callback(value);
        while (low < high) {
            var mid = low + high >>> 1;
            callback(array[mid]) < value ? low = mid + 1 : high = mid;
        }
        return low;
    }
    function union(array) {
        return baseUniq(baseFlatten(arguments, !0, !0));
    }
    function uniq(array, isSorted, callback, thisArg) {
        return typeof isSorted != "boolean" && isSorted != null && (thisArg = callback, callback = !thisArg || thisArg[isSorted] !== array ? isSorted : null, isSorted = !1), callback != null && (callback = createCallback(callback, thisArg, 3)), baseUniq(array, isSorted, callback);
    }
    function without(array) {
        return difference(array, nativeSlice.call(arguments, 1));
    }
    function zip() {
        var index = -1, length = max(pluck(arguments, "length")), result = Array(length < 0 ? 0 : length);
        while (++index < length) result[index] = pluck(arguments, index);
        return result;
    }
    function zipObject(keys, values) {
        var index = -1, length = keys ? keys.length : 0, result = {};
        while (++index < length) {
            var key = keys[index];
            values ? result[key] = values[index] : key && (result[key[0]] = key[1]);
        }
        return result;
    }
    function after(n, func) {
        if (!isFunction(func)) throw new TypeError;
        return function() {
            if (--n < 1) return func.apply(this, arguments);
        };
    }
    function bind(func, thisArg) {
        return arguments.length > 2 ? createBound(func, 17, nativeSlice.call(arguments, 2), null, thisArg) : createBound(func, 1, null, null, thisArg);
    }
    function bindAll(object) {
        var funcs = arguments.length > 1 ? baseFlatten(arguments, !0, !1, 1) : functions(object), index = -1, length = funcs.length;
        while (++index < length) {
            var key = funcs[index];
            object[key] = createBound(object[key], 1, null, null, object);
        }
        return object;
    }
    function compose() {
        var funcs = arguments, length = funcs.length;
        while (length--) if (!isFunction(funcs[length])) throw new TypeError;
        return function() {
            var args = arguments, length = funcs.length;
            while (length--) args = [ funcs[length].apply(this, args) ];
            return args[0];
        };
    }
    function createCallback(func, thisArg, argCount) {
        var type = typeof func;
        if (func == null || type == "function") return baseCreateCallback(func, thisArg, argCount);
        if (type != "object") return function(object) {
            return object[func];
        };
        var props = keys(func);
        return function(object) {
            var length = props.length, result = !1;
            while (length--) if (!(result = object[props[length]] === func[props[length]])) break;
            return result;
        };
    }
    function debounce(func, wait, options) {
        var args, maxTimeoutId, result, stamp, thisArg, timeoutId, trailingCall, lastCalled = 0, maxWait = !1, trailing = !0;
        if (!isFunction(func)) throw new TypeError;
        wait = nativeMax(0, wait) || 0;
        if (options === !0) {
            var leading = !0;
            trailing = !1;
        } else isObject(options) && (leading = options.leading, maxWait = "maxWait" in options && (nativeMax(wait, options.maxWait) || 0), trailing = "trailing" in options ? options.trailing : trailing);
        var delayed = function() {
            var remaining = wait - (now() - stamp);
            if (remaining <= 0) {
                maxTimeoutId && clearTimeout(maxTimeoutId);
                var isCalled = trailingCall;
                maxTimeoutId = timeoutId = trailingCall = undefined, isCalled && (lastCalled = now(), result = func.apply(thisArg, args));
            } else timeoutId = setTimeout(delayed, remaining);
        }, maxDelayed = function() {
            timeoutId && clearTimeout(timeoutId), maxTimeoutId = timeoutId = trailingCall = undefined;
            if (trailing || maxWait !== wait) lastCalled = now(), result = func.apply(thisArg, args);
        };
        return function() {
            args = arguments, stamp = now(), thisArg = this, trailingCall = trailing && (timeoutId || !leading);
            if (maxWait === !1) var leadingCall = leading && !timeoutId; else {
                !maxTimeoutId && !leading && (lastCalled = stamp);
                var remaining = maxWait - (stamp - lastCalled);
                remaining <= 0 ? (maxTimeoutId && (maxTimeoutId = clearTimeout(maxTimeoutId)), lastCalled = stamp, result = func.apply(thisArg, args)) : maxTimeoutId || (maxTimeoutId = setTimeout(maxDelayed, remaining));
            }
            return !timeoutId && wait !== maxWait && (timeoutId = setTimeout(delayed, wait)), leadingCall && (result = func.apply(thisArg, args)), result;
        };
    }
    function defer(func) {
        if (!isFunction(func)) throw new TypeError;
        var args = nativeSlice.call(arguments, 1);
        return setTimeout(function() {
            func.apply(undefined, args);
        }, 1);
    }
    function delay(func, wait) {
        if (!isFunction(func)) throw new TypeError;
        var args = nativeSlice.call(arguments, 2);
        return setTimeout(function() {
            func.apply(undefined, args);
        }, wait);
    }
    function memoize(func, resolver) {
        var cache = {};
        return function() {
            var key = resolver ? resolver.apply(this, arguments) : keyPrefix + arguments[0];
            return hasOwnProperty.call(cache, key) ? cache[key] : cache[key] = func.apply(this, arguments);
        };
    }
    function once(func) {
        var ran, result;
        if (!isFunction(func)) throw new TypeError;
        return function() {
            return ran ? result : (ran = !0, result = func.apply(this, arguments), func = null, result);
        };
    }
    function partial(func) {
        return createBound(func, 16, nativeSlice.call(arguments, 1));
    }
    function throttle(func, wait, options) {
        var leading = !0, trailing = !0;
        if (!isFunction(func)) throw new TypeError;
        return options === !1 ? leading = !1 : isObject(options) && (leading = "leading" in options ? options.leading : leading, trailing = "trailing" in options ? options.trailing : trailing), options = {}, options.leading = leading, options.maxWait = wait, options.trailing = trailing, debounce(func, wait, options);
    }
    function wrap(value, wrapper) {
        if (!isFunction(wrapper)) throw new TypeError;
        return function() {
            var args = [ value ];
            return push.apply(args, arguments), wrapper.apply(this, args);
        };
    }
    function escape(string) {
        return string == null ? "" : String(string).replace(reUnescapedHtml, escapeHtmlChar);
    }
    function identity(value) {
        return value;
    }
    function mixin(object) {
        forEach(functions(object), function(methodName) {
            var func = lodash[methodName] = object[methodName];
            lodash.prototype[methodName] = function() {
                var args = [ this.__wrapped__ ];
                push.apply(args, arguments);
                var result = func.apply(lodash, args);
                return this.__chain__ ? new lodashWrapper(result, !0) : result;
            };
        });
    }
    function noConflict() {
        return root._ = oldDash, this;
    }
    function random(min, max) {
        return min == null && max == null && (max = 1), min = +min || 0, max == null ? (max = min, min = 0) : max = +max || 0, min + floor(nativeRandom() * (max - min + 1));
    }
    function result(object, property) {
        if (object) {
            var value = object[property];
            return isFunction(value) ? object[property]() : value;
        }
    }
    function template(text, data, options) {
        var _ = lodash, settings = _.templateSettings;
        text || (text = ""), options = defaults({}, options, settings);
        var index = 0, source = "__p += '", variable = options.variable, reDelimiters = RegExp((options.escape || reNoMatch).source + "|" + (options.interpolate || reNoMatch).source + "|" + (options.evaluate || reNoMatch).source + "|$", "g");
        text.replace(reDelimiters, function(match, escapeValue, interpolateValue, evaluateValue, offset) {
            return source += text.slice(index, offset).replace(reUnescapedString, escapeStringChar), escapeValue && (source += "' +\n_.escape(" + escapeValue + ") +\n'"), evaluateValue && (source += "';\n" + evaluateValue + ";\n__p += '"), interpolateValue && (source += "' +\n((__t = (" + interpolateValue + ")) == null ? '' : __t) +\n'"), index = offset + match.length, match;
        }), source += "';\n", variable || (variable = "obj", source = "with (" + variable + " || {}) {\n" + source + "\n}\n"), source = "function(" + variable + ") {\n" + "var __t, __p = '', __j = Array.prototype.join;\n" + "function print() { __p += __j.call(arguments, '') }\n" + source + "return __p\n}";
        try {
            var result = Function("_", "return " + source)(_);
        } catch (e) {
            throw e.source = source, e;
        }
        return data ? result(data) : (result.source = source, result);
    }
    function times(n, callback, thisArg) {
        n = (n = +n) > -1 ? n : 0;
        var index = -1, result = Array(n);
        callback = baseCreateCallback(callback, thisArg, 1);
        while (++index < n) result[index] = callback(index);
        return result;
    }
    function unescape(string) {
        return string == null ? "" : String(string).replace(reEscapedHtml, unescapeHtmlChar);
    }
    function uniqueId(prefix) {
        var id = ++idCounter + "";
        return prefix ? prefix + id : id;
    }
    function chain(value) {
        return value = new lodashWrapper(value), value.__chain__ = !0, value;
    }
    function tap(value, interceptor) {
        return interceptor(value), value;
    }
    function wrapperChain() {
        return this.__chain__ = !0, this;
    }
    function wrapperValueOf() {
        return this.__wrapped__;
    }
    lodash.after = after, lodash.bind = bind, lodash.bindAll = bindAll, lodash.chain = chain, lodash.compact = compact, lodash.compose = compose, lodash.countBy = countBy, lodash.debounce = debounce, lodash.defaults = defaults, lodash.defer = defer, lodash.delay = delay, lodash.difference = difference, lodash.filter = filter, lodash.flatten = flatten, lodash.forEach = forEach, lodash.functions = functions, lodash.groupBy = groupBy, lodash.indexBy = indexBy, lodash.initial = initial, lodash.intersection = intersection, lodash.invert = invert, lodash.invoke = invoke, lodash.keys = keys, lodash.map = map, lodash.max = max, lodash.memoize = memoize, lodash.min = min, lodash.omit = omit, lodash.once = once, lodash.pairs = pairs, lodash.partial = partial, lodash.pick = pick, lodash.pluck = pluck, lodash.range = range, lodash.reject = reject, lodash.rest = rest, lodash.shuffle = shuffle, lodash.sortBy = sortBy, lodash.tap = tap, lodash.throttle = throttle, lodash.times = times, lodash.toArray = toArray, lodash.union = union, lodash.uniq = uniq, lodash.values = values, lodash.where = where, lodash.without = without, lodash.wrap = wrap, lodash.zip = zip, lodash.collect = map, lodash.drop = rest, lodash.each = forEach, lodash.extend = assign, lodash.methods = functions, lodash.object = zipObject, lodash.select = filter, lodash.tail = rest, lodash.unique = uniq, lodash.clone = clone, lodash.contains = contains, lodash.escape = escape, lodash.every = every, lodash.find = find, lodash.has = has, lodash.identity = identity, lodash.indexOf = indexOf, lodash.isArguments = isArguments, lodash.isArray = isArray, lodash.isBoolean = isBoolean, lodash.isDate = isDate, lodash.isElement = isElement, lodash.isEmpty = isEmpty, lodash.isEqual = isEqual, lodash.isFinite = isFinite, lodash.isFunction = isFunction, lodash.isNaN = isNaN, lodash.isNull = isNull, lodash.isNumber = isNumber, lodash.isObject = isObject, lodash.isRegExp = isRegExp, lodash.isString = isString, lodash.isUndefined = isUndefined, lodash.lastIndexOf = lastIndexOf, lodash.mixin = mixin, lodash.noConflict = noConflict, lodash.random = random, lodash.reduce = reduce, lodash.reduceRight = reduceRight, lodash.result = result, lodash.size = size, lodash.some = some, lodash.sortedIndex = sortedIndex, lodash.template = template, lodash.unescape = unescape, lodash.uniqueId = uniqueId, lodash.all = every, lodash.any = some, lodash.detect = find, lodash.findWhere = findWhere, lodash.foldl = reduce, lodash.foldr = reduceRight, lodash.include = contains, lodash.inject = reduce, lodash.first = first, lodash.last = last, lodash.sample = sample, lodash.take = first, lodash.head = first, mixin(lodash), lodash.VERSION = "2.2.1", lodash.prototype.chain = wrapperChain, lodash.prototype.value = wrapperValueOf, forEach([ "pop", "push", "reverse", "shift", "sort", "splice", "unshift" ], function(methodName) {
        var func = arrayRef[methodName];
        lodash.prototype[methodName] = function() {
            var value = this.__wrapped__;
            return func.apply(value, arguments), !support.spliceObjects && value.length === 0 && delete value[0], this;
        };
    }), forEach([ "concat", "join", "slice" ], function(methodName) {
        var func = arrayRef[methodName];
        lodash.prototype[methodName] = function() {
            var value = this.__wrapped__, result = func.apply(value, arguments);
            return this.__chain__ && (result = new lodashWrapper(result), result.__chain__ = !0), result;
        };
    }), typeof define == "function" && typeof define.amd == "object" && define.amd ? (root._ = lodash, define("underscore", [], function() {
        return lodash;
    })) : freeExports && freeModule ? moduleExports ? (freeModule.exports = lodash)._ = lodash : freeExports._ = lodash : root._ = lodash;
}.call(this), function(window, undefined) {
    var rootjQuery, readyList, core_strundefined = typeof undefined, location = window.location, document = window.document, docElem = document.documentElement, _jQuery = window.jQuery, _$ = window.$, class2type = {}, core_deletedIds = [], core_version = "2.0.3", core_concat = core_deletedIds.concat, core_push = core_deletedIds.push, core_slice = core_deletedIds.slice, core_indexOf = core_deletedIds.indexOf, core_toString = class2type.toString, core_hasOwn = class2type.hasOwnProperty, core_trim = core_version.trim, jQuery = function(selector, context) {
        return new jQuery.fn.init(selector, context, rootjQuery);
    }, core_pnum = /[+-]?(?:\d*\.|)\d+(?:[eE][+-]?\d+|)/.source, core_rnotwhite = /\S+/g, rquickExpr = /^(?:\s*(<[\w\W]+>)[^>]*|#([\w-]*))$/, rsingleTag = /^<(\w+)\s*\/?>(?:<\/\1>|)$/, rmsPrefix = /^-ms-/, rdashAlpha = /-([\da-z])/gi, fcamelCase = function(all, letter) {
        return letter.toUpperCase();
    }, completed = function() {
        document.removeEventListener("DOMContentLoaded", completed, !1), window.removeEventListener("load", completed, !1), jQuery.ready();
    };
    jQuery.fn = jQuery.prototype = {
        jquery: core_version,
        constructor: jQuery,
        init: function(selector, context, rootjQuery) {
            var match, elem;
            if (!selector) return this;
            if (typeof selector == "string") {
                selector.charAt(0) === "<" && selector.charAt(selector.length - 1) === ">" && selector.length >= 3 ? match = [ null, selector, null ] : match = rquickExpr.exec(selector);
                if (match && (match[1] || !context)) {
                    if (match[1]) {
                        context = context instanceof jQuery ? context[0] : context, jQuery.merge(this, jQuery.parseHTML(match[1], context && context.nodeType ? context.ownerDocument || context : document, !0));
                        if (rsingleTag.test(match[1]) && jQuery.isPlainObject(context)) for (match in context) jQuery.isFunction(this[match]) ? this[match](context[match]) : this.attr(match, context[match]);
                        return this;
                    }
                    return elem = document.getElementById(match[2]), elem && elem.parentNode && (this.length = 1, this[0] = elem), this.context = document, this.selector = selector, this;
                }
                return !context || context.jquery ? (context || rootjQuery).find(selector) : this.constructor(context).find(selector);
            }
            return selector.nodeType ? (this.context = this[0] = selector, this.length = 1, this) : jQuery.isFunction(selector) ? rootjQuery.ready(selector) : (selector.selector !== undefined && (this.selector = selector.selector, this.context = selector.context), jQuery.makeArray(selector, this));
        },
        selector: "",
        length: 0,
        toArray: function() {
            return core_slice.call(this);
        },
        get: function(num) {
            return num == null ? this.toArray() : num < 0 ? this[this.length + num] : this[num];
        },
        pushStack: function(elems) {
            var ret = jQuery.merge(this.constructor(), elems);
            return ret.prevObject = this, ret.context = this.context, ret;
        },
        each: function(callback, args) {
            return jQuery.each(this, callback, args);
        },
        ready: function(fn) {
            return jQuery.ready.promise().done(fn), this;
        },
        slice: function() {
            return this.pushStack(core_slice.apply(this, arguments));
        },
        first: function() {
            return this.eq(0);
        },
        last: function() {
            return this.eq(-1);
        },
        eq: function(i) {
            var len = this.length, j = +i + (i < 0 ? len : 0);
            return this.pushStack(j >= 0 && j < len ? [ this[j] ] : []);
        },
        map: function(callback) {
            return this.pushStack(jQuery.map(this, function(elem, i) {
                return callback.call(elem, i, elem);
            }));
        },
        end: function() {
            return this.prevObject || this.constructor(null);
        },
        push: core_push,
        sort: [].sort,
        splice: [].splice
    }, jQuery.fn.init.prototype = jQuery.fn, jQuery.extend = jQuery.fn.extend = function() {
        var options, name, src, copy, copyIsArray, clone, target = arguments[0] || {}, i = 1, length = arguments.length, deep = !1;
        typeof target == "boolean" && (deep = target, target = arguments[1] || {}, i = 2), typeof target != "object" && !jQuery.isFunction(target) && (target = {}), length === i && (target = this, --i);
        for (; i < length; i++) if ((options = arguments[i]) != null) for (name in options) {
            src = target[name], copy = options[name];
            if (target === copy) continue;
            deep && copy && (jQuery.isPlainObject(copy) || (copyIsArray = jQuery.isArray(copy))) ? (copyIsArray ? (copyIsArray = !1, clone = src && jQuery.isArray(src) ? src : []) : clone = src && jQuery.isPlainObject(src) ? src : {}, target[name] = jQuery.extend(deep, clone, copy)) : copy !== undefined && (target[name] = copy);
        }
        return target;
    }, jQuery.extend({
        expando: "jQuery" + (core_version + Math.random()).replace(/\D/g, ""),
        noConflict: function(deep) {
            return window.$ === jQuery && (window.$ = _$), deep && window.jQuery === jQuery && (window.jQuery = _jQuery), jQuery;
        },
        isReady: !1,
        readyWait: 1,
        holdReady: function(hold) {
            hold ? jQuery.readyWait++ : jQuery.ready(!0);
        },
        ready: function(wait) {
            if (wait === !0 ? --jQuery.readyWait : jQuery.isReady) return;
            jQuery.isReady = !0;
            if (wait !== !0 && --jQuery.readyWait > 0) return;
            readyList.resolveWith(document, [ jQuery ]), jQuery.fn.trigger && jQuery(document).trigger("ready").off("ready");
        },
        isFunction: function(obj) {
            return jQuery.type(obj) === "function";
        },
        isArray: Array.isArray,
        isWindow: function(obj) {
            return obj != null && obj === obj.window;
        },
        isNumeric: function(obj) {
            return !isNaN(parseFloat(obj)) && isFinite(obj);
        },
        type: function(obj) {
            return obj == null ? String(obj) : typeof obj == "object" || typeof obj == "function" ? class2type[core_toString.call(obj)] || "object" : typeof obj;
        },
        isPlainObject: function(obj) {
            if (jQuery.type(obj) !== "object" || obj.nodeType || jQuery.isWindow(obj)) return !1;
            try {
                if (obj.constructor && !core_hasOwn.call(obj.constructor.prototype, "isPrototypeOf")) return !1;
            } catch (e) {
                return !1;
            }
            return !0;
        },
        isEmptyObject: function(obj) {
            var name;
            for (name in obj) return !1;
            return !0;
        },
        error: function(msg) {
            throw new Error(msg);
        },
        parseHTML: function(data, context, keepScripts) {
            if (!data || typeof data != "string") return null;
            typeof context == "boolean" && (keepScripts = context, context = !1), context = context || document;
            var parsed = rsingleTag.exec(data), scripts = !keepScripts && [];
            return parsed ? [ context.createElement(parsed[1]) ] : (parsed = jQuery.buildFragment([ data ], context, scripts), scripts && jQuery(scripts).remove(), jQuery.merge([], parsed.childNodes));
        },
        parseJSON: JSON.parse,
        parseXML: function(data) {
            var xml, tmp;
            if (!data || typeof data != "string") return null;
            try {
                tmp = new DOMParser, xml = tmp.parseFromString(data, "text/xml");
            } catch (e) {
                xml = undefined;
            }
            return (!xml || xml.getElementsByTagName("parsererror").length) && jQuery.error("Invalid XML: " + data), xml;
        },
        noop: function() {},
        globalEval: function(code) {
            var script, indirect = eval;
            code = jQuery.trim(code), code && (code.indexOf("use strict") === 1 ? (script = document.createElement("script"), script.text = code, document.head.appendChild(script).parentNode.removeChild(script)) : indirect(code));
        },
        camelCase: function(string) {
            return string.replace(rmsPrefix, "ms-").replace(rdashAlpha, fcamelCase);
        },
        nodeName: function(elem, name) {
            return elem.nodeName && elem.nodeName.toLowerCase() === name.toLowerCase();
        },
        each: function(obj, callback, args) {
            var value, i = 0, length = obj.length, isArray = isArraylike(obj);
            if (args) if (isArray) for (; i < length; i++) {
                value = callback.apply(obj[i], args);
                if (value === !1) break;
            } else for (i in obj) {
                value = callback.apply(obj[i], args);
                if (value === !1) break;
            } else if (isArray) for (; i < length; i++) {
                value = callback.call(obj[i], i, obj[i]);
                if (value === !1) break;
            } else for (i in obj) {
                value = callback.call(obj[i], i, obj[i]);
                if (value === !1) break;
            }
            return obj;
        },
        trim: function(text) {
            return text == null ? "" : core_trim.call(text);
        },
        makeArray: function(arr, results) {
            var ret = results || [];
            return arr != null && (isArraylike(Object(arr)) ? jQuery.merge(ret, typeof arr == "string" ? [ arr ] : arr) : core_push.call(ret, arr)), ret;
        },
        inArray: function(elem, arr, i) {
            return arr == null ? -1 : core_indexOf.call(arr, elem, i);
        },
        merge: function(first, second) {
            var l = second.length, i = first.length, j = 0;
            if (typeof l == "number") for (; j < l; j++) first[i++] = second[j]; else while (second[j] !== undefined) first[i++] = second[j++];
            return first.length = i, first;
        },
        grep: function(elems, callback, inv) {
            var retVal, ret = [], i = 0, length = elems.length;
            inv = !!inv;
            for (; i < length; i++) retVal = !!callback(elems[i], i), inv !== retVal && ret.push(elems[i]);
            return ret;
        },
        map: function(elems, callback, arg) {
            var value, i = 0, length = elems.length, isArray = isArraylike(elems), ret = [];
            if (isArray) for (; i < length; i++) value = callback(elems[i], i, arg), value != null && (ret[ret.length] = value); else for (i in elems) value = callback(elems[i], i, arg), value != null && (ret[ret.length] = value);
            return core_concat.apply([], ret);
        },
        guid: 1,
        proxy: function(fn, context) {
            var tmp, args, proxy;
            return typeof context == "string" && (tmp = fn[context], context = fn, fn = tmp), jQuery.isFunction(fn) ? (args = core_slice.call(arguments, 2), proxy = function() {
                return fn.apply(context || this, args.concat(core_slice.call(arguments)));
            }, proxy.guid = fn.guid = fn.guid || jQuery.guid++, proxy) : undefined;
        },
        access: function(elems, fn, key, value, chainable, emptyGet, raw) {
            var i = 0, length = elems.length, bulk = key == null;
            if (jQuery.type(key) === "object") {
                chainable = !0;
                for (i in key) jQuery.access(elems, fn, i, key[i], !0, emptyGet, raw);
            } else if (value !== undefined) {
                chainable = !0, jQuery.isFunction(value) || (raw = !0), bulk && (raw ? (fn.call(elems, value), fn = null) : (bulk = fn, fn = function(elem, key, value) {
                    return bulk.call(jQuery(elem), value);
                }));
                if (fn) for (; i < length; i++) fn(elems[i], key, raw ? value : value.call(elems[i], i, fn(elems[i], key)));
            }
            return chainable ? elems : bulk ? fn.call(elems) : length ? fn(elems[0], key) : emptyGet;
        },
        now: Date.now,
        swap: function(elem, options, callback, args) {
            var ret, name, old = {};
            for (name in options) old[name] = elem.style[name], elem.style[name] = options[name];
            ret = callback.apply(elem, args || []);
            for (name in options) elem.style[name] = old[name];
            return ret;
        }
    }), jQuery.ready.promise = function(obj) {
        return readyList || (readyList = jQuery.Deferred(), document.readyState === "complete" ? setTimeout(jQuery.ready) : (document.addEventListener("DOMContentLoaded", completed, !1), window.addEventListener("load", completed, !1))), readyList.promise(obj);
    }, jQuery.each("Boolean Number String Function Array Date RegExp Object Error".split(" "), function(i, name) {
        class2type["[object " + name + "]"] = name.toLowerCase();
    });
    function isArraylike(obj) {
        var length = obj.length, type = jQuery.type(obj);
        return jQuery.isWindow(obj) ? !1 : obj.nodeType === 1 && length ? !0 : type === "array" || type !== "function" && (length === 0 || typeof length == "number" && length > 0 && length - 1 in obj);
    }
    rootjQuery = jQuery(document), function(window, undefined) {
        var i, support, cachedruns, Expr, getText, isXML, compile, outermostContext, sortInput, setDocument, document, docElem, documentIsHTML, rbuggyQSA, rbuggyMatches, matches, contains, expando = "sizzle" + -(new Date), preferredDoc = window.document, dirruns = 0, done = 0, classCache = createCache(), tokenCache = createCache(), compilerCache = createCache(), hasDuplicate = !1, sortOrder = function(a, b) {
            return a === b ? (hasDuplicate = !0, 0) : 0;
        }, strundefined = typeof undefined, MAX_NEGATIVE = 1 << 31, hasOwn = {}.hasOwnProperty, arr = [], pop = arr.pop, push_native = arr.push, push = arr.push, slice = arr.slice, indexOf = arr.indexOf || function(elem) {
            var i = 0, len = this.length;
            for (; i < len; i++) if (this[i] === elem) return i;
            return -1;
        }, booleans = "checked|selected|async|autofocus|autoplay|controls|defer|disabled|hidden|ismap|loop|multiple|open|readonly|required|scoped", whitespace = "[\\x20\\t\\r\\n\\f]", characterEncoding = "(?:\\\\.|[\\w-]|[^\\x00-\\xa0])+", identifier = characterEncoding.replace("w", "w#"), attributes = "\\[" + whitespace + "*(" + characterEncoding + ")" + whitespace + "*(?:([*^$|!~]?=)" + whitespace + "*(?:(['\"])((?:\\\\.|[^\\\\])*?)\\3|(" + identifier + ")|)|)" + whitespace + "*\\]", pseudos = ":(" + characterEncoding + ")(?:\\(((['\"])((?:\\\\.|[^\\\\])*?)\\3|((?:\\\\.|[^\\\\()[\\]]|" + attributes.replace(3, 8) + ")*)|.*)\\)|)", rtrim = new RegExp("^" + whitespace + "+|((?:^|[^\\\\])(?:\\\\.)*)" + whitespace + "+$", "g"), rcomma = new RegExp("^" + whitespace + "*," + whitespace + "*"), rcombinators = new RegExp("^" + whitespace + "*([>+~]|" + whitespace + ")" + whitespace + "*"), rsibling = new RegExp(whitespace + "*[+~]"), rattributeQuotes = new RegExp("=" + whitespace + "*([^\\]'\"]*)" + whitespace + "*\\]", "g"), rpseudo = new RegExp(pseudos), ridentifier = new RegExp("^" + identifier + "$"), matchExpr = {
            ID: new RegExp("^#(" + characterEncoding + ")"),
            CLASS: new RegExp("^\\.(" + characterEncoding + ")"),
            TAG: new RegExp("^(" + characterEncoding.replace("w", "w*") + ")"),
            ATTR: new RegExp("^" + attributes),
            PSEUDO: new RegExp("^" + pseudos),
            CHILD: new RegExp("^:(only|first|last|nth|nth-last)-(child|of-type)(?:\\(" + whitespace + "*(even|odd|(([+-]|)(\\d*)n|)" + whitespace + "*(?:([+-]|)" + whitespace + "*(\\d+)|))" + whitespace + "*\\)|)", "i"),
            bool: new RegExp("^(?:" + booleans + ")$", "i"),
            needsContext: new RegExp("^" + whitespace + "*[>+~]|:(even|odd|eq|gt|lt|nth|first|last)(?:\\(" + whitespace + "*((?:-\\d)?\\d*)" + whitespace + "*\\)|)(?=[^-]|$)", "i")
        }, rnative = /^[^{]+\{\s*\[native \w/, rquickExpr = /^(?:#([\w-]+)|(\w+)|\.([\w-]+))$/, rinputs = /^(?:input|select|textarea|button)$/i, rheader = /^h\d$/i, rescape = /'|\\/g, runescape = new RegExp("\\\\([\\da-f]{1,6}" + whitespace + "?|(" + whitespace + ")|.)", "ig"), funescape = function(_, escaped, escapedWhitespace) {
            var high = "0x" + escaped - 65536;
            return high !== high || escapedWhitespace ? escaped : high < 0 ? String.fromCharCode(high + 65536) : String.fromCharCode(high >> 10 | 55296, high & 1023 | 56320);
        };
        try {
            push.apply(arr = slice.call(preferredDoc.childNodes), preferredDoc.childNodes), arr[preferredDoc.childNodes.length].nodeType;
        } catch (e) {
            push = {
                apply: arr.length ? function(target, els) {
                    push_native.apply(target, slice.call(els));
                } : function(target, els) {
                    var j = target.length, i = 0;
                    while (target[j++] = els[i++]) ;
                    target.length = j - 1;
                }
            };
        }
        function Sizzle(selector, context, results, seed) {
            var match, elem, m, nodeType, i, groups, old, nid, newContext, newSelector;
            (context ? context.ownerDocument || context : preferredDoc) !== document && setDocument(context), context = context || document, results = results || [];
            if (!selector || typeof selector != "string") return results;
            if ((nodeType = context.nodeType) !== 1 && nodeType !== 9) return [];
            if (documentIsHTML && !seed) {
                if (match = rquickExpr.exec(selector)) if (m = match[1]) {
                    if (nodeType === 9) {
                        elem = context.getElementById(m);
                        if (!elem || !elem.parentNode) return results;
                        if (elem.id === m) return results.push(elem), results;
                    } else if (context.ownerDocument && (elem = context.ownerDocument.getElementById(m)) && contains(context, elem) && elem.id === m) return results.push(elem), results;
                } else {
                    if (match[2]) return push.apply(results, context.getElementsByTagName(selector)), results;
                    if ((m = match[3]) && support.getElementsByClassName && context.getElementsByClassName) return push.apply(results, context.getElementsByClassName(m)), results;
                }
                if (support.qsa && (!rbuggyQSA || !rbuggyQSA.test(selector))) {
                    nid = old = expando, newContext = context, newSelector = nodeType === 9 && selector;
                    if (nodeType === 1 && context.nodeName.toLowerCase() !== "object") {
                        groups = tokenize(selector), (old = context.getAttribute("id")) ? nid = old.replace(rescape, "\\$&") : context.setAttribute("id", nid), nid = "[id='" + nid + "'] ", i = groups.length;
                        while (i--) groups[i] = nid + toSelector(groups[i]);
                        newContext = rsibling.test(selector) && context.parentNode || context, newSelector = groups.join(",");
                    }
                    if (newSelector) try {
                        return push.apply(results, newContext.querySelectorAll(newSelector)), results;
                    } catch (qsaError) {} finally {
                        old || context.removeAttribute("id");
                    }
                }
            }
            return select(selector.replace(rtrim, "$1"), context, results, seed);
        }
        function createCache() {
            var keys = [];
            function cache(key, value) {
                return keys.push(key += " ") > Expr.cacheLength && delete cache[keys.shift()], cache[key] = value;
            }
            return cache;
        }
        function markFunction(fn) {
            return fn[expando] = !0, fn;
        }
        function assert(fn) {
            var div = document.createElement("div");
            try {
                return !!fn(div);
            } catch (e) {
                return !1;
            } finally {
                div.parentNode && div.parentNode.removeChild(div), div = null;
            }
        }
        function addHandle(attrs, handler) {
            var arr = attrs.split("|"), i = attrs.length;
            while (i--) Expr.attrHandle[arr[i]] = handler;
        }
        function siblingCheck(a, b) {
            var cur = b && a, diff = cur && a.nodeType === 1 && b.nodeType === 1 && (~b.sourceIndex || MAX_NEGATIVE) - (~a.sourceIndex || MAX_NEGATIVE);
            if (diff) return diff;
            if (cur) while (cur = cur.nextSibling) if (cur === b) return -1;
            return a ? 1 : -1;
        }
        function createInputPseudo(type) {
            return function(elem) {
                var name = elem.nodeName.toLowerCase();
                return name === "input" && elem.type === type;
            };
        }
        function createButtonPseudo(type) {
            return function(elem) {
                var name = elem.nodeName.toLowerCase();
                return (name === "input" || name === "button") && elem.type === type;
            };
        }
        function createPositionalPseudo(fn) {
            return markFunction(function(argument) {
                return argument = +argument, markFunction(function(seed, matches) {
                    var j, matchIndexes = fn([], seed.length, argument), i = matchIndexes.length;
                    while (i--) seed[j = matchIndexes[i]] && (seed[j] = !(matches[j] = seed[j]));
                });
            });
        }
        isXML = Sizzle.isXML = function(elem) {
            var documentElement = elem && (elem.ownerDocument || elem).documentElement;
            return documentElement ? documentElement.nodeName !== "HTML" : !1;
        }, support = Sizzle.support = {}, setDocument = Sizzle.setDocument = function(node) {
            var doc = node ? node.ownerDocument || node : preferredDoc, parent = doc.defaultView;
            if (doc === document || doc.nodeType !== 9 || !doc.documentElement) return document;
            document = doc, docElem = doc.documentElement, documentIsHTML = !isXML(doc), parent && parent.attachEvent && parent !== parent.top && parent.attachEvent("onbeforeunload", function() {
                setDocument();
            }), support.attributes = assert(function(div) {
                return div.className = "i", !div.getAttribute("className");
            }), support.getElementsByTagName = assert(function(div) {
                return div.appendChild(doc.createComment("")), !div.getElementsByTagName("*").length;
            }), support.getElementsByClassName = assert(function(div) {
                return div.innerHTML = "<div class='a'></div><div class='a i'></div>", div.firstChild.className = "i", div.getElementsByClassName("i").length === 2;
            }), support.getById = assert(function(div) {
                return docElem.appendChild(div).id = expando, !doc.getElementsByName || !doc.getElementsByName(expando).length;
            }), support.getById ? (Expr.find.ID = function(id, context) {
                if (typeof context.getElementById !== strundefined && documentIsHTML) {
                    var m = context.getElementById(id);
                    return m && m.parentNode ? [ m ] : [];
                }
            }, Expr.filter.ID = function(id) {
                var attrId = id.replace(runescape, funescape);
                return function(elem) {
                    return elem.getAttribute("id") === attrId;
                };
            }) : (delete Expr.find.ID, Expr.filter.ID = function(id) {
                var attrId = id.replace(runescape, funescape);
                return function(elem) {
                    var node = typeof elem.getAttributeNode !== strundefined && elem.getAttributeNode("id");
                    return node && node.value === attrId;
                };
            }), Expr.find.TAG = support.getElementsByTagName ? function(tag, context) {
                if (typeof context.getElementsByTagName !== strundefined) return context.getElementsByTagName(tag);
            } : function(tag, context) {
                var elem, tmp = [], i = 0, results = context.getElementsByTagName(tag);
                if (tag === "*") {
                    while (elem = results[i++]) elem.nodeType === 1 && tmp.push(elem);
                    return tmp;
                }
                return results;
            }, Expr.find.CLASS = support.getElementsByClassName && function(className, context) {
                if (typeof context.getElementsByClassName !== strundefined && documentIsHTML) return context.getElementsByClassName(className);
            }, rbuggyMatches = [], rbuggyQSA = [];
            if (support.qsa = rnative.test(doc.querySelectorAll)) assert(function(div) {
                div.innerHTML = "<select><option selected=''></option></select>", div.querySelectorAll("[selected]").length || rbuggyQSA.push("\\[" + whitespace + "*(?:value|" + booleans + ")"), div.querySelectorAll(":checked").length || rbuggyQSA.push(":checked");
            }), assert(function(div) {
                var input = doc.createElement("input");
                input.setAttribute("type", "hidden"), div.appendChild(input).setAttribute("t", ""), div.querySelectorAll("[t^='']").length && rbuggyQSA.push("[*^$]=" + whitespace + "*(?:''|\"\")"), div.querySelectorAll(":enabled").length || rbuggyQSA.push(":enabled", ":disabled"), div.querySelectorAll("*,:x"), rbuggyQSA.push(",.*:");
            });
            return (support.matchesSelector = rnative.test(matches = docElem.webkitMatchesSelector || docElem.mozMatchesSelector || docElem.oMatchesSelector || docElem.msMatchesSelector)) && assert(function(div) {
                support.disconnectedMatch = matches.call(div, "div"), matches.call(div, "[s!='']:x"), rbuggyMatches.push("!=", pseudos);
            }), rbuggyQSA = rbuggyQSA.length && new RegExp(rbuggyQSA.join("|")), rbuggyMatches = rbuggyMatches.length && new RegExp(rbuggyMatches.join("|")), contains = rnative.test(docElem.contains) || docElem.compareDocumentPosition ? function(a, b) {
                var adown = a.nodeType === 9 ? a.documentElement : a, bup = b && b.parentNode;
                return a === bup || !!bup && bup.nodeType === 1 && !!(adown.contains ? adown.contains(bup) : a.compareDocumentPosition && a.compareDocumentPosition(bup) & 16);
            } : function(a, b) {
                if (b) while (b = b.parentNode) if (b === a) return !0;
                return !1;
            }, sortOrder = docElem.compareDocumentPosition ? function(a, b) {
                if (a === b) return hasDuplicate = !0, 0;
                var compare = b.compareDocumentPosition && a.compareDocumentPosition && a.compareDocumentPosition(b);
                if (compare) return compare & 1 || !support.sortDetached && b.compareDocumentPosition(a) === compare ? a === doc || contains(preferredDoc, a) ? -1 : b === doc || contains(preferredDoc, b) ? 1 : sortInput ? indexOf.call(sortInput, a) - indexOf.call(sortInput, b) : 0 : compare & 4 ? -1 : 1;
                return a.compareDocumentPosition ? -1 : 1;
            } : function(a, b) {
                var cur, i = 0, aup = a.parentNode, bup = b.parentNode, ap = [ a ], bp = [ b ];
                if (a === b) return hasDuplicate = !0, 0;
                if (!aup || !bup) return a === doc ? -1 : b === doc ? 1 : aup ? -1 : bup ? 1 : sortInput ? indexOf.call(sortInput, a) - indexOf.call(sortInput, b) : 0;
                if (aup === bup) return siblingCheck(a, b);
                cur = a;
                while (cur = cur.parentNode) ap.unshift(cur);
                cur = b;
                while (cur = cur.parentNode) bp.unshift(cur);
                while (ap[i] === bp[i]) i++;
                return i ? siblingCheck(ap[i], bp[i]) : ap[i] === preferredDoc ? -1 : bp[i] === preferredDoc ? 1 : 0;
            }, doc;
        }, Sizzle.matches = function(expr, elements) {
            return Sizzle(expr, null, null, elements);
        }, Sizzle.matchesSelector = function(elem, expr) {
            (elem.ownerDocument || elem) !== document && setDocument(elem), expr = expr.replace(rattributeQuotes, "='$1']");
            if (support.matchesSelector && documentIsHTML && (!rbuggyMatches || !rbuggyMatches.test(expr)) && (!rbuggyQSA || !rbuggyQSA.test(expr))) try {
                var ret = matches.call(elem, expr);
                if (ret || support.disconnectedMatch || elem.document && elem.document.nodeType !== 11) return ret;
            } catch (e) {}
            return Sizzle(expr, document, null, [ elem ]).length > 0;
        }, Sizzle.contains = function(context, elem) {
            return (context.ownerDocument || context) !== document && setDocument(context), contains(context, elem);
        }, Sizzle.attr = function(elem, name) {
            (elem.ownerDocument || elem) !== document && setDocument(elem);
            var fn = Expr.attrHandle[name.toLowerCase()], val = fn && hasOwn.call(Expr.attrHandle, name.toLowerCase()) ? fn(elem, name, !documentIsHTML) : undefined;
            return val === undefined ? support.attributes || !documentIsHTML ? elem.getAttribute(name) : (val = elem.getAttributeNode(name)) && val.specified ? val.value : null : val;
        }, Sizzle.error = function(msg) {
            throw new Error("Syntax error, unrecognized expression: " + msg);
        }, Sizzle.uniqueSort = function(results) {
            var elem, duplicates = [], j = 0, i = 0;
            hasDuplicate = !support.detectDuplicates, sortInput = !support.sortStable && results.slice(0), results.sort(sortOrder);
            if (hasDuplicate) {
                while (elem = results[i++]) elem === results[i] && (j = duplicates.push(i));
                while (j--) results.splice(duplicates[j], 1);
            }
            return results;
        }, getText = Sizzle.getText = function(elem) {
            var node, ret = "", i = 0, nodeType = elem.nodeType;
            if (!nodeType) for (; node = elem[i]; i++) ret += getText(node); else if (nodeType === 1 || nodeType === 9 || nodeType === 11) {
                if (typeof elem.textContent == "string") return elem.textContent;
                for (elem = elem.firstChild; elem; elem = elem.nextSibling) ret += getText(elem);
            } else if (nodeType === 3 || nodeType === 4) return elem.nodeValue;
            return ret;
        }, Expr = Sizzle.selectors = {
            cacheLength: 50,
            createPseudo: markFunction,
            match: matchExpr,
            attrHandle: {},
            find: {},
            relative: {
                ">": {
                    dir: "parentNode",
                    first: !0
                },
                " ": {
                    dir: "parentNode"
                },
                "+": {
                    dir: "previousSibling",
                    first: !0
                },
                "~": {
                    dir: "previousSibling"
                }
            },
            preFilter: {
                ATTR: function(match) {
                    return match[1] = match[1].replace(runescape, funescape), match[3] = (match[4] || match[5] || "").replace(runescape, funescape), match[2] === "~=" && (match[3] = " " + match[3] + " "), match.slice(0, 4);
                },
                CHILD: function(match) {
                    return match[1] = match[1].toLowerCase(), match[1].slice(0, 3) === "nth" ? (match[3] || Sizzle.error(match[0]), match[4] = +(match[4] ? match[5] + (match[6] || 1) : 2 * (match[3] === "even" || match[3] === "odd")), match[5] = +(match[7] + match[8] || match[3] === "odd")) : match[3] && Sizzle.error(match[0]), match;
                },
                PSEUDO: function(match) {
                    var excess, unquoted = !match[5] && match[2];
                    return matchExpr.CHILD.test(match[0]) ? null : (match[3] && match[4] !== undefined ? match[2] = match[4] : unquoted && rpseudo.test(unquoted) && (excess = tokenize(unquoted, !0)) && (excess = unquoted.indexOf(")", unquoted.length - excess) - unquoted.length) && (match[0] = match[0].slice(0, excess), match[2] = unquoted.slice(0, excess)), match.slice(0, 3));
                }
            },
            filter: {
                TAG: function(nodeNameSelector) {
                    var nodeName = nodeNameSelector.replace(runescape, funescape).toLowerCase();
                    return nodeNameSelector === "*" ? function() {
                        return !0;
                    } : function(elem) {
                        return elem.nodeName && elem.nodeName.toLowerCase() === nodeName;
                    };
                },
                CLASS: function(className) {
                    var pattern = classCache[className + " "];
                    return pattern || (pattern = new RegExp("(^|" + whitespace + ")" + className + "(" + whitespace + "|$)")) && classCache(className, function(elem) {
                        return pattern.test(typeof elem.className == "string" && elem.className || typeof elem.getAttribute !== strundefined && elem.getAttribute("class") || "");
                    });
                },
                ATTR: function(name, operator, check) {
                    return function(elem) {
                        var result = Sizzle.attr(elem, name);
                        return result == null ? operator === "!=" : operator ? (result += "", operator === "=" ? result === check : operator === "!=" ? result !== check : operator === "^=" ? check && result.indexOf(check) === 0 : operator === "*=" ? check && result.indexOf(check) > -1 : operator === "$=" ? check && result.slice(-check.length) === check : operator === "~=" ? (" " + result + " ").indexOf(check) > -1 : operator === "|=" ? result === check || result.slice(0, check.length + 1) === check + "-" : !1) : !0;
                    };
                },
                CHILD: function(type, what, argument, first, last) {
                    var simple = type.slice(0, 3) !== "nth", forward = type.slice(-4) !== "last", ofType = what === "of-type";
                    return first === 1 && last === 0 ? function(elem) {
                        return !!elem.parentNode;
                    } : function(elem, context, xml) {
                        var cache, outerCache, node, diff, nodeIndex, start, dir = simple !== forward ? "nextSibling" : "previousSibling", parent = elem.parentNode, name = ofType && elem.nodeName.toLowerCase(), useCache = !xml && !ofType;
                        if (parent) {
                            if (simple) {
                                while (dir) {
                                    node = elem;
                                    while (node = node[dir]) if (ofType ? node.nodeName.toLowerCase() === name : node.nodeType === 1) return !1;
                                    start = dir = type === "only" && !start && "nextSibling";
                                }
                                return !0;
                            }
                            start = [ forward ? parent.firstChild : parent.lastChild ];
                            if (forward && useCache) {
                                outerCache = parent[expando] || (parent[expando] = {}), cache = outerCache[type] || [], nodeIndex = cache[0] === dirruns && cache[1], diff = cache[0] === dirruns && cache[2], node = nodeIndex && parent.childNodes[nodeIndex];
                                while (node = ++nodeIndex && node && node[dir] || (diff = nodeIndex = 0) || start.pop()) if (node.nodeType === 1 && ++diff && node === elem) {
                                    outerCache[type] = [ dirruns, nodeIndex, diff ];
                                    break;
                                }
                            } else if (useCache && (cache = (elem[expando] || (elem[expando] = {}))[type]) && cache[0] === dirruns) diff = cache[1]; else while (node = ++nodeIndex && node && node[dir] || (diff = nodeIndex = 0) || start.pop()) if ((ofType ? node.nodeName.toLowerCase() === name : node.nodeType === 1) && ++diff) {
                                useCache && ((node[expando] || (node[expando] = {}))[type] = [ dirruns, diff ]);
                                if (node === elem) break;
                            }
                            return diff -= last, diff === first || diff % first === 0 && diff / first >= 0;
                        }
                    };
                },
                PSEUDO: function(pseudo, argument) {
                    var args, fn = Expr.pseudos[pseudo] || Expr.setFilters[pseudo.toLowerCase()] || Sizzle.error("unsupported pseudo: " + pseudo);
                    return fn[expando] ? fn(argument) : fn.length > 1 ? (args = [ pseudo, pseudo, "", argument ], Expr.setFilters.hasOwnProperty(pseudo.toLowerCase()) ? markFunction(function(seed, matches) {
                        var idx, matched = fn(seed, argument), i = matched.length;
                        while (i--) idx = indexOf.call(seed, matched[i]), seed[idx] = !(matches[idx] = matched[i]);
                    }) : function(elem) {
                        return fn(elem, 0, args);
                    }) : fn;
                }
            },
            pseudos: {
                not: markFunction(function(selector) {
                    var input = [], results = [], matcher = compile(selector.replace(rtrim, "$1"));
                    return matcher[expando] ? markFunction(function(seed, matches, context, xml) {
                        var elem, unmatched = matcher(seed, null, xml, []), i = seed.length;
                        while (i--) if (elem = unmatched[i]) seed[i] = !(matches[i] = elem);
                    }) : function(elem, context, xml) {
                        return input[0] = elem, matcher(input, null, xml, results), !results.pop();
                    };
                }),
                has: markFunction(function(selector) {
                    return function(elem) {
                        return Sizzle(selector, elem).length > 0;
                    };
                }),
                contains: markFunction(function(text) {
                    return function(elem) {
                        return (elem.textContent || elem.innerText || getText(elem)).indexOf(text) > -1;
                    };
                }),
                lang: markFunction(function(lang) {
                    return ridentifier.test(lang || "") || Sizzle.error("unsupported lang: " + lang), lang = lang.replace(runescape, funescape).toLowerCase(), function(elem) {
                        var elemLang;
                        do if (elemLang = documentIsHTML ? elem.lang : elem.getAttribute("xml:lang") || elem.getAttribute("lang")) return elemLang = elemLang.toLowerCase(), elemLang === lang || elemLang.indexOf(lang + "-") === 0; while ((elem = elem.parentNode) && elem.nodeType === 1);
                        return !1;
                    };
                }),
                target: function(elem) {
                    var hash = window.location && window.location.hash;
                    return hash && hash.slice(1) === elem.id;
                },
                root: function(elem) {
                    return elem === docElem;
                },
                focus: function(elem) {
                    return elem === document.activeElement && (!document.hasFocus || document.hasFocus()) && !!(elem.type || elem.href || ~elem.tabIndex);
                },
                enabled: function(elem) {
                    return elem.disabled === !1;
                },
                disabled: function(elem) {
                    return elem.disabled === !0;
                },
                checked: function(elem) {
                    var nodeName = elem.nodeName.toLowerCase();
                    return nodeName === "input" && !!elem.checked || nodeName === "option" && !!elem.selected;
                },
                selected: function(elem) {
                    return elem.parentNode && elem.parentNode.selectedIndex, elem.selected === !0;
                },
                empty: function(elem) {
                    for (elem = elem.firstChild; elem; elem = elem.nextSibling) if (elem.nodeName > "@" || elem.nodeType === 3 || elem.nodeType === 4) return !1;
                    return !0;
                },
                parent: function(elem) {
                    return !Expr.pseudos.empty(elem);
                },
                header: function(elem) {
                    return rheader.test(elem.nodeName);
                },
                input: function(elem) {
                    return rinputs.test(elem.nodeName);
                },
                button: function(elem) {
                    var name = elem.nodeName.toLowerCase();
                    return name === "input" && elem.type === "button" || name === "button";
                },
                text: function(elem) {
                    var attr;
                    return elem.nodeName.toLowerCase() === "input" && elem.type === "text" && ((attr = elem.getAttribute("type")) == null || attr.toLowerCase() === elem.type);
                },
                first: createPositionalPseudo(function() {
                    return [ 0 ];
                }),
                last: createPositionalPseudo(function(matchIndexes, length) {
                    return [ length - 1 ];
                }),
                eq: createPositionalPseudo(function(matchIndexes, length, argument) {
                    return [ argument < 0 ? argument + length : argument ];
                }),
                even: createPositionalPseudo(function(matchIndexes, length) {
                    var i = 0;
                    for (; i < length; i += 2) matchIndexes.push(i);
                    return matchIndexes;
                }),
                odd: createPositionalPseudo(function(matchIndexes, length) {
                    var i = 1;
                    for (; i < length; i += 2) matchIndexes.push(i);
                    return matchIndexes;
                }),
                lt: createPositionalPseudo(function(matchIndexes, length, argument) {
                    var i = argument < 0 ? argument + length : argument;
                    for (; --i >= 0; ) matchIndexes.push(i);
                    return matchIndexes;
                }),
                gt: createPositionalPseudo(function(matchIndexes, length, argument) {
                    var i = argument < 0 ? argument + length : argument;
                    for (; ++i < length; ) matchIndexes.push(i);
                    return matchIndexes;
                })
            }
        }, Expr.pseudos.nth = Expr.pseudos.eq;
        for (i in {
            radio: !0,
            checkbox: !0,
            file: !0,
            password: !0,
            image: !0
        }) Expr.pseudos[i] = createInputPseudo(i);
        for (i in {
            submit: !0,
            reset: !0
        }) Expr.pseudos[i] = createButtonPseudo(i);
        function setFilters() {}
        setFilters.prototype = Expr.filters = Expr.pseudos, Expr.setFilters = new setFilters;
        function tokenize(selector, parseOnly) {
            var matched, match, tokens, type, soFar, groups, preFilters, cached = tokenCache[selector + " "];
            if (cached) return parseOnly ? 0 : cached.slice(0);
            soFar = selector, groups = [], preFilters = Expr.preFilter;
            while (soFar) {
                if (!matched || (match = rcomma.exec(soFar))) match && (soFar = soFar.slice(match[0].length) || soFar), groups.push(tokens = []);
                matched = !1;
                if (match = rcombinators.exec(soFar)) matched = match.shift(), tokens.push({
                    value: matched,
                    type: match[0].replace(rtrim, " ")
                }), soFar = soFar.slice(matched.length);
                for (type in Expr.filter) (match = matchExpr[type].exec(soFar)) && (!preFilters[type] || (match = preFilters[type](match))) && (matched = match.shift(), tokens.push({
                    value: matched,
                    type: type,
                    matches: match
                }), soFar = soFar.slice(matched.length));
                if (!matched) break;
            }
            return parseOnly ? soFar.length : soFar ? Sizzle.error(selector) : tokenCache(selector, groups).slice(0);
        }
        function toSelector(tokens) {
            var i = 0, len = tokens.length, selector = "";
            for (; i < len; i++) selector += tokens[i].value;
            return selector;
        }
        function addCombinator(matcher, combinator, base) {
            var dir = combinator.dir, checkNonElements = base && dir === "parentNode", doneName = done++;
            return combinator.first ? function(elem, context, xml) {
                while (elem = elem[dir]) if (elem.nodeType === 1 || checkNonElements) return matcher(elem, context, xml);
            } : function(elem, context, xml) {
                var data, cache, outerCache, dirkey = dirruns + " " + doneName;
                if (xml) {
                    while (elem = elem[dir]) if (elem.nodeType === 1 || checkNonElements) if (matcher(elem, context, xml)) return !0;
                } else while (elem = elem[dir]) if (elem.nodeType === 1 || checkNonElements) {
                    outerCache = elem[expando] || (elem[expando] = {});
                    if ((cache = outerCache[dir]) && cache[0] === dirkey) {
                        if ((data = cache[1]) === !0 || data === cachedruns) return data === !0;
                    } else {
                        cache = outerCache[dir] = [ dirkey ], cache[1] = matcher(elem, context, xml) || cachedruns;
                        if (cache[1] === !0) return !0;
                    }
                }
            };
        }
        function elementMatcher(matchers) {
            return matchers.length > 1 ? function(elem, context, xml) {
                var i = matchers.length;
                while (i--) if (!matchers[i](elem, context, xml)) return !1;
                return !0;
            } : matchers[0];
        }
        function condense(unmatched, map, filter, context, xml) {
            var elem, newUnmatched = [], i = 0, len = unmatched.length, mapped = map != null;
            for (; i < len; i++) if (elem = unmatched[i]) if (!filter || filter(elem, context, xml)) newUnmatched.push(elem), mapped && map.push(i);
            return newUnmatched;
        }
        function setMatcher(preFilter, selector, matcher, postFilter, postFinder, postSelector) {
            return postFilter && !postFilter[expando] && (postFilter = setMatcher(postFilter)), postFinder && !postFinder[expando] && (postFinder = setMatcher(postFinder, postSelector)), markFunction(function(seed, results, context, xml) {
                var temp, i, elem, preMap = [], postMap = [], preexisting = results.length, elems = seed || multipleContexts(selector || "*", context.nodeType ? [ context ] : context, []), matcherIn = preFilter && (seed || !selector) ? condense(elems, preMap, preFilter, context, xml) : elems, matcherOut = matcher ? postFinder || (seed ? preFilter : preexisting || postFilter) ? [] : results : matcherIn;
                matcher && matcher(matcherIn, matcherOut, context, xml);
                if (postFilter) {
                    temp = condense(matcherOut, postMap), postFilter(temp, [], context, xml), i = temp.length;
                    while (i--) if (elem = temp[i]) matcherOut[postMap[i]] = !(matcherIn[postMap[i]] = elem);
                }
                if (seed) {
                    if (postFinder || preFilter) {
                        if (postFinder) {
                            temp = [], i = matcherOut.length;
                            while (i--) (elem = matcherOut[i]) && temp.push(matcherIn[i] = elem);
                            postFinder(null, matcherOut = [], temp, xml);
                        }
                        i = matcherOut.length;
                        while (i--) (elem = matcherOut[i]) && (temp = postFinder ? indexOf.call(seed, elem) : preMap[i]) > -1 && (seed[temp] = !(results[temp] = elem));
                    }
                } else matcherOut = condense(matcherOut === results ? matcherOut.splice(preexisting, matcherOut.length) : matcherOut), postFinder ? postFinder(null, results, matcherOut, xml) : push.apply(results, matcherOut);
            });
        }
        function matcherFromTokens(tokens) {
            var checkContext, matcher, j, len = tokens.length, leadingRelative = Expr.relative[tokens[0].type], implicitRelative = leadingRelative || Expr.relative[" "], i = leadingRelative ? 1 : 0, matchContext = addCombinator(function(elem) {
                return elem === checkContext;
            }, implicitRelative, !0), matchAnyContext = addCombinator(function(elem) {
                return indexOf.call(checkContext, elem) > -1;
            }, implicitRelative, !0), matchers = [ function(elem, context, xml) {
                return !leadingRelative && (xml || context !== outermostContext) || ((checkContext = context).nodeType ? matchContext(elem, context, xml) : matchAnyContext(elem, context, xml));
            } ];
            for (; i < len; i++) if (matcher = Expr.relative[tokens[i].type]) matchers = [ addCombinator(elementMatcher(matchers), matcher) ]; else {
                matcher = Expr.filter[tokens[i].type].apply(null, tokens[i].matches);
                if (matcher[expando]) {
                    j = ++i;
                    for (; j < len; j++) if (Expr.relative[tokens[j].type]) break;
                    return setMatcher(i > 1 && elementMatcher(matchers), i > 1 && toSelector(tokens.slice(0, i - 1).concat({
                        value: tokens[i - 2].type === " " ? "*" : ""
                    })).replace(rtrim, "$1"), matcher, i < j && matcherFromTokens(tokens.slice(i, j)), j < len && matcherFromTokens(tokens = tokens.slice(j)), j < len && toSelector(tokens));
                }
                matchers.push(matcher);
            }
            return elementMatcher(matchers);
        }
        function matcherFromGroupMatchers(elementMatchers, setMatchers) {
            var matcherCachedRuns = 0, bySet = setMatchers.length > 0, byElement = elementMatchers.length > 0, superMatcher = function(seed, context, xml, results, expandContext) {
                var elem, j, matcher, setMatched = [], matchedCount = 0, i = "0", unmatched = seed && [], outermost = expandContext != null, contextBackup = outermostContext, elems = seed || byElement && Expr.find.TAG("*", expandContext && context.parentNode || context), dirrunsUnique = dirruns += contextBackup == null ? 1 : Math.random() || .1;
                outermost && (outermostContext = context !== document && context, cachedruns = matcherCachedRuns);
                for (; (elem = elems[i]) != null; i++) {
                    if (byElement && elem) {
                        j = 0;
                        while (matcher = elementMatchers[j++]) if (matcher(elem, context, xml)) {
                            results.push(elem);
                            break;
                        }
                        outermost && (dirruns = dirrunsUnique, cachedruns = ++matcherCachedRuns);
                    }
                    bySet && ((elem = !matcher && elem) && matchedCount--, seed && unmatched.push(elem));
                }
                matchedCount += i;
                if (bySet && i !== matchedCount) {
                    j = 0;
                    while (matcher = setMatchers[j++]) matcher(unmatched, setMatched, context, xml);
                    if (seed) {
                        if (matchedCount > 0) while (i--) !unmatched[i] && !setMatched[i] && (setMatched[i] = pop.call(results));
                        setMatched = condense(setMatched);
                    }
                    push.apply(results, setMatched), outermost && !seed && setMatched.length > 0 && matchedCount + setMatchers.length > 1 && Sizzle.uniqueSort(results);
                }
                return outermost && (dirruns = dirrunsUnique, outermostContext = contextBackup), unmatched;
            };
            return bySet ? markFunction(superMatcher) : superMatcher;
        }
        compile = Sizzle.compile = function(selector, group) {
            var i, setMatchers = [], elementMatchers = [], cached = compilerCache[selector + " "];
            if (!cached) {
                group || (group = tokenize(selector)), i = group.length;
                while (i--) cached = matcherFromTokens(group[i]), cached[expando] ? setMatchers.push(cached) : elementMatchers.push(cached);
                cached = compilerCache(selector, matcherFromGroupMatchers(elementMatchers, setMatchers));
            }
            return cached;
        };
        function multipleContexts(selector, contexts, results) {
            var i = 0, len = contexts.length;
            for (; i < len; i++) Sizzle(selector, contexts[i], results);
            return results;
        }
        function select(selector, context, results, seed) {
            var i, tokens, token, type, find, match = tokenize(selector);
            if (!seed && match.length === 1) {
                tokens = match[0] = match[0].slice(0);
                if (tokens.length > 2 && (token = tokens[0]).type === "ID" && support.getById && context.nodeType === 9 && documentIsHTML && Expr.relative[tokens[1].type]) {
                    context = (Expr.find.ID(token.matches[0].replace(runescape, funescape), context) || [])[0];
                    if (!context) return results;
                    selector = selector.slice(tokens.shift().value.length);
                }
                i = matchExpr.needsContext.test(selector) ? 0 : tokens.length;
                while (i--) {
                    token = tokens[i];
                    if (Expr.relative[type = token.type]) break;
                    if (find = Expr.find[type]) if (seed = find(token.matches[0].replace(runescape, funescape), rsibling.test(tokens[0].type) && context.parentNode || context)) {
                        tokens.splice(i, 1), selector = seed.length && toSelector(tokens);
                        if (!selector) return push.apply(results, seed), results;
                        break;
                    }
                }
            }
            return compile(selector, match)(seed, context, !documentIsHTML, results, rsibling.test(selector)), results;
        }
        support.sortStable = expando.split("").sort(sortOrder).join("") === expando, support.detectDuplicates = hasDuplicate, setDocument(), support.sortDetached = assert(function(div1) {
            return div1.compareDocumentPosition(document.createElement("div")) & 1;
        }), assert(function(div) {
            return div.innerHTML = "<a href='#'></a>", div.firstChild.getAttribute("href") === "#";
        }) || addHandle("type|href|height|width", function(elem, name, isXML) {
            if (!isXML) return elem.getAttribute(name, name.toLowerCase() === "type" ? 1 : 2);
        }), (!support.attributes || !assert(function(div) {
            return div.innerHTML = "<input/>", div.firstChild.setAttribute("value", ""), div.firstChild.getAttribute("value") === "";
        })) && addHandle("value", function(elem, name, isXML) {
            if (!isXML && elem.nodeName.toLowerCase() === "input") return elem.defaultValue;
        }), assert(function(div) {
            return div.getAttribute("disabled") == null;
        }) || addHandle(booleans, function(elem, name, isXML) {
            var val;
            if (!isXML) return (val = elem.getAttributeNode(name)) && val.specified ? val.value : elem[name] === !0 ? name.toLowerCase() : null;
        }), jQuery.find = Sizzle, jQuery.expr = Sizzle.selectors, jQuery.expr[":"] = jQuery.expr.pseudos, jQuery.unique = Sizzle.uniqueSort, jQuery.text = Sizzle.getText, jQuery.isXMLDoc = Sizzle.isXML, jQuery.contains = Sizzle.contains;
    }(window);
    var optionsCache = {};
    function createOptions(options) {
        var object = optionsCache[options] = {};
        return jQuery.each(options.match(core_rnotwhite) || [], function(_, flag) {
            object[flag] = !0;
        }), object;
    }
    jQuery.Callbacks = function(options) {
        options = typeof options == "string" ? optionsCache[options] || createOptions(options) : jQuery.extend({}, options);
        var memory, fired, firing, firingStart, firingLength, firingIndex, list = [], stack = !options.once && [], fire = function(data) {
            memory = options.memory && data, fired = !0, firingIndex = firingStart || 0, firingStart = 0, firingLength = list.length, firing = !0;
            for (; list && firingIndex < firingLength; firingIndex++) if (list[firingIndex].apply(data[0], data[1]) === !1 && options.stopOnFalse) {
                memory = !1;
                break;
            }
            firing = !1, list && (stack ? stack.length && fire(stack.shift()) : memory ? list = [] : self.disable());
        }, self = {
            add: function() {
                if (list) {
                    var start = list.length;
                    (function add(args) {
                        jQuery.each(args, function(_, arg) {
                            var type = jQuery.type(arg);
                            type === "function" ? (!options.unique || !self.has(arg)) && list.push(arg) : arg && arg.length && type !== "string" && add(arg);
                        });
                    })(arguments), firing ? firingLength = list.length : memory && (firingStart = start, fire(memory));
                }
                return this;
            },
            remove: function() {
                return list && jQuery.each(arguments, function(_, arg) {
                    var index;
                    while ((index = jQuery.inArray(arg, list, index)) > -1) list.splice(index, 1), firing && (index <= firingLength && firingLength--, index <= firingIndex && firingIndex--);
                }), this;
            },
            has: function(fn) {
                return fn ? jQuery.inArray(fn, list) > -1 : !!list && !!list.length;
            },
            empty: function() {
                return list = [], firingLength = 0, this;
            },
            disable: function() {
                return list = stack = memory = undefined, this;
            },
            disabled: function() {
                return !list;
            },
            lock: function() {
                return stack = undefined, memory || self.disable(), this;
            },
            locked: function() {
                return !stack;
            },
            fireWith: function(context, args) {
                return list && (!fired || stack) && (args = args || [], args = [ context, args.slice ? args.slice() : args ], firing ? stack.push(args) : fire(args)), this;
            },
            fire: function() {
                return self.fireWith(this, arguments), this;
            },
            fired: function() {
                return !!fired;
            }
        };
        return self;
    }, jQuery.extend({
        Deferred: function(func) {
            var tuples = [ [ "resolve", "done", jQuery.Callbacks("once memory"), "resolved" ], [ "reject", "fail", jQuery.Callbacks("once memory"), "rejected" ], [ "notify", "progress", jQuery.Callbacks("memory") ] ], state = "pending", promise = {
                state: function() {
                    return state;
                },
                always: function() {
                    return deferred.done(arguments).fail(arguments), this;
                },
                then: function() {
                    var fns = arguments;
                    return jQuery.Deferred(function(newDefer) {
                        jQuery.each(tuples, function(i, tuple) {
                            var action = tuple[0], fn = jQuery.isFunction(fns[i]) && fns[i];
                            deferred[tuple[1]](function() {
                                var returned = fn && fn.apply(this, arguments);
                                returned && jQuery.isFunction(returned.promise) ? returned.promise().done(newDefer.resolve).fail(newDefer.reject).progress(newDefer.notify) : newDefer[action + "With"](this === promise ? newDefer.promise() : this, fn ? [ returned ] : arguments);
                            });
                        }), fns = null;
                    }).promise();
                },
                promise: function(obj) {
                    return obj != null ? jQuery.extend(obj, promise) : promise;
                }
            }, deferred = {};
            return promise.pipe = promise.then, jQuery.each(tuples, function(i, tuple) {
                var list = tuple[2], stateString = tuple[3];
                promise[tuple[1]] = list.add, stateString && list.add(function() {
                    state = stateString;
                }, tuples[i ^ 1][2].disable, tuples[2][2].lock), deferred[tuple[0]] = function() {
                    return deferred[tuple[0] + "With"](this === deferred ? promise : this, arguments), this;
                }, deferred[tuple[0] + "With"] = list.fireWith;
            }), promise.promise(deferred), func && func.call(deferred, deferred), deferred;
        },
        when: function(subordinate) {
            var i = 0, resolveValues = core_slice.call(arguments), length = resolveValues.length, remaining = length !== 1 || subordinate && jQuery.isFunction(subordinate.promise) ? length : 0, deferred = remaining === 1 ? subordinate : jQuery.Deferred(), updateFunc = function(i, contexts, values) {
                return function(value) {
                    contexts[i] = this, values[i] = arguments.length > 1 ? core_slice.call(arguments) : value, values === progressValues ? deferred.notifyWith(contexts, values) : --remaining || deferred.resolveWith(contexts, values);
                };
            }, progressValues, progressContexts, resolveContexts;
            if (length > 1) {
                progressValues = new Array(length), progressContexts = new Array(length), resolveContexts = new Array(length);
                for (; i < length; i++) resolveValues[i] && jQuery.isFunction(resolveValues[i].promise) ? resolveValues[i].promise().done(updateFunc(i, resolveContexts, resolveValues)).fail(deferred.reject).progress(updateFunc(i, progressContexts, progressValues)) : --remaining;
            }
            return remaining || deferred.resolveWith(resolveContexts, resolveValues), deferred.promise();
        }
    }), jQuery.support = function(support) {
        var input = document.createElement("input"), fragment = document.createDocumentFragment(), div = document.createElement("div"), select = document.createElement("select"), opt = select.appendChild(document.createElement("option"));
        return input.type ? (input.type = "checkbox", support.checkOn = input.value !== "", support.optSelected = opt.selected, support.reliableMarginRight = !0, support.boxSizingReliable = !0, support.pixelPosition = !1, input.checked = !0, support.noCloneChecked = input.cloneNode(!0).checked, select.disabled = !0, support.optDisabled = !opt.disabled, input = document.createElement("input"), input.value = "t", input.type = "radio", support.radioValue = input.value === "t", input.setAttribute("checked", "t"), input.setAttribute("name", "t"), fragment.appendChild(input), support.checkClone = fragment.cloneNode(!0).cloneNode(!0).lastChild.checked, support.focusinBubbles = "onfocusin" in window, div.style.backgroundClip = "content-box", div.cloneNode(!0).style.backgroundClip = "", support.clearCloneStyle = div.style.backgroundClip === "content-box", jQuery(function() {
            var container, marginDiv, divReset = "padding:0;margin:0;border:0;display:block;-webkit-box-sizing:content-box;-moz-box-sizing:content-box;box-sizing:content-box", body = document.getElementsByTagName("body")[0];
            if (!body) return;
            container = document.createElement("div"), container.style.cssText = "border:0;width:0;height:0;position:absolute;top:0;left:-9999px;margin-top:1px", body.appendChild(container).appendChild(div), div.innerHTML = "", div.style.cssText = "-webkit-box-sizing:border-box;-moz-box-sizing:border-box;box-sizing:border-box;padding:1px;border:1px;display:block;width:4px;margin-top:1%;position:absolute;top:1%", jQuery.swap(body, body.style.zoom != null ? {
                zoom: 1
            } : {}, function() {
                support.boxSizing = div.offsetWidth === 4;
            }), window.getComputedStyle && (support.pixelPosition = (window.getComputedStyle(div, null) || {}).top !== "1%", support.boxSizingReliable = (window.getComputedStyle(div, null) || {
                width: "4px"
            }).width === "4px", marginDiv = div.appendChild(document.createElement("div")), marginDiv.style.cssText = div.style.cssText = divReset, marginDiv.style.marginRight = marginDiv.style.width = "0", div.style.width = "1px", support.reliableMarginRight = !parseFloat((window.getComputedStyle(marginDiv, null) || {}).marginRight)), body.removeChild(container);
        }), support) : support;
    }({});
    var data_user, data_priv, rbrace = /(?:\{[\s\S]*\}|\[[\s\S]*\])$/, rmultiDash = /([A-Z])/g;
    function Data() {
        Object.defineProperty(this.cache = {}, 0, {
            get: function() {
                return {};
            }
        }), this.expando = jQuery.expando + Math.random();
    }
    Data.uid = 1, Data.accepts = function(owner) {
        return owner.nodeType ? owner.nodeType === 1 || owner.nodeType === 9 : !0;
    }, Data.prototype = {
        key: function(owner) {
            if (!Data.accepts(owner)) return 0;
            var descriptor = {}, unlock = owner[this.expando];
            if (!unlock) {
                unlock = Data.uid++;
                try {
                    descriptor[this.expando] = {
                        value: unlock
                    }, Object.defineProperties(owner, descriptor);
                } catch (e) {
                    descriptor[this.expando] = unlock, jQuery.extend(owner, descriptor);
                }
            }
            return this.cache[unlock] || (this.cache[unlock] = {}), unlock;
        },
        set: function(owner, data, value) {
            var prop, unlock = this.key(owner), cache = this.cache[unlock];
            if (typeof data == "string") cache[data] = value; else if (jQuery.isEmptyObject(cache)) jQuery.extend(this.cache[unlock], data); else for (prop in data) cache[prop] = data[prop];
            return cache;
        },
        get: function(owner, key) {
            var cache = this.cache[this.key(owner)];
            return key === undefined ? cache : cache[key];
        },
        access: function(owner, key, value) {
            var stored;
            return key === undefined || key && typeof key == "string" && value === undefined ? (stored = this.get(owner, key), stored !== undefined ? stored : this.get(owner, jQuery.camelCase(key))) : (this.set(owner, key, value), value !== undefined ? value : key);
        },
        remove: function(owner, key) {
            var i, name, camel, unlock = this.key(owner), cache = this.cache[unlock];
            if (key === undefined) this.cache[unlock] = {}; else {
                jQuery.isArray(key) ? name = key.concat(key.map(jQuery.camelCase)) : (camel = jQuery.camelCase(key), key in cache ? name = [ key, camel ] : (name = camel, name = name in cache ? [ name ] : name.match(core_rnotwhite) || [])), i = name.length;
                while (i--) delete cache[name[i]];
            }
        },
        hasData: function(owner) {
            return !jQuery.isEmptyObject(this.cache[owner[this.expando]] || {});
        },
        discard: function(owner) {
            owner[this.expando] && delete this.cache[owner[this.expando]];
        }
    }, data_user = new Data, data_priv = new Data, jQuery.extend({
        acceptData: Data.accepts,
        hasData: function(elem) {
            return data_user.hasData(elem) || data_priv.hasData(elem);
        },
        data: function(elem, name, data) {
            return data_user.access(elem, name, data);
        },
        removeData: function(elem, name) {
            data_user.remove(elem, name);
        },
        _data: function(elem, name, data) {
            return data_priv.access(elem, name, data);
        },
        _removeData: function(elem, name) {
            data_priv.remove(elem, name);
        }
    }), jQuery.fn.extend({
        data: function(key, value) {
            var attrs, name, elem = this[0], i = 0, data = null;
            if (key === undefined) {
                if (this.length) {
                    data = data_user.get(elem);
                    if (elem.nodeType === 1 && !data_priv.get(elem, "hasDataAttrs")) {
                        attrs = elem.attributes;
                        for (; i < attrs.length; i++) name = attrs[i].name, name.indexOf("data-") === 0 && (name = jQuery.camelCase(name.slice(5)), dataAttr(elem, name, data[name]));
                        data_priv.set(elem, "hasDataAttrs", !0);
                    }
                }
                return data;
            }
            return typeof key == "object" ? this.each(function() {
                data_user.set(this, key);
            }) : jQuery.access(this, function(value) {
                var data, camelKey = jQuery.camelCase(key);
                if (elem && value === undefined) {
                    data = data_user.get(elem, key);
                    if (data !== undefined) return data;
                    data = data_user.get(elem, camelKey);
                    if (data !== undefined) return data;
                    data = dataAttr(elem, camelKey, undefined);
                    if (data !== undefined) return data;
                    return;
                }
                this.each(function() {
                    var data = data_user.get(this, camelKey);
                    data_user.set(this, camelKey, value), key.indexOf("-") !== -1 && data !== undefined && data_user.set(this, key, value);
                });
            }, null, value, arguments.length > 1, null, !0);
        },
        removeData: function(key) {
            return this.each(function() {
                data_user.remove(this, key);
            });
        }
    });
    function dataAttr(elem, key, data) {
        var name;
        if (data === undefined && elem.nodeType === 1) {
            name = "data-" + key.replace(rmultiDash, "-$1").toLowerCase(), data = elem.getAttribute(name);
            if (typeof data == "string") {
                try {
                    data = data === "true" ? !0 : data === "false" ? !1 : data === "null" ? null : +data + "" === data ? +data : rbrace.test(data) ? JSON.parse(data) : data;
                } catch (e) {}
                data_user.set(elem, key, data);
            } else data = undefined;
        }
        return data;
    }
    jQuery.extend({
        queue: function(elem, type, data) {
            var queue;
            if (elem) return type = (type || "fx") + "queue", queue = data_priv.get(elem, type), data && (!queue || jQuery.isArray(data) ? queue = data_priv.access(elem, type, jQuery.makeArray(data)) : queue.push(data)), queue || [];
        },
        dequeue: function(elem, type) {
            type = type || "fx";
            var queue = jQuery.queue(elem, type), startLength = queue.length, fn = queue.shift(), hooks = jQuery._queueHooks(elem, type), next = function() {
                jQuery.dequeue(elem, type);
            };
            fn === "inprogress" && (fn = queue.shift(), startLength--), fn && (type === "fx" && queue.unshift("inprogress"), delete hooks.stop, fn.call(elem, next, hooks)), !startLength && hooks && hooks.empty.fire();
        },
        _queueHooks: function(elem, type) {
            var key = type + "queueHooks";
            return data_priv.get(elem, key) || data_priv.access(elem, key, {
                empty: jQuery.Callbacks("once memory").add(function() {
                    data_priv.remove(elem, [ type + "queue", key ]);
                })
            });
        }
    }), jQuery.fn.extend({
        queue: function(type, data) {
            var setter = 2;
            return typeof type != "string" && (data = type, type = "fx", setter--), arguments.length < setter ? jQuery.queue(this[0], type) : data === undefined ? this : this.each(function() {
                var queue = jQuery.queue(this, type, data);
                jQuery._queueHooks(this, type), type === "fx" && queue[0] !== "inprogress" && jQuery.dequeue(this, type);
            });
        },
        dequeue: function(type) {
            return this.each(function() {
                jQuery.dequeue(this, type);
            });
        },
        delay: function(time, type) {
            return time = jQuery.fx ? jQuery.fx.speeds[time] || time : time, type = type || "fx", this.queue(type, function(next, hooks) {
                var timeout = setTimeout(next, time);
                hooks.stop = function() {
                    clearTimeout(timeout);
                };
            });
        },
        clearQueue: function(type) {
            return this.queue(type || "fx", []);
        },
        promise: function(type, obj) {
            var tmp, count = 1, defer = jQuery.Deferred(), elements = this, i = this.length, resolve = function() {
                --count || defer.resolveWith(elements, [ elements ]);
            };
            typeof type != "string" && (obj = type, type = undefined), type = type || "fx";
            while (i--) tmp = data_priv.get(elements[i], type + "queueHooks"), tmp && tmp.empty && (count++, tmp.empty.add(resolve));
            return resolve(), defer.promise(obj);
        }
    });
    var nodeHook, boolHook, rclass = /[\t\r\n\f]/g, rreturn = /\r/g, rfocusable = /^(?:input|select|textarea|button)$/i;
    jQuery.fn.extend({
        attr: function(name, value) {
            return jQuery.access(this, jQuery.attr, name, value, arguments.length > 1);
        },
        removeAttr: function(name) {
            return this.each(function() {
                jQuery.removeAttr(this, name);
            });
        },
        prop: function(name, value) {
            return jQuery.access(this, jQuery.prop, name, value, arguments.length > 1);
        },
        removeProp: function(name) {
            return this.each(function() {
                delete this[jQuery.propFix[name] || name];
            });
        },
        addClass: function(value) {
            var classes, elem, cur, clazz, j, i = 0, len = this.length, proceed = typeof value == "string" && value;
            if (jQuery.isFunction(value)) return this.each(function(j) {
                jQuery(this).addClass(value.call(this, j, this.className));
            });
            if (proceed) {
                classes = (value || "").match(core_rnotwhite) || [];
                for (; i < len; i++) {
                    elem = this[i], cur = elem.nodeType === 1 && (elem.className ? (" " + elem.className + " ").replace(rclass, " ") : " ");
                    if (cur) {
                        j = 0;
                        while (clazz = classes[j++]) cur.indexOf(" " + clazz + " ") < 0 && (cur += clazz + " ");
                        elem.className = jQuery.trim(cur);
                    }
                }
            }
            return this;
        },
        removeClass: function(value) {
            var classes, elem, cur, clazz, j, i = 0, len = this.length, proceed = arguments.length === 0 || typeof value == "string" && value;
            if (jQuery.isFunction(value)) return this.each(function(j) {
                jQuery(this).removeClass(value.call(this, j, this.className));
            });
            if (proceed) {
                classes = (value || "").match(core_rnotwhite) || [];
                for (; i < len; i++) {
                    elem = this[i], cur = elem.nodeType === 1 && (elem.className ? (" " + elem.className + " ").replace(rclass, " ") : "");
                    if (cur) {
                        j = 0;
                        while (clazz = classes[j++]) while (cur.indexOf(" " + clazz + " ") >= 0) cur = cur.replace(" " + clazz + " ", " ");
                        elem.className = value ? jQuery.trim(cur) : "";
                    }
                }
            }
            return this;
        },
        toggleClass: function(value, stateVal) {
            var type = typeof value;
            return typeof stateVal == "boolean" && type === "string" ? stateVal ? this.addClass(value) : this.removeClass(value) : jQuery.isFunction(value) ? this.each(function(i) {
                jQuery(this).toggleClass(value.call(this, i, this.className, stateVal), stateVal);
            }) : this.each(function() {
                if (type === "string") {
                    var className, i = 0, self = jQuery(this), classNames = value.match(core_rnotwhite) || [];
                    while (className = classNames[i++]) self.hasClass(className) ? self.removeClass(className) : self.addClass(className);
                } else if (type === core_strundefined || type === "boolean") this.className && data_priv.set(this, "__className__", this.className), this.className = this.className || value === !1 ? "" : data_priv.get(this, "__className__") || "";
            });
        },
        hasClass: function(selector) {
            var className = " " + selector + " ", i = 0, l = this.length;
            for (; i < l; i++) if (this[i].nodeType === 1 && (" " + this[i].className + " ").replace(rclass, " ").indexOf(className) >= 0) return !0;
            return !1;
        },
        val: function(value) {
            var hooks, ret, isFunction, elem = this[0];
            if (!arguments.length) {
                if (elem) return hooks = jQuery.valHooks[elem.type] || jQuery.valHooks[elem.nodeName.toLowerCase()], hooks && "get" in hooks && (ret = hooks.get(elem, "value")) !== undefined ? ret : (ret = elem.value, typeof ret == "string" ? ret.replace(rreturn, "") : ret == null ? "" : ret);
                return;
            }
            return isFunction = jQuery.isFunction(value), this.each(function(i) {
                var val;
                if (this.nodeType !== 1) return;
                isFunction ? val = value.call(this, i, jQuery(this).val()) : val = value, val == null ? val = "" : typeof val == "number" ? val += "" : jQuery.isArray(val) && (val = jQuery.map(val, function(value) {
                    return value == null ? "" : value + "";
                })), hooks = jQuery.valHooks[this.type] || jQuery.valHooks[this.nodeName.toLowerCase()];
                if (!hooks || !("set" in hooks) || hooks.set(this, val, "value") === undefined) this.value = val;
            });
        }
    }), jQuery.extend({
        valHooks: {
            option: {
                get: function(elem) {
                    var val = elem.attributes.value;
                    return !val || val.specified ? elem.value : elem.text;
                }
            },
            select: {
                get: function(elem) {
                    var value, option, options = elem.options, index = elem.selectedIndex, one = elem.type === "select-one" || index < 0, values = one ? null : [], max = one ? index + 1 : options.length, i = index < 0 ? max : one ? index : 0;
                    for (; i < max; i++) {
                        option = options[i];
                        if ((option.selected || i === index) && (jQuery.support.optDisabled ? !option.disabled : option.getAttribute("disabled") === null) && (!option.parentNode.disabled || !jQuery.nodeName(option.parentNode, "optgroup"))) {
                            value = jQuery(option).val();
                            if (one) return value;
                            values.push(value);
                        }
                    }
                    return values;
                },
                set: function(elem, value) {
                    var optionSet, option, options = elem.options, values = jQuery.makeArray(value), i = options.length;
                    while (i--) {
                        option = options[i];
                        if (option.selected = jQuery.inArray(jQuery(option).val(), values) >= 0) optionSet = !0;
                    }
                    return optionSet || (elem.selectedIndex = -1), values;
                }
            }
        },
        attr: function(elem, name, value) {
            var hooks, ret, nType = elem.nodeType;
            if (!elem || nType === 3 || nType === 8 || nType === 2) return;
            if (typeof elem.getAttribute === core_strundefined) return jQuery.prop(elem, name, value);
            if (nType !== 1 || !jQuery.isXMLDoc(elem)) name = name.toLowerCase(), hooks = jQuery.attrHooks[name] || (jQuery.expr.match.bool.test(name) ? boolHook : nodeHook);
            if (value === undefined) return hooks && "get" in hooks && (ret = hooks.get(elem, name)) !== null ? ret : (ret = jQuery.find.attr(elem, name), ret == null ? undefined : ret);
            if (value !== null) return hooks && "set" in hooks && (ret = hooks.set(elem, value, name)) !== undefined ? ret : (elem.setAttribute(name, value + ""), value);
            jQuery.removeAttr(elem, name);
        },
        removeAttr: function(elem, value) {
            var name, propName, i = 0, attrNames = value && value.match(core_rnotwhite);
            if (attrNames && elem.nodeType === 1) while (name = attrNames[i++]) propName = jQuery.propFix[name] || name, jQuery.expr.match.bool.test(name) && (elem[propName] = !1), elem.removeAttribute(name);
        },
        attrHooks: {
            type: {
                set: function(elem, value) {
                    if (!jQuery.support.radioValue && value === "radio" && jQuery.nodeName(elem, "input")) {
                        var val = elem.value;
                        return elem.setAttribute("type", value), val && (elem.value = val), value;
                    }
                }
            }
        },
        propFix: {
            "for": "htmlFor",
            "class": "className"
        },
        prop: function(elem, name, value) {
            var ret, hooks, notxml, nType = elem.nodeType;
            if (!elem || nType === 3 || nType === 8 || nType === 2) return;
            return notxml = nType !== 1 || !jQuery.isXMLDoc(elem), notxml && (name = jQuery.propFix[name] || name, hooks = jQuery.propHooks[name]), value !== undefined ? hooks && "set" in hooks && (ret = hooks.set(elem, value, name)) !== undefined ? ret : elem[name] = value : hooks && "get" in hooks && (ret = hooks.get(elem, name)) !== null ? ret : elem[name];
        },
        propHooks: {
            tabIndex: {
                get: function(elem) {
                    return elem.hasAttribute("tabindex") || rfocusable.test(elem.nodeName) || elem.href ? elem.tabIndex : -1;
                }
            }
        }
    }), boolHook = {
        set: function(elem, value, name) {
            return value === !1 ? jQuery.removeAttr(elem, name) : elem.setAttribute(name, name), name;
        }
    }, jQuery.each(jQuery.expr.match.bool.source.match(/\w+/g), function(i, name) {
        var getter = jQuery.expr.attrHandle[name] || jQuery.find.attr;
        jQuery.expr.attrHandle[name] = function(elem, name, isXML) {
            var fn = jQuery.expr.attrHandle[name], ret = isXML ? undefined : (jQuery.expr.attrHandle[name] = undefined) != getter(elem, name, isXML) ? name.toLowerCase() : null;
            return jQuery.expr.attrHandle[name] = fn, ret;
        };
    }), jQuery.support.optSelected || (jQuery.propHooks.selected = {
        get: function(elem) {
            var parent = elem.parentNode;
            return parent && parent.parentNode && parent.parentNode.selectedIndex, null;
        }
    }), jQuery.each([ "tabIndex", "readOnly", "maxLength", "cellSpacing", "cellPadding", "rowSpan", "colSpan", "useMap", "frameBorder", "contentEditable" ], function() {
        jQuery.propFix[this.toLowerCase()] = this;
    }), jQuery.each([ "radio", "checkbox" ], function() {
        jQuery.valHooks[this] = {
            set: function(elem, value) {
                if (jQuery.isArray(value)) return elem.checked = jQuery.inArray(jQuery(elem).val(), value) >= 0;
            }
        }, jQuery.support.checkOn || (jQuery.valHooks[this].get = function(elem) {
            return elem.getAttribute("value") === null ? "on" : elem.value;
        });
    });
    var rkeyEvent = /^key/, rmouseEvent = /^(?:mouse|contextmenu)|click/, rfocusMorph = /^(?:focusinfocus|focusoutblur)$/, rtypenamespace = /^([^.]*)(?:\.(.+)|)$/;
    function returnTrue() {
        return !0;
    }
    function returnFalse() {
        return !1;
    }
    function safeActiveElement() {
        try {
            return document.activeElement;
        } catch (err) {}
    }
    jQuery.event = {
        global: {},
        add: function(elem, types, handler, data, selector) {
            var handleObjIn, eventHandle, tmp, events, t, handleObj, special, handlers, type, namespaces, origType, elemData = data_priv.get(elem);
            if (!elemData) return;
            handler.handler && (handleObjIn = handler, handler = handleObjIn.handler, selector = handleObjIn.selector), handler.guid || (handler.guid = jQuery.guid++), (events = elemData.events) || (events = elemData.events = {}), (eventHandle = elemData.handle) || (eventHandle = elemData.handle = function(e) {
                return typeof jQuery === core_strundefined || !!e && jQuery.event.triggered === e.type ? undefined : jQuery.event.dispatch.apply(eventHandle.elem, arguments);
            }, eventHandle.elem = elem), types = (types || "").match(core_rnotwhite) || [ "" ], t = types.length;
            while (t--) {
                tmp = rtypenamespace.exec(types[t]) || [], type = origType = tmp[1], namespaces = (tmp[2] || "").split(".").sort();
                if (!type) continue;
                special = jQuery.event.special[type] || {}, type = (selector ? special.delegateType : special.bindType) || type, special = jQuery.event.special[type] || {}, handleObj = jQuery.extend({
                    type: type,
                    origType: origType,
                    data: data,
                    handler: handler,
                    guid: handler.guid,
                    selector: selector,
                    needsContext: selector && jQuery.expr.match.needsContext.test(selector),
                    namespace: namespaces.join(".")
                }, handleObjIn), (handlers = events[type]) || (handlers = events[type] = [], handlers.delegateCount = 0, (!special.setup || special.setup.call(elem, data, namespaces, eventHandle) === !1) && elem.addEventListener && elem.addEventListener(type, eventHandle, !1)), special.add && (special.add.call(elem, handleObj), handleObj.handler.guid || (handleObj.handler.guid = handler.guid)), selector ? handlers.splice(handlers.delegateCount++, 0, handleObj) : handlers.push(handleObj), jQuery.event.global[type] = !0;
            }
            elem = null;
        },
        remove: function(elem, types, handler, selector, mappedTypes) {
            var j, origCount, tmp, events, t, handleObj, special, handlers, type, namespaces, origType, elemData = data_priv.hasData(elem) && data_priv.get(elem);
            if (!elemData || !(events = elemData.events)) return;
            types = (types || "").match(core_rnotwhite) || [ "" ], t = types.length;
            while (t--) {
                tmp = rtypenamespace.exec(types[t]) || [], type = origType = tmp[1], namespaces = (tmp[2] || "").split(".").sort();
                if (!type) {
                    for (type in events) jQuery.event.remove(elem, type + types[t], handler, selector, !0);
                    continue;
                }
                special = jQuery.event.special[type] || {}, type = (selector ? special.delegateType : special.bindType) || type, handlers = events[type] || [], tmp = tmp[2] && new RegExp("(^|\\.)" + namespaces.join("\\.(?:.*\\.|)") + "(\\.|$)"), origCount = j = handlers.length;
                while (j--) handleObj = handlers[j], (mappedTypes || origType === handleObj.origType) && (!handler || handler.guid === handleObj.guid) && (!tmp || tmp.test(handleObj.namespace)) && (!selector || selector === handleObj.selector || selector === "**" && handleObj.selector) && (handlers.splice(j, 1), handleObj.selector && handlers.delegateCount--, special.remove && special.remove.call(elem, handleObj));
                origCount && !handlers.length && ((!special.teardown || special.teardown.call(elem, namespaces, elemData.handle) === !1) && jQuery.removeEvent(elem, type, elemData.handle), delete events[type]);
            }
            jQuery.isEmptyObject(events) && (delete elemData.handle, data_priv.remove(elem, "events"));
        },
        trigger: function(event, data, elem, onlyHandlers) {
            var i, cur, tmp, bubbleType, ontype, handle, special, eventPath = [ elem || document ], type = core_hasOwn.call(event, "type") ? event.type : event, namespaces = core_hasOwn.call(event, "namespace") ? event.namespace.split(".") : [];
            cur = tmp = elem = elem || document;
            if (elem.nodeType === 3 || elem.nodeType === 8) return;
            if (rfocusMorph.test(type + jQuery.event.triggered)) return;
            type.indexOf(".") >= 0 && (namespaces = type.split("."), type = namespaces.shift(), namespaces.sort()), ontype = type.indexOf(":") < 0 && "on" + type, event = event[jQuery.expando] ? event : new jQuery.Event(type, typeof event == "object" && event), event.isTrigger = onlyHandlers ? 2 : 3, event.namespace = namespaces.join("."), event.namespace_re = event.namespace ? new RegExp("(^|\\.)" + namespaces.join("\\.(?:.*\\.|)") + "(\\.|$)") : null, event.result = undefined, event.target || (event.target = elem), data = data == null ? [ event ] : jQuery.makeArray(data, [ event ]), special = jQuery.event.special[type] || {};
            if (!onlyHandlers && special.trigger && special.trigger.apply(elem, data) === !1) return;
            if (!onlyHandlers && !special.noBubble && !jQuery.isWindow(elem)) {
                bubbleType = special.delegateType || type, rfocusMorph.test(bubbleType + type) || (cur = cur.parentNode);
                for (; cur; cur = cur.parentNode) eventPath.push(cur), tmp = cur;
                tmp === (elem.ownerDocument || document) && eventPath.push(tmp.defaultView || tmp.parentWindow || window);
            }
            i = 0;
            while ((cur = eventPath[i++]) && !event.isPropagationStopped()) event.type = i > 1 ? bubbleType : special.bindType || type, handle = (data_priv.get(cur, "events") || {})[event.type] && data_priv.get(cur, "handle"), handle && handle.apply(cur, data), handle = ontype && cur[ontype], handle && jQuery.acceptData(cur) && handle.apply && handle.apply(cur, data) === !1 && event.preventDefault();
            return event.type = type, !onlyHandlers && !event.isDefaultPrevented() && (!special._default || special._default.apply(eventPath.pop(), data) === !1) && jQuery.acceptData(elem) && ontype && jQuery.isFunction(elem[type]) && !jQuery.isWindow(elem) && (tmp = elem[ontype], tmp && (elem[ontype] = null), jQuery.event.triggered = type, elem[type](), jQuery.event.triggered = undefined, tmp && (elem[ontype] = tmp)), event.result;
        },
        dispatch: function(event) {
            event = jQuery.event.fix(event);
            var i, j, ret, matched, handleObj, handlerQueue = [], args = core_slice.call(arguments), handlers = (data_priv.get(this, "events") || {})[event.type] || [], special = jQuery.event.special[event.type] || {};
            args[0] = event, event.delegateTarget = this;
            if (special.preDispatch && special.preDispatch.call(this, event) === !1) return;
            handlerQueue = jQuery.event.handlers.call(this, event, handlers), i = 0;
            while ((matched = handlerQueue[i++]) && !event.isPropagationStopped()) {
                event.currentTarget = matched.elem, j = 0;
                while ((handleObj = matched.handlers[j++]) && !event.isImmediatePropagationStopped()) if (!event.namespace_re || event.namespace_re.test(handleObj.namespace)) event.handleObj = handleObj, event.data = handleObj.data, ret = ((jQuery.event.special[handleObj.origType] || {}).handle || handleObj.handler).apply(matched.elem, args), ret !== undefined && (event.result = ret) === !1 && (event.preventDefault(), event.stopPropagation());
            }
            return special.postDispatch && special.postDispatch.call(this, event), event.result;
        },
        handlers: function(event, handlers) {
            var i, matches, sel, handleObj, handlerQueue = [], delegateCount = handlers.delegateCount, cur = event.target;
            if (delegateCount && cur.nodeType && (!event.button || event.type !== "click")) for (; cur !== this; cur = cur.parentNode || this) if (cur.disabled !== !0 || event.type !== "click") {
                matches = [];
                for (i = 0; i < delegateCount; i++) handleObj = handlers[i], sel = handleObj.selector + " ", matches[sel] === undefined && (matches[sel] = handleObj.needsContext ? jQuery(sel, this).index(cur) >= 0 : jQuery.find(sel, this, null, [ cur ]).length), matches[sel] && matches.push(handleObj);
                matches.length && handlerQueue.push({
                    elem: cur,
                    handlers: matches
                });
            }
            return delegateCount < handlers.length && handlerQueue.push({
                elem: this,
                handlers: handlers.slice(delegateCount)
            }), handlerQueue;
        },
        props: "altKey bubbles cancelable ctrlKey currentTarget eventPhase metaKey relatedTarget shiftKey target timeStamp view which".split(" "),
        fixHooks: {},
        keyHooks: {
            props: "char charCode key keyCode".split(" "),
            filter: function(event, original) {
                return event.which == null && (event.which = original.charCode != null ? original.charCode : original.keyCode), event;
            }
        },
        mouseHooks: {
            props: "button buttons clientX clientY offsetX offsetY pageX pageY screenX screenY toElement".split(" "),
            filter: function(event, original) {
                var eventDoc, doc, body, button = original.button;
                return event.pageX == null && original.clientX != null && (eventDoc = event.target.ownerDocument || document, doc = eventDoc.documentElement, body = eventDoc.body, event.pageX = original.clientX + (doc && doc.scrollLeft || body && body.scrollLeft || 0) - (doc && doc.clientLeft || body && body.clientLeft || 0), event.pageY = original.clientY + (doc && doc.scrollTop || body && body.scrollTop || 0) - (doc && doc.clientTop || body && body.clientTop || 0)), !event.which && button !== undefined && (event.which = button & 1 ? 1 : button & 2 ? 3 : button & 4 ? 2 : 0), event;
            }
        },
        fix: function(event) {
            if (event[jQuery.expando]) return event;
            var i, prop, copy, type = event.type, originalEvent = event, fixHook = this.fixHooks[type];
            fixHook || (this.fixHooks[type] = fixHook = rmouseEvent.test(type) ? this.mouseHooks : rkeyEvent.test(type) ? this.keyHooks : {}), copy = fixHook.props ? this.props.concat(fixHook.props) : this.props, event = new jQuery.Event(originalEvent), i = copy.length;
            while (i--) prop = copy[i], event[prop] = originalEvent[prop];
            return event.target || (event.target = document), event.target.nodeType === 3 && (event.target = event.target.parentNode), fixHook.filter ? fixHook.filter(event, originalEvent) : event;
        },
        special: {
            load: {
                noBubble: !0
            },
            focus: {
                trigger: function() {
                    if (this !== safeActiveElement() && this.focus) return this.focus(), !1;
                },
                delegateType: "focusin"
            },
            blur: {
                trigger: function() {
                    if (this === safeActiveElement() && this.blur) return this.blur(), !1;
                },
                delegateType: "focusout"
            },
            click: {
                trigger: function() {
                    if (this.type === "checkbox" && this.click && jQuery.nodeName(this, "input")) return this.click(), !1;
                },
                _default: function(event) {
                    return jQuery.nodeName(event.target, "a");
                }
            },
            beforeunload: {
                postDispatch: function(event) {
                    event.result !== undefined && (event.originalEvent.returnValue = event.result);
                }
            }
        },
        simulate: function(type, elem, event, bubble) {
            var e = jQuery.extend(new jQuery.Event, event, {
                type: type,
                isSimulated: !0,
                originalEvent: {}
            });
            bubble ? jQuery.event.trigger(e, null, elem) : jQuery.event.dispatch.call(elem, e), e.isDefaultPrevented() && event.preventDefault();
        }
    }, jQuery.removeEvent = function(elem, type, handle) {
        elem.removeEventListener && elem.removeEventListener(type, handle, !1);
    }, jQuery.Event = function(src, props) {
        if (!(this instanceof jQuery.Event)) return new jQuery.Event(src, props);
        src && src.type ? (this.originalEvent = src, this.type = src.type, this.isDefaultPrevented = src.defaultPrevented || src.getPreventDefault && src.getPreventDefault() ? returnTrue : returnFalse) : this.type = src, props && jQuery.extend(this, props), this.timeStamp = src && src.timeStamp || jQuery.now(), this[jQuery.expando] = !0;
    }, jQuery.Event.prototype = {
        isDefaultPrevented: returnFalse,
        isPropagationStopped: returnFalse,
        isImmediatePropagationStopped: returnFalse,
        preventDefault: function() {
            var e = this.originalEvent;
            this.isDefaultPrevented = returnTrue, e && e.preventDefault && e.preventDefault();
        },
        stopPropagation: function() {
            var e = this.originalEvent;
            this.isPropagationStopped = returnTrue, e && e.stopPropagation && e.stopPropagation();
        },
        stopImmediatePropagation: function() {
            this.isImmediatePropagationStopped = returnTrue, this.stopPropagation();
        }
    }, jQuery.each({
        mouseenter: "mouseover",
        mouseleave: "mouseout"
    }, function(orig, fix) {
        jQuery.event.special[orig] = {
            delegateType: fix,
            bindType: fix,
            handle: function(event) {
                var ret, target = this, related = event.relatedTarget, handleObj = event.handleObj;
                if (!related || related !== target && !jQuery.contains(target, related)) event.type = handleObj.origType, ret = handleObj.handler.apply(this, arguments), event.type = fix;
                return ret;
            }
        };
    }), jQuery.support.focusinBubbles || jQuery.each({
        focus: "focusin",
        blur: "focusout"
    }, function(orig, fix) {
        var attaches = 0, handler = function(event) {
            jQuery.event.simulate(fix, event.target, jQuery.event.fix(event), !0);
        };
        jQuery.event.special[fix] = {
            setup: function() {
                attaches++ === 0 && document.addEventListener(orig, handler, !0);
            },
            teardown: function() {
                --attaches === 0 && document.removeEventListener(orig, handler, !0);
            }
        };
    }), jQuery.fn.extend({
        on: function(types, selector, data, fn, one) {
            var origFn, type;
            if (typeof types == "object") {
                typeof selector != "string" && (data = data || selector, selector = undefined);
                for (type in types) this.on(type, selector, data, types[type], one);
                return this;
            }
            data == null && fn == null ? (fn = selector, data = selector = undefined) : fn == null && (typeof selector == "string" ? (fn = data, data = undefined) : (fn = data, data = selector, selector = undefined));
            if (fn === !1) fn = returnFalse; else if (!fn) return this;
            return one === 1 && (origFn = fn, fn = function(event) {
                return jQuery().off(event), origFn.apply(this, arguments);
            }, fn.guid = origFn.guid || (origFn.guid = jQuery.guid++)), this.each(function() {
                jQuery.event.add(this, types, fn, data, selector);
            });
        },
        one: function(types, selector, data, fn) {
            return this.on(types, selector, data, fn, 1);
        },
        off: function(types, selector, fn) {
            var handleObj, type;
            if (types && types.preventDefault && types.handleObj) return handleObj = types.handleObj, jQuery(types.delegateTarget).off(handleObj.namespace ? handleObj.origType + "." + handleObj.namespace : handleObj.origType, handleObj.selector, handleObj.handler), this;
            if (typeof types == "object") {
                for (type in types) this.off(type, selector, types[type]);
                return this;
            }
            if (selector === !1 || typeof selector == "function") fn = selector, selector = undefined;
            return fn === !1 && (fn = returnFalse), this.each(function() {
                jQuery.event.remove(this, types, fn, selector);
            });
        },
        trigger: function(type, data) {
            return this.each(function() {
                jQuery.event.trigger(type, data, this);
            });
        },
        triggerHandler: function(type, data) {
            var elem = this[0];
            if (elem) return jQuery.event.trigger(type, data, elem, !0);
        }
    });
    var isSimple = /^.[^:#\[\.,]*$/, rparentsprev = /^(?:parents|prev(?:Until|All))/, rneedsContext = jQuery.expr.match.needsContext, guaranteedUnique = {
        children: !0,
        contents: !0,
        next: !0,
        prev: !0
    };
    jQuery.fn.extend({
        find: function(selector) {
            var i, ret = [], self = this, len = self.length;
            if (typeof selector != "string") return this.pushStack(jQuery(selector).filter(function() {
                for (i = 0; i < len; i++) if (jQuery.contains(self[i], this)) return !0;
            }));
            for (i = 0; i < len; i++) jQuery.find(selector, self[i], ret);
            return ret = this.pushStack(len > 1 ? jQuery.unique(ret) : ret), ret.selector = this.selector ? this.selector + " " + selector : selector, ret;
        },
        has: function(target) {
            var targets = jQuery(target, this), l = targets.length;
            return this.filter(function() {
                var i = 0;
                for (; i < l; i++) if (jQuery.contains(this, targets[i])) return !0;
            });
        },
        not: function(selector) {
            return this.pushStack(winnow(this, selector || [], !0));
        },
        filter: function(selector) {
            return this.pushStack(winnow(this, selector || [], !1));
        },
        is: function(selector) {
            return !!winnow(this, typeof selector == "string" && rneedsContext.test(selector) ? jQuery(selector) : selector || [], !1).length;
        },
        closest: function(selectors, context) {
            var cur, i = 0, l = this.length, matched = [], pos = rneedsContext.test(selectors) || typeof selectors != "string" ? jQuery(selectors, context || this.context) : 0;
            for (; i < l; i++) for (cur = this[i]; cur && cur !== context; cur = cur.parentNode) if (cur.nodeType < 11 && (pos ? pos.index(cur) > -1 : cur.nodeType === 1 && jQuery.find.matchesSelector(cur, selectors))) {
                cur = matched.push(cur);
                break;
            }
            return this.pushStack(matched.length > 1 ? jQuery.unique(matched) : matched);
        },
        index: function(elem) {
            return elem ? typeof elem == "string" ? core_indexOf.call(jQuery(elem), this[0]) : core_indexOf.call(this, elem.jquery ? elem[0] : elem) : this[0] && this[0].parentNode ? this.first().prevAll().length : -1;
        },
        add: function(selector, context) {
            var set = typeof selector == "string" ? jQuery(selector, context) : jQuery.makeArray(selector && selector.nodeType ? [ selector ] : selector), all = jQuery.merge(this.get(), set);
            return this.pushStack(jQuery.unique(all));
        },
        addBack: function(selector) {
            return this.add(selector == null ? this.prevObject : this.prevObject.filter(selector));
        }
    });
    function sibling(cur, dir) {
        while ((cur = cur[dir]) && cur.nodeType !== 1) ;
        return cur;
    }
    jQuery.each({
        parent: function(elem) {
            var parent = elem.parentNode;
            return parent && parent.nodeType !== 11 ? parent : null;
        },
        parents: function(elem) {
            return jQuery.dir(elem, "parentNode");
        },
        parentsUntil: function(elem, i, until) {
            return jQuery.dir(elem, "parentNode", until);
        },
        next: function(elem) {
            return sibling(elem, "nextSibling");
        },
        prev: function(elem) {
            return sibling(elem, "previousSibling");
        },
        nextAll: function(elem) {
            return jQuery.dir(elem, "nextSibling");
        },
        prevAll: function(elem) {
            return jQuery.dir(elem, "previousSibling");
        },
        nextUntil: function(elem, i, until) {
            return jQuery.dir(elem, "nextSibling", until);
        },
        prevUntil: function(elem, i, until) {
            return jQuery.dir(elem, "previousSibling", until);
        },
        siblings: function(elem) {
            return jQuery.sibling((elem.parentNode || {}).firstChild, elem);
        },
        children: function(elem) {
            return jQuery.sibling(elem.firstChild);
        },
        contents: function(elem) {
            return elem.contentDocument || jQuery.merge([], elem.childNodes);
        }
    }, function(name, fn) {
        jQuery.fn[name] = function(until, selector) {
            var matched = jQuery.map(this, fn, until);
            return name.slice(-5) !== "Until" && (selector = until), selector && typeof selector == "string" && (matched = jQuery.filter(selector, matched)), this.length > 1 && (guaranteedUnique[name] || jQuery.unique(matched), rparentsprev.test(name) && matched.reverse()), this.pushStack(matched);
        };
    }), jQuery.extend({
        filter: function(expr, elems, not) {
            var elem = elems[0];
            return not && (expr = ":not(" + expr + ")"), elems.length === 1 && elem.nodeType === 1 ? jQuery.find.matchesSelector(elem, expr) ? [ elem ] : [] : jQuery.find.matches(expr, jQuery.grep(elems, function(elem) {
                return elem.nodeType === 1;
            }));
        },
        dir: function(elem, dir, until) {
            var matched = [], truncate = until !== undefined;
            while ((elem = elem[dir]) && elem.nodeType !== 9) if (elem.nodeType === 1) {
                if (truncate && jQuery(elem).is(until)) break;
                matched.push(elem);
            }
            return matched;
        },
        sibling: function(n, elem) {
            var matched = [];
            for (; n; n = n.nextSibling) n.nodeType === 1 && n !== elem && matched.push(n);
            return matched;
        }
    });
    function winnow(elements, qualifier, not) {
        if (jQuery.isFunction(qualifier)) return jQuery.grep(elements, function(elem, i) {
            return !!qualifier.call(elem, i, elem) !== not;
        });
        if (qualifier.nodeType) return jQuery.grep(elements, function(elem) {
            return elem === qualifier !== not;
        });
        if (typeof qualifier == "string") {
            if (isSimple.test(qualifier)) return jQuery.filter(qualifier, elements, not);
            qualifier = jQuery.filter(qualifier, elements);
        }
        return jQuery.grep(elements, function(elem) {
            return core_indexOf.call(qualifier, elem) >= 0 !== not;
        });
    }
    var rxhtmlTag = /<(?!area|br|col|embed|hr|img|input|link|meta|param)(([\w:]+)[^>]*)\/>/gi, rtagName = /<([\w:]+)/, rhtml = /<|&#?\w+;/, rnoInnerhtml = /<(?:script|style|link)/i, manipulation_rcheckableType = /^(?:checkbox|radio)$/i, rchecked = /checked\s*(?:[^=]|=\s*.checked.)/i, rscriptType = /^$|\/(?:java|ecma)script/i, rscriptTypeMasked = /^true\/(.*)/, rcleanScript = /^\s*<!(?:\[CDATA\[|--)|(?:\]\]|--)>\s*$/g, wrapMap = {
        option: [ 1, "<select multiple='multiple'>", "</select>" ],
        thead: [ 1, "<table>", "</table>" ],
        col: [ 2, "<table><colgroup>", "</colgroup></table>" ],
        tr: [ 2, "<table><tbody>", "</tbody></table>" ],
        td: [ 3, "<table><tbody><tr>", "</tr></tbody></table>" ],
        _default: [ 0, "", "" ]
    };
    wrapMap.optgroup = wrapMap.option, wrapMap.tbody = wrapMap.tfoot = wrapMap.colgroup = wrapMap.caption = wrapMap.thead, wrapMap.th = wrapMap.td, jQuery.fn.extend({
        text: function(value) {
            return jQuery.access(this, function(value) {
                return value === undefined ? jQuery.text(this) : this.empty().append((this[0] && this[0].ownerDocument || document).createTextNode(value));
            }, null, value, arguments.length);
        },
        append: function() {
            return this.domManip(arguments, function(elem) {
                if (this.nodeType === 1 || this.nodeType === 11 || this.nodeType === 9) {
                    var target = manipulationTarget(this, elem);
                    target.appendChild(elem);
                }
            });
        },
        prepend: function() {
            return this.domManip(arguments, function(elem) {
                if (this.nodeType === 1 || this.nodeType === 11 || this.nodeType === 9) {
                    var target = manipulationTarget(this, elem);
                    target.insertBefore(elem, target.firstChild);
                }
            });
        },
        before: function() {
            return this.domManip(arguments, function(elem) {
                this.parentNode && this.parentNode.insertBefore(elem, this);
            });
        },
        after: function() {
            return this.domManip(arguments, function(elem) {
                this.parentNode && this.parentNode.insertBefore(elem, this.nextSibling);
            });
        },
        remove: function(selector, keepData) {
            var elem, elems = selector ? jQuery.filter(selector, this) : this, i = 0;
            for (; (elem = elems[i]) != null; i++) !keepData && elem.nodeType === 1 && jQuery.cleanData(getAll(elem)), elem.parentNode && (keepData && jQuery.contains(elem.ownerDocument, elem) && setGlobalEval(getAll(elem, "script")), elem.parentNode.removeChild(elem));
            return this;
        },
        empty: function() {
            var elem, i = 0;
            for (; (elem = this[i]) != null; i++) elem.nodeType === 1 && (jQuery.cleanData(getAll(elem, !1)), elem.textContent = "");
            return this;
        },
        clone: function(dataAndEvents, deepDataAndEvents) {
            return dataAndEvents = dataAndEvents == null ? !1 : dataAndEvents, deepDataAndEvents = deepDataAndEvents == null ? dataAndEvents : deepDataAndEvents, this.map(function() {
                return jQuery.clone(this, dataAndEvents, deepDataAndEvents);
            });
        },
        html: function(value) {
            return jQuery.access(this, function(value) {
                var elem = this[0] || {}, i = 0, l = this.length;
                if (value === undefined && elem.nodeType === 1) return elem.innerHTML;
                if (typeof value == "string" && !rnoInnerhtml.test(value) && !wrapMap[(rtagName.exec(value) || [ "", "" ])[1].toLowerCase()]) {
                    value = value.replace(rxhtmlTag, "<$1></$2>");
                    try {
                        for (; i < l; i++) elem = this[i] || {}, elem.nodeType === 1 && (jQuery.cleanData(getAll(elem, !1)), elem.innerHTML = value);
                        elem = 0;
                    } catch (e) {}
                }
                elem && this.empty().append(value);
            }, null, value, arguments.length);
        },
        replaceWith: function() {
            var args = jQuery.map(this, function(elem) {
                return [ elem.nextSibling, elem.parentNode ];
            }), i = 0;
            return this.domManip(arguments, function(elem) {
                var next = args[i++], parent = args[i++];
                parent && (next && next.parentNode !== parent && (next = this.nextSibling), jQuery(this).remove(), parent.insertBefore(elem, next));
            }, !0), i ? this : this.remove();
        },
        detach: function(selector) {
            return this.remove(selector, !0);
        },
        domManip: function(args, callback, allowIntersection) {
            args = core_concat.apply([], args);
            var fragment, first, scripts, hasScripts, node, doc, i = 0, l = this.length, set = this, iNoClone = l - 1, value = args[0], isFunction = jQuery.isFunction(value);
            if (isFunction || !(l <= 1 || typeof value != "string" || jQuery.support.checkClone || !rchecked.test(value))) return this.each(function(index) {
                var self = set.eq(index);
                isFunction && (args[0] = value.call(this, index, self.html())), self.domManip(args, callback, allowIntersection);
            });
            if (l) {
                fragment = jQuery.buildFragment(args, this[0].ownerDocument, !1, !allowIntersection && this), first = fragment.firstChild, fragment.childNodes.length === 1 && (fragment = first);
                if (first) {
                    scripts = jQuery.map(getAll(fragment, "script"), disableScript), hasScripts = scripts.length;
                    for (; i < l; i++) node = fragment, i !== iNoClone && (node = jQuery.clone(node, !0, !0), hasScripts && jQuery.merge(scripts, getAll(node, "script"))), callback.call(this[i], node, i);
                    if (hasScripts) {
                        doc = scripts[scripts.length - 1].ownerDocument, jQuery.map(scripts, restoreScript);
                        for (i = 0; i < hasScripts; i++) node = scripts[i], rscriptType.test(node.type || "") && !data_priv.access(node, "globalEval") && jQuery.contains(doc, node) && (node.src ? jQuery._evalUrl(node.src) : jQuery.globalEval(node.textContent.replace(rcleanScript, "")));
                    }
                }
            }
            return this;
        }
    }), jQuery.each({
        appendTo: "append",
        prependTo: "prepend",
        insertBefore: "before",
        insertAfter: "after",
        replaceAll: "replaceWith"
    }, function(name, original) {
        jQuery.fn[name] = function(selector) {
            var elems, ret = [], insert = jQuery(selector), last = insert.length - 1, i = 0;
            for (; i <= last; i++) elems = i === last ? this : this.clone(!0), jQuery(insert[i])[original](elems), core_push.apply(ret, elems.get());
            return this.pushStack(ret);
        };
    }), jQuery.extend({
        clone: function(elem, dataAndEvents, deepDataAndEvents) {
            var i, l, srcElements, destElements, clone = elem.cloneNode(!0), inPage = jQuery.contains(elem.ownerDocument, elem);
            if (!jQuery.support.noCloneChecked && (elem.nodeType === 1 || elem.nodeType === 11) && !jQuery.isXMLDoc(elem)) {
                destElements = getAll(clone), srcElements = getAll(elem);
                for (i = 0, l = srcElements.length; i < l; i++) fixInput(srcElements[i], destElements[i]);
            }
            if (dataAndEvents) if (deepDataAndEvents) {
                srcElements = srcElements || getAll(elem), destElements = destElements || getAll(clone);
                for (i = 0, l = srcElements.length; i < l; i++) cloneCopyEvent(srcElements[i], destElements[i]);
            } else cloneCopyEvent(elem, clone);
            return destElements = getAll(clone, "script"), destElements.length > 0 && setGlobalEval(destElements, !inPage && getAll(elem, "script")), clone;
        },
        buildFragment: function(elems, context, scripts, selection) {
            var elem, tmp, tag, wrap, contains, j, i = 0, l = elems.length, fragment = context.createDocumentFragment(), nodes = [];
            for (; i < l; i++) {
                elem = elems[i];
                if (elem || elem === 0) if (jQuery.type(elem) === "object") jQuery.merge(nodes, elem.nodeType ? [ elem ] : elem); else if (!rhtml.test(elem)) nodes.push(context.createTextNode(elem)); else {
                    tmp = tmp || fragment.appendChild(context.createElement("div")), tag = (rtagName.exec(elem) || [ "", "" ])[1].toLowerCase(), wrap = wrapMap[tag] || wrapMap._default, tmp.innerHTML = wrap[1] + elem.replace(rxhtmlTag, "<$1></$2>") + wrap[2], j = wrap[0];
                    while (j--) tmp = tmp.lastChild;
                    jQuery.merge(nodes, tmp.childNodes), tmp = fragment.firstChild, tmp.textContent = "";
                }
            }
            fragment.textContent = "", i = 0;
            while (elem = nodes[i++]) {
                if (selection && jQuery.inArray(elem, selection) !== -1) continue;
                contains = jQuery.contains(elem.ownerDocument, elem), tmp = getAll(fragment.appendChild(elem), "script"), contains && setGlobalEval(tmp);
                if (scripts) {
                    j = 0;
                    while (elem = tmp[j++]) rscriptType.test(elem.type || "") && scripts.push(elem);
                }
            }
            return fragment;
        },
        cleanData: function(elems) {
            var data, elem, events, type, key, j, special = jQuery.event.special, i = 0;
            for (; (elem = elems[i]) !== undefined; i++) {
                if (Data.accepts(elem)) {
                    key = elem[data_priv.expando];
                    if (key && (data = data_priv.cache[key])) {
                        events = Object.keys(data.events || {});
                        if (events.length) for (j = 0; (type = events[j]) !== undefined; j++) special[type] ? jQuery.event.remove(elem, type) : jQuery.removeEvent(elem, type, data.handle);
                        data_priv.cache[key] && delete data_priv.cache[key];
                    }
                }
                delete data_user.cache[elem[data_user.expando]];
            }
        },
        _evalUrl: function(url) {
            return jQuery.ajax({
                url: url,
                type: "GET",
                dataType: "script",
                async: !1,
                global: !1,
                "throws": !0
            });
        }
    });
    function manipulationTarget(elem, content) {
        return jQuery.nodeName(elem, "table") && jQuery.nodeName(content.nodeType === 1 ? content : content.firstChild, "tr") ? elem.getElementsByTagName("tbody")[0] || elem.appendChild(elem.ownerDocument.createElement("tbody")) : elem;
    }
    function disableScript(elem) {
        return elem.type = (elem.getAttribute("type") !== null) + "/" + elem.type, elem;
    }
    function restoreScript(elem) {
        var match = rscriptTypeMasked.exec(elem.type);
        return match ? elem.type = match[1] : elem.removeAttribute("type"), elem;
    }
    function setGlobalEval(elems, refElements) {
        var l = elems.length, i = 0;
        for (; i < l; i++) data_priv.set(elems[i], "globalEval", !refElements || data_priv.get(refElements[i], "globalEval"));
    }
    function cloneCopyEvent(src, dest) {
        var i, l, type, pdataOld, pdataCur, udataOld, udataCur, events;
        if (dest.nodeType !== 1) return;
        if (data_priv.hasData(src)) {
            pdataOld = data_priv.access(src), pdataCur = data_priv.set(dest, pdataOld), events = pdataOld.events;
            if (events) {
                delete pdataCur.handle, pdataCur.events = {};
                for (type in events) for (i = 0, l = events[type].length; i < l; i++) jQuery.event.add(dest, type, events[type][i]);
            }
        }
        data_user.hasData(src) && (udataOld = data_user.access(src), udataCur = jQuery.extend({}, udataOld), data_user.set(dest, udataCur));
    }
    function getAll(context, tag) {
        var ret = context.getElementsByTagName ? context.getElementsByTagName(tag || "*") : context.querySelectorAll ? context.querySelectorAll(tag || "*") : [];
        return tag === undefined || tag && jQuery.nodeName(context, tag) ? jQuery.merge([ context ], ret) : ret;
    }
    function fixInput(src, dest) {
        var nodeName = dest.nodeName.toLowerCase();
        if (nodeName === "input" && manipulation_rcheckableType.test(src.type)) dest.checked = src.checked; else if (nodeName === "input" || nodeName === "textarea") dest.defaultValue = src.defaultValue;
    }
    jQuery.fn.extend({
        wrapAll: function(html) {
            var wrap;
            return jQuery.isFunction(html) ? this.each(function(i) {
                jQuery(this).wrapAll(html.call(this, i));
            }) : (this[0] && (wrap = jQuery(html, this[0].ownerDocument).eq(0).clone(!0), this[0].parentNode && wrap.insertBefore(this[0]), wrap.map(function() {
                var elem = this;
                while (elem.firstElementChild) elem = elem.firstElementChild;
                return elem;
            }).append(this)), this);
        },
        wrapInner: function(html) {
            return jQuery.isFunction(html) ? this.each(function(i) {
                jQuery(this).wrapInner(html.call(this, i));
            }) : this.each(function() {
                var self = jQuery(this), contents = self.contents();
                contents.length ? contents.wrapAll(html) : self.append(html);
            });
        },
        wrap: function(html) {
            var isFunction = jQuery.isFunction(html);
            return this.each(function(i) {
                jQuery(this).wrapAll(isFunction ? html.call(this, i) : html);
            });
        },
        unwrap: function() {
            return this.parent().each(function() {
                jQuery.nodeName(this, "body") || jQuery(this).replaceWith(this.childNodes);
            }).end();
        }
    });
    var curCSS, iframe, rdisplayswap = /^(none|table(?!-c[ea]).+)/, rmargin = /^margin/, rnumsplit = new RegExp("^(" + core_pnum + ")(.*)$", "i"), rnumnonpx = new RegExp("^(" + core_pnum + ")(?!px)[a-z%]+$", "i"), rrelNum = new RegExp("^([+-])=(" + core_pnum + ")", "i"), elemdisplay = {
        BODY: "block"
    }, cssShow = {
        position: "absolute",
        visibility: "hidden",
        display: "block"
    }, cssNormalTransform = {
        letterSpacing: 0,
        fontWeight: 400
    }, cssExpand = [ "Top", "Right", "Bottom", "Left" ], cssPrefixes = [ "Webkit", "O", "Moz", "ms" ];
    function vendorPropName(style, name) {
        if (name in style) return name;
        var capName = name.charAt(0).toUpperCase() + name.slice(1), origName = name, i = cssPrefixes.length;
        while (i--) {
            name = cssPrefixes[i] + capName;
            if (name in style) return name;
        }
        return origName;
    }
    function isHidden(elem, el) {
        return elem = el || elem, jQuery.css(elem, "display") === "none" || !jQuery.contains(elem.ownerDocument, elem);
    }
    function getStyles(elem) {
        return window.getComputedStyle(elem, null);
    }
    function showHide(elements, show) {
        var display, elem, hidden, values = [], index = 0, length = elements.length;
        for (; index < length; index++) {
            elem = elements[index];
            if (!elem.style) continue;
            values[index] = data_priv.get(elem, "olddisplay"), display = elem.style.display, show ? (!values[index] && display === "none" && (elem.style.display = ""), elem.style.display === "" && isHidden(elem) && (values[index] = data_priv.access(elem, "olddisplay", css_defaultDisplay(elem.nodeName)))) : values[index] || (hidden = isHidden(elem), (display && display !== "none" || !hidden) && data_priv.set(elem, "olddisplay", hidden ? display : jQuery.css(elem, "display")));
        }
        for (index = 0; index < length; index++) {
            elem = elements[index];
            if (!elem.style) continue;
            if (!show || elem.style.display === "none" || elem.style.display === "") elem.style.display = show ? values[index] || "" : "none";
        }
        return elements;
    }
    jQuery.fn.extend({
        css: function(name, value) {
            return jQuery.access(this, function(elem, name, value) {
                var styles, len, map = {}, i = 0;
                if (jQuery.isArray(name)) {
                    styles = getStyles(elem), len = name.length;
                    for (; i < len; i++) map[name[i]] = jQuery.css(elem, name[i], !1, styles);
                    return map;
                }
                return value !== undefined ? jQuery.style(elem, name, value) : jQuery.css(elem, name);
            }, name, value, arguments.length > 1);
        },
        show: function() {
            return showHide(this, !0);
        },
        hide: function() {
            return showHide(this);
        },
        toggle: function(state) {
            return typeof state == "boolean" ? state ? this.show() : this.hide() : this.each(function() {
                isHidden(this) ? jQuery(this).show() : jQuery(this).hide();
            });
        }
    }), jQuery.extend({
        cssHooks: {
            opacity: {
                get: function(elem, computed) {
                    if (computed) {
                        var ret = curCSS(elem, "opacity");
                        return ret === "" ? "1" : ret;
                    }
                }
            }
        },
        cssNumber: {
            columnCount: !0,
            fillOpacity: !0,
            fontWeight: !0,
            lineHeight: !0,
            opacity: !0,
            order: !0,
            orphans: !0,
            widows: !0,
            zIndex: !0,
            zoom: !0
        },
        cssProps: {
            "float": "cssFloat"
        },
        style: function(elem, name, value, extra) {
            if (!elem || elem.nodeType === 3 || elem.nodeType === 8 || !elem.style) return;
            var ret, type, hooks, origName = jQuery.camelCase(name), style = elem.style;
            name = jQuery.cssProps[origName] || (jQuery.cssProps[origName] = vendorPropName(style, origName)), hooks = jQuery.cssHooks[name] || jQuery.cssHooks[origName];
            if (value === undefined) return hooks && "get" in hooks && (ret = hooks.get(elem, !1, extra)) !== undefined ? ret : style[name];
            type = typeof value, type === "string" && (ret = rrelNum.exec(value)) && (value = (ret[1] + 1) * ret[2] + parseFloat(jQuery.css(elem, name)), type = "number");
            if (value == null || type === "number" && isNaN(value)) return;
            type === "number" && !jQuery.cssNumber[origName] && (value += "px"), !jQuery.support.clearCloneStyle && value === "" && name.indexOf("background") === 0 && (style[name] = "inherit");
            if (!hooks || !("set" in hooks) || (value = hooks.set(elem, value, extra)) !== undefined) style[name] = value;
        },
        css: function(elem, name, extra, styles) {
            var val, num, hooks, origName = jQuery.camelCase(name);
            return name = jQuery.cssProps[origName] || (jQuery.cssProps[origName] = vendorPropName(elem.style, origName)), hooks = jQuery.cssHooks[name] || jQuery.cssHooks[origName], hooks && "get" in hooks && (val = hooks.get(elem, !0, extra)), val === undefined && (val = curCSS(elem, name, styles)), val === "normal" && name in cssNormalTransform && (val = cssNormalTransform[name]), extra === "" || extra ? (num = parseFloat(val), extra === !0 || jQuery.isNumeric(num) ? num || 0 : val) : val;
        }
    }), curCSS = function(elem, name, _computed) {
        var width, minWidth, maxWidth, computed = _computed || getStyles(elem), ret = computed ? computed.getPropertyValue(name) || computed[name] : undefined, style = elem.style;
        return computed && (ret === "" && !jQuery.contains(elem.ownerDocument, elem) && (ret = jQuery.style(elem, name)), rnumnonpx.test(ret) && rmargin.test(name) && (width = style.width, minWidth = style.minWidth, maxWidth = style.maxWidth, style.minWidth = style.maxWidth = style.width = ret, ret = computed.width, style.width = width, style.minWidth = minWidth, style.maxWidth = maxWidth)), ret;
    };
    function setPositiveNumber(elem, value, subtract) {
        var matches = rnumsplit.exec(value);
        return matches ? Math.max(0, matches[1] - (subtract || 0)) + (matches[2] || "px") : value;
    }
    function augmentWidthOrHeight(elem, name, extra, isBorderBox, styles) {
        var i = extra === (isBorderBox ? "border" : "content") ? 4 : name === "width" ? 1 : 0, val = 0;
        for (; i < 4; i += 2) extra === "margin" && (val += jQuery.css(elem, extra + cssExpand[i], !0, styles)), isBorderBox ? (extra === "content" && (val -= jQuery.css(elem, "padding" + cssExpand[i], !0, styles)), extra !== "margin" && (val -= jQuery.css(elem, "border" + cssExpand[i] + "Width", !0, styles))) : (val += jQuery.css(elem, "padding" + cssExpand[i], !0, styles), extra !== "padding" && (val += jQuery.css(elem, "border" + cssExpand[i] + "Width", !0, styles)));
        return val;
    }
    function getWidthOrHeight(elem, name, extra) {
        var valueIsBorderBox = !0, val = name === "width" ? elem.offsetWidth : elem.offsetHeight, styles = getStyles(elem), isBorderBox = jQuery.support.boxSizing && jQuery.css(elem, "boxSizing", !1, styles) === "border-box";
        if (val <= 0 || val == null) {
            val = curCSS(elem, name, styles);
            if (val < 0 || val == null) val = elem.style[name];
            if (rnumnonpx.test(val)) return val;
            valueIsBorderBox = isBorderBox && (jQuery.support.boxSizingReliable || val === elem.style[name]), val = parseFloat(val) || 0;
        }
        return val + augmentWidthOrHeight(elem, name, extra || (isBorderBox ? "border" : "content"), valueIsBorderBox, styles) + "px";
    }
    function css_defaultDisplay(nodeName) {
        var doc = document, display = elemdisplay[nodeName];
        if (!display) {
            display = actualDisplay(nodeName, doc);
            if (display === "none" || !display) iframe = (iframe || jQuery("<iframe frameborder='0' width='0' height='0'/>").css("cssText", "display:block !important")).appendTo(doc.documentElement), doc = (iframe[0].contentWindow || iframe[0].contentDocument).document, doc.write("<!doctype html><html><body>"), doc.close(), display = actualDisplay(nodeName, doc), iframe.detach();
            elemdisplay[nodeName] = display;
        }
        return display;
    }
    function actualDisplay(name, doc) {
        var elem = jQuery(doc.createElement(name)).appendTo(doc.body), display = jQuery.css(elem[0], "display");
        return elem.remove(), display;
    }
    jQuery.each([ "height", "width" ], function(i, name) {
        jQuery.cssHooks[name] = {
            get: function(elem, computed, extra) {
                if (computed) return elem.offsetWidth === 0 && rdisplayswap.test(jQuery.css(elem, "display")) ? jQuery.swap(elem, cssShow, function() {
                    return getWidthOrHeight(elem, name, extra);
                }) : getWidthOrHeight(elem, name, extra);
            },
            set: function(elem, value, extra) {
                var styles = extra && getStyles(elem);
                return setPositiveNumber(elem, value, extra ? augmentWidthOrHeight(elem, name, extra, jQuery.support.boxSizing && jQuery.css(elem, "boxSizing", !1, styles) === "border-box", styles) : 0);
            }
        };
    }), jQuery(function() {
        jQuery.support.reliableMarginRight || (jQuery.cssHooks.marginRight = {
            get: function(elem, computed) {
                if (computed) return jQuery.swap(elem, {
                    display: "inline-block"
                }, curCSS, [ elem, "marginRight" ]);
            }
        }), !jQuery.support.pixelPosition && jQuery.fn.position && jQuery.each([ "top", "left" ], function(i, prop) {
            jQuery.cssHooks[prop] = {
                get: function(elem, computed) {
                    if (computed) return computed = curCSS(elem, prop), rnumnonpx.test(computed) ? jQuery(elem).position()[prop] + "px" : computed;
                }
            };
        });
    }), jQuery.expr && jQuery.expr.filters && (jQuery.expr.filters.hidden = function(elem) {
        return elem.offsetWidth <= 0 && elem.offsetHeight <= 0;
    }, jQuery.expr.filters.visible = function(elem) {
        return !jQuery.expr.filters.hidden(elem);
    }), jQuery.each({
        margin: "",
        padding: "",
        border: "Width"
    }, function(prefix, suffix) {
        jQuery.cssHooks[prefix + suffix] = {
            expand: function(value) {
                var i = 0, expanded = {}, parts = typeof value == "string" ? value.split(" ") : [ value ];
                for (; i < 4; i++) expanded[prefix + cssExpand[i] + suffix] = parts[i] || parts[i - 2] || parts[0];
                return expanded;
            }
        }, rmargin.test(prefix) || (jQuery.cssHooks[prefix + suffix].set = setPositiveNumber);
    });
    var r20 = /%20/g, rbracket = /\[\]$/, rCRLF = /\r?\n/g, rsubmitterTypes = /^(?:submit|button|image|reset|file)$/i, rsubmittable = /^(?:input|select|textarea|keygen)/i;
    jQuery.fn.extend({
        serialize: function() {
            return jQuery.param(this.serializeArray());
        },
        serializeArray: function() {
            return this.map(function() {
                var elements = jQuery.prop(this, "elements");
                return elements ? jQuery.makeArray(elements) : this;
            }).filter(function() {
                var type = this.type;
                return this.name && !jQuery(this).is(":disabled") && rsubmittable.test(this.nodeName) && !rsubmitterTypes.test(type) && (this.checked || !manipulation_rcheckableType.test(type));
            }).map(function(i, elem) {
                var val = jQuery(this).val();
                return val == null ? null : jQuery.isArray(val) ? jQuery.map(val, function(val) {
                    return {
                        name: elem.name,
                        value: val.replace(rCRLF, "\r\n")
                    };
                }) : {
                    name: elem.name,
                    value: val.replace(rCRLF, "\r\n")
                };
            }).get();
        }
    }), jQuery.param = function(a, traditional) {
        var prefix, s = [], add = function(key, value) {
            value = jQuery.isFunction(value) ? value() : value == null ? "" : value, s[s.length] = encodeURIComponent(key) + "=" + encodeURIComponent(value);
        };
        traditional === undefined && (traditional = jQuery.ajaxSettings && jQuery.ajaxSettings.traditional);
        if (jQuery.isArray(a) || a.jquery && !jQuery.isPlainObject(a)) jQuery.each(a, function() {
            add(this.name, this.value);
        }); else for (prefix in a) buildParams(prefix, a[prefix], traditional, add);
        return s.join("&").replace(r20, "+");
    };
    function buildParams(prefix, obj, traditional, add) {
        var name;
        if (jQuery.isArray(obj)) jQuery.each(obj, function(i, v) {
            traditional || rbracket.test(prefix) ? add(prefix, v) : buildParams(prefix + "[" + (typeof v == "object" ? i : "") + "]", v, traditional, add);
        }); else if (!traditional && jQuery.type(obj) === "object") for (name in obj) buildParams(prefix + "[" + name + "]", obj[name], traditional, add); else add(prefix, obj);
    }
    jQuery.each("blur focus focusin focusout load resize scroll unload click dblclick mousedown mouseup mousemove mouseover mouseout mouseenter mouseleave change select submit keydown keypress keyup error contextmenu".split(" "), function(i, name) {
        jQuery.fn[name] = function(data, fn) {
            return arguments.length > 0 ? this.on(name, null, data, fn) : this.trigger(name);
        };
    }), jQuery.fn.extend({
        hover: function(fnOver, fnOut) {
            return this.mouseenter(fnOver).mouseleave(fnOut || fnOver);
        },
        bind: function(types, data, fn) {
            return this.on(types, null, data, fn);
        },
        unbind: function(types, fn) {
            return this.off(types, null, fn);
        },
        delegate: function(selector, types, data, fn) {
            return this.on(types, selector, data, fn);
        },
        undelegate: function(selector, types, fn) {
            return arguments.length === 1 ? this.off(selector, "**") : this.off(types, selector || "**", fn);
        }
    });
    var ajaxLocParts, ajaxLocation, ajax_nonce = jQuery.now(), ajax_rquery = /\?/, rhash = /#.*$/, rts = /([?&])_=[^&]*/, rheaders = /^(.*?):[ \t]*([^\r\n]*)$/mg, rlocalProtocol = /^(?:about|app|app-storage|.+-extension|file|res|widget):$/, rnoContent = /^(?:GET|HEAD)$/, rprotocol = /^\/\//, rurl = /^([\w.+-]+:)(?:\/\/([^\/?#:]*)(?::(\d+)|)|)/, _load = jQuery.fn.load, prefilters = {}, transports = {}, allTypes = "*/".concat("*");
    try {
        ajaxLocation = location.href;
    } catch (e) {
        ajaxLocation = document.createElement("a"), ajaxLocation.href = "", ajaxLocation = ajaxLocation.href;
    }
    ajaxLocParts = rurl.exec(ajaxLocation.toLowerCase()) || [];
    function addToPrefiltersOrTransports(structure) {
        return function(dataTypeExpression, func) {
            typeof dataTypeExpression != "string" && (func = dataTypeExpression, dataTypeExpression = "*");
            var dataType, i = 0, dataTypes = dataTypeExpression.toLowerCase().match(core_rnotwhite) || [];
            if (jQuery.isFunction(func)) while (dataType = dataTypes[i++]) dataType[0] === "+" ? (dataType = dataType.slice(1) || "*", (structure[dataType] = structure[dataType] || []).unshift(func)) : (structure[dataType] = structure[dataType] || []).push(func);
        };
    }
    function inspectPrefiltersOrTransports(structure, options, originalOptions, jqXHR) {
        var inspected = {}, seekingTransport = structure === transports;
        function inspect(dataType) {
            var selected;
            return inspected[dataType] = !0, jQuery.each(structure[dataType] || [], function(_, prefilterOrFactory) {
                var dataTypeOrTransport = prefilterOrFactory(options, originalOptions, jqXHR);
                if (typeof dataTypeOrTransport == "string" && !seekingTransport && !inspected[dataTypeOrTransport]) return options.dataTypes.unshift(dataTypeOrTransport), inspect(dataTypeOrTransport), !1;
                if (seekingTransport) return !(selected = dataTypeOrTransport);
            }), selected;
        }
        return inspect(options.dataTypes[0]) || !inspected["*"] && inspect("*");
    }
    function ajaxExtend(target, src) {
        var key, deep, flatOptions = jQuery.ajaxSettings.flatOptions || {};
        for (key in src) src[key] !== undefined && ((flatOptions[key] ? target : deep || (deep = {}))[key] = src[key]);
        return deep && jQuery.extend(!0, target, deep), target;
    }
    jQuery.fn.load = function(url, params, callback) {
        if (typeof url != "string" && _load) return _load.apply(this, arguments);
        var selector, type, response, self = this, off = url.indexOf(" ");
        return off >= 0 && (selector = url.slice(off), url = url.slice(0, off)), jQuery.isFunction(params) ? (callback = params, params = undefined) : params && typeof params == "object" && (type = "POST"), self.length > 0 && jQuery.ajax({
            url: url,
            type: type,
            dataType: "html",
            data: params
        }).done(function(responseText) {
            response = arguments, self.html(selector ? jQuery("<div>").append(jQuery.parseHTML(responseText)).find(selector) : responseText);
        }).complete(callback && function(jqXHR, status) {
            self.each(callback, response || [ jqXHR.responseText, status, jqXHR ]);
        }), this;
    }, jQuery.each([ "ajaxStart", "ajaxStop", "ajaxComplete", "ajaxError", "ajaxSuccess", "ajaxSend" ], function(i, type) {
        jQuery.fn[type] = function(fn) {
            return this.on(type, fn);
        };
    }), jQuery.extend({
        active: 0,
        lastModified: {},
        etag: {},
        ajaxSettings: {
            url: ajaxLocation,
            type: "GET",
            isLocal: rlocalProtocol.test(ajaxLocParts[1]),
            global: !0,
            processData: !0,
            async: !0,
            contentType: "application/x-www-form-urlencoded; charset=UTF-8",
            accepts: {
                "*": allTypes,
                text: "text/plain",
                html: "text/html",
                xml: "application/xml, text/xml",
                json: "application/json, text/javascript"
            },
            contents: {
                xml: /xml/,
                html: /html/,
                json: /json/
            },
            responseFields: {
                xml: "responseXML",
                text: "responseText",
                json: "responseJSON"
            },
            converters: {
                "* text": String,
                "text html": !0,
                "text json": jQuery.parseJSON,
                "text xml": jQuery.parseXML
            },
            flatOptions: {
                url: !0,
                context: !0
            }
        },
        ajaxSetup: function(target, settings) {
            return settings ? ajaxExtend(ajaxExtend(target, jQuery.ajaxSettings), settings) : ajaxExtend(jQuery.ajaxSettings, target);
        },
        ajaxPrefilter: addToPrefiltersOrTransports(prefilters),
        ajaxTransport: addToPrefiltersOrTransports(transports),
        ajax: function(url, options) {
            typeof url == "object" && (options = url, url = undefined), options = options || {};
            var transport, cacheURL, responseHeadersString, responseHeaders, timeoutTimer, parts, fireGlobals, i, s = jQuery.ajaxSetup({}, options), callbackContext = s.context || s, globalEventContext = s.context && (callbackContext.nodeType || callbackContext.jquery) ? jQuery(callbackContext) : jQuery.event, deferred = jQuery.Deferred(), completeDeferred = jQuery.Callbacks("once memory"), statusCode = s.statusCode || {}, requestHeaders = {}, requestHeadersNames = {}, state = 0, strAbort = "canceled", jqXHR = {
                readyState: 0,
                getResponseHeader: function(key) {
                    var match;
                    if (state === 2) {
                        if (!responseHeaders) {
                            responseHeaders = {};
                            while (match = rheaders.exec(responseHeadersString)) responseHeaders[match[1].toLowerCase()] = match[2];
                        }
                        match = responseHeaders[key.toLowerCase()];
                    }
                    return match == null ? null : match;
                },
                getAllResponseHeaders: function() {
                    return state === 2 ? responseHeadersString : null;
                },
                setRequestHeader: function(name, value) {
                    var lname = name.toLowerCase();
                    return state || (name = requestHeadersNames[lname] = requestHeadersNames[lname] || name, requestHeaders[name] = value), this;
                },
                overrideMimeType: function(type) {
                    return state || (s.mimeType = type), this;
                },
                statusCode: function(map) {
                    var code;
                    if (map) if (state < 2) for (code in map) statusCode[code] = [ statusCode[code], map[code] ]; else jqXHR.always(map[jqXHR.status]);
                    return this;
                },
                abort: function(statusText) {
                    var finalText = statusText || strAbort;
                    return transport && transport.abort(finalText), done(0, finalText), this;
                }
            };
            deferred.promise(jqXHR).complete = completeDeferred.add, jqXHR.success = jqXHR.done, jqXHR.error = jqXHR.fail, s.url = ((url || s.url || ajaxLocation) + "").replace(rhash, "").replace(rprotocol, ajaxLocParts[1] + "//"), s.type = options.method || options.type || s.method || s.type, s.dataTypes = jQuery.trim(s.dataType || "*").toLowerCase().match(core_rnotwhite) || [ "" ], s.crossDomain == null && (parts = rurl.exec(s.url.toLowerCase()), s.crossDomain = !(!parts || parts[1] === ajaxLocParts[1] && parts[2] === ajaxLocParts[2] && (parts[3] || (parts[1] === "http:" ? "80" : "443")) === (ajaxLocParts[3] || (ajaxLocParts[1] === "http:" ? "80" : "443")))), s.data && s.processData && typeof s.data != "string" && (s.data = jQuery.param(s.data, s.traditional)), inspectPrefiltersOrTransports(prefilters, s, options, jqXHR);
            if (state === 2) return jqXHR;
            fireGlobals = s.global, fireGlobals && jQuery.active++ === 0 && jQuery.event.trigger("ajaxStart"), s.type = s.type.toUpperCase(), s.hasContent = !rnoContent.test(s.type), cacheURL = s.url, s.hasContent || (s.data && (cacheURL = s.url += (ajax_rquery.test(cacheURL) ? "&" : "?") + s.data, delete s.data), s.cache === !1 && (s.url = rts.test(cacheURL) ? cacheURL.replace(rts, "$1_=" + ajax_nonce++) : cacheURL + (ajax_rquery.test(cacheURL) ? "&" : "?") + "_=" + ajax_nonce++)), s.ifModified && (jQuery.lastModified[cacheURL] && jqXHR.setRequestHeader("If-Modified-Since", jQuery.lastModified[cacheURL]), jQuery.etag[cacheURL] && jqXHR.setRequestHeader("If-None-Match", jQuery.etag[cacheURL])), (s.data && s.hasContent && s.contentType !== !1 || options.contentType) && jqXHR.setRequestHeader("Content-Type", s.contentType), jqXHR.setRequestHeader("Accept", s.dataTypes[0] && s.accepts[s.dataTypes[0]] ? s.accepts[s.dataTypes[0]] + (s.dataTypes[0] !== "*" ? ", " + allTypes + "; q=0.01" : "") : s.accepts["*"]);
            for (i in s.headers) jqXHR.setRequestHeader(i, s.headers[i]);
            if (!s.beforeSend || s.beforeSend.call(callbackContext, jqXHR, s) !== !1 && state !== 2) {
                strAbort = "abort";
                for (i in {
                    success: 1,
                    error: 1,
                    complete: 1
                }) jqXHR[i](s[i]);
                transport = inspectPrefiltersOrTransports(transports, s, options, jqXHR);
                if (!transport) done(-1, "No Transport"); else {
                    jqXHR.readyState = 1, fireGlobals && globalEventContext.trigger("ajaxSend", [ jqXHR, s ]), s.async && s.timeout > 0 && (timeoutTimer = setTimeout(function() {
                        jqXHR.abort("timeout");
                    }, s.timeout));
                    try {
                        state = 1, transport.send(requestHeaders, done);
                    } catch (e) {
                        if (!(state < 2)) throw e;
                        done(-1, e);
                    }
                }
                function done(status, nativeStatusText, responses, headers) {
                    var isSuccess, success, error, response, modified, statusText = nativeStatusText;
                    if (state === 2) return;
                    state = 2, timeoutTimer && clearTimeout(timeoutTimer), transport = undefined, responseHeadersString = headers || "", jqXHR.readyState = status > 0 ? 4 : 0, isSuccess = status >= 200 && status < 300 || status === 304, responses && (response = ajaxHandleResponses(s, jqXHR, responses)), response = ajaxConvert(s, response, jqXHR, isSuccess);
                    if (isSuccess) s.ifModified && (modified = jqXHR.getResponseHeader("Last-Modified"), modified && (jQuery.lastModified[cacheURL] = modified), modified = jqXHR.getResponseHeader("etag"), modified && (jQuery.etag[cacheURL] = modified)), status === 204 || s.type === "HEAD" ? statusText = "nocontent" : status === 304 ? statusText = "notmodified" : (statusText = response.state, success = response.data, error = response.error, isSuccess = !error); else {
                        error = statusText;
                        if (status || !statusText) statusText = "error", status < 0 && (status = 0);
                    }
                    jqXHR.status = status, jqXHR.statusText = (nativeStatusText || statusText) + "", isSuccess ? deferred.resolveWith(callbackContext, [ success, statusText, jqXHR ]) : deferred.rejectWith(callbackContext, [ jqXHR, statusText, error ]), jqXHR.statusCode(statusCode), statusCode = undefined, fireGlobals && globalEventContext.trigger(isSuccess ? "ajaxSuccess" : "ajaxError", [ jqXHR, s, isSuccess ? success : error ]), completeDeferred.fireWith(callbackContext, [ jqXHR, statusText ]), fireGlobals && (globalEventContext.trigger("ajaxComplete", [ jqXHR, s ]), --jQuery.active || jQuery.event.trigger("ajaxStop"));
                }
                return jqXHR;
            }
            return jqXHR.abort();
        },
        getJSON: function(url, data, callback) {
            return jQuery.get(url, data, callback, "json");
        },
        getScript: function(url, callback) {
            return jQuery.get(url, undefined, callback, "script");
        }
    }), jQuery.each([ "get", "post" ], function(i, method) {
        jQuery[method] = function(url, data, callback, type) {
            return jQuery.isFunction(data) && (type = type || callback, callback = data, data = undefined), jQuery.ajax({
                url: url,
                type: method,
                dataType: type,
                data: data,
                success: callback
            });
        };
    });
    function ajaxHandleResponses(s, jqXHR, responses) {
        var ct, type, finalDataType, firstDataType, contents = s.contents, dataTypes = s.dataTypes;
        while (dataTypes[0] === "*") dataTypes.shift(), ct === undefined && (ct = s.mimeType || jqXHR.getResponseHeader("Content-Type"));
        if (ct) for (type in contents) if (contents[type] && contents[type].test(ct)) {
            dataTypes.unshift(type);
            break;
        }
        if (dataTypes[0] in responses) finalDataType = dataTypes[0]; else {
            for (type in responses) {
                if (!dataTypes[0] || s.converters[type + " " + dataTypes[0]]) {
                    finalDataType = type;
                    break;
                }
                firstDataType || (firstDataType = type);
            }
            finalDataType = finalDataType || firstDataType;
        }
        if (finalDataType) return finalDataType !== dataTypes[0] && dataTypes.unshift(finalDataType), responses[finalDataType];
    }
    function ajaxConvert(s, response, jqXHR, isSuccess) {
        var conv2, current, conv, tmp, prev, converters = {}, dataTypes = s.dataTypes.slice();
        if (dataTypes[1]) for (conv in s.converters) converters[conv.toLowerCase()] = s.converters[conv];
        current = dataTypes.shift();
        while (current) {
            s.responseFields[current] && (jqXHR[s.responseFields[current]] = response), !prev && isSuccess && s.dataFilter && (response = s.dataFilter(response, s.dataType)), prev = current, current = dataTypes.shift();
            if (current) if (current === "*") current = prev; else if (prev !== "*" && prev !== current) {
                conv = converters[prev + " " + current] || converters["* " + current];
                if (!conv) for (conv2 in converters) {
                    tmp = conv2.split(" ");
                    if (tmp[1] === current) {
                        conv = converters[prev + " " + tmp[0]] || converters["* " + tmp[0]];
                        if (conv) {
                            conv === !0 ? conv = converters[conv2] : converters[conv2] !== !0 && (current = tmp[0], dataTypes.unshift(tmp[1]));
                            break;
                        }
                    }
                }
                if (conv !== !0) if (conv && s["throws"]) response = conv(response); else try {
                    response = conv(response);
                } catch (e) {
                    return {
                        state: "parsererror",
                        error: conv ? e : "No conversion from " + prev + " to " + current
                    };
                }
            }
        }
        return {
            state: "success",
            data: response
        };
    }
    jQuery.ajaxSetup({
        accepts: {
            script: "text/javascript, application/javascript, application/ecmascript, application/x-ecmascript"
        },
        contents: {
            script: /(?:java|ecma)script/
        },
        converters: {
            "text script": function(text) {
                return jQuery.globalEval(text), text;
            }
        }
    }), jQuery.ajaxPrefilter("script", function(s) {
        s.cache === undefined && (s.cache = !1), s.crossDomain && (s.type = "GET");
    }), jQuery.ajaxTransport("script", function(s) {
        if (s.crossDomain) {
            var script, callback;
            return {
                send: function(_, complete) {
                    script = jQuery("<script>").prop({
                        async: !0,
                        charset: s.scriptCharset,
                        src: s.url
                    }).on("load error", callback = function(evt) {
                        script.remove(), callback = null, evt && complete(evt.type === "error" ? 404 : 200, evt.type);
                    }), document.head.appendChild(script[0]);
                },
                abort: function() {
                    callback && callback();
                }
            };
        }
    });
    var oldCallbacks = [], rjsonp = /(=)\?(?=&|$)|\?\?/;
    jQuery.ajaxSetup({
        jsonp: "callback",
        jsonpCallback: function() {
            var callback = oldCallbacks.pop() || jQuery.expando + "_" + ajax_nonce++;
            return this[callback] = !0, callback;
        }
    }), jQuery.ajaxPrefilter("json jsonp", function(s, originalSettings, jqXHR) {
        var callbackName, overwritten, responseContainer, jsonProp = s.jsonp !== !1 && (rjsonp.test(s.url) ? "url" : typeof s.data == "string" && !(s.contentType || "").indexOf("application/x-www-form-urlencoded") && rjsonp.test(s.data) && "data");
        if (jsonProp || s.dataTypes[0] === "jsonp") return callbackName = s.jsonpCallback = jQuery.isFunction(s.jsonpCallback) ? s.jsonpCallback() : s.jsonpCallback, jsonProp ? s[jsonProp] = s[jsonProp].replace(rjsonp, "$1" + callbackName) : s.jsonp !== !1 && (s.url += (ajax_rquery.test(s.url) ? "&" : "?") + s.jsonp + "=" + callbackName), s.converters["script json"] = function() {
            return responseContainer || jQuery.error(callbackName + " was not called"), responseContainer[0];
        }, s.dataTypes[0] = "json", overwritten = window[callbackName], window[callbackName] = function() {
            responseContainer = arguments;
        }, jqXHR.always(function() {
            window[callbackName] = overwritten, s[callbackName] && (s.jsonpCallback = originalSettings.jsonpCallback, oldCallbacks.push(callbackName)), responseContainer && jQuery.isFunction(overwritten) && overwritten(responseContainer[0]), responseContainer = overwritten = undefined;
        }), "script";
    }), jQuery.ajaxSettings.xhr = function() {
        try {
            return new XMLHttpRequest;
        } catch (e) {}
    };
    var xhrSupported = jQuery.ajaxSettings.xhr(), xhrSuccessStatus = {
        0: 200,
        1223: 204
    }, xhrId = 0, xhrCallbacks = {};
    window.ActiveXObject && jQuery(window).on("unload", function() {
        for (var key in xhrCallbacks) xhrCallbacks[key]();
        xhrCallbacks = undefined;
    }), jQuery.support.cors = !!xhrSupported && "withCredentials" in xhrSupported, jQuery.support.ajax = xhrSupported = !!xhrSupported, jQuery.ajaxTransport(function(options) {
        var callback;
        if (jQuery.support.cors || xhrSupported && !options.crossDomain) return {
            send: function(headers, complete) {
                var i, id, xhr = options.xhr();
                xhr.open(options.type, options.url, options.async, options.username, options.password);
                if (options.xhrFields) for (i in options.xhrFields) xhr[i] = options.xhrFields[i];
                options.mimeType && xhr.overrideMimeType && xhr.overrideMimeType(options.mimeType), !options.crossDomain && !headers["X-Requested-With"] && (headers["X-Requested-With"] = "XMLHttpRequest");
                for (i in headers) xhr.setRequestHeader(i, headers[i]);
                callback = function(type) {
                    return function() {
                        callback && (delete xhrCallbacks[id], callback = xhr.onload = xhr.onerror = null, type === "abort" ? xhr.abort() : type === "error" ? complete(xhr.status || 404, xhr.statusText) : complete(xhrSuccessStatus[xhr.status] || xhr.status, xhr.statusText, typeof xhr.responseText == "string" ? {
                            text: xhr.responseText
                        } : undefined, xhr.getAllResponseHeaders()));
                    };
                }, xhr.onload = callback(), xhr.onerror = callback("error"), callback = xhrCallbacks[id = xhrId++] = callback("abort"), xhr.send(options.hasContent && options.data || null);
            },
            abort: function() {
                callback && callback();
            }
        };
    });
    var fxNow, timerId, rfxtypes = /^(?:toggle|show|hide)$/, rfxnum = new RegExp("^(?:([+-])=|)(" + core_pnum + ")([a-z%]*)$", "i"), rrun = /queueHooks$/, animationPrefilters = [ defaultPrefilter ], tweeners = {
        "*": [ function(prop, value) {
            var tween = this.createTween(prop, value), target = tween.cur(), parts = rfxnum.exec(value), unit = parts && parts[3] || (jQuery.cssNumber[prop] ? "" : "px"), start = (jQuery.cssNumber[prop] || unit !== "px" && +target) && rfxnum.exec(jQuery.css(tween.elem, prop)), scale = 1, maxIterations = 20;
            if (start && start[3] !== unit) {
                unit = unit || start[3], parts = parts || [], start = +target || 1;
                do scale = scale || ".5", start /= scale, jQuery.style(tween.elem, prop, start + unit); while (scale !== (scale = tween.cur() / target) && scale !== 1 && --maxIterations);
            }
            return parts && (start = tween.start = +start || +target || 0, tween.unit = unit, tween.end = parts[1] ? start + (parts[1] + 1) * parts[2] : +parts[2]), tween;
        } ]
    };
    function createFxNow() {
        return setTimeout(function() {
            fxNow = undefined;
        }), fxNow = jQuery.now();
    }
    function createTween(value, prop, animation) {
        var tween, collection = (tweeners[prop] || []).concat(tweeners["*"]), index = 0, length = collection.length;
        for (; index < length; index++) if (tween = collection[index].call(animation, prop, value)) return tween;
    }
    function Animation(elem, properties, options) {
        var result, stopped, index = 0, length = animationPrefilters.length, deferred = jQuery.Deferred().always(function() {
            delete tick.elem;
        }), tick = function() {
            if (stopped) return !1;
            var currentTime = fxNow || createFxNow(), remaining = Math.max(0, animation.startTime + animation.duration - currentTime), temp = remaining / animation.duration || 0, percent = 1 - temp, index = 0, length = animation.tweens.length;
            for (; index < length; index++) animation.tweens[index].run(percent);
            return deferred.notifyWith(elem, [ animation, percent, remaining ]), percent < 1 && length ? remaining : (deferred.resolveWith(elem, [ animation ]), !1);
        }, animation = deferred.promise({
            elem: elem,
            props: jQuery.extend({}, properties),
            opts: jQuery.extend(!0, {
                specialEasing: {}
            }, options),
            originalProperties: properties,
            originalOptions: options,
            startTime: fxNow || createFxNow(),
            duration: options.duration,
            tweens: [],
            createTween: function(prop, end) {
                var tween = jQuery.Tween(elem, animation.opts, prop, end, animation.opts.specialEasing[prop] || animation.opts.easing);
                return animation.tweens.push(tween), tween;
            },
            stop: function(gotoEnd) {
                var index = 0, length = gotoEnd ? animation.tweens.length : 0;
                if (stopped) return this;
                stopped = !0;
                for (; index < length; index++) animation.tweens[index].run(1);
                return gotoEnd ? deferred.resolveWith(elem, [ animation, gotoEnd ]) : deferred.rejectWith(elem, [ animation, gotoEnd ]), this;
            }
        }), props = animation.props;
        propFilter(props, animation.opts.specialEasing);
        for (; index < length; index++) {
            result = animationPrefilters[index].call(animation, elem, props, animation.opts);
            if (result) return result;
        }
        return jQuery.map(props, createTween, animation), jQuery.isFunction(animation.opts.start) && animation.opts.start.call(elem, animation), jQuery.fx.timer(jQuery.extend(tick, {
            elem: elem,
            anim: animation,
            queue: animation.opts.queue
        })), animation.progress(animation.opts.progress).done(animation.opts.done, animation.opts.complete).fail(animation.opts.fail).always(animation.opts.always);
    }
    function propFilter(props, specialEasing) {
        var index, name, easing, value, hooks;
        for (index in props) {
            name = jQuery.camelCase(index), easing = specialEasing[name], value = props[index], jQuery.isArray(value) && (easing = value[1], value = props[index] = value[0]), index !== name && (props[name] = value, delete props[index]), hooks = jQuery.cssHooks[name];
            if (hooks && "expand" in hooks) {
                value = hooks.expand(value), delete props[name];
                for (index in value) index in props || (props[index] = value[index], specialEasing[index] = easing);
            } else specialEasing[name] = easing;
        }
    }
    jQuery.Animation = jQuery.extend(Animation, {
        tweener: function(props, callback) {
            jQuery.isFunction(props) ? (callback = props, props = [ "*" ]) : props = props.split(" ");
            var prop, index = 0, length = props.length;
            for (; index < length; index++) prop = props[index], tweeners[prop] = tweeners[prop] || [], tweeners[prop].unshift(callback);
        },
        prefilter: function(callback, prepend) {
            prepend ? animationPrefilters.unshift(callback) : animationPrefilters.push(callback);
        }
    });
    function defaultPrefilter(elem, props, opts) {
        var prop, value, toggle, tween, hooks, oldfire, anim = this, orig = {}, style = elem.style, hidden = elem.nodeType && isHidden(elem), dataShow = data_priv.get(elem, "fxshow");
        opts.queue || (hooks = jQuery._queueHooks(elem, "fx"), hooks.unqueued == null && (hooks.unqueued = 0, oldfire = hooks.empty.fire, hooks.empty.fire = function() {
            hooks.unqueued || oldfire();
        }), hooks.unqueued++, anim.always(function() {
            anim.always(function() {
                hooks.unqueued--, jQuery.queue(elem, "fx").length || hooks.empty.fire();
            });
        })), elem.nodeType === 1 && ("height" in props || "width" in props) && (opts.overflow = [ style.overflow, style.overflowX, style.overflowY ], jQuery.css(elem, "display") === "inline" && jQuery.css(elem, "float") === "none" && (style.display = "inline-block")), opts.overflow && (style.overflow = "hidden", anim.always(function() {
            style.overflow = opts.overflow[0], style.overflowX = opts.overflow[1], style.overflowY = opts.overflow[2];
        }));
        for (prop in props) {
            value = props[prop];
            if (rfxtypes.exec(value)) {
                delete props[prop], toggle = toggle || value === "toggle";
                if (value === (hidden ? "hide" : "show")) {
                    if (value !== "show" || !dataShow || dataShow[prop] === undefined) continue;
                    hidden = !0;
                }
                orig[prop] = dataShow && dataShow[prop] || jQuery.style(elem, prop);
            }
        }
        if (!jQuery.isEmptyObject(orig)) {
            dataShow ? "hidden" in dataShow && (hidden = dataShow.hidden) : dataShow = data_priv.access(elem, "fxshow", {}), toggle && (dataShow.hidden = !hidden), hidden ? jQuery(elem).show() : anim.done(function() {
                jQuery(elem).hide();
            }), anim.done(function() {
                var prop;
                data_priv.remove(elem, "fxshow");
                for (prop in orig) jQuery.style(elem, prop, orig[prop]);
            });
            for (prop in orig) tween = createTween(hidden ? dataShow[prop] : 0, prop, anim), prop in dataShow || (dataShow[prop] = tween.start, hidden && (tween.end = tween.start, tween.start = prop === "width" || prop === "height" ? 1 : 0));
        }
    }
    function Tween(elem, options, prop, end, easing) {
        return new Tween.prototype.init(elem, options, prop, end, easing);
    }
    jQuery.Tween = Tween, Tween.prototype = {
        constructor: Tween,
        init: function(elem, options, prop, end, easing, unit) {
            this.elem = elem, this.prop = prop, this.easing = easing || "swing", this.options = options, this.start = this.now = this.cur(), this.end = end, this.unit = unit || (jQuery.cssNumber[prop] ? "" : "px");
        },
        cur: function() {
            var hooks = Tween.propHooks[this.prop];
            return hooks && hooks.get ? hooks.get(this) : Tween.propHooks._default.get(this);
        },
        run: function(percent) {
            var eased, hooks = Tween.propHooks[this.prop];
            return this.options.duration ? this.pos = eased = jQuery.easing[this.easing](percent, this.options.duration * percent, 0, 1, this.options.duration) : this.pos = eased = percent, this.now = (this.end - this.start) * eased + this.start, this.options.step && this.options.step.call(this.elem, this.now, this), hooks && hooks.set ? hooks.set(this) : Tween.propHooks._default.set(this), this;
        }
    }, Tween.prototype.init.prototype = Tween.prototype, Tween.propHooks = {
        _default: {
            get: function(tween) {
                var result;
                return tween.elem[tween.prop] == null || !!tween.elem.style && tween.elem.style[tween.prop] != null ? (result = jQuery.css(tween.elem, tween.prop, ""), !result || result === "auto" ? 0 : result) : tween.elem[tween.prop];
            },
            set: function(tween) {
                jQuery.fx.step[tween.prop] ? jQuery.fx.step[tween.prop](tween) : tween.elem.style && (tween.elem.style[jQuery.cssProps[tween.prop]] != null || jQuery.cssHooks[tween.prop]) ? jQuery.style(tween.elem, tween.prop, tween.now + tween.unit) : tween.elem[tween.prop] = tween.now;
            }
        }
    }, Tween.propHooks.scrollTop = Tween.propHooks.scrollLeft = {
        set: function(tween) {
            tween.elem.nodeType && tween.elem.parentNode && (tween.elem[tween.prop] = tween.now);
        }
    }, jQuery.each([ "toggle", "show", "hide" ], function(i, name) {
        var cssFn = jQuery.fn[name];
        jQuery.fn[name] = function(speed, easing, callback) {
            return speed == null || typeof speed == "boolean" ? cssFn.apply(this, arguments) : this.animate(genFx(name, !0), speed, easing, callback);
        };
    }), jQuery.fn.extend({
        fadeTo: function(speed, to, easing, callback) {
            return this.filter(isHidden).css("opacity", 0).show().end().animate({
                opacity: to
            }, speed, easing, callback);
        },
        animate: function(prop, speed, easing, callback) {
            var empty = jQuery.isEmptyObject(prop), optall = jQuery.speed(speed, easing, callback), doAnimation = function() {
                var anim = Animation(this, jQuery.extend({}, prop), optall);
                (empty || data_priv.get(this, "finish")) && anim.stop(!0);
            };
            return doAnimation.finish = doAnimation, empty || optall.queue === !1 ? this.each(doAnimation) : this.queue(optall.queue, doAnimation);
        },
        stop: function(type, clearQueue, gotoEnd) {
            var stopQueue = function(hooks) {
                var stop = hooks.stop;
                delete hooks.stop, stop(gotoEnd);
            };
            return typeof type != "string" && (gotoEnd = clearQueue, clearQueue = type, type = undefined), clearQueue && type !== !1 && this.queue(type || "fx", []), this.each(function() {
                var dequeue = !0, index = type != null && type + "queueHooks", timers = jQuery.timers, data = data_priv.get(this);
                if (index) data[index] && data[index].stop && stopQueue(data[index]); else for (index in data) data[index] && data[index].stop && rrun.test(index) && stopQueue(data[index]);
                for (index = timers.length; index--; ) timers[index].elem === this && (type == null || timers[index].queue === type) && (timers[index].anim.stop(gotoEnd), dequeue = !1, timers.splice(index, 1));
                (dequeue || !gotoEnd) && jQuery.dequeue(this, type);
            });
        },
        finish: function(type) {
            return type !== !1 && (type = type || "fx"), this.each(function() {
                var index, data = data_priv.get(this), queue = data[type + "queue"], hooks = data[type + "queueHooks"], timers = jQuery.timers, length = queue ? queue.length : 0;
                data.finish = !0, jQuery.queue(this, type, []), hooks && hooks.stop && hooks.stop.call(this, !0);
                for (index = timers.length; index--; ) timers[index].elem === this && timers[index].queue === type && (timers[index].anim.stop(!0), timers.splice(index, 1));
                for (index = 0; index < length; index++) queue[index] && queue[index].finish && queue[index].finish.call(this);
                delete data.finish;
            });
        }
    });
    function genFx(type, includeWidth) {
        var which, attrs = {
            height: type
        }, i = 0;
        includeWidth = includeWidth ? 1 : 0;
        for (; i < 4; i += 2 - includeWidth) which = cssExpand[i], attrs["margin" + which] = attrs["padding" + which] = type;
        return includeWidth && (attrs.opacity = attrs.width = type), attrs;
    }
    jQuery.each({
        slideDown: genFx("show"),
        slideUp: genFx("hide"),
        slideToggle: genFx("toggle"),
        fadeIn: {
            opacity: "show"
        },
        fadeOut: {
            opacity: "hide"
        },
        fadeToggle: {
            opacity: "toggle"
        }
    }, function(name, props) {
        jQuery.fn[name] = function(speed, easing, callback) {
            return this.animate(props, speed, easing, callback);
        };
    }), jQuery.speed = function(speed, easing, fn) {
        var opt = speed && typeof speed == "object" ? jQuery.extend({}, speed) : {
            complete: fn || !fn && easing || jQuery.isFunction(speed) && speed,
            duration: speed,
            easing: fn && easing || easing && !jQuery.isFunction(easing) && easing
        };
        opt.duration = jQuery.fx.off ? 0 : typeof opt.duration == "number" ? opt.duration : opt.duration in jQuery.fx.speeds ? jQuery.fx.speeds[opt.duration] : jQuery.fx.speeds._default;
        if (opt.queue == null || opt.queue === !0) opt.queue = "fx";
        return opt.old = opt.complete, opt.complete = function() {
            jQuery.isFunction(opt.old) && opt.old.call(this), opt.queue && jQuery.dequeue(this, opt.queue);
        }, opt;
    }, jQuery.easing = {
        linear: function(p) {
            return p;
        },
        swing: function(p) {
            return .5 - Math.cos(p * Math.PI) / 2;
        }
    }, jQuery.timers = [], jQuery.fx = Tween.prototype.init, jQuery.fx.tick = function() {
        var timer, timers = jQuery.timers, i = 0;
        fxNow = jQuery.now();
        for (; i < timers.length; i++) timer = timers[i], !timer() && timers[i] === timer && timers.splice(i--, 1);
        timers.length || jQuery.fx.stop(), fxNow = undefined;
    }, jQuery.fx.timer = function(timer) {
        timer() && jQuery.timers.push(timer) && jQuery.fx.start();
    }, jQuery.fx.interval = 13, jQuery.fx.start = function() {
        timerId || (timerId = setInterval(jQuery.fx.tick, jQuery.fx.interval));
    }, jQuery.fx.stop = function() {
        clearInterval(timerId), timerId = null;
    }, jQuery.fx.speeds = {
        slow: 600,
        fast: 200,
        _default: 400
    }, jQuery.fx.step = {}, jQuery.expr && jQuery.expr.filters && (jQuery.expr.filters.animated = function(elem) {
        return jQuery.grep(jQuery.timers, function(fn) {
            return elem === fn.elem;
        }).length;
    }), jQuery.fn.offset = function(options) {
        if (arguments.length) return options === undefined ? this : this.each(function(i) {
            jQuery.offset.setOffset(this, options, i);
        });
        var docElem, win, elem = this[0], box = {
            top: 0,
            left: 0
        }, doc = elem && elem.ownerDocument;
        if (!doc) return;
        return docElem = doc.documentElement, jQuery.contains(docElem, elem) ? (typeof elem.getBoundingClientRect !== core_strundefined && (box = elem.getBoundingClientRect()), win = getWindow(doc), {
            top: box.top + win.pageYOffset - docElem.clientTop,
            left: box.left + win.pageXOffset - docElem.clientLeft
        }) : box;
    }, jQuery.offset = {
        setOffset: function(elem, options, i) {
            var curPosition, curLeft, curCSSTop, curTop, curOffset, curCSSLeft, calculatePosition, position = jQuery.css(elem, "position"), curElem = jQuery(elem), props = {};
            position === "static" && (elem.style.position = "relative"), curOffset = curElem.offset(), curCSSTop = jQuery.css(elem, "top"), curCSSLeft = jQuery.css(elem, "left"), calculatePosition = (position === "absolute" || position === "fixed") && (curCSSTop + curCSSLeft).indexOf("auto") > -1, calculatePosition ? (curPosition = curElem.position(), curTop = curPosition.top, curLeft = curPosition.left) : (curTop = parseFloat(curCSSTop) || 0, curLeft = parseFloat(curCSSLeft) || 0), jQuery.isFunction(options) && (options = options.call(elem, i, curOffset)), options.top != null && (props.top = options.top - curOffset.top + curTop), options.left != null && (props.left = options.left - curOffset.left + curLeft), "using" in options ? options.using.call(elem, props) : curElem.css(props);
        }
    }, jQuery.fn.extend({
        position: function() {
            if (!this[0]) return;
            var offsetParent, offset, elem = this[0], parentOffset = {
                top: 0,
                left: 0
            };
            return jQuery.css(elem, "position") === "fixed" ? offset = elem.getBoundingClientRect() : (offsetParent = this.offsetParent(), offset = this.offset(), jQuery.nodeName(offsetParent[0], "html") || (parentOffset = offsetParent.offset()), parentOffset.top += jQuery.css(offsetParent[0], "borderTopWidth", !0), parentOffset.left += jQuery.css(offsetParent[0], "borderLeftWidth", !0)), {
                top: offset.top - parentOffset.top - jQuery.css(elem, "marginTop", !0),
                left: offset.left - parentOffset.left - jQuery.css(elem, "marginLeft", !0)
            };
        },
        offsetParent: function() {
            return this.map(function() {
                var offsetParent = this.offsetParent || docElem;
                while (offsetParent && !jQuery.nodeName(offsetParent, "html") && jQuery.css(offsetParent, "position") === "static") offsetParent = offsetParent.offsetParent;
                return offsetParent || docElem;
            });
        }
    }), jQuery.each({
        scrollLeft: "pageXOffset",
        scrollTop: "pageYOffset"
    }, function(method, prop) {
        var top = "pageYOffset" === prop;
        jQuery.fn[method] = function(val) {
            return jQuery.access(this, function(elem, method, val) {
                var win = getWindow(elem);
                if (val === undefined) return win ? win[prop] : elem[method];
                win ? win.scrollTo(top ? window.pageXOffset : val, top ? val : window.pageYOffset) : elem[method] = val;
            }, method, val, arguments.length, null);
        };
    });
    function getWindow(elem) {
        return jQuery.isWindow(elem) ? elem : elem.nodeType === 9 && elem.defaultView;
    }
    jQuery.each({
        Height: "height",
        Width: "width"
    }, function(name, type) {
        jQuery.each({
            padding: "inner" + name,
            content: type,
            "": "outer" + name
        }, function(defaultExtra, funcName) {
            jQuery.fn[funcName] = function(margin, value) {
                var chainable = arguments.length && (defaultExtra || typeof margin != "boolean"), extra = defaultExtra || (margin === !0 || value === !0 ? "margin" : "border");
                return jQuery.access(this, function(elem, type, value) {
                    var doc;
                    return jQuery.isWindow(elem) ? elem.document.documentElement["client" + name] : elem.nodeType === 9 ? (doc = elem.documentElement, Math.max(elem.body["scroll" + name], doc["scroll" + name], elem.body["offset" + name], doc["offset" + name], doc["client" + name])) : value === undefined ? jQuery.css(elem, type, extra) : jQuery.style(elem, type, value, extra);
                }, type, chainable ? margin : undefined, chainable, null);
            };
        });
    }), jQuery.fn.size = function() {
        return this.length;
    }, jQuery.fn.andSelf = jQuery.fn.addBack, typeof module == "object" && module && typeof module.exports == "object" ? module.exports = jQuery : typeof define == "function" && define.amd && define("jquery", [], function() {
        return jQuery;
    }), typeof window == "object" && typeof window.document == "object" && (window.jQuery = window.$ = jQuery);
}(window), function() {
    var root = this, previousBackbone = root.Backbone, array = [], push = array.push, slice = array.slice, splice = array.splice, Backbone;
    typeof exports != "undefined" ? Backbone = exports : Backbone = root.Backbone = {}, Backbone.VERSION = "1.0.0";
    var _ = root._;
    !_ && typeof require != "undefined" && (_ = require("underscore")), Backbone.$ = root.jQuery || root.Zepto || root.ender || root.$, Backbone.noConflict = function() {
        return root.Backbone = previousBackbone, this;
    }, Backbone.emulateHTTP = !1, Backbone.emulateJSON = !1;
    var Events = Backbone.Events = {
        on: function(name, callback, context) {
            if (!eventsApi(this, "on", name, [ callback, context ]) || !callback) return this;
            this._events || (this._events = {});
            var events = this._events[name] || (this._events[name] = []);
            return events.push({
                callback: callback,
                context: context,
                ctx: context || this
            }), this;
        },
        once: function(name, callback, context) {
            if (!eventsApi(this, "once", name, [ callback, context ]) || !callback) return this;
            var self = this, once = _.once(function() {
                self.off(name, once), callback.apply(this, arguments);
            });
            return once._callback = callback, this.on(name, once, context);
        },
        off: function(name, callback, context) {
            var retain, ev, events, names, i, l, j, k;
            if (!this._events || !eventsApi(this, "off", name, [ callback, context ])) return this;
            if (!name && !callback && !context) return this._events = {}, this;
            names = name ? [ name ] : _.keys(this._events);
            for (i = 0, l = names.length; i < l; i++) {
                name = names[i];
                if (events = this._events[name]) {
                    this._events[name] = retain = [];
                    if (callback || context) for (j = 0, k = events.length; j < k; j++) ev = events[j], (callback && callback !== ev.callback && callback !== ev.callback._callback || context && context !== ev.context) && retain.push(ev);
                    retain.length || delete this._events[name];
                }
            }
            return this;
        },
        trigger: function(name) {
            if (!this._events) return this;
            var args = slice.call(arguments, 1);
            if (!eventsApi(this, "trigger", name, args)) return this;
            var events = this._events[name], allEvents = this._events.all;
            return events && triggerEvents(events, args), allEvents && triggerEvents(allEvents, arguments), this;
        },
        stopListening: function(obj, name, callback) {
            var listeners = this._listeners;
            if (!listeners) return this;
            var deleteListener = !name && !callback;
            typeof name == "object" && (callback = this), obj && ((listeners = {})[obj._listenerId] = obj);
            for (var id in listeners) listeners[id].off(name, callback, this), deleteListener && delete this._listeners[id];
            return this;
        }
    }, eventSplitter = /\s+/, eventsApi = function(obj, action, name, rest) {
        if (!name) return !0;
        if (typeof name == "object") {
            for (var key in name) obj[action].apply(obj, [ key, name[key] ].concat(rest));
            return !1;
        }
        if (eventSplitter.test(name)) {
            var names = name.split(eventSplitter);
            for (var i = 0, l = names.length; i < l; i++) obj[action].apply(obj, [ names[i] ].concat(rest));
            return !1;
        }
        return !0;
    }, triggerEvents = function(events, args) {
        var ev, i = -1, l = events.length, a1 = args[0], a2 = args[1], a3 = args[2];
        switch (args.length) {
          case 0:
            while (++i < l) (ev = events[i]).callback.call(ev.ctx);
            return;
          case 1:
            while (++i < l) (ev = events[i]).callback.call(ev.ctx, a1);
            return;
          case 2:
            while (++i < l) (ev = events[i]).callback.call(ev.ctx, a1, a2);
            return;
          case 3:
            while (++i < l) (ev = events[i]).callback.call(ev.ctx, a1, a2, a3);
            return;
          default:
            while (++i < l) (ev = events[i]).callback.apply(ev.ctx, args);
        }
    }, listenMethods = {
        listenTo: "on",
        listenToOnce: "once"
    };
    _.each(listenMethods, function(implementation, method) {
        Events[method] = function(obj, name, callback) {
            var listeners = this._listeners || (this._listeners = {}), id = obj._listenerId || (obj._listenerId = _.uniqueId("l"));
            return listeners[id] = obj, typeof name == "object" && (callback = this), obj[implementation](name, callback, this), this;
        };
    }), Events.bind = Events.on, Events.unbind = Events.off, _.extend(Backbone, Events);
    var Model = Backbone.Model = function(attributes, options) {
        var defaults, attrs = attributes || {};
        options || (options = {}), this.cid = _.uniqueId("c"), this.attributes = {}, _.extend(this, _.pick(options, modelOptions)), options.parse && (attrs = this.parse(attrs, options) || {});
        if (defaults = _.result(this, "defaults")) attrs = _.defaults({}, attrs, defaults);
        this.set(attrs, options), this.changed = {}, this.initialize.apply(this, arguments);
    }, modelOptions = [ "url", "urlRoot", "collection" ];
    _.extend(Model.prototype, Events, {
        changed: null,
        validationError: null,
        idAttribute: "id",
        initialize: function() {},
        toJSON: function(options) {
            return _.clone(this.attributes);
        },
        sync: function() {
            return Backbone.sync.apply(this, arguments);
        },
        get: function(attr) {
            return this.attributes[attr];
        },
        escape: function(attr) {
            return _.escape(this.get(attr));
        },
        has: function(attr) {
            return this.get(attr) != null;
        },
        set: function(key, val, options) {
            var attr, attrs, unset, changes, silent, changing, prev, current;
            if (key == null) return this;
            typeof key == "object" ? (attrs = key, options = val) : (attrs = {})[key] = val, options || (options = {});
            if (!this._validate(attrs, options)) return !1;
            unset = options.unset, silent = options.silent, changes = [], changing = this._changing, this._changing = !0, changing || (this._previousAttributes = _.clone(this.attributes), this.changed = {}), current = this.attributes, prev = this._previousAttributes, this.idAttribute in attrs && (this.id = attrs[this.idAttribute]);
            for (attr in attrs) val = attrs[attr], _.isEqual(current[attr], val) || changes.push(attr), _.isEqual(prev[attr], val) ? delete this.changed[attr] : this.changed[attr] = val, unset ? delete current[attr] : current[attr] = val;
            if (!silent) {
                changes.length && (this._pending = !0);
                for (var i = 0, l = changes.length; i < l; i++) this.trigger("change:" + changes[i], this, current[changes[i]], options);
            }
            if (changing) return this;
            if (!silent) while (this._pending) this._pending = !1, this.trigger("change", this, options);
            return this._pending = !1, this._changing = !1, this;
        },
        unset: function(attr, options) {
            return this.set(attr, void 0, _.extend({}, options, {
                unset: !0
            }));
        },
        clear: function(options) {
            var attrs = {};
            for (var key in this.attributes) attrs[key] = void 0;
            return this.set(attrs, _.extend({}, options, {
                unset: !0
            }));
        },
        hasChanged: function(attr) {
            return attr == null ? !_.isEmpty(this.changed) : _.has(this.changed, attr);
        },
        changedAttributes: function(diff) {
            if (!diff) return this.hasChanged() ? _.clone(this.changed) : !1;
            var val, changed = !1, old = this._changing ? this._previousAttributes : this.attributes;
            for (var attr in diff) {
                if (_.isEqual(old[attr], val = diff[attr])) continue;
                (changed || (changed = {}))[attr] = val;
            }
            return changed;
        },
        previous: function(attr) {
            return attr == null || !this._previousAttributes ? null : this._previousAttributes[attr];
        },
        previousAttributes: function() {
            return _.clone(this._previousAttributes);
        },
        fetch: function(options) {
            options = options ? _.clone(options) : {}, options.parse === void 0 && (options.parse = !0);
            var model = this, success = options.success;
            return options.success = function(resp) {
                if (!model.set(model.parse(resp, options), options)) return !1;
                success && success(model, resp, options), model.trigger("sync", model, resp, options);
            }, wrapError(this, options), this.sync("read", this, options);
        },
        save: function(key, val, options) {
            var attrs, method, xhr, attributes = this.attributes;
            key == null || typeof key == "object" ? (attrs = key, options = val) : (attrs = {})[key] = val;
            if (attrs && (!options || !options.wait) && !this.set(attrs, options)) return !1;
            options = _.extend({
                validate: !0
            }, options);
            if (!this._validate(attrs, options)) return !1;
            attrs && options.wait && (this.attributes = _.extend({}, attributes, attrs)), options.parse === void 0 && (options.parse = !0);
            var model = this, success = options.success;
            return options.success = function(resp) {
                model.attributes = attributes;
                var serverAttrs = model.parse(resp, options);
                options.wait && (serverAttrs = _.extend(attrs || {}, serverAttrs));
                if (_.isObject(serverAttrs) && !model.set(serverAttrs, options)) return !1;
                success && success(model, resp, options), model.trigger("sync", model, resp, options);
            }, wrapError(this, options), method = this.isNew() ? "create" : options.patch ? "patch" : "update", method === "patch" && (options.attrs = attrs), xhr = this.sync(method, this, options), attrs && options.wait && (this.attributes = attributes), xhr;
        },
        destroy: function(options) {
            options = options ? _.clone(options) : {};
            var model = this, success = options.success, destroy = function() {
                model.trigger("destroy", model, model.collection, options);
            };
            options.success = function(resp) {
                (options.wait || model.isNew()) && destroy(), success && success(model, resp, options), model.isNew() || model.trigger("sync", model, resp, options);
            };
            if (this.isNew()) return options.success(), !1;
            wrapError(this, options);
            var xhr = this.sync("delete", this, options);
            return options.wait || destroy(), xhr;
        },
        url: function() {
            var base = _.result(this, "urlRoot") || _.result(this.collection, "url") || urlError();
            return this.isNew() ? base : base + (base.charAt(base.length - 1) === "/" ? "" : "/") + encodeURIComponent(this.id);
        },
        parse: function(resp, options) {
            return resp;
        },
        clone: function() {
            return new this.constructor(this.attributes);
        },
        isNew: function() {
            return this.id == null;
        },
        isValid: function(options) {
            return this._validate({}, _.extend(options || {}, {
                validate: !0
            }));
        },
        _validate: function(attrs, options) {
            if (!options.validate || !this.validate) return !0;
            attrs = _.extend({}, this.attributes, attrs);
            var error = this.validationError = this.validate(attrs, options) || null;
            return error ? (this.trigger("invalid", this, error, _.extend(options || {}, {
                validationError: error
            })), !1) : !0;
        }
    });
    var modelMethods = [ "keys", "values", "pairs", "invert", "pick", "omit" ];
    _.each(modelMethods, function(method) {
        Model.prototype[method] = function() {
            var args = slice.call(arguments);
            return args.unshift(this.attributes), _[method].apply(_, args);
        };
    });
    var Collection = Backbone.Collection = function(models, options) {
        options || (options = {}), options.url && (this.url = options.url), options.model && (this.model = options.model), options.comparator !== void 0 && (this.comparator = options.comparator), this._reset(), this.initialize.apply(this, arguments), models && this.reset(models, _.extend({
            silent: !0
        }, options));
    }, setOptions = {
        add: !0,
        remove: !0,
        merge: !0
    }, addOptions = {
        add: !0,
        merge: !1,
        remove: !1
    };
    _.extend(Collection.prototype, Events, {
        model: Model,
        initialize: function() {},
        toJSON: function(options) {
            return this.map(function(model) {
                return model.toJSON(options);
            });
        },
        sync: function() {
            return Backbone.sync.apply(this, arguments);
        },
        add: function(models, options) {
            return this.set(models, _.defaults(options || {}, addOptions));
        },
        remove: function(models, options) {
            models = _.isArray(models) ? models.slice() : [ models ], options || (options = {});
            var i, l, index, model;
            for (i = 0, l = models.length; i < l; i++) {
                model = this.get(models[i]);
                if (!model) continue;
                delete this._byId[model.id], delete this._byId[model.cid], index = this.indexOf(model), this.models.splice(index, 1), this.length--, options.silent || (options.index = index, model.trigger("remove", model, this, options)), this._removeReference(model);
            }
            return this;
        },
        set: function(models, options) {
            options = _.defaults(options || {}, setOptions), options.parse && (models = this.parse(models, options)), _.isArray(models) || (models = models ? [ models ] : []);
            var i, l, model, attrs, existing, sort, at = options.at, sortable = this.comparator && at == null && options.sort !== !1, sortAttr = _.isString(this.comparator) ? this.comparator : null, toAdd = [], toRemove = [], modelMap = {};
            for (i = 0, l = models.length; i < l; i++) {
                if (!(model = this._prepareModel(models[i], options))) continue;
                (existing = this.get(model)) ? (options.remove && (modelMap[existing.cid] = !0), options.merge && (existing.set(model.attributes, options), sortable && !sort && existing.hasChanged(sortAttr) && (sort = !0))) : options.add && (toAdd.push(model), model.on("all", this._onModelEvent, this), this._byId[model.cid] = model, model.id != null && (this._byId[model.id] = model));
            }
            if (options.remove) {
                for (i = 0, l = this.length; i < l; ++i) modelMap[(model = this.models[i]).cid] || toRemove.push(model);
                toRemove.length && this.remove(toRemove, options);
            }
            toAdd.length && (sortable && (sort = !0), this.length += toAdd.length, at != null ? splice.apply(this.models, [ at, 0 ].concat(toAdd)) : push.apply(this.models, toAdd)), sort && this.sort({
                silent: !0
            });
            if (options.silent) return this;
            for (i = 0, l = toAdd.length; i < l; i++) (model = toAdd[i]).trigger("add", model, this, options);
            return sort && this.trigger("sort", this, options), this;
        },
        reset: function(models, options) {
            options || (options = {});
            for (var i = 0, l = this.models.length; i < l; i++) this._removeReference(this.models[i]);
            return options.previousModels = this.models, this._reset(), this.add(models, _.extend({
                silent: !0
            }, options)), options.silent || this.trigger("reset", this, options), this;
        },
        push: function(model, options) {
            return model = this._prepareModel(model, options), this.add(model, _.extend({
                at: this.length
            }, options)), model;
        },
        pop: function(options) {
            var model = this.at(this.length - 1);
            return this.remove(model, options), model;
        },
        unshift: function(model, options) {
            return model = this._prepareModel(model, options), this.add(model, _.extend({
                at: 0
            }, options)), model;
        },
        shift: function(options) {
            var model = this.at(0);
            return this.remove(model, options), model;
        },
        slice: function(begin, end) {
            return this.models.slice(begin, end);
        },
        get: function(obj) {
            return obj == null ? void 0 : this._byId[obj.id != null ? obj.id : obj.cid || obj];
        },
        at: function(index) {
            return this.models[index];
        },
        where: function(attrs, first) {
            return _.isEmpty(attrs) ? first ? void 0 : [] : this[first ? "find" : "filter"](function(model) {
                for (var key in attrs) if (attrs[key] !== model.get(key)) return !1;
                return !0;
            });
        },
        findWhere: function(attrs) {
            return this.where(attrs, !0);
        },
        sort: function(options) {
            if (!this.comparator) throw new Error("Cannot sort a set without a comparator");
            return options || (options = {}), _.isString(this.comparator) || this.comparator.length === 1 ? this.models = this.sortBy(this.comparator, this) : this.models.sort(_.bind(this.comparator, this)), options.silent || this.trigger("sort", this, options), this;
        },
        sortedIndex: function(model, value, context) {
            value || (value = this.comparator);
            var iterator = _.isFunction(value) ? value : function(model) {
                return model.get(value);
            };
            return _.sortedIndex(this.models, model, iterator, context);
        },
        pluck: function(attr) {
            return _.invoke(this.models, "get", attr);
        },
        fetch: function(options) {
            options = options ? _.clone(options) : {}, options.parse === void 0 && (options.parse = !0);
            var success = options.success, collection = this;
            return options.success = function(resp) {
                var method = options.reset ? "reset" : "set";
                collection[method](resp, options), success && success(collection, resp, options), collection.trigger("sync", collection, resp, options);
            }, wrapError(this, options), this.sync("read", this, options);
        },
        create: function(model, options) {
            options = options ? _.clone(options) : {};
            if (!(model = this._prepareModel(model, options))) return !1;
            options.wait || this.add(model, options);
            var collection = this, success = options.success;
            return options.success = function(resp) {
                options.wait && collection.add(model, options), success && success(model, resp, options);
            }, model.save(null, options), model;
        },
        parse: function(resp, options) {
            return resp;
        },
        clone: function() {
            return new this.constructor(this.models);
        },
        _reset: function() {
            this.length = 0, this.models = [], this._byId = {};
        },
        _prepareModel: function(attrs, options) {
            if (attrs instanceof Model) return attrs.collection || (attrs.collection = this), attrs;
            options || (options = {}), options.collection = this;
            var model = new this.model(attrs, options);
            return model._validate(attrs, options) ? model : (this.trigger("invalid", this, attrs, options), !1);
        },
        _removeReference: function(model) {
            this === model.collection && delete model.collection, model.off("all", this._onModelEvent, this);
        },
        _onModelEvent: function(event, model, collection, options) {
            if ((event === "add" || event === "remove") && collection !== this) return;
            event === "destroy" && this.remove(model, options), model && event === "change:" + model.idAttribute && (delete this._byId[model.previous(model.idAttribute)], model.id != null && (this._byId[model.id] = model)), this.trigger.apply(this, arguments);
        }
    });
    var methods = [ "forEach", "each", "map", "collect", "reduce", "foldl", "inject", "reduceRight", "foldr", "find", "detect", "filter", "select", "reject", "every", "all", "some", "any", "include", "contains", "invoke", "max", "min", "toArray", "size", "first", "head", "take", "initial", "rest", "tail", "drop", "last", "without", "indexOf", "shuffle", "lastIndexOf", "isEmpty", "chain" ];
    _.each(methods, function(method) {
        Collection.prototype[method] = function() {
            var args = slice.call(arguments);
            return args.unshift(this.models), _[method].apply(_, args);
        };
    });
    var attributeMethods = [ "groupBy", "countBy", "sortBy" ];
    _.each(attributeMethods, function(method) {
        Collection.prototype[method] = function(value, context) {
            var iterator = _.isFunction(value) ? value : function(model) {
                return model.get(value);
            };
            return _[method](this.models, iterator, context);
        };
    });
    var View = Backbone.View = function(options) {
        this.cid = _.uniqueId("view"), this._configure(options || {}), this._ensureElement(), this.initialize.apply(this, arguments), this.delegateEvents();
    }, delegateEventSplitter = /^(\S+)\s*(.*)$/, viewOptions = [ "model", "collection", "el", "id", "attributes", "className", "tagName", "events" ];
    _.extend(View.prototype, Events, {
        tagName: "div",
        $: function(selector) {
            return this.$el.find(selector);
        },
        initialize: function() {},
        render: function() {
            return this;
        },
        remove: function() {
            return this.$el.remove(), this.stopListening(), this;
        },
        setElement: function(element, delegate) {
            return this.$el && this.undelegateEvents(), this.$el = element instanceof Backbone.$ ? element : Backbone.$(element), this.el = this.$el[0], delegate !== !1 && this.delegateEvents(), this;
        },
        delegateEvents: function(events) {
            if (!events && !(events = _.result(this, "events"))) return this;
            this.undelegateEvents();
            for (var key in events) {
                var method = events[key];
                _.isFunction(method) || (method = this[events[key]]);
                if (!method) continue;
                var match = key.match(delegateEventSplitter), eventName = match[1], selector = match[2];
                method = _.bind(method, this), eventName += ".delegateEvents" + this.cid, selector === "" ? this.$el.on(eventName, method) : this.$el.on(eventName, selector, method);
            }
            return this;
        },
        undelegateEvents: function() {
            return this.$el.off(".delegateEvents" + this.cid), this;
        },
        _configure: function(options) {
            this.options && (options = _.extend({}, _.result(this, "options"), options)), _.extend(this, _.pick(options, viewOptions)), this.options = options;
        },
        _ensureElement: function() {
            if (!this.el) {
                var attrs = _.extend({}, _.result(this, "attributes"));
                this.id && (attrs.id = _.result(this, "id")), this.className && (attrs["class"] = _.result(this, "className"));
                var $el = Backbone.$("<" + _.result(this, "tagName") + ">").attr(attrs);
                this.setElement($el, !1);
            } else this.setElement(_.result(this, "el"), !1);
        }
    }), Backbone.sync = function(method, model, options) {
        var type = methodMap[method];
        _.defaults(options || (options = {}), {
            emulateHTTP: Backbone.emulateHTTP,
            emulateJSON: Backbone.emulateJSON
        });
        var params = {
            type: type,
            dataType: "json"
        };
        options.url || (params.url = _.result(model, "url") || urlError()), options.data == null && model && (method === "create" || method === "update" || method === "patch") && (params.contentType = "application/json", params.data = JSON.stringify(options.attrs || model.toJSON(options))), options.emulateJSON && (params.contentType = "application/x-www-form-urlencoded", params.data = params.data ? {
            model: params.data
        } : {});
        if (options.emulateHTTP && (type === "PUT" || type === "DELETE" || type === "PATCH")) {
            params.type = "POST", options.emulateJSON && (params.data._method = type);
            var beforeSend = options.beforeSend;
            options.beforeSend = function(xhr) {
                xhr.setRequestHeader("X-HTTP-Method-Override", type);
                if (beforeSend) return beforeSend.apply(this, arguments);
            };
        }
        params.type !== "GET" && !options.emulateJSON && (params.processData = !1), params.type === "PATCH" && window.ActiveXObject && (!window.external || !window.external.msActiveXFilteringEnabled) && (params.xhr = function() {
            return new ActiveXObject("Microsoft.XMLHTTP");
        });
        var xhr = options.xhr = Backbone.ajax(_.extend(params, options));
        return model.trigger("request", model, xhr, options), xhr;
    };
    var methodMap = {
        create: "POST",
        update: "PUT",
        patch: "PATCH",
        "delete": "DELETE",
        read: "GET"
    };
    Backbone.ajax = function() {
        return Backbone.$.ajax.apply(Backbone.$, arguments);
    };
    var Router = Backbone.Router = function(options) {
        options || (options = {}), options.routes && (this.routes = options.routes), this._bindRoutes(), this.initialize.apply(this, arguments);
    }, optionalParam = /\((.*?)\)/g, namedParam = /(\(\?)?:\w+/g, splatParam = /\*\w+/g, escapeRegExp = /[\-{}\[\]+?.,\\\^$|#\s]/g;
    _.extend(Router.prototype, Events, {
        initialize: function() {},
        route: function(route, name, callback) {
            _.isRegExp(route) || (route = this._routeToRegExp(route)), _.isFunction(name) && (callback = name, name = ""), callback || (callback = this[name]);
            var router = this;
            return Backbone.history.route(route, function(fragment) {
                var args = router._extractParameters(route, fragment);
                callback && callback.apply(router, args), router.trigger.apply(router, [ "route:" + name ].concat(args)), router.trigger("route", name, args), Backbone.history.trigger("route", router, name, args);
            }), this;
        },
        navigate: function(fragment, options) {
            return Backbone.history.navigate(fragment, options), this;
        },
        _bindRoutes: function() {
            if (!this.routes) return;
            this.routes = _.result(this, "routes");
            var route, routes = _.keys(this.routes);
            while ((route = routes.pop()) != null) this.route(route, this.routes[route]);
        },
        _routeToRegExp: function(route) {
            return route = route.replace(escapeRegExp, "\\$&").replace(optionalParam, "(?:$1)?").replace(namedParam, function(match, optional) {
                return optional ? match : "([^/]+)";
            }).replace(splatParam, "(.*?)"), new RegExp("^" + route + "$");
        },
        _extractParameters: function(route, fragment) {
            var params = route.exec(fragment).slice(1);
            return _.map(params, function(param) {
                return param ? decodeURIComponent(param) : null;
            });
        }
    });
    var History = Backbone.History = function() {
        this.handlers = [], _.bindAll(this, "checkUrl"), typeof window != "undefined" && (this.location = window.location, this.history = window.history);
    }, routeStripper = /^[#\/]|\s+$/g, rootStripper = /^\/+|\/+$/g, isExplorer = /msie [\w.]+/, trailingSlash = /\/$/;
    History.started = !1, _.extend(History.prototype, Events, {
        interval: 50,
        getHash: function(window) {
            var match = (window || this).location.href.match(/#(.*)$/);
            return match ? match[1] : "";
        },
        getFragment: function(fragment, forcePushState) {
            if (fragment == null) if (this._hasPushState || !this._wantsHashChange || forcePushState) {
                fragment = this.location.pathname;
                var root = this.root.replace(trailingSlash, "");
                fragment.indexOf(root) || (fragment = fragment.substr(root.length));
            } else fragment = this.getHash();
            return fragment.replace(routeStripper, "");
        },
        start: function(options) {
            if (History.started) throw new Error("Backbone.history has already been started");
            History.started = !0, this.options = _.extend({}, {
                root: "/"
            }, this.options, options), this.root = this.options.root, this._wantsHashChange = this.options.hashChange !== !1, this._wantsPushState = !!this.options.pushState, this._hasPushState = !!(this.options.pushState && this.history && this.history.pushState);
            var fragment = this.getFragment(), docMode = document.documentMode, oldIE = isExplorer.exec(navigator.userAgent.toLowerCase()) && (!docMode || docMode <= 7);
            this.root = ("/" + this.root + "/").replace(rootStripper, "/"), oldIE && this._wantsHashChange && (this.iframe = Backbone.$('<iframe src="javascript:0" tabindex="-1" />').hide().appendTo("body")[0].contentWindow, this.navigate(fragment)), this._hasPushState ? Backbone.$(window).on("popstate", this.checkUrl) : this._wantsHashChange && "onhashchange" in window && !oldIE ? Backbone.$(window).on("hashchange", this.checkUrl) : this._wantsHashChange && (this._checkUrlInterval = setInterval(this.checkUrl, this.interval)), this.fragment = fragment;
            var loc = this.location, atRoot = loc.pathname.replace(/[^\/]$/, "$&/") === this.root;
            if (this._wantsHashChange && this._wantsPushState && !this._hasPushState && !atRoot) return this.fragment = this.getFragment(null, !0), this.location.replace(this.root + this.location.search + "#" + this.fragment), !0;
            this._wantsPushState && this._hasPushState && atRoot && loc.hash && (this.fragment = this.getHash().replace(routeStripper, ""), this.history.replaceState({}, document.title, this.root + this.fragment + loc.search));
            if (!this.options.silent) return this.loadUrl();
        },
        stop: function() {
            Backbone.$(window).off("popstate", this.checkUrl).off("hashchange", this.checkUrl), clearInterval(this._checkUrlInterval), History.started = !1;
        },
        route: function(route, callback) {
            this.handlers.unshift({
                route: route,
                callback: callback
            });
        },
        checkUrl: function(e) {
            var current = this.getFragment();
            current === this.fragment && this.iframe && (current = this.getFragment(this.getHash(this.iframe)));
            if (current === this.fragment) return !1;
            this.iframe && this.navigate(current), this.loadUrl() || this.loadUrl(this.getHash());
        },
        loadUrl: function(fragmentOverride) {
            var fragment = this.fragment = this.getFragment(fragmentOverride), matched = _.any(this.handlers, function(handler) {
                if (handler.route.test(fragment)) return handler.callback(fragment), !0;
            });
            return matched;
        },
        navigate: function(fragment, options) {
            if (!History.started) return !1;
            if (!options || options === !0) options = {
                trigger: options
            };
            fragment = this.getFragment(fragment || "");
            if (this.fragment === fragment) return;
            this.fragment = fragment;
            var url = this.root + fragment;
            if (this._hasPushState) this.history[options.replace ? "replaceState" : "pushState"]({}, document.title, url); else {
                if (!this._wantsHashChange) return this.location.assign(url);
                this._updateHash(this.location, fragment, options.replace), this.iframe && fragment !== this.getFragment(this.getHash(this.iframe)) && (options.replace || this.iframe.document.open().close(), this._updateHash(this.iframe.location, fragment, options.replace));
            }
            options.trigger && this.loadUrl(fragment);
        },
        _updateHash: function(location, fragment, replace) {
            if (replace) {
                var href = location.href.replace(/(javascript:|#).*$/, "");
                location.replace(href + "#" + fragment);
            } else location.hash = "#" + fragment;
        }
    }), Backbone.history = new History;
    var extend = function(protoProps, staticProps) {
        var parent = this, child;
        protoProps && _.has(protoProps, "constructor") ? child = protoProps.constructor : child = function() {
            return parent.apply(this, arguments);
        }, _.extend(child, parent, staticProps);
        var Surrogate = function() {
            this.constructor = child;
        };
        return Surrogate.prototype = parent.prototype, child.prototype = new Surrogate, protoProps && _.extend(child.prototype, protoProps), child.__super__ = parent.prototype, child;
    };
    Model.extend = Collection.extend = Router.extend = View.extend = History.extend = extend;
    var urlError = function() {
        throw new Error('A "url" property or function must be specified');
    }, wrapError = function(model, options) {
        var error = options.error;
        options.error = function(resp) {
            error && error(model, resp, options), model.trigger("error", model, resp, options);
        };
    };
}.call(this), define("backbone", [ "jquery", "underscore" ], function(global) {
    return function() {
        var ret, fn;
        return ret || global.Backbone;
    };
}(this)), define("app", [ "require", "exports", "module", "underscore", "jquery", "backbone" ], function(require, exports, module) {
    var _ = require("underscore"), $ = require("jquery"), Backbone = require("backbone"), app = module.exports;
    app.root = "/";
}), define("modules/models/ga", [ "require", "backbone" ], function(require) {
    var Backbone = require("backbone"), GaModel = Backbone.Model.extend({
        url: "/data/ga",
        initialize: function() {
            this.fetch();
        }
    });
    return GaModel;
}), define("events", [ "require", "exports", "module", "underscore", "backbone" ], function(require, exports, module) {
    var _ = require("underscore"), Backbone = require("backbone"), o = {};
    return _.extend(o, Backbone.Events), o;
});

var Handlebars = {};

!function(Handlebars, undefined) {
    Handlebars.VERSION = "1.0.0", Handlebars.COMPILER_REVISION = 4, Handlebars.REVISION_CHANGES = {
        1: "<= 1.0.rc.2",
        2: "== 1.0.0-rc.3",
        3: "== 1.0.0-rc.4",
        4: ">= 1.0.0"
    }, Handlebars.helpers = {}, Handlebars.partials = {};
    var toString = Object.prototype.toString, functionType = "[object Function]", objectType = "[object Object]";
    Handlebars.registerHelper = function(name, fn, inverse) {
        if (toString.call(name) === objectType) {
            if (inverse || fn) throw new Handlebars.Exception("Arg not supported with multiple helpers");
            Handlebars.Utils.extend(this.helpers, name);
        } else inverse && (fn.not = inverse), this.helpers[name] = fn;
    }, Handlebars.registerPartial = function(name, str) {
        toString.call(name) === objectType ? Handlebars.Utils.extend(this.partials, name) : this.partials[name] = str;
    }, Handlebars.registerHelper("helperMissing", function(arg) {
        if (arguments.length === 2) return undefined;
        throw new Error("Missing helper: '" + arg + "'");
    }), Handlebars.registerHelper("blockHelperMissing", function(context, options) {
        var inverse = options.inverse || function() {}, fn = options.fn, type = toString.call(context);
        return type === functionType && (context = context.call(this)), context === !0 ? fn(this) : context === !1 || context == null ? inverse(this) : type === "[object Array]" ? context.length > 0 ? Handlebars.helpers.each(context, options) : inverse(this) : fn(context);
    }), Handlebars.K = function() {}, Handlebars.createFrame = Object.create || function(object) {
        Handlebars.K.prototype = object;
        var obj = new Handlebars.K;
        return Handlebars.K.prototype = null, obj;
    }, Handlebars.logger = {
        DEBUG: 0,
        INFO: 1,
        WARN: 2,
        ERROR: 3,
        level: 3,
        methodMap: {
            0: "debug",
            1: "info",
            2: "warn",
            3: "error"
        },
        log: function(level, obj) {
            if (Handlebars.logger.level <= level) {
                var method = Handlebars.logger.methodMap[level];
                typeof console != "undefined" && console[method] && console[method].call(console, obj);
            }
        }
    }, Handlebars.log = function(level, obj) {
        Handlebars.logger.log(level, obj);
    }, Handlebars.registerHelper("each", function(context, options) {
        var fn = options.fn, inverse = options.inverse, i = 0, ret = "", data, type = toString.call(context);
        type === functionType && (context = context.call(this)), options.data && (data = Handlebars.createFrame(options.data));
        if (context && typeof context == "object") if (context instanceof Array) for (var j = context.length; i < j; i++) data && (data.index = i), ret += fn(context[i], {
            data: data
        }); else for (var key in context) context.hasOwnProperty(key) && (data && (data.key = key), ret += fn(context[key], {
            data: data
        }), i++);
        return i === 0 && (ret = inverse(this)), ret;
    }), Handlebars.registerHelper("if", function(conditional, options) {
        var type = toString.call(conditional);
        return type === functionType && (conditional = conditional.call(this)), !conditional || Handlebars.Utils.isEmpty(conditional) ? options.inverse(this) : options.fn(this);
    }), Handlebars.registerHelper("unless", function(conditional, options) {
        return Handlebars.helpers["if"].call(this, conditional, {
            fn: options.inverse,
            inverse: options.fn
        });
    }), Handlebars.registerHelper("with", function(context, options) {
        var type = toString.call(context);
        type === functionType && (context = context.call(this));
        if (!Handlebars.Utils.isEmpty(context)) return options.fn(context);
    }), Handlebars.registerHelper("log", function(context, options) {
        var level = options.data && options.data.level != null ? parseInt(options.data.level, 10) : 1;
        Handlebars.log(level, context);
    });
    var handlebars = function() {
        var parser = {
            trace: function trace() {},
            yy: {},
            symbols_: {
                error: 2,
                root: 3,
                program: 4,
                EOF: 5,
                simpleInverse: 6,
                statements: 7,
                statement: 8,
                openInverse: 9,
                closeBlock: 10,
                openBlock: 11,
                mustache: 12,
                partial: 13,
                CONTENT: 14,
                COMMENT: 15,
                OPEN_BLOCK: 16,
                inMustache: 17,
                CLOSE: 18,
                OPEN_INVERSE: 19,
                OPEN_ENDBLOCK: 20,
                path: 21,
                OPEN: 22,
                OPEN_UNESCAPED: 23,
                CLOSE_UNESCAPED: 24,
                OPEN_PARTIAL: 25,
                partialName: 26,
                params: 27,
                hash: 28,
                dataName: 29,
                param: 30,
                STRING: 31,
                INTEGER: 32,
                BOOLEAN: 33,
                hashSegments: 34,
                hashSegment: 35,
                ID: 36,
                EQUALS: 37,
                DATA: 38,
                pathSegments: 39,
                SEP: 40,
                $accept: 0,
                $end: 1
            },
            terminals_: {
                2: "error",
                5: "EOF",
                14: "CONTENT",
                15: "COMMENT",
                16: "OPEN_BLOCK",
                18: "CLOSE",
                19: "OPEN_INVERSE",
                20: "OPEN_ENDBLOCK",
                22: "OPEN",
                23: "OPEN_UNESCAPED",
                24: "CLOSE_UNESCAPED",
                25: "OPEN_PARTIAL",
                31: "STRING",
                32: "INTEGER",
                33: "BOOLEAN",
                36: "ID",
                37: "EQUALS",
                38: "DATA",
                40: "SEP"
            },
            productions_: [ 0, [ 3, 2 ], [ 4, 2 ], [ 4, 3 ], [ 4, 2 ], [ 4, 1 ], [ 4, 1 ], [ 4, 0 ], [ 7, 1 ], [ 7, 2 ], [ 8, 3 ], [ 8, 3 ], [ 8, 1 ], [ 8, 1 ], [ 8, 1 ], [ 8, 1 ], [ 11, 3 ], [ 9, 3 ], [ 10, 3 ], [ 12, 3 ], [ 12, 3 ], [ 13, 3 ], [ 13, 4 ], [ 6, 2 ], [ 17, 3 ], [ 17, 2 ], [ 17, 2 ], [ 17, 1 ], [ 17, 1 ], [ 27, 2 ], [ 27, 1 ], [ 30, 1 ], [ 30, 1 ], [ 30, 1 ], [ 30, 1 ], [ 30, 1 ], [ 28, 1 ], [ 34, 2 ], [ 34, 1 ], [ 35, 3 ], [ 35, 3 ], [ 35, 3 ], [ 35, 3 ], [ 35, 3 ], [ 26, 1 ], [ 26, 1 ], [ 26, 1 ], [ 29, 2 ], [ 21, 1 ], [ 39, 3 ], [ 39, 1 ] ],
            performAction: function anonymous(yytext, yyleng, yylineno, yy, yystate, $$, _$) {
                var $0 = $$.length - 1;
                switch (yystate) {
                  case 1:
                    return $$[$0 - 1];
                  case 2:
                    this.$ = new yy.ProgramNode([], $$[$0]);
                    break;
                  case 3:
                    this.$ = new yy.ProgramNode($$[$0 - 2], $$[$0]);
                    break;
                  case 4:
                    this.$ = new yy.ProgramNode($$[$0 - 1], []);
                    break;
                  case 5:
                    this.$ = new yy.ProgramNode($$[$0]);
                    break;
                  case 6:
                    this.$ = new yy.ProgramNode([], []);
                    break;
                  case 7:
                    this.$ = new yy.ProgramNode([]);
                    break;
                  case 8:
                    this.$ = [ $$[$0] ];
                    break;
                  case 9:
                    $$[$0 - 1].push($$[$0]), this.$ = $$[$0 - 1];
                    break;
                  case 10:
                    this.$ = new yy.BlockNode($$[$0 - 2], $$[$0 - 1].inverse, $$[$0 - 1], $$[$0]);
                    break;
                  case 11:
                    this.$ = new yy.BlockNode($$[$0 - 2], $$[$0 - 1], $$[$0 - 1].inverse, $$[$0]);
                    break;
                  case 12:
                    this.$ = $$[$0];
                    break;
                  case 13:
                    this.$ = $$[$0];
                    break;
                  case 14:
                    this.$ = new yy.ContentNode($$[$0]);
                    break;
                  case 15:
                    this.$ = new yy.CommentNode($$[$0]);
                    break;
                  case 16:
                    this.$ = new yy.MustacheNode($$[$0 - 1][0], $$[$0 - 1][1]);
                    break;
                  case 17:
                    this.$ = new yy.MustacheNode($$[$0 - 1][0], $$[$0 - 1][1]);
                    break;
                  case 18:
                    this.$ = $$[$0 - 1];
                    break;
                  case 19:
                    this.$ = new yy.MustacheNode($$[$0 - 1][0], $$[$0 - 1][1], $$[$0 - 2][2] === "&");
                    break;
                  case 20:
                    this.$ = new yy.MustacheNode($$[$0 - 1][0], $$[$0 - 1][1], !0);
                    break;
                  case 21:
                    this.$ = new yy.PartialNode($$[$0 - 1]);
                    break;
                  case 22:
                    this.$ = new yy.PartialNode($$[$0 - 2], $$[$0 - 1]);
                    break;
                  case 23:
                    break;
                  case 24:
                    this.$ = [ [ $$[$0 - 2] ].concat($$[$0 - 1]), $$[$0] ];
                    break;
                  case 25:
                    this.$ = [ [ $$[$0 - 1] ].concat($$[$0]), null ];
                    break;
                  case 26:
                    this.$ = [ [ $$[$0 - 1] ], $$[$0] ];
                    break;
                  case 27:
                    this.$ = [ [ $$[$0] ], null ];
                    break;
                  case 28:
                    this.$ = [ [ $$[$0] ], null ];
                    break;
                  case 29:
                    $$[$0 - 1].push($$[$0]), this.$ = $$[$0 - 1];
                    break;
                  case 30:
                    this.$ = [ $$[$0] ];
                    break;
                  case 31:
                    this.$ = $$[$0];
                    break;
                  case 32:
                    this.$ = new yy.StringNode($$[$0]);
                    break;
                  case 33:
                    this.$ = new yy.IntegerNode($$[$0]);
                    break;
                  case 34:
                    this.$ = new yy.BooleanNode($$[$0]);
                    break;
                  case 35:
                    this.$ = $$[$0];
                    break;
                  case 36:
                    this.$ = new yy.HashNode($$[$0]);
                    break;
                  case 37:
                    $$[$0 - 1].push($$[$0]), this.$ = $$[$0 - 1];
                    break;
                  case 38:
                    this.$ = [ $$[$0] ];
                    break;
                  case 39:
                    this.$ = [ $$[$0 - 2], $$[$0] ];
                    break;
                  case 40:
                    this.$ = [ $$[$0 - 2], new yy.StringNode($$[$0]) ];
                    break;
                  case 41:
                    this.$ = [ $$[$0 - 2], new yy.IntegerNode($$[$0]) ];
                    break;
                  case 42:
                    this.$ = [ $$[$0 - 2], new yy.BooleanNode($$[$0]) ];
                    break;
                  case 43:
                    this.$ = [ $$[$0 - 2], $$[$0] ];
                    break;
                  case 44:
                    this.$ = new yy.PartialNameNode($$[$0]);
                    break;
                  case 45:
                    this.$ = new yy.PartialNameNode(new yy.StringNode($$[$0]));
                    break;
                  case 46:
                    this.$ = new yy.PartialNameNode(new yy.IntegerNode($$[$0]));
                    break;
                  case 47:
                    this.$ = new yy.DataNode($$[$0]);
                    break;
                  case 48:
                    this.$ = new yy.IdNode($$[$0]);
                    break;
                  case 49:
                    $$[$0 - 2].push({
                        part: $$[$0],
                        separator: $$[$0 - 1]
                    }), this.$ = $$[$0 - 2];
                    break;
                  case 50:
                    this.$ = [ {
                        part: $$[$0]
                    } ];
                }
            },
            table: [ {
                3: 1,
                4: 2,
                5: [ 2, 7 ],
                6: 3,
                7: 4,
                8: 6,
                9: 7,
                11: 8,
                12: 9,
                13: 10,
                14: [ 1, 11 ],
                15: [ 1, 12 ],
                16: [ 1, 13 ],
                19: [ 1, 5 ],
                22: [ 1, 14 ],
                23: [ 1, 15 ],
                25: [ 1, 16 ]
            }, {
                1: [ 3 ]
            }, {
                5: [ 1, 17 ]
            }, {
                5: [ 2, 6 ],
                7: 18,
                8: 6,
                9: 7,
                11: 8,
                12: 9,
                13: 10,
                14: [ 1, 11 ],
                15: [ 1, 12 ],
                16: [ 1, 13 ],
                19: [ 1, 19 ],
                20: [ 2, 6 ],
                22: [ 1, 14 ],
                23: [ 1, 15 ],
                25: [ 1, 16 ]
            }, {
                5: [ 2, 5 ],
                6: 20,
                8: 21,
                9: 7,
                11: 8,
                12: 9,
                13: 10,
                14: [ 1, 11 ],
                15: [ 1, 12 ],
                16: [ 1, 13 ],
                19: [ 1, 5 ],
                20: [ 2, 5 ],
                22: [ 1, 14 ],
                23: [ 1, 15 ],
                25: [ 1, 16 ]
            }, {
                17: 23,
                18: [ 1, 22 ],
                21: 24,
                29: 25,
                36: [ 1, 28 ],
                38: [ 1, 27 ],
                39: 26
            }, {
                5: [ 2, 8 ],
                14: [ 2, 8 ],
                15: [ 2, 8 ],
                16: [ 2, 8 ],
                19: [ 2, 8 ],
                20: [ 2, 8 ],
                22: [ 2, 8 ],
                23: [ 2, 8 ],
                25: [ 2, 8 ]
            }, {
                4: 29,
                6: 3,
                7: 4,
                8: 6,
                9: 7,
                11: 8,
                12: 9,
                13: 10,
                14: [ 1, 11 ],
                15: [ 1, 12 ],
                16: [ 1, 13 ],
                19: [ 1, 5 ],
                20: [ 2, 7 ],
                22: [ 1, 14 ],
                23: [ 1, 15 ],
                25: [ 1, 16 ]
            }, {
                4: 30,
                6: 3,
                7: 4,
                8: 6,
                9: 7,
                11: 8,
                12: 9,
                13: 10,
                14: [ 1, 11 ],
                15: [ 1, 12 ],
                16: [ 1, 13 ],
                19: [ 1, 5 ],
                20: [ 2, 7 ],
                22: [ 1, 14 ],
                23: [ 1, 15 ],
                25: [ 1, 16 ]
            }, {
                5: [ 2, 12 ],
                14: [ 2, 12 ],
                15: [ 2, 12 ],
                16: [ 2, 12 ],
                19: [ 2, 12 ],
                20: [ 2, 12 ],
                22: [ 2, 12 ],
                23: [ 2, 12 ],
                25: [ 2, 12 ]
            }, {
                5: [ 2, 13 ],
                14: [ 2, 13 ],
                15: [ 2, 13 ],
                16: [ 2, 13 ],
                19: [ 2, 13 ],
                20: [ 2, 13 ],
                22: [ 2, 13 ],
                23: [ 2, 13 ],
                25: [ 2, 13 ]
            }, {
                5: [ 2, 14 ],
                14: [ 2, 14 ],
                15: [ 2, 14 ],
                16: [ 2, 14 ],
                19: [ 2, 14 ],
                20: [ 2, 14 ],
                22: [ 2, 14 ],
                23: [ 2, 14 ],
                25: [ 2, 14 ]
            }, {
                5: [ 2, 15 ],
                14: [ 2, 15 ],
                15: [ 2, 15 ],
                16: [ 2, 15 ],
                19: [ 2, 15 ],
                20: [ 2, 15 ],
                22: [ 2, 15 ],
                23: [ 2, 15 ],
                25: [ 2, 15 ]
            }, {
                17: 31,
                21: 24,
                29: 25,
                36: [ 1, 28 ],
                38: [ 1, 27 ],
                39: 26
            }, {
                17: 32,
                21: 24,
                29: 25,
                36: [ 1, 28 ],
                38: [ 1, 27 ],
                39: 26
            }, {
                17: 33,
                21: 24,
                29: 25,
                36: [ 1, 28 ],
                38: [ 1, 27 ],
                39: 26
            }, {
                21: 35,
                26: 34,
                31: [ 1, 36 ],
                32: [ 1, 37 ],
                36: [ 1, 28 ],
                39: 26
            }, {
                1: [ 2, 1 ]
            }, {
                5: [ 2, 2 ],
                8: 21,
                9: 7,
                11: 8,
                12: 9,
                13: 10,
                14: [ 1, 11 ],
                15: [ 1, 12 ],
                16: [ 1, 13 ],
                19: [ 1, 19 ],
                20: [ 2, 2 ],
                22: [ 1, 14 ],
                23: [ 1, 15 ],
                25: [ 1, 16 ]
            }, {
                17: 23,
                21: 24,
                29: 25,
                36: [ 1, 28 ],
                38: [ 1, 27 ],
                39: 26
            }, {
                5: [ 2, 4 ],
                7: 38,
                8: 6,
                9: 7,
                11: 8,
                12: 9,
                13: 10,
                14: [ 1, 11 ],
                15: [ 1, 12 ],
                16: [ 1, 13 ],
                19: [ 1, 19 ],
                20: [ 2, 4 ],
                22: [ 1, 14 ],
                23: [ 1, 15 ],
                25: [ 1, 16 ]
            }, {
                5: [ 2, 9 ],
                14: [ 2, 9 ],
                15: [ 2, 9 ],
                16: [ 2, 9 ],
                19: [ 2, 9 ],
                20: [ 2, 9 ],
                22: [ 2, 9 ],
                23: [ 2, 9 ],
                25: [ 2, 9 ]
            }, {
                5: [ 2, 23 ],
                14: [ 2, 23 ],
                15: [ 2, 23 ],
                16: [ 2, 23 ],
                19: [ 2, 23 ],
                20: [ 2, 23 ],
                22: [ 2, 23 ],
                23: [ 2, 23 ],
                25: [ 2, 23 ]
            }, {
                18: [ 1, 39 ]
            }, {
                18: [ 2, 27 ],
                21: 44,
                24: [ 2, 27 ],
                27: 40,
                28: 41,
                29: 48,
                30: 42,
                31: [ 1, 45 ],
                32: [ 1, 46 ],
                33: [ 1, 47 ],
                34: 43,
                35: 49,
                36: [ 1, 50 ],
                38: [ 1, 27 ],
                39: 26
            }, {
                18: [ 2, 28 ],
                24: [ 2, 28 ]
            }, {
                18: [ 2, 48 ],
                24: [ 2, 48 ],
                31: [ 2, 48 ],
                32: [ 2, 48 ],
                33: [ 2, 48 ],
                36: [ 2, 48 ],
                38: [ 2, 48 ],
                40: [ 1, 51 ]
            }, {
                21: 52,
                36: [ 1, 28 ],
                39: 26
            }, {
                18: [ 2, 50 ],
                24: [ 2, 50 ],
                31: [ 2, 50 ],
                32: [ 2, 50 ],
                33: [ 2, 50 ],
                36: [ 2, 50 ],
                38: [ 2, 50 ],
                40: [ 2, 50 ]
            }, {
                10: 53,
                20: [ 1, 54 ]
            }, {
                10: 55,
                20: [ 1, 54 ]
            }, {
                18: [ 1, 56 ]
            }, {
                18: [ 1, 57 ]
            }, {
                24: [ 1, 58 ]
            }, {
                18: [ 1, 59 ],
                21: 60,
                36: [ 1, 28 ],
                39: 26
            }, {
                18: [ 2, 44 ],
                36: [ 2, 44 ]
            }, {
                18: [ 2, 45 ],
                36: [ 2, 45 ]
            }, {
                18: [ 2, 46 ],
                36: [ 2, 46 ]
            }, {
                5: [ 2, 3 ],
                8: 21,
                9: 7,
                11: 8,
                12: 9,
                13: 10,
                14: [ 1, 11 ],
                15: [ 1, 12 ],
                16: [ 1, 13 ],
                19: [ 1, 19 ],
                20: [ 2, 3 ],
                22: [ 1, 14 ],
                23: [ 1, 15 ],
                25: [ 1, 16 ]
            }, {
                14: [ 2, 17 ],
                15: [ 2, 17 ],
                16: [ 2, 17 ],
                19: [ 2, 17 ],
                20: [ 2, 17 ],
                22: [ 2, 17 ],
                23: [ 2, 17 ],
                25: [ 2, 17 ]
            }, {
                18: [ 2, 25 ],
                21: 44,
                24: [ 2, 25 ],
                28: 61,
                29: 48,
                30: 62,
                31: [ 1, 45 ],
                32: [ 1, 46 ],
                33: [ 1, 47 ],
                34: 43,
                35: 49,
                36: [ 1, 50 ],
                38: [ 1, 27 ],
                39: 26
            }, {
                18: [ 2, 26 ],
                24: [ 2, 26 ]
            }, {
                18: [ 2, 30 ],
                24: [ 2, 30 ],
                31: [ 2, 30 ],
                32: [ 2, 30 ],
                33: [ 2, 30 ],
                36: [ 2, 30 ],
                38: [ 2, 30 ]
            }, {
                18: [ 2, 36 ],
                24: [ 2, 36 ],
                35: 63,
                36: [ 1, 64 ]
            }, {
                18: [ 2, 31 ],
                24: [ 2, 31 ],
                31: [ 2, 31 ],
                32: [ 2, 31 ],
                33: [ 2, 31 ],
                36: [ 2, 31 ],
                38: [ 2, 31 ]
            }, {
                18: [ 2, 32 ],
                24: [ 2, 32 ],
                31: [ 2, 32 ],
                32: [ 2, 32 ],
                33: [ 2, 32 ],
                36: [ 2, 32 ],
                38: [ 2, 32 ]
            }, {
                18: [ 2, 33 ],
                24: [ 2, 33 ],
                31: [ 2, 33 ],
                32: [ 2, 33 ],
                33: [ 2, 33 ],
                36: [ 2, 33 ],
                38: [ 2, 33 ]
            }, {
                18: [ 2, 34 ],
                24: [ 2, 34 ],
                31: [ 2, 34 ],
                32: [ 2, 34 ],
                33: [ 2, 34 ],
                36: [ 2, 34 ],
                38: [ 2, 34 ]
            }, {
                18: [ 2, 35 ],
                24: [ 2, 35 ],
                31: [ 2, 35 ],
                32: [ 2, 35 ],
                33: [ 2, 35 ],
                36: [ 2, 35 ],
                38: [ 2, 35 ]
            }, {
                18: [ 2, 38 ],
                24: [ 2, 38 ],
                36: [ 2, 38 ]
            }, {
                18: [ 2, 50 ],
                24: [ 2, 50 ],
                31: [ 2, 50 ],
                32: [ 2, 50 ],
                33: [ 2, 50 ],
                36: [ 2, 50 ],
                37: [ 1, 65 ],
                38: [ 2, 50 ],
                40: [ 2, 50 ]
            }, {
                36: [ 1, 66 ]
            }, {
                18: [ 2, 47 ],
                24: [ 2, 47 ],
                31: [ 2, 47 ],
                32: [ 2, 47 ],
                33: [ 2, 47 ],
                36: [ 2, 47 ],
                38: [ 2, 47 ]
            }, {
                5: [ 2, 10 ],
                14: [ 2, 10 ],
                15: [ 2, 10 ],
                16: [ 2, 10 ],
                19: [ 2, 10 ],
                20: [ 2, 10 ],
                22: [ 2, 10 ],
                23: [ 2, 10 ],
                25: [ 2, 10 ]
            }, {
                21: 67,
                36: [ 1, 28 ],
                39: 26
            }, {
                5: [ 2, 11 ],
                14: [ 2, 11 ],
                15: [ 2, 11 ],
                16: [ 2, 11 ],
                19: [ 2, 11 ],
                20: [ 2, 11 ],
                22: [ 2, 11 ],
                23: [ 2, 11 ],
                25: [ 2, 11 ]
            }, {
                14: [ 2, 16 ],
                15: [ 2, 16 ],
                16: [ 2, 16 ],
                19: [ 2, 16 ],
                20: [ 2, 16 ],
                22: [ 2, 16 ],
                23: [ 2, 16 ],
                25: [ 2, 16 ]
            }, {
                5: [ 2, 19 ],
                14: [ 2, 19 ],
                15: [ 2, 19 ],
                16: [ 2, 19 ],
                19: [ 2, 19 ],
                20: [ 2, 19 ],
                22: [ 2, 19 ],
                23: [ 2, 19 ],
                25: [ 2, 19 ]
            }, {
                5: [ 2, 20 ],
                14: [ 2, 20 ],
                15: [ 2, 20 ],
                16: [ 2, 20 ],
                19: [ 2, 20 ],
                20: [ 2, 20 ],
                22: [ 2, 20 ],
                23: [ 2, 20 ],
                25: [ 2, 20 ]
            }, {
                5: [ 2, 21 ],
                14: [ 2, 21 ],
                15: [ 2, 21 ],
                16: [ 2, 21 ],
                19: [ 2, 21 ],
                20: [ 2, 21 ],
                22: [ 2, 21 ],
                23: [ 2, 21 ],
                25: [ 2, 21 ]
            }, {
                18: [ 1, 68 ]
            }, {
                18: [ 2, 24 ],
                24: [ 2, 24 ]
            }, {
                18: [ 2, 29 ],
                24: [ 2, 29 ],
                31: [ 2, 29 ],
                32: [ 2, 29 ],
                33: [ 2, 29 ],
                36: [ 2, 29 ],
                38: [ 2, 29 ]
            }, {
                18: [ 2, 37 ],
                24: [ 2, 37 ],
                36: [ 2, 37 ]
            }, {
                37: [ 1, 65 ]
            }, {
                21: 69,
                29: 73,
                31: [ 1, 70 ],
                32: [ 1, 71 ],
                33: [ 1, 72 ],
                36: [ 1, 28 ],
                38: [ 1, 27 ],
                39: 26
            }, {
                18: [ 2, 49 ],
                24: [ 2, 49 ],
                31: [ 2, 49 ],
                32: [ 2, 49 ],
                33: [ 2, 49 ],
                36: [ 2, 49 ],
                38: [ 2, 49 ],
                40: [ 2, 49 ]
            }, {
                18: [ 1, 74 ]
            }, {
                5: [ 2, 22 ],
                14: [ 2, 22 ],
                15: [ 2, 22 ],
                16: [ 2, 22 ],
                19: [ 2, 22 ],
                20: [ 2, 22 ],
                22: [ 2, 22 ],
                23: [ 2, 22 ],
                25: [ 2, 22 ]
            }, {
                18: [ 2, 39 ],
                24: [ 2, 39 ],
                36: [ 2, 39 ]
            }, {
                18: [ 2, 40 ],
                24: [ 2, 40 ],
                36: [ 2, 40 ]
            }, {
                18: [ 2, 41 ],
                24: [ 2, 41 ],
                36: [ 2, 41 ]
            }, {
                18: [ 2, 42 ],
                24: [ 2, 42 ],
                36: [ 2, 42 ]
            }, {
                18: [ 2, 43 ],
                24: [ 2, 43 ],
                36: [ 2, 43 ]
            }, {
                5: [ 2, 18 ],
                14: [ 2, 18 ],
                15: [ 2, 18 ],
                16: [ 2, 18 ],
                19: [ 2, 18 ],
                20: [ 2, 18 ],
                22: [ 2, 18 ],
                23: [ 2, 18 ],
                25: [ 2, 18 ]
            } ],
            defaultActions: {
                17: [ 2, 1 ]
            },
            parseError: function parseError(str, hash) {
                throw new Error(str);
            },
            parse: function parse(input) {
                var self = this, stack = [ 0 ], vstack = [ null ], lstack = [], table = this.table, yytext = "", yylineno = 0, yyleng = 0, recovering = 0, TERROR = 2, EOF = 1;
                this.lexer.setInput(input), this.lexer.yy = this.yy, this.yy.lexer = this.lexer, this.yy.parser = this, typeof this.lexer.yylloc == "undefined" && (this.lexer.yylloc = {});
                var yyloc = this.lexer.yylloc;
                lstack.push(yyloc);
                var ranges = this.lexer.options && this.lexer.options.ranges;
                typeof this.yy.parseError == "function" && (this.parseError = this.yy.parseError);
                function popStack(n) {
                    stack.length = stack.length - 2 * n, vstack.length = vstack.length - n, lstack.length = lstack.length - n;
                }
                function lex() {
                    var token;
                    return token = self.lexer.lex() || 1, typeof token != "number" && (token = self.symbols_[token] || token), token;
                }
                var symbol, preErrorSymbol, state, action, a, r, yyval = {}, p, len, newState, expected;
                for (;;) {
                    state = stack[stack.length - 1];
                    if (this.defaultActions[state]) action = this.defaultActions[state]; else {
                        if (symbol === null || typeof symbol == "undefined") symbol = lex();
                        action = table[state] && table[state][symbol];
                    }
                    if (typeof action == "undefined" || !action.length || !action[0]) {
                        var errStr = "";
                        if (!recovering) {
                            expected = [];
                            for (p in table[state]) this.terminals_[p] && p > 2 && expected.push("'" + this.terminals_[p] + "'");
                            this.lexer.showPosition ? errStr = "Parse error on line " + (yylineno + 1) + ":\n" + this.lexer.showPosition() + "\nExpecting " + expected.join(", ") + ", got '" + (this.terminals_[symbol] || symbol) + "'" : errStr = "Parse error on line " + (yylineno + 1) + ": Unexpected " + (symbol == 1 ? "end of input" : "'" + (this.terminals_[symbol] || symbol) + "'"), this.parseError(errStr, {
                                text: this.lexer.match,
                                token: this.terminals_[symbol] || symbol,
                                line: this.lexer.yylineno,
                                loc: yyloc,
                                expected: expected
                            });
                        }
                    }
                    if (action[0] instanceof Array && action.length > 1) throw new Error("Parse Error: multiple actions possible at state: " + state + ", token: " + symbol);
                    switch (action[0]) {
                      case 1:
                        stack.push(symbol), vstack.push(this.lexer.yytext), lstack.push(this.lexer.yylloc), stack.push(action[1]), symbol = null, preErrorSymbol ? (symbol = preErrorSymbol, preErrorSymbol = null) : (yyleng = this.lexer.yyleng, yytext = this.lexer.yytext, yylineno = this.lexer.yylineno, yyloc = this.lexer.yylloc, recovering > 0 && recovering--);
                        break;
                      case 2:
                        len = this.productions_[action[1]][1], yyval.$ = vstack[vstack.length - len], yyval._$ = {
                            first_line: lstack[lstack.length - (len || 1)].first_line,
                            last_line: lstack[lstack.length - 1].last_line,
                            first_column: lstack[lstack.length - (len || 1)].first_column,
                            last_column: lstack[lstack.length - 1].last_column
                        }, ranges && (yyval._$.range = [ lstack[lstack.length - (len || 1)].range[0], lstack[lstack.length - 1].range[1] ]), r = this.performAction.call(yyval, yytext, yyleng, yylineno, this.yy, action[1], vstack, lstack);
                        if (typeof r != "undefined") return r;
                        len && (stack = stack.slice(0, -1 * len * 2), vstack = vstack.slice(0, -1 * len), lstack = lstack.slice(0, -1 * len)), stack.push(this.productions_[action[1]][0]), vstack.push(yyval.$), lstack.push(yyval._$), newState = table[stack[stack.length - 2]][stack[stack.length - 1]], stack.push(newState);
                        break;
                      case 3:
                        return !0;
                    }
                }
                return !0;
            }
        }, lexer = function() {
            var lexer = {
                EOF: 1,
                parseError: function parseError(str, hash) {
                    if (!this.yy.parser) throw new Error(str);
                    this.yy.parser.parseError(str, hash);
                },
                setInput: function(input) {
                    return this._input = input, this._more = this._less = this.done = !1, this.yylineno = this.yyleng = 0, this.yytext = this.matched = this.match = "", this.conditionStack = [ "INITIAL" ], this.yylloc = {
                        first_line: 1,
                        first_column: 0,
                        last_line: 1,
                        last_column: 0
                    }, this.options.ranges && (this.yylloc.range = [ 0, 0 ]), this.offset = 0, this;
                },
                input: function() {
                    var ch = this._input[0];
                    this.yytext += ch, this.yyleng++, this.offset++, this.match += ch, this.matched += ch;
                    var lines = ch.match(/(?:\r\n?|\n).*/g);
                    return lines ? (this.yylineno++, this.yylloc.last_line++) : this.yylloc.last_column++, this.options.ranges && this.yylloc.range[1]++, this._input = this._input.slice(1), ch;
                },
                unput: function(ch) {
                    var len = ch.length, lines = ch.split(/(?:\r\n?|\n)/g);
                    this._input = ch + this._input, this.yytext = this.yytext.substr(0, this.yytext.length - len - 1), this.offset -= len;
                    var oldLines = this.match.split(/(?:\r\n?|\n)/g);
                    this.match = this.match.substr(0, this.match.length - 1), this.matched = this.matched.substr(0, this.matched.length - 1), lines.length - 1 && (this.yylineno -= lines.length - 1);
                    var r = this.yylloc.range;
                    return this.yylloc = {
                        first_line: this.yylloc.first_line,
                        last_line: this.yylineno + 1,
                        first_column: this.yylloc.first_column,
                        last_column: lines ? (lines.length === oldLines.length ? this.yylloc.first_column : 0) + oldLines[oldLines.length - lines.length].length - lines[0].length : this.yylloc.first_column - len
                    }, this.options.ranges && (this.yylloc.range = [ r[0], r[0] + this.yyleng - len ]), this;
                },
                more: function() {
                    return this._more = !0, this;
                },
                less: function(n) {
                    this.unput(this.match.slice(n));
                },
                pastInput: function() {
                    var past = this.matched.substr(0, this.matched.length - this.match.length);
                    return (past.length > 20 ? "..." : "") + past.substr(-20).replace(/\n/g, "");
                },
                upcomingInput: function() {
                    var next = this.match;
                    return next.length < 20 && (next += this._input.substr(0, 20 - next.length)), (next.substr(0, 20) + (next.length > 20 ? "..." : "")).replace(/\n/g, "");
                },
                showPosition: function() {
                    var pre = this.pastInput(), c = (new Array(pre.length + 1)).join("-");
                    return pre + this.upcomingInput() + "\n" + c + "^";
                },
                next: function() {
                    if (this.done) return this.EOF;
                    this._input || (this.done = !0);
                    var token, match, tempMatch, index, col, lines;
                    this._more || (this.yytext = "", this.match = "");
                    var rules = this._currentRules();
                    for (var i = 0; i < rules.length; i++) {
                        tempMatch = this._input.match(this.rules[rules[i]]);
                        if (tempMatch && (!match || tempMatch[0].length > match[0].length)) {
                            match = tempMatch, index = i;
                            if (!this.options.flex) break;
                        }
                    }
                    if (match) {
                        lines = match[0].match(/(?:\r\n?|\n).*/g), lines && (this.yylineno += lines.length), this.yylloc = {
                            first_line: this.yylloc.last_line,
                            last_line: this.yylineno + 1,
                            first_column: this.yylloc.last_column,
                            last_column: lines ? lines[lines.length - 1].length - lines[lines.length - 1].match(/\r?\n?/)[0].length : this.yylloc.last_column + match[0].length
                        }, this.yytext += match[0], this.match += match[0], this.matches = match, this.yyleng = this.yytext.length, this.options.ranges && (this.yylloc.range = [ this.offset, this.offset += this.yyleng ]), this._more = !1, this._input = this._input.slice(match[0].length), this.matched += match[0], token = this.performAction.call(this, this.yy, this, rules[index], this.conditionStack[this.conditionStack.length - 1]), this.done && this._input && (this.done = !1);
                        if (token) return token;
                        return;
                    }
                    return this._input === "" ? this.EOF : this.parseError("Lexical error on line " + (this.yylineno + 1) + ". Unrecognized text.\n" + this.showPosition(), {
                        text: "",
                        token: null,
                        line: this.yylineno
                    });
                },
                lex: function lex() {
                    var r = this.next();
                    return typeof r != "undefined" ? r : this.lex();
                },
                begin: function begin(condition) {
                    this.conditionStack.push(condition);
                },
                popState: function popState() {
                    return this.conditionStack.pop();
                },
                _currentRules: function _currentRules() {
                    return this.conditions[this.conditionStack[this.conditionStack.length - 1]].rules;
                },
                topState: function() {
                    return this.conditionStack[this.conditionStack.length - 2];
                },
                pushState: function begin(condition) {
                    this.begin(condition);
                }
            };
            return lexer.options = {}, lexer.performAction = function anonymous(yy, yy_, $avoiding_name_collisions, YY_START) {
                var YYSTATE = YY_START;
                switch ($avoiding_name_collisions) {
                  case 0:
                    return yy_.yytext = "\\", 14;
                  case 1:
                    yy_.yytext.slice(-1) !== "\\" && this.begin("mu"), yy_.yytext.slice(-1) === "\\" && (yy_.yytext = yy_.yytext.substr(0, yy_.yyleng - 1), this.begin("emu"));
                    if (yy_.yytext) return 14;
                    break;
                  case 2:
                    return 14;
                  case 3:
                    return yy_.yytext.slice(-1) !== "\\" && this.popState(), yy_.yytext.slice(-1) === "\\" && (yy_.yytext = yy_.yytext.substr(0, yy_.yyleng - 1)), 14;
                  case 4:
                    return yy_.yytext = yy_.yytext.substr(0, yy_.yyleng - 4), this.popState(), 15;
                  case 5:
                    return 25;
                  case 6:
                    return 16;
                  case 7:
                    return 20;
                  case 8:
                    return 19;
                  case 9:
                    return 19;
                  case 10:
                    return 23;
                  case 11:
                    return 22;
                  case 12:
                    this.popState(), this.begin("com");
                    break;
                  case 13:
                    return yy_.yytext = yy_.yytext.substr(3, yy_.yyleng - 5), this.popState(), 15;
                  case 14:
                    return 22;
                  case 15:
                    return 37;
                  case 16:
                    return 36;
                  case 17:
                    return 36;
                  case 18:
                    return 40;
                  case 19:
                    break;
                  case 20:
                    return this.popState(), 24;
                  case 21:
                    return this.popState(), 18;
                  case 22:
                    return yy_.yytext = yy_.yytext.substr(1, yy_.yyleng - 2).replace(/\\"/g, '"'), 31;
                  case 23:
                    return yy_.yytext = yy_.yytext.substr(1, yy_.yyleng - 2).replace(/\\'/g, "'"), 31;
                  case 24:
                    return 38;
                  case 25:
                    return 33;
                  case 26:
                    return 33;
                  case 27:
                    return 32;
                  case 28:
                    return 36;
                  case 29:
                    return yy_.yytext = yy_.yytext.substr(1, yy_.yyleng - 2), 36;
                  case 30:
                    return "INVALID";
                  case 31:
                    return 5;
                }
            }, lexer.rules = [ /^(?:\\\\(?=(\{\{)))/, /^(?:[^\x00]*?(?=(\{\{)))/, /^(?:[^\x00]+)/, /^(?:[^\x00]{2,}?(?=(\{\{|$)))/, /^(?:[\s\S]*?--\}\})/, /^(?:\{\{>)/, /^(?:\{\{#)/, /^(?:\{\{\/)/, /^(?:\{\{\^)/, /^(?:\{\{\s*else\b)/, /^(?:\{\{\{)/, /^(?:\{\{&)/, /^(?:\{\{!--)/, /^(?:\{\{![\s\S]*?\}\})/, /^(?:\{\{)/, /^(?:=)/, /^(?:\.(?=[}\/ ]))/, /^(?:\.\.)/, /^(?:[\/.])/, /^(?:\s+)/, /^(?:\}\}\})/, /^(?:\}\})/, /^(?:"(\\["]|[^"])*")/, /^(?:'(\\[']|[^'])*')/, /^(?:@)/, /^(?:true(?=[}\s]))/, /^(?:false(?=[}\s]))/, /^(?:-?[0-9]+(?=[}\s]))/, /^(?:[^\s!"#%-,\.\/;->@\[-\^`\{-~]+(?=[=}\s\/.]))/, /^(?:\[[^\]]*\])/, /^(?:.)/, /^(?:$)/ ], lexer.conditions = {
                mu: {
                    rules: [ 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31 ],
                    inclusive: !1
                },
                emu: {
                    rules: [ 3 ],
                    inclusive: !1
                },
                com: {
                    rules: [ 4 ],
                    inclusive: !1
                },
                INITIAL: {
                    rules: [ 0, 1, 2, 31 ],
                    inclusive: !0
                }
            }, lexer;
        }();
        parser.lexer = lexer;
        function Parser() {
            this.yy = {};
        }
        return Parser.prototype = parser, parser.Parser = Parser, new Parser;
    }();
    Handlebars.Parser = handlebars, Handlebars.parse = function(input) {
        return input.constructor === Handlebars.AST.ProgramNode ? input : (Handlebars.Parser.yy = Handlebars.AST, Handlebars.Parser.parse(input));
    }, Handlebars.AST = {}, Handlebars.AST.ProgramNode = function(statements, inverse) {
        this.type = "program", this.statements = statements, inverse && (this.inverse = new Handlebars.AST.ProgramNode(inverse));
    }, Handlebars.AST.MustacheNode = function(rawParams, hash, unescaped) {
        this.type = "mustache", this.escaped = !unescaped, this.hash = hash;
        var id = this.id = rawParams[0], params = this.params = rawParams.slice(1), eligibleHelper = this.eligibleHelper = id.isSimple;
        this.isHelper = eligibleHelper && (params.length || hash);
    }, Handlebars.AST.PartialNode = function(partialName, context) {
        this.type = "partial", this.partialName = partialName, this.context = context;
    }, Handlebars.AST.BlockNode = function(mustache, program, inverse, close) {
        var verifyMatch = function(open, close) {
            if (open.original !== close.original) throw new Handlebars.Exception(open.original + " doesn't match " + close.original);
        };
        verifyMatch(mustache.id, close), this.type = "block", this.mustache = mustache, this.program = program, this.inverse = inverse, this.inverse && !this.program && (this.isInverse = !0);
    }, Handlebars.AST.ContentNode = function(string) {
        this.type = "content", this.string = string;
    }, Handlebars.AST.HashNode = function(pairs) {
        this.type = "hash", this.pairs = pairs;
    }, Handlebars.AST.IdNode = function(parts) {
        this.type = "ID";
        var original = "", dig = [], depth = 0;
        for (var i = 0, l = parts.length; i < l; i++) {
            var part = parts[i].part;
            original += (parts[i].separator || "") + part;
            if (part === ".." || part === "." || part === "this") {
                if (dig.length > 0) throw new Handlebars.Exception("Invalid path: " + original);
                part === ".." ? depth++ : this.isScoped = !0;
            } else dig.push(part);
        }
        this.original = original, this.parts = dig, this.string = dig.join("."), this.depth = depth, this.isSimple = parts.length === 1 && !this.isScoped && depth === 0, this.stringModeValue = this.string;
    }, Handlebars.AST.PartialNameNode = function(name) {
        this.type = "PARTIAL_NAME", this.name = name.original;
    }, Handlebars.AST.DataNode = function(id) {
        this.type = "DATA", this.id = id;
    }, Handlebars.AST.StringNode = function(string) {
        this.type = "STRING", this.original = this.string = this.stringModeValue = string;
    }, Handlebars.AST.IntegerNode = function(integer) {
        this.type = "INTEGER", this.original = this.integer = integer, this.stringModeValue = Number(integer);
    }, Handlebars.AST.BooleanNode = function(bool) {
        this.type = "BOOLEAN", this.bool = bool, this.stringModeValue = bool === "true";
    }, Handlebars.AST.CommentNode = function(comment) {
        this.type = "comment", this.comment = comment;
    };
    var errorProps = [ "description", "fileName", "lineNumber", "message", "name", "number", "stack" ];
    Handlebars.Exception = function(message) {
        var tmp = Error.prototype.constructor.apply(this, arguments);
        for (var idx = 0; idx < errorProps.length; idx++) this[errorProps[idx]] = tmp[errorProps[idx]];
    }, Handlebars.Exception.prototype = new Error, Handlebars.SafeString = function(string) {
        this.string = string;
    }, Handlebars.SafeString.prototype.toString = function() {
        return this.string.toString();
    };
    var escape = {
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#x27;",
        "`": "&#x60;"
    }, badChars = /[&<>"'`]/g, possible = /[&<>"'`]/, escapeChar = function(chr) {
        return escape[chr] || "&amp;";
    };
    Handlebars.Utils = {
        extend: function(obj, value) {
            for (var key in value) value.hasOwnProperty(key) && (obj[key] = value[key]);
        },
        escapeExpression: function(string) {
            return string instanceof Handlebars.SafeString ? string.toString() : string == null || string === !1 ? "" : (string = string.toString(), possible.test(string) ? string.replace(badChars, escapeChar) : string);
        },
        isEmpty: function(value) {
            return !value && value !== 0 ? !0 : toString.call(value) === "[object Array]" && value.length === 0 ? !0 : !1;
        }
    };
    var Compiler = Handlebars.Compiler = function() {}, JavaScriptCompiler = Handlebars.JavaScriptCompiler = function() {};
    Compiler.prototype = {
        compiler: Compiler,
        disassemble: function() {
            var opcodes = this.opcodes, opcode, out = [], params, param;
            for (var i = 0, l = opcodes.length; i < l; i++) {
                opcode = opcodes[i];
                if (opcode.opcode === "DECLARE") out.push("DECLARE " + opcode.name + "=" + opcode.value); else {
                    params = [];
                    for (var j = 0; j < opcode.args.length; j++) param = opcode.args[j], typeof param == "string" && (param = '"' + param.replace("\n", "\\n") + '"'), params.push(param);
                    out.push(opcode.opcode + " " + params.join(" "));
                }
            }
            return out.join("\n");
        },
        equals: function(other) {
            var len = this.opcodes.length;
            if (other.opcodes.length !== len) return !1;
            for (var i = 0; i < len; i++) {
                var opcode = this.opcodes[i], otherOpcode = other.opcodes[i];
                if (opcode.opcode !== otherOpcode.opcode || opcode.args.length !== otherOpcode.args.length) return !1;
                for (var j = 0; j < opcode.args.length; j++) if (opcode.args[j] !== otherOpcode.args[j]) return !1;
            }
            len = this.children.length;
            if (other.children.length !== len) return !1;
            for (i = 0; i < len; i++) if (!this.children[i].equals(other.children[i])) return !1;
            return !0;
        },
        guid: 0,
        compile: function(program, options) {
            this.children = [], this.depths = {
                list: []
            }, this.options = options;
            var knownHelpers = this.options.knownHelpers;
            this.options.knownHelpers = {
                helperMissing: !0,
                blockHelperMissing: !0,
                each: !0,
                "if": !0,
                unless: !0,
                "with": !0,
                log: !0
            };
            if (knownHelpers) for (var name in knownHelpers) this.options.knownHelpers[name] = knownHelpers[name];
            return this.program(program);
        },
        accept: function(node) {
            return this[node.type](node);
        },
        program: function(program) {
            var statements = program.statements, statement;
            this.opcodes = [];
            for (var i = 0, l = statements.length; i < l; i++) statement = statements[i], this[statement.type](statement);
            return this.isSimple = l === 1, this.depths.list = this.depths.list.sort(function(a, b) {
                return a - b;
            }), this;
        },
        compileProgram: function(program) {
            var result = (new this.compiler).compile(program, this.options), guid = this.guid++, depth;
            this.usePartial = this.usePartial || result.usePartial, this.children[guid] = result;
            for (var i = 0, l = result.depths.list.length; i < l; i++) {
                depth = result.depths.list[i];
                if (depth < 2) continue;
                this.addDepth(depth - 1);
            }
            return guid;
        },
        block: function(block) {
            var mustache = block.mustache, program = block.program, inverse = block.inverse;
            program && (program = this.compileProgram(program)), inverse && (inverse = this.compileProgram(inverse));
            var type = this.classifyMustache(mustache);
            type === "helper" ? this.helperMustache(mustache, program, inverse) : type === "simple" ? (this.simpleMustache(mustache), this.opcode("pushProgram", program), this.opcode("pushProgram", inverse), this.opcode("emptyHash"), this.opcode("blockValue")) : (this.ambiguousMustache(mustache, program, inverse), this.opcode("pushProgram", program), this.opcode("pushProgram", inverse), this.opcode("emptyHash"), this.opcode("ambiguousBlockValue")), this.opcode("append");
        },
        hash: function(hash) {
            var pairs = hash.pairs, pair, val;
            this.opcode("pushHash");
            for (var i = 0, l = pairs.length; i < l; i++) pair = pairs[i], val = pair[1], this.options.stringParams ? (val.depth && this.addDepth(val.depth), this.opcode("getContext", val.depth || 0), this.opcode("pushStringParam", val.stringModeValue, val.type)) : this.accept(val), this.opcode("assignToHash", pair[0]);
            this.opcode("popHash");
        },
        partial: function(partial) {
            var partialName = partial.partialName;
            this.usePartial = !0, partial.context ? this.ID(partial.context) : this.opcode("push", "depth0"), this.opcode("invokePartial", partialName.name), this.opcode("append");
        },
        content: function(content) {
            this.opcode("appendContent", content.string);
        },
        mustache: function(mustache) {
            var options = this.options, type = this.classifyMustache(mustache);
            type === "simple" ? this.simpleMustache(mustache) : type === "helper" ? this.helperMustache(mustache) : this.ambiguousMustache(mustache), mustache.escaped && !options.noEscape ? this.opcode("appendEscaped") : this.opcode("append");
        },
        ambiguousMustache: function(mustache, program, inverse) {
            var id = mustache.id, name = id.parts[0], isBlock = program != null || inverse != null;
            this.opcode("getContext", id.depth), this.opcode("pushProgram", program), this.opcode("pushProgram", inverse), this.opcode("invokeAmbiguous", name, isBlock);
        },
        simpleMustache: function(mustache) {
            var id = mustache.id;
            id.type === "DATA" ? this.DATA(id) : id.parts.length ? this.ID(id) : (this.addDepth(id.depth), this.opcode("getContext", id.depth), this.opcode("pushContext")), this.opcode("resolvePossibleLambda");
        },
        helperMustache: function(mustache, program, inverse) {
            var params = this.setupFullMustacheParams(mustache, program, inverse), name = mustache.id.parts[0];
            if (this.options.knownHelpers[name]) this.opcode("invokeKnownHelper", params.length, name); else {
                if (this.options.knownHelpersOnly) throw new Error("You specified knownHelpersOnly, but used the unknown helper " + name);
                this.opcode("invokeHelper", params.length, name);
            }
        },
        ID: function(id) {
            this.addDepth(id.depth), this.opcode("getContext", id.depth);
            var name = id.parts[0];
            name ? this.opcode("lookupOnContext", id.parts[0]) : this.opcode("pushContext");
            for (var i = 1, l = id.parts.length; i < l; i++) this.opcode("lookup", id.parts[i]);
        },
        DATA: function(data) {
            this.options.data = !0;
            if (data.id.isScoped || data.id.depth) throw new Handlebars.Exception("Scoped data references are not supported: " + data.original);
            this.opcode("lookupData");
            var parts = data.id.parts;
            for (var i = 0, l = parts.length; i < l; i++) this.opcode("lookup", parts[i]);
        },
        STRING: function(string) {
            this.opcode("pushString", string.string);
        },
        INTEGER: function(integer) {
            this.opcode("pushLiteral", integer.integer);
        },
        BOOLEAN: function(bool) {
            this.opcode("pushLiteral", bool.bool);
        },
        comment: function() {},
        opcode: function(name) {
            this.opcodes.push({
                opcode: name,
                args: [].slice.call(arguments, 1)
            });
        },
        declare: function(name, value) {
            this.opcodes.push({
                opcode: "DECLARE",
                name: name,
                value: value
            });
        },
        addDepth: function(depth) {
            if (isNaN(depth)) throw new Error("EWOT");
            if (depth === 0) return;
            this.depths[depth] || (this.depths[depth] = !0, this.depths.list.push(depth));
        },
        classifyMustache: function(mustache) {
            var isHelper = mustache.isHelper, isEligible = mustache.eligibleHelper, options = this.options;
            if (isEligible && !isHelper) {
                var name = mustache.id.parts[0];
                options.knownHelpers[name] ? isHelper = !0 : options.knownHelpersOnly && (isEligible = !1);
            }
            return isHelper ? "helper" : isEligible ? "ambiguous" : "simple";
        },
        pushParams: function(params) {
            var i = params.length, param;
            while (i--) param = params[i], this.options.stringParams ? (param.depth && this.addDepth(param.depth), this.opcode("getContext", param.depth || 0), this.opcode("pushStringParam", param.stringModeValue, param.type)) : this[param.type](param);
        },
        setupMustacheParams: function(mustache) {
            var params = mustache.params;
            return this.pushParams(params), mustache.hash ? this.hash(mustache.hash) : this.opcode("emptyHash"), params;
        },
        setupFullMustacheParams: function(mustache, program, inverse) {
            var params = mustache.params;
            return this.pushParams(params), this.opcode("pushProgram", program), this.opcode("pushProgram", inverse), mustache.hash ? this.hash(mustache.hash) : this.opcode("emptyHash"), params;
        }
    };
    var Literal = function(value) {
        this.value = value;
    };
    JavaScriptCompiler.prototype = {
        nameLookup: function(parent, name) {
            return /^[0-9]+$/.test(name) ? parent + "[" + name + "]" : JavaScriptCompiler.isValidJavaScriptVariableName(name) ? parent + "." + name : parent + "['" + name + "']";
        },
        appendToBuffer: function(string) {
            return this.environment.isSimple ? "return " + string + ";" : {
                appendToBuffer: !0,
                content: string,
                toString: function() {
                    return "buffer += " + string + ";";
                }
            };
        },
        initializeBuffer: function() {
            return this.quotedString("");
        },
        namespace: "Handlebars",
        compile: function(environment, options, context, asObject) {
            this.environment = environment, this.options = options || {}, Handlebars.log(Handlebars.logger.DEBUG, this.environment.disassemble() + "\n\n"), this.name = this.environment.name, this.isChild = !!context, this.context = context || {
                programs: [],
                environments: [],
                aliases: {}
            }, this.preamble(), this.stackSlot = 0, this.stackVars = [], this.registers = {
                list: []
            }, this.compileStack = [], this.inlineStack = [], this.compileChildren(environment, options);
            var opcodes = environment.opcodes, opcode;
            this.i = 0;
            for (l = opcodes.length; this.i < l; this.i++) opcode = opcodes[this.i], opcode.opcode === "DECLARE" ? this[opcode.name] = opcode.value : this[opcode.opcode].apply(this, opcode.args);
            return this.createFunctionContext(asObject);
        },
        nextOpcode: function() {
            var opcodes = this.environment.opcodes;
            return opcodes[this.i + 1];
        },
        eat: function() {
            this.i = this.i + 1;
        },
        preamble: function() {
            var out = [];
            if (!this.isChild) {
                var namespace = this.namespace, copies = "helpers = this.merge(helpers, " + namespace + ".helpers);";
                this.environment.usePartial && (copies = copies + " partials = this.merge(partials, " + namespace + ".partials);"), this.options.data && (copies += " data = data || {};"), out.push(copies);
            } else out.push("");
            this.environment.isSimple ? out.push("") : out.push(", buffer = " + this.initializeBuffer()), this.lastContext = 0, this.source = out;
        },
        createFunctionContext: function(asObject) {
            var locals = this.stackVars.concat(this.registers.list);
            locals.length > 0 && (this.source[1] = this.source[1] + ", " + locals.join(", "));
            if (!this.isChild) for (var alias in this.context.aliases) this.context.aliases.hasOwnProperty(alias) && (this.source[1] = this.source[1] + ", " + alias + "=" + this.context.aliases[alias]);
            this.source[1] && (this.source[1] = "var " + this.source[1].substring(2) + ";"), this.isChild || (this.source[1] += "\n" + this.context.programs.join("\n") + "\n"), this.environment.isSimple || this.source.push("return buffer;");
            var params = this.isChild ? [ "depth0", "data" ] : [ "Handlebars", "depth0", "helpers", "partials", "data" ];
            for (var i = 0, l = this.environment.depths.list.length; i < l; i++) params.push("depth" + this.environment.depths.list[i]);
            var source = this.mergeSource();
            if (!this.isChild) {
                var revision = Handlebars.COMPILER_REVISION, versions = Handlebars.REVISION_CHANGES[revision];
                source = "this.compilerInfo = [" + revision + ",'" + versions + "'];\n" + source;
            }
            if (asObject) return params.push(source), Function.apply(this, params);
            var functionSource = "function " + (this.name || "") + "(" + params.join(",") + ") {\n  " + source + "}";
            return Handlebars.log(Handlebars.logger.DEBUG, functionSource + "\n\n"), functionSource;
        },
        mergeSource: function() {
            var source = "", buffer;
            for (var i = 0, len = this.source.length; i < len; i++) {
                var line = this.source[i];
                line.appendToBuffer ? buffer ? buffer = buffer + "\n    + " + line.content : buffer = line.content : (buffer && (source += "buffer += " + buffer + ";\n  ", buffer = undefined), source += line + "\n  ");
            }
            return source;
        },
        blockValue: function() {
            this.context.aliases.blockHelperMissing = "helpers.blockHelperMissing";
            var params = [ "depth0" ];
            this.setupParams(0, params), this.replaceStack(function(current) {
                return params.splice(1, 0, current), "blockHelperMissing.call(" + params.join(", ") + ")";
            });
        },
        ambiguousBlockValue: function() {
            this.context.aliases.blockHelperMissing = "helpers.blockHelperMissing";
            var params = [ "depth0" ];
            this.setupParams(0, params);
            var current = this.topStack();
            params.splice(1, 0, current), params[params.length - 1] = "options", this.source.push("if (!" + this.lastHelper + ") { " + current + " = blockHelperMissing.call(" + params.join(", ") + "); }");
        },
        appendContent: function(content) {
            this.source.push(this.appendToBuffer(this.quotedString(content)));
        },
        append: function() {
            this.flushInline();
            var local = this.popStack();
            this.source.push("if(" + local + " || " + local + " === 0) { " + this.appendToBuffer(local) + " }"), this.environment.isSimple && this.source.push("else { " + this.appendToBuffer("''") + " }");
        },
        appendEscaped: function() {
            this.context.aliases.escapeExpression = "this.escapeExpression", this.source.push(this.appendToBuffer("escapeExpression(" + this.popStack() + ")"));
        },
        getContext: function(depth) {
            this.lastContext !== depth && (this.lastContext = depth);
        },
        lookupOnContext: function(name) {
            this.push(this.nameLookup("depth" + this.lastContext, name, "context"));
        },
        pushContext: function() {
            this.pushStackLiteral("depth" + this.lastContext);
        },
        resolvePossibleLambda: function() {
            this.context.aliases.functionType = '"function"', this.replaceStack(function(current) {
                return "typeof " + current + " === functionType ? " + current + ".apply(depth0) : " + current;
            });
        },
        lookup: function(name) {
            this.replaceStack(function(current) {
                return current + " == null || " + current + " === false ? " + current + " : " + this.nameLookup(current, name, "context");
            });
        },
        lookupData: function(id) {
            this.push("data");
        },
        pushStringParam: function(string, type) {
            this.pushStackLiteral("depth" + this.lastContext), this.pushString(type), typeof string == "string" ? this.pushString(string) : this.pushStackLiteral(string);
        },
        emptyHash: function() {
            this.pushStackLiteral("{}"), this.options.stringParams && (this.register("hashTypes", "{}"), this.register("hashContexts", "{}"));
        },
        pushHash: function() {
            this.hash = {
                values: [],
                types: [],
                contexts: []
            };
        },
        popHash: function() {
            var hash = this.hash;
            this.hash = undefined, this.options.stringParams && (this.register("hashContexts", "{" + hash.contexts.join(",") + "}"), this.register("hashTypes", "{" + hash.types.join(",") + "}")), this.push("{\n    " + hash.values.join(",\n    ") + "\n  }");
        },
        pushString: function(string) {
            this.pushStackLiteral(this.quotedString(string));
        },
        push: function(expr) {
            return this.inlineStack.push(expr), expr;
        },
        pushLiteral: function(value) {
            this.pushStackLiteral(value);
        },
        pushProgram: function(guid) {
            guid != null ? this.pushStackLiteral(this.programExpression(guid)) : this.pushStackLiteral(null);
        },
        invokeHelper: function(paramSize, name) {
            this.context.aliases.helperMissing = "helpers.helperMissing";
            var helper = this.lastHelper = this.setupHelper(paramSize, name, !0), nonHelper = this.nameLookup("depth" + this.lastContext, name, "context");
            this.push(helper.name + " || " + nonHelper), this.replaceStack(function(name) {
                return name + " ? " + name + ".call(" + helper.callParams + ") " + ": helperMissing.call(" + helper.helperMissingParams + ")";
            });
        },
        invokeKnownHelper: function(paramSize, name) {
            var helper = this.setupHelper(paramSize, name);
            this.push(helper.name + ".call(" + helper.callParams + ")");
        },
        invokeAmbiguous: function(name, helperCall) {
            this.context.aliases.functionType = '"function"', this.pushStackLiteral("{}");
            var helper = this.setupHelper(0, name, helperCall), helperName = this.lastHelper = this.nameLookup("helpers", name, "helper"), nonHelper = this.nameLookup("depth" + this.lastContext, name, "context"), nextStack = this.nextStack();
            this.source.push("if (" + nextStack + " = " + helperName + ") { " + nextStack + " = " + nextStack + ".call(" + helper.callParams + "); }"), this.source.push("else { " + nextStack + " = " + nonHelper + "; " + nextStack + " = typeof " + nextStack + " === functionType ? " + nextStack + ".apply(depth0) : " + nextStack + "; }");
        },
        invokePartial: function(name) {
            var params = [ this.nameLookup("partials", name, "partial"), "'" + name + "'", this.popStack(), "helpers", "partials" ];
            this.options.data && params.push("data"), this.context.aliases.self = "this", this.push("self.invokePartial(" + params.join(", ") + ")");
        },
        assignToHash: function(key) {
            var value = this.popStack(), context, type;
            this.options.stringParams && (type = this.popStack(), context = this.popStack());
            var hash = this.hash;
            context && hash.contexts.push("'" + key + "': " + context), type && hash.types.push("'" + key + "': " + type), hash.values.push("'" + key + "': (" + value + ")");
        },
        compiler: JavaScriptCompiler,
        compileChildren: function(environment, options) {
            var children = environment.children, child, compiler;
            for (var i = 0, l = children.length; i < l; i++) {
                child = children[i], compiler = new this.compiler;
                var index = this.matchExistingProgram(child);
                index == null ? (this.context.programs.push(""), index = this.context.programs.length, child.index = index, child.name = "program" + index, this.context.programs[index] = compiler.compile(child, options, this.context), this.context.environments[index] = child) : (child.index = index, child.name = "program" + index);
            }
        },
        matchExistingProgram: function(child) {
            for (var i = 0, len = this.context.environments.length; i < len; i++) {
                var environment = this.context.environments[i];
                if (environment && environment.equals(child)) return i;
            }
        },
        programExpression: function(guid) {
            this.context.aliases.self = "this";
            if (guid == null) return "self.noop";
            var child = this.environment.children[guid], depths = child.depths.list, depth, programParams = [ child.index, child.name, "data" ];
            for (var i = 0, l = depths.length; i < l; i++) depth = depths[i], depth === 1 ? programParams.push("depth0") : programParams.push("depth" + (depth - 1));
            return (depths.length === 0 ? "self.program(" : "self.programWithDepth(") + programParams.join(", ") + ")";
        },
        register: function(name, val) {
            this.useRegister(name), this.source.push(name + " = " + val + ";");
        },
        useRegister: function(name) {
            this.registers[name] || (this.registers[name] = !0, this.registers.list.push(name));
        },
        pushStackLiteral: function(item) {
            return this.push(new Literal(item));
        },
        pushStack: function(item) {
            this.flushInline();
            var stack = this.incrStack();
            return item && this.source.push(stack + " = " + item + ";"), this.compileStack.push(stack), stack;
        },
        replaceStack: function(callback) {
            var prefix = "", inline = this.isInline(), stack;
            if (inline) {
                var top = this.popStack(!0);
                if (top instanceof Literal) stack = top.value; else {
                    var name = this.stackSlot ? this.topStackName() : this.incrStack();
                    prefix = "(" + this.push(name) + " = " + top + "),", stack = this.topStack();
                }
            } else stack = this.topStack();
            var item = callback.call(this, stack);
            return inline ? ((this.inlineStack.length || this.compileStack.length) && this.popStack(), this.push("(" + prefix + item + ")")) : (/^stack/.test(stack) || (stack = this.nextStack()), this.source.push(stack + " = (" + prefix + item + ");")), stack;
        },
        nextStack: function() {
            return this.pushStack();
        },
        incrStack: function() {
            return this.stackSlot++, this.stackSlot > this.stackVars.length && this.stackVars.push("stack" + this.stackSlot), this.topStackName();
        },
        topStackName: function() {
            return "stack" + this.stackSlot;
        },
        flushInline: function() {
            var inlineStack = this.inlineStack;
            if (inlineStack.length) {
                this.inlineStack = [];
                for (var i = 0, len = inlineStack.length; i < len; i++) {
                    var entry = inlineStack[i];
                    entry instanceof Literal ? this.compileStack.push(entry) : this.pushStack(entry);
                }
            }
        },
        isInline: function() {
            return this.inlineStack.length;
        },
        popStack: function(wrapped) {
            var inline = this.isInline(), item = (inline ? this.inlineStack : this.compileStack).pop();
            return !wrapped && item instanceof Literal ? item.value : (inline || this.stackSlot--, item);
        },
        topStack: function(wrapped) {
            var stack = this.isInline() ? this.inlineStack : this.compileStack, item = stack[stack.length - 1];
            return !wrapped && item instanceof Literal ? item.value : item;
        },
        quotedString: function(str) {
            return '"' + str.replace(/\\/g, "\\\\").replace(/"/g, '\\"').replace(/\n/g, "\\n").replace(/\r/g, "\\r").replace(/\u2028/g, "\\u2028").replace(/\u2029/g, "\\u2029") + '"';
        },
        setupHelper: function(paramSize, name, missingParams) {
            var params = [];
            this.setupParams(paramSize, params, missingParams);
            var foundHelper = this.nameLookup("helpers", name, "helper");
            return {
                params: params,
                name: foundHelper,
                callParams: [ "depth0" ].concat(params).join(", "),
                helperMissingParams: missingParams && [ "depth0", this.quotedString(name) ].concat(params).join(", ")
            };
        },
        setupParams: function(paramSize, params, useRegister) {
            var options = [], contexts = [], types = [], param, inverse, program;
            options.push("hash:" + this.popStack()), inverse = this.popStack(), program = this.popStack();
            if (program || inverse) program || (this.context.aliases.self = "this", program = "self.noop"), inverse || (this.context.aliases.self = "this", inverse = "self.noop"), options.push("inverse:" + inverse), options.push("fn:" + program);
            for (var i = 0; i < paramSize; i++) param = this.popStack(), params.push(param), this.options.stringParams && (types.push(this.popStack()), contexts.push(this.popStack()));
            return this.options.stringParams && (options.push("contexts:[" + contexts.join(",") + "]"), options.push("types:[" + types.join(",") + "]"), options.push("hashContexts:hashContexts"), options.push("hashTypes:hashTypes")), this.options.data && options.push("data:data"), options = "{" + options.join(",") + "}", useRegister ? (this.register("options", options), params.push("options")) : params.push(options), params.join(", ");
        }
    };
    var reservedWords = "break else new var case finally return void catch for switch while continue function this with default if throw delete in try do instanceof typeof abstract enum int short boolean export interface static byte extends long super char final native synchronized class float package throws const goto private transient debugger implements protected volatile double import public let yield".split(" "), compilerWords = JavaScriptCompiler.RESERVED_WORDS = {};
    for (var i = 0, l = reservedWords.length; i < l; i++) compilerWords[reservedWords[i]] = !0;
    JavaScriptCompiler.isValidJavaScriptVariableName = function(name) {
        return !JavaScriptCompiler.RESERVED_WORDS[name] && /^[a-zA-Z_$][0-9a-zA-Z_$]+$/.test(name) ? !0 : !1;
    }, Handlebars.precompile = function(input, options) {
        if (input == null || typeof input != "string" && input.constructor !== Handlebars.AST.ProgramNode) throw new Handlebars.Exception("You must pass a string or Handlebars AST to Handlebars.precompile. You passed " + input);
        options = options || {}, "data" in options || (options.data = !0);
        var ast = Handlebars.parse(input), environment = (new Compiler).compile(ast, options);
        return (new JavaScriptCompiler).compile(environment, options);
    }, Handlebars.compile = function(input, options) {
        if (input == null || typeof input != "string" && input.constructor !== Handlebars.AST.ProgramNode) throw new Handlebars.Exception("You must pass a string or Handlebars AST to Handlebars.compile. You passed " + input);
        options = options || {}, "data" in options || (options.data = !0);
        var compiled;
        function compile() {
            var ast = Handlebars.parse(input), environment = (new Compiler).compile(ast, options), templateSpec = (new JavaScriptCompiler).compile(environment, options, undefined, !0);
            return Handlebars.template(templateSpec);
        }
        return function(context, options) {
            return compiled || (compiled = compile()), compiled.call(this, context, options);
        };
    }, Handlebars.VM = {
        template: function(templateSpec) {
            var container = {
                escapeExpression: Handlebars.Utils.escapeExpression,
                invokePartial: Handlebars.VM.invokePartial,
                programs: [],
                program: function(i, fn, data) {
                    var programWrapper = this.programs[i];
                    return data ? programWrapper = Handlebars.VM.program(i, fn, data) : programWrapper || (programWrapper = this.programs[i] = Handlebars.VM.program(i, fn)), programWrapper;
                },
                merge: function(param, common) {
                    var ret = param || common;
                    return param && common && (ret = {}, Handlebars.Utils.extend(ret, common), Handlebars.Utils.extend(ret, param)), ret;
                },
                programWithDepth: Handlebars.VM.programWithDepth,
                noop: Handlebars.VM.noop,
                compilerInfo: null
            };
            return function(context, options) {
                options = options || {};
                var result = templateSpec.call(container, Handlebars, context, options.helpers, options.partials, options.data), compilerInfo = container.compilerInfo || [], compilerRevision = compilerInfo[0] || 1, currentRevision = Handlebars.COMPILER_REVISION;
                if (compilerRevision !== currentRevision) {
                    if (compilerRevision < currentRevision) {
                        var runtimeVersions = Handlebars.REVISION_CHANGES[currentRevision], compilerVersions = Handlebars.REVISION_CHANGES[compilerRevision];
                        throw "Template was precompiled with an older version of Handlebars than the current runtime. Please update your precompiler to a newer version (" + runtimeVersions + ") or downgrade your runtime to an older version (" + compilerVersions + ").";
                    }
                    throw "Template was precompiled with a newer version of Handlebars than the current runtime. Please update your runtime to a newer version (" + compilerInfo[1] + ").";
                }
                return result;
            };
        },
        programWithDepth: function(i, fn, data) {
            var args = Array.prototype.slice.call(arguments, 3), program = function(context, options) {
                return options = options || {}, fn.apply(this, [ context, options.data || data ].concat(args));
            };
            return program.program = i, program.depth = args.length, program;
        },
        program: function(i, fn, data) {
            var program = function(context, options) {
                return options = options || {}, fn(context, options.data || data);
            };
            return program.program = i, program.depth = 0, program;
        },
        noop: function() {
            return "";
        },
        invokePartial: function(partial, name, context, helpers, partials, data) {
            var options = {
                helpers: helpers,
                partials: partials,
                data: data
            };
            if (partial === undefined) throw new Handlebars.Exception("The partial " + name + " could not be found");
            if (partial instanceof Function) return partial(context, options);
            if (!Handlebars.compile) throw new Handlebars.Exception("The partial " + name + " could not be compiled when running in runtime-only mode");
            return partials[name] = Handlebars.compile(partial, {
                data: data !== undefined
            }), partials[name](context, options);
        }
    }, Handlebars.template = Handlebars.VM.template;
}(Handlebars), define("handlebars", function(global) {
    return function() {
        var ret, fn;
        return ret || global.Handlebars;
    };
}(this)), function() {
    var k = [ "Msxml2.XMLHTTP", "Microsoft.XMLHTTP", "Msxml2.XMLHTTP.4.0" ], m = /^\s*<\?xml(\s)+version=[\'\"](\d)*.(\d)*[\'\"](\s)*\?>/im, n = /<body[^>]*>\s*([\s\S]+)\s*<\/body>/im, i = typeof location != "undefined" && location.href, o = i && location.protocol && location.protocol.replace(/\:/, ""), p = i && location.hostname, q = i && (location.port || void 0), j = [];
    define("text", [], function() {
        var e, l;
        return e = {
            version: "1.0.8",
            strip: function(a) {
                if (a) {
                    var a = a.replace(m, ""), c = a.match(n);
                    c && (a = c[1]);
                } else a = "";
                return a;
            },
            jsEscape: function(a) {
                return a.replace(/(['\\])/g, "\\$1").replace(/[\f]/g, "\\f").replace(/[\b]/g, "\\b").replace(/[\n]/g, "\\n").replace(/[\t]/g, "\\t").replace(/[\r]/g, "\\r");
            },
            createXhr: function() {
                var a, c, b;
                if (typeof XMLHttpRequest != "undefined") return new XMLHttpRequest;
                if (typeof ActiveXObject != "undefined") for (c = 0; c < 3; c++) {
                    b = k[c];
                    try {
                        a = new ActiveXObject(b);
                    } catch (f) {}
                    if (a) {
                        k = [ b ];
                        break;
                    }
                }
                return a;
            },
            parseName: function(a) {
                var c = !1, b = a.indexOf("."), f = a.substring(0, b), a = a.substring(b + 1, a.length), b = a.indexOf("!");
                return b !== -1 && (c = a.substring(b + 1, a.length), c = c === "strip", a = a.substring(0, b)), {
                    moduleName: f,
                    ext: a,
                    strip: c
                };
            },
            xdRegExp: /^((\w+)\:)?\/\/([^\/\\]+)/,
            useXhr: function(a, c, b, f) {
                var d = e.xdRegExp.exec(a), g;
                return d ? (a = d[2], d = d[3], d = d.split(":"), g = d[1], d = d[0], (!a || a === c) && (!d || d === b) && (!g && !d || g === f)) : !0;
            },
            finishLoad: function(a, c, b, f, d) {
                b = c ? e.strip(b) : b, d.isBuild && (j[a] = b), f(b);
            },
            load: function(a, c, b, f) {
                if (f.isBuild && !f.inlineText) b(); else {
                    var d = e.parseName(a), g = d.moduleName + "." + d.ext, h = c.toUrl(g), r = f && f.text && f.text.useXhr || e.useXhr;
                    !i || r(h, o, p, q) ? e.get(h, function(c) {
                        e.finishLoad(a, d.strip, c, b, f);
                    }) : c([ g ], function(a) {
                        e.finishLoad(d.moduleName + "." + d.ext, d.strip, a, b, f);
                    });
                }
            },
            write: function(a, c, b) {
                if (j.hasOwnProperty(c)) {
                    var f = e.jsEscape(j[c]);
                    b.asModule(a + "!" + c, "define(function () { return '" + f + "';});\n");
                }
            },
            writeFile: function(a, c, b, f, d) {
                var c = e.parseName(c), g = c.moduleName + "." + c.ext, h = b.toUrl(c.moduleName + "." + c.ext) + ".js";
                e.load(g, b, function() {
                    var b = function(a) {
                        return f(h, a);
                    };
                    b.asModule = function(a, b) {
                        return f.asModule(a, h, b);
                    }, e.write(a, g, b, d);
                }, d);
            }
        }, e.createXhr() ? e.get = function(a, c) {
            var b = e.createXhr();
            b.open("GET", a, !0), b.onreadystatechange = function() {
                b.readyState === 4 && c(b.responseText);
            }, b.send(null);
        } : typeof process != "undefined" && process.versions && process.versions.node ? (l = require.nodeRequire("fs"), e.get = function(a, c) {
            var b = l.readFileSync(a, "utf8");
            b.indexOf("﻿") === 0 && (b = b.substring(1)), c(b);
        }) : typeof Packages != "undefined" && (e.get = function(a, c) {
            var b = new java.io.File(a), f = java.lang.System.getProperty("line.separator"), b = new java.io.BufferedReader(new java.io.InputStreamReader(new java.io.FileInputStream(b), "utf-8")), d, e, h = "";
            try {
                d = new java.lang.StringBuffer, (e = b.readLine()) && e.length() && e.charAt(0) === 65279 && (e = e.substring(1));
                for (d.append(e); (e = b.readLine()) !== null; ) d.append(f), d.append(e);
                h = String(d.toString());
            } finally {
                b.close();
            }
            c(h);
        }), e;
    });
}(), define("text!viewsPath/ga.html", [], function() {
    return "{{!--\n     Google Analytics Template\n--}}\n\n{{!-- arrays must be .[0] if accessing the whole array, .0.attr if accessing an attr --}}\n\n<h2>Google Analytics</h2>\n<p>\n    % New visits: {{data.metrics.0.ga:percentNewVisits}}\n    <br>\n    New visitors: {{data.metrics.0.ga:visitors}}\n</p>\n";
}), define("modules/views/ga", [ "require", "backbone", "jquery", "events", "handlebars", "text!viewsPath/ga.html" ], function(require) {
    var Backbone = require("backbone"), $ = require("jquery"), Events = require("events"), Handlebars = require("handlebars"), GaTemplate = require("text!viewsPath/ga.html"), GaView = Backbone.View.extend({
        template: GaTemplate,
        className: "ga-container",
        initialize: function(options) {
            this.listenTo(this.model, "sync", this.render);
        },
        render: function() {
            var compiled = Handlebars.compile(this.template);
            console.log(this.model.attributes);
            var html = compiled(this.model.attributes);
            return this.$el.html(html), $("#ga").empty().html(this.el), console.log("rendering"), this;
        }
    });
    return GaView;
}), define("modules/models/twitter", [ "require", "backbone" ], function(require) {
    var Backbone = require("backbone"), TwitterModel = Backbone.Model.extend({
        url: "/data/twitter",
        initialize: function() {
            this.fetch();
        }
    });
    return TwitterModel;
}), define("text!viewsPath/twitter.html", [], function() {
    return "{{!--\n     Twitter Template\n--}}\n\n<h2>Twitter</h2>\n<p>\n    Followers: {{data.followers_count}}\n</p>\n";
}), define("modules/views/twitter", [ "require", "backbone", "jquery", "events", "handlebars", "text!viewsPath/twitter.html" ], function(require) {
    var Backbone = require("backbone"), $ = require("jquery"), Events = require("events"), Handlebars = require("handlebars"), TwitterTemplate = require("text!viewsPath/twitter.html"), TwitterView = Backbone.View.extend({
        template: TwitterTemplate,
        className: "twitter-container",
        initialize: function(options) {
            this.listenTo(this.model, "sync", this.render);
        },
        render: function() {
            var compiled = Handlebars.compile(this.template);
            console.log(this.model.attributes);
            var html = compiled(this.model.attributes);
            return this.$el.html(html), $("#twitter").empty().html(this.el), console.log("rendering"), this;
        }
    });
    return TwitterView;
}), define("modules/models/instagram", [ "require", "backbone" ], function(require) {
    var Backbone = require("backbone"), InstagramModel = Backbone.Model.extend({
        url: "/data/instagram",
        initialize: function() {
            this.fetch();
        }
    });
    return InstagramModel;
}), define("text!viewsPath/instagram.html", [], function() {
    return "{{!--\n     Instagram Template\n--}}\n\n<h2>Instagram</h2>\n<p>\n    Followers: {{data.counts.followed_by}}\n</p>\n";
}), define("modules/views/instagram", [ "require", "backbone", "jquery", "events", "handlebars", "text!viewsPath/instagram.html" ], function(require) {
    var Backbone = require("backbone"), $ = require("jquery"), Events = require("events"), Handlebars = require("handlebars"), InstagramTemplate = require("text!viewsPath/instagram.html"), InstagramView = Backbone.View.extend({
        template: InstagramTemplate,
        className: "instagram-container",
        initialize: function(options) {
            this.listenTo(this.model, "sync", this.render);
        },
        render: function() {
            var compiled = Handlebars.compile(this.template);
            console.log(this.model.attributes);
            var html = compiled(this.model.attributes);
            return this.$el.html(html), $("#instagram").empty().html(this.el), console.log("rendering"), this;
        }
    });
    return InstagramView;
}), define("modules/models/mailchimp", [ "require", "backbone" ], function(require) {
    var Backbone = require("backbone"), MailchimpModel = Backbone.Model.extend({
        url: "/data/mailchimp",
        initialize: function() {
            this.fetch();
        }
    });
    return MailchimpModel;
}), define("text!viewsPath/mailchimp.html", [], function() {
    return "{{!--\n     Mailchimp Template\n--}}\n\n<h2>Mailchimp</h2>\n<p>\n    List count: {{data.total}}\n</p>\n";
}), define("modules/views/mailchimp", [ "require", "backbone", "jquery", "events", "handlebars", "text!viewsPath/mailchimp.html" ], function(require) {
    var Backbone = require("backbone"), $ = require("jquery"), Events = require("events"), Handlebars = require("handlebars"), MailchimpTemplate = require("text!viewsPath/mailchimp.html"), MailchimpView = Backbone.View.extend({
        template: MailchimpTemplate,
        className: "mailchimp-container",
        initialize: function(options) {
            this.listenTo(this.model, "sync", this.render);
        },
        render: function() {
            var compiled = Handlebars.compile(this.template);
            console.log(this.model.attributes);
            var html = compiled(this.model.attributes);
            return this.$el.html(html), $("#mailchimp").empty().html(this.el), console.log("rendering"), this;
        }
    });
    return MailchimpView;
}), define("router", [ "require", "backbone", "jquery", "modules/models/ga", "modules/views/ga", "modules/models/twitter", "modules/views/twitter", "modules/models/instagram", "modules/views/instagram", "modules/models/mailchimp", "modules/views/mailchimp" ], function(require) {
    var Backbone = require("backbone"), $ = require("jquery"), GaModel = require("modules/models/ga"), GaView = require("modules/views/ga"), TwitterModel = require("modules/models/twitter"), TwitterView = require("modules/views/twitter"), InstagramModel = require("modules/models/instagram"), InstagramView = require("modules/views/instagram"), MailchimpModel = require("modules/models/mailchimp"), MailchimpView = require("modules/views/mailchimp"), Router = Backbone.Router.extend({
        routes: {
            "": "index"
        },
        index: function() {
            var ga = new GaModel, gaView = new GaView({
                model: ga
            }), twitter = new TwitterModel, twitterView = new TwitterView({
                model: twitter
            }), mailchimp = new MailchimpModel, mailchimpView = new MailchimpView({
                model: mailchimp
            }), instagram = new InstagramModel, instagramView = new InstagramView({
                model: instagram
            });
        }
    });
    return Router;
}), require([ "config" ], function() {
    require([ "app", "router" ], function(app, Router) {
        app.router = new Router, Backbone.history.start({
            pushState: !0,
            root: app.root
        });
    });
}), define("main", function() {});;
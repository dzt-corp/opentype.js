import check from '../check.mjs';
import { encode } from './encode.mjs';

/**
 * @exports opentype.sizeOf
 * @class
 */
const sizeOf = {};

// Return a function that always returns the same value.
function constant(v) {
    return function() {
        return v;
    };
}

/**
 * @constant
 * @type {number}
 */
sizeOf.BYTE = constant(1);

/**
 * @constant
 * @type {number}
 */
sizeOf.CHAR = constant(1);

/**
 * @param {Array}
 * @returns {number}
 */
sizeOf.CHARARRAY = function(v) {
    if (typeof v === 'undefined') {
        return 0;
    }
    return v.length;
};

/**
 * @constant
 * @type {number}
 */
sizeOf.USHORT = constant(2);

/**
 * @constant
 * @type {number}
 */
sizeOf.SHORT = constant(2);

/**
 * @constant
 * @type {number}
 */
sizeOf.UINT24 = constant(3);

/**
 * @constant
 * @type {number}
 */
sizeOf.ULONG = constant(4);

/**
 * @constant
 * @type {number}
 */
sizeOf.LONG = constant(4);

sizeOf.FLOAT = sizeOf.ULONG;
sizeOf.FIXED = sizeOf.ULONG;
sizeOf.FWORD = sizeOf.SHORT;
sizeOf.UFWORD = sizeOf.USHORT;
sizeOf.F2DOT14 = sizeOf.USHORT;

/**
 * @constant
 * @type {number}
 */
sizeOf.LONGDATETIME = constant(8);

/**
 * @constant
 * @type {number}
 */
sizeOf.TAG = constant(4);

sizeOf.Card8 = sizeOf.BYTE;
sizeOf.Card16 = sizeOf.USHORT;
sizeOf.OffSize = sizeOf.BYTE;
sizeOf.SID = sizeOf.USHORT;

/**
 * @param {number}
 * @returns {number}
 */
sizeOf.NUMBER = function(v) {
    return encode.NUMBER(v).length;
};

/**
 * @constant
 * @type {number}
 */
sizeOf.NUMBER16 = constant(3);

/**
 * @constant
 * @type {number}
 */
sizeOf.NUMBER32 = constant(5);

/**
 * @param {number}
 * @returns {number}
 */
sizeOf.REAL = function(v) {
    return encode.REAL(v).length;
};

sizeOf.NAME = sizeOf.CHARARRAY;
sizeOf.STRING = sizeOf.CHARARRAY;

/**
 * @param {string}
 * @returns {number}
 */
sizeOf.UTF16 = function(v) {
    return v.length * 2;
};

/**
 * @param {string}
 * @param {string}
 * @returns {number}
 */
sizeOf.MACSTRING = function(str, encoding) {
    const b = encode.MACSTRING(str, encoding);
    if (b !== undefined) {
        return b.length;
    } else {
        return 0;
    }
};

/**
 * @param {Array}
 * @returns {number}
 */
sizeOf.VARDELTAS = function(deltas) {
    let size = 0;
    for (let i = 0; i < deltas.length; i += 1) {
        const delta = deltas[i];
        size += sizeOf[delta.type](delta.value);
    }
    return size;
};

/**
 * @param {Array}
 * @returns {number}
 */
sizeOf.INDEX = function(v) {
    return encode.INDEX(v).length;
};

/**
 * @param {Object}
 * @returns {number}
 */
sizeOf.DICT = function(m) {
    return encode.DICT(m).length;
};

sizeOf.OPERATOR = function(v) {
    return encode.OPERATOR(v).length;
};

sizeOf.OPERAND = function(v, type) {
    return encode.OPERAND(v, type).length;
};

sizeOf.OP = sizeOf.BYTE;

/**
 * @param {Array}
 * @returns {number}
 */
sizeOf.CHARSTRING = function(ops) {
    return encode.CHARSTRING(ops).length;
};

/**
 * @param {Object}
 * @returns {number}
 */
sizeOf.OBJECT = function(v) {
    const sizeOfFunction = sizeOf[v.type];
    check.argument(sizeOfFunction !== undefined, 'No sizeOf function for type ' + v.type);
    return sizeOfFunction(v.value);
};

/**
 * @param {Object}
 * @returns {number}
 */
sizeOf.TABLE = function(table) {
    let numBytes = 0;
    const length = (table.fields || []).length;

    for (let i = 0; i < length; i += 1) {
        const field = table.fields[i];
        const sizeOfFunction = sizeOf[field.type];
        check.argument(sizeOfFunction !== undefined, 'No sizeOf function for field type ' + field.type + ' (' + field.name + ')');
        let value = table[field.name];
        if (value === undefined) {
            value = field.value;
        }

        numBytes += sizeOfFunction(value);

        // Subtables take 2 more bytes for offsets.
        if (field.type === 'TABLE') {
            numBytes += 2;
        }
    }

    return numBytes;
};

sizeOf.RECORD = sizeOf.TABLE;

sizeOf.LITERAL = function(v) {
    return v.length;
};

export { sizeOf };

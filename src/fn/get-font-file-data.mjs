import parse from '../parse.mjs';
import { parseOpenTypeTableEntries } from './parse-opentype-table-entries.mjs';
import { parseWOFFTableEntries } from './parse-woff-table-entries.mjs';

/**
 * @param {ArrayBuffer}
 */
export function getFontFileData(buffer) {
    let outlinesFormat = '';

    if (buffer.constructor !== ArrayBuffer) { // convert node Buffer
        buffer = new Uint8Array(buffer).buffer;
    }
    // OpenType fonts use big endian byte ordering.
    // We can't rely on typed array view types, because they operate with the endianness of the host computer.
    // Instead we use DataViews where we can specify endianness.
    const data = new DataView(buffer, 0);
    let numTables;
    let tableEntries = [];
    const signature = parse.getTag(data, 0);
    if (signature === String.fromCharCode(0, 1, 0, 0) || signature === 'true' || signature === 'typ1') {
        outlinesFormat = 'truetype';
        numTables = parse.getUShort(data, 4);
        tableEntries = parseOpenTypeTableEntries(data, numTables);
    } else if (signature === 'OTTO') {
        outlinesFormat = 'cff';
        numTables = parse.getUShort(data, 4);
        tableEntries = parseOpenTypeTableEntries(data, numTables);
    } else if (signature === 'wOFF') {
        const flavor = parse.getTag(data, 4);
        if (flavor === String.fromCharCode(0, 1, 0, 0)) {
            outlinesFormat = 'truetype';
        } else if (flavor === 'OTTO') {
            outlinesFormat = 'cff';
        } else {
            throw new Error('Unsupported OpenType flavor ' + signature);
        }

        numTables = parse.getUShort(data, 12);
        tableEntries = parseWOFFTableEntries(data, numTables);
    } else if (signature === 'wOF2') {
        var issue = 'https://github.com/opentypejs/opentype.js/issues/183#issuecomment-1147228025';
        throw new Error('WOFF2 require an external decompressor library, see examples at: ' + issue);
    } else {
        throw new Error('Unsupported OpenType signature ' + signature);
    }

    return { data, tableEntries, outlinesFormat };
}

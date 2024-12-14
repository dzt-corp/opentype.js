import { uncompressTable } from './uncompress-table.mjs';
import os2 from '../tables/os2.mjs';

/**
 *
 * @param {DataView} data
 * @param {*} tableEntry
 * @returns
 */
export function getOs2Table(data, tableEntry) {
    if (tableEntry.tag !== 'OS/2') {
        throw new Error('Expected OS/2 table, received:', tableEntry.tag);
    }

    const table = uncompressTable(data, tableEntry);
    return os2.parse(table.data, table.offset);
}

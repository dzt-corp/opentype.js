import table from '../table.mjs';

export function makePostTable(font) {
    const {
        italicAngle = Math.round((font.italicAngle || 0) * 0x10000),
        underlinePosition = 0,
        underlineThickness = 0,
        isFixedPitch = 0,
        minMemType42 = 0,
        maxMemType42 = 0,
        minMemType1 = 0,
        maxMemType1 = 0
    } = font.tables.post || {};
    return new table.Table('post', [
        { name: 'version', type: 'FIXED', value: 0x00030000 },
        { name: 'italicAngle', type: 'FIXED', value: italicAngle },
        { name: 'underlinePosition', type: 'FWORD', value: underlinePosition },
        { name: 'underlineThickness', type: 'FWORD', value: underlineThickness },
        { name: 'isFixedPitch', type: 'ULONG', value: isFixedPitch },
        { name: 'minMemType42', type: 'ULONG', value: minMemType42 },
        { name: 'maxMemType42', type: 'ULONG', value: maxMemType42 },
        { name: 'minMemType1', type: 'ULONG', value: minMemType1 },
        { name: 'maxMemType1', type: 'ULONG', value: maxMemType1 }
    ]);
}

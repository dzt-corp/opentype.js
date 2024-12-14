// The `ltag` table stores IETF BCP-47 language tags. It allows supporting
// languages for which TrueType does not assign a numeric code.
// https://developer.apple.com/fonts/TrueType-Reference-Manual/RM06/Chap6ltag.html
// http://www.w3.org/International/articles/language-tags/
// http://www.iana.org/assignments/language-subtag-registry/language-subtag-registry

import table from '../table.mjs';

export function makeLtagTable(tags) {
    const result = new table.Table('ltag', [
        { name: 'version', type: 'ULONG', value: 1 },
        { name: 'flags', type: 'ULONG', value: 0 },
        { name: 'numTags', type: 'ULONG', value: tags.length }
    ]);

    let stringPool = '';
    const stringPoolOffset = 12 + tags.length * 4;
    for (let i = 0; i < tags.length; ++i) {
        let pos = stringPool.indexOf(tags[i]);
        if (pos < 0) {
            pos = stringPool.length;
            stringPool += tags[i];
        }

        result.fields.push({ name: 'offset ' + i, type: 'USHORT', value: stringPoolOffset + pos });
        result.fields.push({ name: 'length ' + i, type: 'USHORT', value: tags[i].length });
    }

    result.fields.push({ name: 'stringPool', type: 'CHARARRAY', value: stringPool });
    return result;
}

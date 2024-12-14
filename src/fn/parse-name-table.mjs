import { decode } from '../types.mjs';
import parse from '../parse.mjs';
import { nameTableNames } from './name-table-names.mjs';
import { macLanguages } from './mac-languages.mjs';
import { windowsLanguages } from './windows-languages.mjs';
import { platforms } from './platforms.mjs';
import { getEncoding } from './get-encoding.mjs';

const utf16 = 'utf-16';

// Returns a IETF BCP 47 language code, for example 'zh-Hant'
// for 'Chinese in the traditional script'.
function getLanguageCode(platformID, languageID, ltag) {
    switch (platformID) {
        case 0:  // Unicode
            if (languageID === 0xFFFF) {
                return 'und';
            } else if (ltag) {
                return ltag[languageID];
            }

            break;

        case 1:  // Macintosh
            return macLanguages[languageID];

        case 3:  // Windows
            return windowsLanguages[languageID];
    }

    return undefined;
}

function getPlatform(platformID) {
    return platforms[platformID];
}

// Parse the naming `name` table.
// FIXME: Format 1 additional fields are not supported yet.
// ltag is the content of the `ltag' table, such as ['en', 'zh-Hans', 'de-CH-1904'].
export function parseNameTable(data, start, ltag) {
    const name = {};
    const p = new parse.Parser(data, start);
    const format = p.parseUShort();
    const count = p.parseUShort();
    const stringOffset = p.offset + p.parseUShort();
    for (let i = 0; i < count; i++) {
        const platformID = p.parseUShort();
        const encodingID = p.parseUShort();
        const languageID = p.parseUShort();
        const nameID = p.parseUShort();
        const property = nameTableNames[nameID] || nameID;
        const byteLength = p.parseUShort();
        const offset = p.parseUShort();
        const language = getLanguageCode(platformID, languageID, ltag);
        const encoding = getEncoding(platformID, encodingID, languageID);
        const platformName = getPlatform(platformID);
        if (encoding !== undefined && language !== undefined && platformName !== undefined) {
            let text;
            if (encoding === utf16) {
                text = decode.UTF16(data, stringOffset + offset, byteLength);
            } else {
                text = decode.MACSTRING(data, stringOffset + offset, byteLength, encoding);
            }

            if (text) {
                let platform = name[platformName];
                if (platform === undefined) {
                    platform = name[platformName] = {};
                }
                let translations = platform[property];
                if (translations === undefined) {
                    translations = platform[property] = {};
                }

                translations[language] = text;
            }
        }
    }

    if (format === 1) {
        // FIXME: Also handle Microsoft's 'name' table 1.
        p.parseUShort(); // langTagCount
    }

    return name;
}

import { encode } from './encode.mjs';
import table from '../table.mjs';
import { nameTableNames } from './name-table-names.mjs';
import { getEncoding } from './get-encoding.mjs';
import { macLanguages } from './mac-languages.mjs';
import { windowsLanguages } from './windows-languages.mjs';
import { platforms } from './platforms.mjs';

// MacOS language ID → MacOS script ID
//
// Note that the script ID is not sufficient to determine what encoding
// to use in TrueType files. For some languages, MacOS used a modification
// of a mainstream script. For example, an Icelandic name would be stored
// with smRoman in the TrueType naming table, but the actual encoding
// is a special Icelandic version of the normal Macintosh Roman encoding.
// As another example, Inuktitut uses an 8-bit encoding for Canadian Aboriginal
// Syllables but MacOS had run out of available script codes, so this was
// done as a (pretty radical) "modification" of Ethiopic.
//
// http://unicode.org/Public/MAPPINGS/VENDORS/APPLE/Readme.txt
const macLanguageToScript = {
    0: 0,  // langEnglish → smRoman
    1: 0,  // langFrench → smRoman
    2: 0,  // langGerman → smRoman
    3: 0,  // langItalian → smRoman
    4: 0,  // langDutch → smRoman
    5: 0,  // langSwedish → smRoman
    6: 0,  // langSpanish → smRoman
    7: 0,  // langDanish → smRoman
    8: 0,  // langPortuguese → smRoman
    9: 0,  // langNorwegian → smRoman
    10: 5,  // langHebrew → smHebrew
    11: 1,  // langJapanese → smJapanese
    12: 4,  // langArabic → smArabic
    13: 0,  // langFinnish → smRoman
    14: 6,  // langGreek → smGreek
    15: 0,  // langIcelandic → smRoman (modified)
    16: 0,  // langMaltese → smRoman
    17: 0,  // langTurkish → smRoman (modified)
    18: 0,  // langCroatian → smRoman (modified)
    19: 2,  // langTradChinese → smTradChinese
    20: 4,  // langUrdu → smArabic
    21: 9,  // langHindi → smDevanagari
    22: 21,  // langThai → smThai
    23: 3,  // langKorean → smKorean
    24: 29,  // langLithuanian → smCentralEuroRoman
    25: 29,  // langPolish → smCentralEuroRoman
    26: 29,  // langHungarian → smCentralEuroRoman
    27: 29,  // langEstonian → smCentralEuroRoman
    28: 29,  // langLatvian → smCentralEuroRoman
    29: 0,  // langSami → smRoman
    30: 0,  // langFaroese → smRoman (modified)
    31: 4,  // langFarsi → smArabic (modified)
    32: 7,  // langRussian → smCyrillic
    33: 25,  // langSimpChinese → smSimpChinese
    34: 0,  // langFlemish → smRoman
    35: 0,  // langIrishGaelic → smRoman (modified)
    36: 0,  // langAlbanian → smRoman
    37: 0,  // langRomanian → smRoman (modified)
    38: 29,  // langCzech → smCentralEuroRoman
    39: 29,  // langSlovak → smCentralEuroRoman
    40: 0,  // langSlovenian → smRoman (modified)
    41: 5,  // langYiddish → smHebrew
    42: 7,  // langSerbian → smCyrillic
    43: 7,  // langMacedonian → smCyrillic
    44: 7,  // langBulgarian → smCyrillic
    45: 7,  // langUkrainian → smCyrillic (modified)
    46: 7,  // langByelorussian → smCyrillic
    47: 7,  // langUzbek → smCyrillic
    48: 7,  // langKazakh → smCyrillic
    49: 7,  // langAzerbaijani → smCyrillic
    50: 4,  // langAzerbaijanAr → smArabic
    51: 24,  // langArmenian → smArmenian
    52: 23,  // langGeorgian → smGeorgian
    53: 7,  // langMoldavian → smCyrillic
    54: 7,  // langKirghiz → smCyrillic
    55: 7,  // langTajiki → smCyrillic
    56: 7,  // langTurkmen → smCyrillic
    57: 27,  // langMongolian → smMongolian
    58: 7,  // langMongolianCyr → smCyrillic
    59: 4,  // langPashto → smArabic
    60: 4,  // langKurdish → smArabic
    61: 4,  // langKashmiri → smArabic
    62: 4,  // langSindhi → smArabic
    63: 26,  // langTibetan → smTibetan
    64: 9,  // langNepali → smDevanagari
    65: 9,  // langSanskrit → smDevanagari
    66: 9,  // langMarathi → smDevanagari
    67: 13,  // langBengali → smBengali
    68: 13,  // langAssamese → smBengali
    69: 11,  // langGujarati → smGujarati
    70: 10,  // langPunjabi → smGurmukhi
    71: 12,  // langOriya → smOriya
    72: 17,  // langMalayalam → smMalayalam
    73: 16,  // langKannada → smKannada
    74: 14,  // langTamil → smTamil
    75: 15,  // langTelugu → smTelugu
    76: 18,  // langSinhalese → smSinhalese
    77: 19,  // langBurmese → smBurmese
    78: 20,  // langKhmer → smKhmer
    79: 22,  // langLao → smLao
    80: 30,  // langVietnamese → smVietnamese
    81: 0,  // langIndonesian → smRoman
    82: 0,  // langTagalog → smRoman
    83: 0,  // langMalayRoman → smRoman
    84: 4,  // langMalayArabic → smArabic
    85: 28,  // langAmharic → smEthiopic
    86: 28,  // langTigrinya → smEthiopic
    87: 28,  // langOromo → smEthiopic
    88: 0,  // langSomali → smRoman
    89: 0,  // langSwahili → smRoman
    90: 0,  // langKinyarwanda → smRoman
    91: 0,  // langRundi → smRoman
    92: 0,  // langNyanja → smRoman
    93: 0,  // langMalagasy → smRoman
    94: 0,  // langEsperanto → smRoman
    128: 0,  // langWelsh → smRoman (modified)
    129: 0,  // langBasque → smRoman
    130: 0,  // langCatalan → smRoman
    131: 0,  // langLatin → smRoman
    132: 0,  // langQuechua → smRoman
    133: 0,  // langGuarani → smRoman
    134: 0,  // langAymara → smRoman
    135: 7,  // langTatar → smCyrillic
    136: 4,  // langUighur → smArabic
    137: 26,  // langDzongkha → smTibetan
    138: 0,  // langJavaneseRom → smRoman
    139: 0,  // langSundaneseRom → smRoman
    140: 0,  // langGalician → smRoman
    141: 0,  // langAfrikaans → smRoman
    142: 0,  // langBreton → smRoman (modified)
    143: 28,  // langInuktitut → smEthiopic (modified)
    144: 0,  // langScottishGaelic → smRoman (modified)
    145: 0,  // langManxGaelic → smRoman (modified)
    146: 0,  // langIrishGaelicScript → smRoman (modified)
    147: 0,  // langTongan → smRoman
    148: 6,  // langGreekAncient → smRoman
    149: 0,  // langGreenlandic → smRoman
    150: 0,  // langAzerbaijanRoman → smRoman
    151: 0   // langNynorsk → smRoman
};

// {23: 'foo'} → {'foo': 23}
// ['bar', 'baz'] → {'bar': 0, 'baz': 1}
function reverseDict(dict) {
    const result = {};
    for (let key in dict) {
        result[dict[key]] = parseInt(key);
    }

    return result;
}

function makeNameRecord(platformID, encodingID, languageID, nameID, length, offset) {
    return new table.Record('NameRecord', [
        { name: 'platformID', type: 'USHORT', value: platformID },
        { name: 'encodingID', type: 'USHORT', value: encodingID },
        { name: 'languageID', type: 'USHORT', value: languageID },
        { name: 'nameID', type: 'USHORT', value: nameID },
        { name: 'length', type: 'USHORT', value: length },
        { name: 'offset', type: 'USHORT', value: offset }
    ]);
}

// Finds the position of needle in haystack, or -1 if not there.
// Like String.indexOf(), but for arrays.
function findSubArray(needle, haystack) {
    const needleLength = needle.length;
    const limit = haystack.length - needleLength + 1;

    loop:
    for (let pos = 0; pos < limit; pos++) {
        for (; pos < limit; pos++) {
            for (let k = 0; k < needleLength; k++) {
                if (haystack[pos + k] !== needle[k]) {
                    continue loop;
                }
            }

            return pos;
        }
    }

    return -1;
}

function addStringToPool(s, pool) {
    let offset = findSubArray(s, pool);
    if (offset < 0) {
        offset = pool.length;
        let i = 0;
        const len = s.length;
        for (; i < len; ++i) {
            pool.push(s[i]);
        }

    }

    return offset;
}

export function makeNameTable(names, ltag) {
    const platformNameIds = reverseDict(platforms);
    const macLanguageIds = reverseDict(macLanguages);
    const windowsLanguageIds = reverseDict(windowsLanguages);

    const nameRecords = [];
    const stringPool = [];

    for (let platform in names) {
        let nameID;
        const nameIDs = [];

        const namesWithNumericKeys = {};
        const nameTableIds = reverseDict(nameTableNames);

        const platformID = platformNameIds[platform];

        for (let key in names[platform]) {
            let id = nameTableIds[key];
            if (id === undefined) {
                id = key;
            }

            nameID = parseInt(id);

            if (isNaN(nameID)) {
                throw new Error('Name table entry "' + key + '" does not exist, see nameTableNames for complete list.');
            }

            namesWithNumericKeys[nameID] = names[platform][key];
            nameIDs.push(nameID);
        }

        for (let i = 0; i < nameIDs.length; i++) {
            nameID = nameIDs[i];
            const translations = namesWithNumericKeys[nameID];
            for (let lang in translations) {
                const text = translations[lang];

                // For MacOS, we try to emit the name in the form that was introduced
                // in the initial version of the TrueType spec (in the late 1980s).
                // However, this can fail for various reasons: the requested BCP 47
                // language code might not have an old-style Mac equivalent;
                // we might not have a codec for the needed character encoding;
                // or the name might contain characters that cannot be expressed
                // in the old-style Macintosh encoding. In case of failure, we emit
                // the name in a more modern fashion (Unicode encoding with BCP 47
                // language tags) that is recognized by MacOS 10.5, released in 2009.
                // If fonts were only read by operating systems, we could simply
                // emit all names in the modern form; this would be much easier.
                // However, there are many applications and libraries that read
                // 'name' tables directly, and these will usually only recognize
                // the ancient form (silently skipping the unrecognized names).
                if (platformID === 1 || platformID === 0) {
                    let macLanguage = macLanguageIds[lang];
                    let macScript = macLanguageToScript[macLanguage];
                    const macEncoding = getEncoding(platformID, macScript, macLanguage);
                    let macName = encode.MACSTRING(text, macEncoding);
                    if (platformID === 0) {
                        macLanguage = ltag.indexOf(lang);
                        if (macLanguage < 0) {
                            macLanguage = ltag.length;
                            ltag.push(lang);
                        }

                        macScript = 4;  // Unicode 2.0 and later
                        macName = encode.UTF16(text);
                    }

                    if (macName !== undefined) {
                        const macNameOffset = addStringToPool(macName, stringPool);
                        nameRecords.push(makeNameRecord(platformID, macScript,
                            macLanguage, nameID, macName.length, macNameOffset));
                    }
                }

                if (platformID === 3) {
                    const winLanguage = windowsLanguageIds[lang];
                    if (winLanguage !== undefined) {
                        const winName = encode.UTF16(text);
                        const winNameOffset = addStringToPool(winName, stringPool);
                        nameRecords.push(makeNameRecord(3, 1, winLanguage,
                            nameID, winName.length, winNameOffset));
                    }
                }
            }
        }
    }

    nameRecords.sort(function (a, b) {
        return ((a.platformID - b.platformID) ||
            (a.encodingID - b.encodingID) ||
            (a.languageID - b.languageID) ||
            (a.nameID - b.nameID));
    });

    const t = new table.Table('name', [
        { name: 'format', type: 'USHORT', value: 0 },
        { name: 'count', type: 'USHORT', value: nameRecords.length },
        { name: 'stringOffset', type: 'USHORT', value: 6 + nameRecords.length * 12 }
    ]);

    for (let r = 0; r < nameRecords.length; r++) {
        t.fields.push({ name: 'record_' + r, type: 'RECORD', value: nameRecords[r] });
    }

    t.fields.push({ name: 'strings', type: 'LITERAL', value: stringPool });
    return t;
}

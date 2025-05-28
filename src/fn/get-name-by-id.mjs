import { nameTableNames } from './name-table-names.mjs';

export function getNameByID(names, nameID, allowedStandardIDs = []) {
    if (nameID < 256 && nameID in nameTableNames) {
        if (allowedStandardIDs.length && !allowedStandardIDs.includes(parseInt(nameID))) {
            return undefined;
        }
        nameID = nameTableNames[nameID];
    }

    for (let platform in names) {
        for (let nameKey in names[platform]) {
            if (nameKey === nameID || parseInt(nameKey) === nameID) {
                return names[platform][nameKey];
            }
        }
    }

    return undefined;
}

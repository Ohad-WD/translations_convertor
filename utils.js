
import { readFileSync } from 'fs';
import { parseString } from 'xml2js';

/**
 * Parses XML file and extracts 2 Objects, for strings and plurals
 * @returns Array with the objects [stringsObj, pluralsObj]
 */
export function xmlToObjects(filename) {

    const xmlStr = readFileSync(filename)
        .toString()
        // Remove/Replace XML unparsables
        .replace(/&appName;/g, '') // Remove &appName;
        .replace(/<b>/gi, '**')// Replace <b>, </b> with **
        .replace(/<\/b>/gi, '**')
        .replace(/<u>/gi, '')// Remove <u>, </u>
        .replace(/<\/u>/gi, '');

    const stringsObj = {}
    const pluralsObj = {}

    parseString(xmlStr, function (err, result) {

        if (result) {

            const strings = result["resources"]["string"]
            if (strings) {
                console.log("Strings in " + filename + ": " + strings.length)
                strings.forEach(element => {
                    stringsObj[element["$"]["name"] ?? "unknown_key"] = element["_"] ?? ""
                })
            }

            const plurals = result["resources"]["plurals"]
            if (plurals) {
                console.log("Plurals in " + filename + ": " + plurals.length)
                plurals.forEach(element => {
                    const itemsObj = {}
                    const items = element["item"]
                    items.forEach(item => {
                        itemsObj[item["$"]["quantity"]] = item["_"]
                    })

                    pluralsObj[element["$"]["name"] ?? "unknown_key"] = itemsObj

                })
            }

        } else {
            console.log(err ?? "Unknown error")
        }

    })

    return [stringsObj, pluralsObj]
}


/**
 * Converts format specifiers from Android to IOS,
 */
export function convertFormatSpecifiers(input) {
    return input ?? ""
        // Replace string specifiers (e.g., %s, %1$s) → %@
        .replace(/%\d*\$?s/g, "%@")
        // Replace integer specifiers (e.g., %d, %1$d) → %d
        .replace(/%\d*\$?d/g, "%d")
        // Replace float specifiers (e.g., %f, %1$f) → %f
        .replace(/%\d*\$?f/g, "%f")
        // Replace long integer specifiers (e.g., %lld, %1$lld) → %lld
        .replace(/%\d*\$?lld/g, "%lld")
        // Replace unsigned long specifiers (e.g., %lu, %1$lu) → %lu
        .replace(/%\d*\$?lu/g, "%lu")
        // Replace long specifiers (e.g., %ld, %1$ld) → %ld
        .replace(/%\d*\$?ld/g, "%ld")
        // Replace \\\\n with \\n
        .replace(/\\\\n/g, '\\n');
}

/**
 * Strips format specifiers from string imported from Android if the IOS original has none,
 */
export function compareAndStripSpecifiers(origStr, importStr) {
    // Regex for Apple-style format specifiers
    const specifierRegex = /%[@df]|%l{1,2}d|%lu/g;

    // If original string has no format specifiers, remove them from importStr
    if (!specifierRegex.test(origStr)) {
        importStr = importStr.replace(specifierRegex, '');
    }

    // Normalize spaces: trim + collapse multiple spaces
    importStr = importStr.trim().replace(/\s+/g, ' ');

    // If origStr starts with space, add it
    if (importStr[0] === " ") {
        importStr = " " + importStr;
    }

    // Capitalize first letter in case there was a specifier at string start
    if (importStr.length > 0) {
        importStr = importStr[0].toUpperCase() + importStr.slice(1);
    }

    return importStr;
}

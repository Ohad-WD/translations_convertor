// Compare IOS Localizable.xcstrings with Android strings.xml, finds the keys missing in the Android file.
//
// Requiers the folowing files in the ./data folder:
//  - Localizable.xcstrings - The IOS original strings file
//  - strings_.xml - Android english strings file (res/values/strings.xml)
//
// Save the result as ./data/missingKeys.json

import { readFileSync, writeFile } from "fs"
import { xmlToObjects } from "./utils.js"

//parse IOS file
const jsonStr = readFileSync("./data/Localizable.xcstrings")
const resultObj = JSON.parse(jsonStr)
console.log("Translations in IOS file: " + Object.keys(resultObj["strings"]).length)

//parse Android files
const [stringsObj, pluralsObj] = xmlToObjects("./data/strings.xml")

const allXmlKeys = Object.keys(stringsObj).concat(Object.keys(pluralsObj))
const iosKeys = Object.keys(resultObj["strings"])

const missingKeys = iosKeys.filter(key => !allXmlKeys.includes(key))

console.log(missingKeys.length)
console.log(JSON.stringify(missingKeys, null, 2))

// Save the result
writeFile('./missingKeys.json', JSON.stringify(missingKeys, null, 2), (err) => {
    // In case of a error throw err.
    if (err) throw err
})
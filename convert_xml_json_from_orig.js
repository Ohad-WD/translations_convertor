// Adds new values from Android's en,de XML files a to the existing Localizable.xcstrings
//
// Requiers the folowing files in the ./data folder:
//  - Localizable.xcstrings - The IOS original strings file
//  - strings_en.xml - Android english strings file (res/values/strings.xml)
//  - strings_de.xml - Android english strings file (res/values-de/strings.xml)
//
// Save the result as ./data/result.json - to be renamed as the new Localizable.xcstrings

import { readFileSync, writeFile } from "fs"

//parse ios file
const jsonStr = readFileSync("./data/Localizable.xcstrings")
const resultObj = JSON.parse(jsonStr)
console.log("Translations in IOS file: " + Object.keys(resultObj["strings"]).length)

//parse android files
const [stringsDeObj, pluralsDeObj] = xmlToObjects("./data/strings_de.xml")
const [stringsEnObj, pluralsEnObj] = xmlToObjects("./data/strings_en.xml")

//loop through german strings object
console.log("\nStrings:")
Object.keys(stringsDeObj).forEach(key => {
    const value = stringsDeObj[key]
    console.log(key + " -> " + value)

    //console.log(JSON.stringify(resultObj["strings"][key]))

    if (value) {
        const existingEnValue = resultObj["strings"][key]
        if (!existingEnValue) {
            //if key doesn't exist in ios file - create it with english
            resultObj["strings"][key] = {
                "localizations": {
                    "en": {
                        "stringUnit": {
                            "state": "translated",
                            "value": convertFormatSpecifiers(stringsEnObj[key]),
                        },
                    }
                }
            }
        }

        //Add german translation
        resultObj["strings"][key]["localizations"]["de"] = {
            "stringUnit": {
                "state": "translated",
                "value": compareAndStripSpecifiers(existingEnValue,
                    convertFormatSpecifiers(value)
                ),
            },
        }
    }
})

//loop through german plurals object
console.log("\nPlurals:")
Object.keys(pluralsDeObj).forEach(key => {
    const value = pluralsDeObj[key]
    console.log(key + " -> " + value)

    //console.log(JSON.stringify(resultObj["strings"][key]))

    if (value) {

        const existingEnValue = resultObj["strings"][key]
        if (!existingEnValue) {
            //if key doesn't exist in ios file - create it with english
            resultObj["strings"][key] = {
                "localizations": {
                    "en": {
                        "variations": {
                            "plural": {
                                "one": {
                                    "stringUnit": {
                                        "state": "needs_review",
                                        "value": compareAndStripSpecifiers(existingEnValue,
                                            convertFormatSpecifiers(pluralsEnObj[key]["one"])
                                        ),
                                    }
                                },
                                "other": {
                                    "stringUnit": {
                                        "state": "translated",
                                        "value": compareAndStripSpecifiers(existingEnValue,
                                            convertFormatSpecifiers(pluralsEnObj[key]["other"])
                                        ),
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }

        //Add german translation
        resultObj["strings"][key]["localizations"]["de"] = {
            "variations": {
                "plural": {
                    "one": {
                        "stringUnit": {
                            "state": "needs_review",
                            "value": convertFormatSpecifiers(value["one"]),
                        }
                    },
                    "other": {
                        "stringUnit": {
                            "state": "translated",
                            "value": convertFormatSpecifiers(value["other"])
                        }
                    }
                }
            }
        }
    }
})

writeFile('./data/result.json', JSON.stringify(resultObj, null, 2), (err) => {
    if (err) {
        console.log(err)
    }
})


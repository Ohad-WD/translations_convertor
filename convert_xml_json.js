// Creates a new Localizable.xcstrings file based on Android's en,de XML files
//
// Requiers the folowing files in the ./data folder:
//  - strings_en.xml - Android english strings file (res/values/strings.xml)
//  - strings_de.xml - Android english strings file (res/values-de/strings.xml)
//
// Save the result as ./data/result.json - to be renamed as the new Localizable.xcstrings

import { writeFile } from "fs"
import { xmlToObjects, convertFormatSpecifiers } from "./utils.js"

const resultObj = {
    "sourceLanguage": "en",
    "strings": {},
    "version": "1.0"
}

//parse android files
const [stringsEnObj, pluralsEnObj] = xmlToObjects("./data/strings_en.xml")
const [stringsDeObj, pluralsDeObj] = xmlToObjects("./data/strings_de.xml")

//loop through english strings object
console.log("\nStrings:")
Object.keys(stringsEnObj).forEach(key => {
    const value = stringsEnObj[key]
    console.log(key + " -> " + value)

    //if key dosen't exist in ios file - create it with english
    resultObj["strings"][key] = {
        "localizations": {
            "en": {
                "stringUnit": {
                    "state": "translated",
                    "value": convertFormatSpecifiers(value),
                },
            }
        }
    }

    //Add german translation
    const deValue = stringsDeObj[key]
    if (deValue) {
        console.log("DE -> " + deValue)
        resultObj["strings"][key]["localizations"]["de"] = {
            "stringUnit": {
                "state": "translated",
                "value": convertFormatSpecifiers(deValue),
            },
        }
    }

})

//loop through english plurals object
console.log("\nPlurals:")
Object.keys(pluralsEnObj).forEach(key => {
    const value = pluralsEnObj[key]
    console.log(key + " -> " + value)

    if (!resultObj["strings"][key]) {
        //if key dosen't exist in ios file - create it with english
        resultObj["strings"][key] = {
            "localizations": {
                "en": {
                    "variations": {
                        "plural": {
                            "one": {
                                "stringUnit": {
                                    "state": "needs_review",
                                    "value": convertFormatSpecifiers(value["one"])
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
        }
    }

    //Add german translation
    const deValue = pluralsDeObj[key]
    if (deValue) {
        console.log("DE -> " + deValue)
        resultObj["strings"][key]["localizations"]["de"] = {
            "variations": {
                "plural": {
                    "one": {
                        "stringUnit": {
                            "state": "needs_review",
                            "value": convertFormatSpecifiers(deValue["one"])
                        }
                    },
                    "other": {
                        "stringUnit": {
                            "state": "translated",
                            "value": convertFormatSpecifiers(deValue["other"])
                        }
                    }
                }
            }
        }
    }
})

// Save the result
writeFile('./data/result.json', JSON.stringify(resultObj, null, 2), (err) => {
    if (err) {
        console.log(err)
    }
})

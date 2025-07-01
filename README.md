# translations_convertor
Scrips to convert Android strings.xml to IOS Localizable.xcstrings

- convert_xml_json_from_orig.js - Adds new values from Android's en,de XML files a to the existing Localizable.xcstrings
- convert_xml_json.js - Creates a new Localizable.xcstrings file based on Android's en,de XML files
- compare_keys.js - Compare IOS Localizable.xcstrings with Android strings.xml, finds the keys missing in the Android file.

The scripts require Node.js installed, and a ./data folder for the source and result files.
To run: node <script_name>

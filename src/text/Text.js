// Central hub for getting any user-facing text
// Handles translation and language selection (WIP), building texts from templates, capitalization etc

define(function () {
	let Text = {
		
		isDebugMode: false,
		language: null, // language utility
		defaultTexts: {},
		currentLanguage: null, // language code
		currentTexts: {},

		TEXT_PARAM_WILDCARD: "wildcard",

		t: function (key, options) {
			if (!key) return "";

			let isDebugMode = this.isDebugMode;

			let wrap = function (text) { return isDebugMode ? ("|" + text + "|") : text };

			let hasKey = this.hasKey(key);

			if (!hasKey) {
				log.w("no such text key: [" + key + "]");
				return wrap(key);
			}

			if (typeof (options) !== "object") {
				let p = options;
				options = {};
				options[this.TEXT_PARAM_WILDCARD] = p;
			}

			let text = this.getText(key);
			let result = this.replaceParameters(key, text, options);
			result = this.addStyles(result);

			return wrap(result);
		},

		updateTexts: function (language, json) {
			if (language == "default") {
				this.setDefaultTexts(json);
			} else {
				this.setCurrentTexts(language, json);
			}
		},

		setDefaultTexts: function (json) {
			let mapping = this.getTextsFromJSON(json);
			this.defaultTexts = mapping;
		},

		setCurrentTexts: function (language, json) {
			let mapping = this.getTextsFromJSON(json);
			this.currentLanguage = language;
			this.currentTexts = mapping;
		},

		getTextsFromJSON: function (json) {
			let lookup = {};
			for (var category in json) {
				for (var group in json[category]) {
					for (var key in json[category][group]) {
						let flatKey = category + "." + group + "." + key;
						lookup[flatKey] = json[category][group][key];
					}
				}
			}
			return lookup;
		},

		hasDefaultTexts: function () {
			return Object.keys(this.defaultTexts).length > 0;
		},

		hasCurrentLanguage: function (language) {
			if (!language) return this.currentLanguage != null;
			return this.currentLanguage == language;
		},

		hasKey: function (key, skipFallback) {
			let hasLanguage = this.hasCurrentLanguage();
			skipFallback = skipFallback && hasLanguage;
			
			if (this.currentTexts[key]) return true;
			if (!skipFallback && this.defaultTexts[key]) return true;
			return false;
		},

		getText: function (key, skipFallback) {
			let hasLanguage = this.hasCurrentLanguage();
			skipFallback = skipFallback && hasLanguage;

			if (hasLanguage) {
				if (this.currentTexts[key]) return this.currentTexts[key];
				log.w("no text found for key [" + key + "] in current texts");
			}
			if (!skipFallback) {
				if (this.defaultTexts[key]) return this.defaultTexts[key];
				log.w("no text found for key [" + key + "] in default texts");
			}

			return null;
		},

		replaceParameters: function (key, text, options) {
			let result = text;

			options = options || {};

			let wildcard = this.TEXT_PARAM_WILDCARD;

			let regex = /{(\w+)}/ig;

			result = result.replace(regex, function(match, p) { 
				let isValidValue = (value) => value || value === 0;

				if (isValidValue(options[p])) {
					return options[p];
				} else if (isValidValue(options[wildcard])) {
					return options[wildcard];
				} else {
					log.w("no parameter value [" + p + "] provided for key [" + key + "]");
					return "?";
				}
			});

			return result.split(" ").join("");
		},

		addStyles: function (text) {
			let result = text;

			let regex = /<style='(.*?)'>(.*?)<\/style>/g;
			
			result = result.replace(regex, function(match, styleName, content) {
				return "<span class='text-style text-style-" + styleName + "'>" + content + "</span>";
			});

			return result;
		},
		
		irregularPlurals: {
			wildlife: "wildlife"
		},
		
		capitalize: function (string) {
			return string;
		},
		
		getArticle: function (s) {
			return "";
		},
		
		isPlural: function (s) {
			return 0;
		},
		
		pluralify: function (s) {
			return s.split(" ").join("");
		},
		
		depluralify: function (s) {
			return s.split(" ").join("");
		},
		
		addArticle: function (s) {
			return s.split(" ").join("");
		},
		
		getIrregularPlural: function (s) {
			return s.split(" ").join("");
		}
		
	};
	return Text;
});

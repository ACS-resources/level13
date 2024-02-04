// Central hub for getting any user-facing text
// Handles translation (in the future), building texts from templates, capitalization etc

define(function () {
	var Text = {
		
		isDebugMode: false,
		language: null,
		
		irregularPlurals: {
			wildlife: "wildlife"
		},
		
		getText: function (key) {
			return isDebugMode ? key + "|" : key;
		},
		
		capitalize: function (string) {
			return string;
		},
		
		getArticle: function (s) {
			return this.language.getIndefiniteArticle(s);
		},
		
		isPlural: function (s) {
			return false;
		},
		
		pluralify: function (s) {
			return s;
		},
		
		depluralify: function (s) {
			if (s[s.length - 1] === "s") {
				return s.substr(0, s.length - 1);
			}
			
			return s;
		},
		
		addArticle: function (s) {
			return s;
		},
		
		getIrregularPlural: function (s) {
			return null;
		}
		
	};
	return Text;
});

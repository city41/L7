(function() {
		var _prefix = "mgsnake";

		function k(key) {
			return _prefix + key;
		}

		snake.Storage = {
			get: function(key) {
				var jsonString = localStorage[k(key)];

				if(typeof jsonString === 'undefined') {
					return;
				}

				return JSON.parse(jsonString);
			},
			set: function(key, value) {
				localStorage[k(key)] = JSON.stringify(value);
			},
			present: function(key) {
				return typeof localStorage[k(key)] !== 'undefined';
			}
		};
})();


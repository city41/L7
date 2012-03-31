(function() {
	L7.Observable = {
		on: function(eventName, handler, scope) {
			this._listeners = this._listeners || {};

			if (!this._listeners[eventName]) {
				this._listeners[eventName] = [];
			}

			this._listeners[eventName].push({
				handler: handler,
				scope: scope
			});
		},

		fireEvent: function(eventName, varargs) {
			this._listeners = this._listeners || {};
			var listeners = this._listeners[eventName];

			if (_.isArray(listeners)) {
				var args = _.toArray(arguments);
				args.shift();
				_.each(listeners, function(listener) {
					listener.handler.apply(listener.scope, args);
				});
			}
		}
	};
})();


(function (window) {
	'use strict';

	var cfg = require('./../../config.json');
	var env = (cfg.environment == 'production') ? cfg.production : cfg.development;
	env.environment = cfg.environment;

	// Import variables if present (from env.js)
	if (window) {
		Object.assign(env, window.__env);
	}

	var ngModule = angular
		.module('QiSatApp', ['ngResource', 'ngRoute', 'ngCookies', 'ngMeta', 'ngMask', 'ui.utils.masks', 'mm.foundation', 'timer', 'infinite-scroll', 'angulartics', 'angulartics.google.analytics', 'angulartics.facebook.pixel', 'angular-loading-bar', 'ngSanitize', 'vcRecaptcha', 'credit-cards']);

	ngModule.constant('__env', env);
}(this));
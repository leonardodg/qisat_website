(function () {
    'use strict';

    angular
        .module('QiSatApp')
        .config(['ngMetaProvider', '__env', function (ngMetaProvider, env) {
            ngMetaProvider.setDefaultTitle(env.metatag.tittle);
            ngMetaProvider.setDefaultTag('author', env.metatag.author);
            ngMetaProvider.setDefaultTag('description', env.metatag.description);
            ngMetaProvider.setDefaultTag('keywords', env.metatag.keywords);
        }]);
}());
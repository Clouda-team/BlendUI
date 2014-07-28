define(
    function(require) {

        /**
         * @class runtime
         * @private
         * @singleton
         */

        var runtime = {};

        var core = require('./api/core');
        var layer = require('./api/layer');
        var layerGroup = require('./api/layerGroup');
        var component = require('./api/component');

        runtime.core = core;
        runtime.layer = layer;
        runtime.layerGroup = layerGroup;
        runtime.component = component;

        return runtime;

    }

);

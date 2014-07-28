define(
    function(require) {

        var api = {};
        var noop = function(){};

        // var events = require('./events');
        // var layerapi = require('./layer/layerapi');
        // var blend = require('./blend');

        // api.core={};
        // api.core.removeSplashScreen = noop;

        // api.layer = {};
        // api.layer.on = events.on;
        // api.layer.off = events.off;
        // api.layer.fire = events.fire;
        // api.layer.once = events.once;

        api.layerStopRefresh = function(id){
            if (!id) {//默认使用active layer的id
                id = Blend.ui.activeLayer.attr("data-blend-id") || '0';
            }
            Blend.ui.get(id).endPullRefresh();
            // layerapi.endPullRefresh(Blend.ui.get(id));
        };

        api.layerBack = function(id){
            if (!id) {//默认使用active layer的id
                id = Blend.ui.activeLayer.attr("data-blend-id") || '0';
            }
            // layerapi.endPullRefresh(Blend.ui.get(id));

            Blend.ui.get(id).out();
        };

        api.removeSplashScreen = noop;

        return api;

    }
);
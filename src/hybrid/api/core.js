define(
    function(require) {

        /**
         * @class blend.api.core
         * @blendui native核心接口层
         * @private
         */
        var core = {};

        var apiFn = function(handler, args) {
            try {
                var api = window.nuwa_core || window.nuwa_runtime;
                return api[handler].apply(api, args);
            }catch (e) {
                console.log('BlendUI_Api_Error:'+ handler + '======');
                console.log(e);
            }
        };

        /**
         * 移除启动画面
         * @method {Function} removeSplashScreen
         */
        core.removeSplashScreen = function() {
            apiFn('removeSplashScreen', arguments);
        };

        /**
         * 退出app应用
         * @method {Function} exitApp
         */
        core.exitApp = function() {
            apiFn('exitApp', arguments);
        };

        /**
         * 启动app应用
         * @method {Function} exitApp
         */
        core.launchApp = function(link) {
            apiFn('launchLightApp', arguments);
        };

        return core;
    }
);

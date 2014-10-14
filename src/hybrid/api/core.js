define(
    function(require) {

        /**
         * @class blend.api.core
         * @blendui native核心接口层
         * @private
         */
        var util = require('./util');
        var apiFn = util.apiFn;

        var core = {};

        var keyboard;

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

        /**
         * 显示/ 隐藏键盘
         * @method {Function} keyboard
         */
        core.keyboard = function(boolShow) {
            if (!keyboard) {
                apiFn('addComponent', ["KEYBOARD", 'UIBase', 'com.baidu.lightui.component.keyboard.KeyboardHelper', '{"left":0,"top":0,"width":1,"height":1,"fixed":false}']);
                keyboard = true;
            }
            var isShow = boolShow ? "show" : "hide";
            apiFn('componentExecuteNative', ["KEYBOARD", isShow, '{}']);
        };

        return core;
    }
);
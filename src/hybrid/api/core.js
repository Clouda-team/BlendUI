define(
    function(require) {

        /**
         * @class blend.api.core
         * @blendui native核心接口层
         * @private
         */
        var core = {};

        var keyboard;

        var apiFn = function(handler, args) {
            try {
                var api = window.nuwa_core || window.nuwa_runtime;
                var api2 = window.nuwa_widget || window.lc_bridge;
                var fn;
                if(api2&&(fn=api2[handler])){
                    api = api2; 
                }else{
                    fn = api[handler];
                }
                return fn.apply(api, args);
            }catch (e) {
                console.log('BlendUI_Api_Error:'+ handler +  '======'+fn);
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

        /**
         * 显示/ 隐藏键盘
         * @method {Function} keyboard
         */
        core.keyboard = function( boolShow ) {
            if(!keyboard){
                apiFn('addComponent',["KEYBOARD", 'UIBase', 'com.baidu.lightui.component.keyboard.KeyboardHelper','{"left":0,"top":0,"width":1,"height":1,"fixed":false}']);
                keyboard = true;
            }
            var isShow = boolShow?"show":"hide";
            apiFn('componentExecuteNative',["KEYBOARD",isShow,'{}']);
        };

        return core;
    }
);

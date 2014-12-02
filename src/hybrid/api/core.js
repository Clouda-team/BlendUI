define(
    function(require) {

        /**
         * @class blend.api.core
         * @blendui native核心接口层
         * @private
         */
        var util = require('./util');
        var layer = require('./layer');
        var event = require('./event');

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

        /**
         * dialog对话框组件
         */
        core.dialog = {
            alert : function(options,callback){
                var title = options.title || "";
                var message = options.msg||"";
                var button = options.button||"确定";
                var layerId = options.layerId||layer.getCurrentId();
                var alertId = options.alertId||(1*new Date()+"");
                if(callback){
                    event.once("showAlert",callback,layerId);
                }
                apiFn('showAlert', [layerId, alertId, message, title, button]);
            },
            prompt: function(options,callback){
                var title = options.title || "";
                var message = options.msg||"";
                var buttons = JSON.stringify(options.buttons||['确定','取消']);
                var layerId = options.layerId||layer.getCurrentId();
                var promptId = options.promptId||(1*new Date()+"");
                var defaultText = options.defaultText||"";
                if(callback){
                    event.once("showPrompt",callback,layerId);
                }
                apiFn('showPrompt', [layerId, promptId, message, title, buttons, defaultText]);
            },
            confirm : function(options,callback){
                var title = options.title || "";
                var message = options.msg||"";
                var buttons = JSON.stringify(options.buttons||['确定','取消']);
                var layerId = options.layerId||layer.getCurrentId();
                var promptId = options.promptId||(1*new Date()+"");
                if(callback){
                    event.once("showConfirm",callback,layerId);
                }
                apiFn('showConfirmDialog', [layerId, promptId, message, title, buttons]);
            },
            toast:function(options){
                var message = options.msg||"";
                var layerId = options.layerId||layer.getCurrentId();
                var promptId = options.promptId||(1*new Date()+"");
                var duration = options.duration||0;
                apiFn('showToast', [layerId, promptId, message, duration]);
            }
        };

        return core;
    }
);
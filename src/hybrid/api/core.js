/**
* @file core.js
* @path hybrid/api/core.js
* @desc native核心接口api;
* @author clouda-team(https://github.com/clouda-team)
*/
define(
    function(require) {

        /**
         * @class blend.api.core
         * @blendui native核心接口层
         * @private
         */
        var util = require('./util');
        // dialog作为核心接口引入blend
        var dialog = require('./dialog');

        var apiFn = util.apiFn;
        var core = {};

        // 标志是否已经创建了键盘组件;
        var keyboard;

        /**
         * 移除启动画面
         */
        core.removeSplashScreen = function() {
            apiFn('removeSplashScreen', arguments);
        };

        /**
         * 退出app应用
         */
        core.exitApp = function() {
            apiFn('exitApp', arguments);
        };

        /**
         * 启动app应用
         */
        core.launchApp = function() {
            apiFn('launchLightApp', arguments);
        };

        /**
         * 显示/ 隐藏键盘
         * @param {boolean} boolShow 显示 or 隐藏
         */
        core.keyboard = function(boolShow) {
            if (!keyboard) {
                apiFn('addComponent', [
                    'KEYBOARD',
                    'UIBase',
                    'com.baidu.lightui.component.keyboard.KeyboardHelper',
                    '{"left":0,"top":0,"width":1,"height":1,"fixed":false}'
                ]);
                keyboard = true;
            }
            var isShow = boolShow ? 'show' : 'hide';
            apiFn('componentExecuteNative', [
                'KEYBOARD',
                isShow,
                '{}'
            ]);
        };

        /**
         * dialog对话框组件直接引入core
         */
        core.dialog = dialog;

        return core;
    }
);

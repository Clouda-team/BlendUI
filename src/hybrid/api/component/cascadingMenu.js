/**
* @file cascadingMenu.js
* @path hybrid/api/component/cascadingMenu.js
* @desc native 级联菜单组件相关api;
* @author clouda-team(https://github.com/clouda-team)
*/
define(
    function(require) {

        /**
         * @class rutime.component.cascadingMenu
         * @singleton
         * @private
         */
        var config = require('../config');
        var event = require('../event');
        var util = require('../util');
        var cascadingMenu = {};
        var devPR = config.DEVICE_PR;

        var filterOption = util.filterPositionOption;
        var apiFn = util.apiFn;

        // 增加footbar组件
        cascadingMenu.add = function(id, options) {
            var _options = {
                'left': 0,
                'top': 0,
                'width': window.innerWidth * devPR,
                'height':window.innerHeight/2 * devPR,
                'fixed': true
            };

            _options = filterOption(options, false, _options);

            apiFn('addComponent', [
                id,
                'UIBase',
                'com.baidu.lappgui.blend.component.cascadingMenu.CascadingMenu',
                JSON.stringify(_options)
            ]);

            return cascadingMenu;
        };

        // 设置菜单数据
        cascadingMenu.setMenu = function(id, data) {
            apiFn('componentExecuteNative', [
                id,
                'setMenu',
                JSON.stringify(data)
            ]);
            return cascadingMenu;
        };

        // 显示
        cascadingMenu.show = function(id, options) {
            options = options || {};
            apiFn('componentExecuteNative', [
                id,
                'show',
                JSON.stringify(options)
            ]);
            return cascadingMenu;
        };

        // 选择菜单项
        cascadingMenu.setItemSelected = function(id, options) {
            options = options || {};
            apiFn('componentExecuteNative', [
                id,
                'setItemSelected',
                JSON.stringify(options)
            ]);
            return cascadingMenu;
        };

        // 隐藏
        cascadingMenu.hide = function(id, options) {
            options = options || {};
            apiFn('componentExecuteNative', [
                id,
                'hide',
                JSON.stringify(options)
            ]);
            return cascadingMenu;
        };
        
        // 移除组件
        cascadingMenu.remove = function(id) {
            apiFn('removeComponent', [
                id,
                'UIBase'
            ]);
        };

        // 事件扩展到footbar组件中
        cascadingMenu.on = event.on;

        cascadingMenu.off = event.off;

        return cascadingMenu;
    }
);

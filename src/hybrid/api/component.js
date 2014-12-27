/**
* @file component.js
* @path hybrid/api/component.js
* @desc 组件相关代码入口文件;
* @author clouda-team(https://github.com/clouda-team)
*/
define(
    function(require) {

        var comp = {};

        // 幻灯片组件
        comp.slider = require('./component/slider');
        // footbar组件
        comp.footbar = require('./component/footbar');
        // cascadingMenu
        comp.cascadingMenu = require('./component/cascadingMenu');

        return comp;
    }
);

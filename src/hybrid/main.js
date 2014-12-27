/**
* @file main.js
* @path hybrid/main.js
* @desc requirejs合并头文件;
* @author clouda-team(https://github.com/clouda-team)
*/
require([
    'src/hybrid/blend',
    'src/hybrid/Layer',
    'src/hybrid/LayerGroup',
    'src/hybrid/Slider',
    'src/hybrid/Footbar',
    'src/hybrid/CascadingMenu'
], function(blend, Layer, LayerGroup, Slider, Footbar, CascadingMenu) {
        blend = blend || {};
        blend.Layer = Layer;
        blend.LayerGroup = LayerGroup;
        blend.Slider = Slider;
        blend.Footbar = Footbar;
        blend.CascadingMenu = CascadingMenu;

        // 初始化命名空间;
        window.Blend = window.Blend || {};
        window.Blend.ui = blend;
        window.console && window.console.log('====BlendUI Ok======');
        // 自定义blendready事件
        var _event;
        if (window.CustomEvent) {
            _event = new window.CustomEvent('blendready', {
                bubbles: false,
                cancelable: false
            });
        }
        else {
            _event = document.createEvent('Event');
            _event.initEvent('blendready', false, false);
        }
        blend.ready(function() {
            document.dispatchEvent(_event);
            blend._lanch(blend.getLayerId(), document.querySelector('body'));
        });
    }, null, true);

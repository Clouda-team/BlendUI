define(
    function (require) {

        /**
         * @class rutime.component.footbar 
         * @singleton
         * @private
         */
        var config = require('../config');
        var event = require('../event');
        var util = require('../util');
        var footbar  = {};
        var devPR = config.DEVICE_PR;

        var filterOption = util.filterPositionOption;
        var apiFn = util.apiFn;

        /**
         * 增加slider
         */
        footbar.add = function(id, options){
            var _options = {
                "left":0,
                "top":(window.innerHeight-45)*devPR,
                "width":window.innerWidth*devPR,
                "height":45*devPR,
                "fixed":true
            };

            _options = filterOption(options,false,_options);

            apiFn("addComponent",[id, 'UIBase', 'com.baidu.lightui.component.toolbar.Toolbar', JSON.stringify(_options)]);

            return footbar;
        };
        
        /**
         * 增加images数据
         */
        footbar.setMenu = function(id, data){
            apiFn("componentExecuteNative",[id, 'setMenu',  JSON.stringify(data)]);
            return footbar;
        };
        /**
         * show
         */
        footbar.show = function(id,options){
            options = options||{};
            apiFn("componentExecuteNative",[id, 'show',JSON.stringify(options)]);
            return footbar;
        };

        /**
         * hide
         */
        footbar.hide = function(id, options){
            options = options||{};
            apiFn("componentExecuteNative",[id, 'hide',JSON.stringify(options)]);
            return footbar;
        };

        /**
         * 移除组件
         */
        footbar.remove = function(id){
            apiFn("removeComponent",[id, 'UIBase']);
        };

        footbar.on = event.on;

        footbar.off = event.off;

        return footbar;
    }
);
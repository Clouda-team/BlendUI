define(
    function (require) {

        /**
         * @class rutime.component.footbar 
         * @singleton
         * @private
         */
        var config = require('../config');
        var event = require('../event');
        var footbar  = {};
        var devPR = config.DEVICE_PR;

        var apiFn = function( handler, args){
            try{
                var api = window.nuwa_widget||window.lc_bridge;
                return api[handler].apply(api,args);
            }catch(e){
                console.log("BlendUI_Api_Error:"+handler+"======");
                console.log(e);
            }
        };

        /**
         * 增加slider
         */
        footbar.add = function(id, options){
            var _options = {
                "left":0,
                "top":(window.innerHeight-45)*devPR,
                "width":window.innerWidth*devPR,
                "height":45 * devPR,
                "fixed":true
            };
            ['left','top','width','height','fixed'].forEach(function(n,i){
                if(options&&options[n]!==undefined){
                    _options[n] = options[n]*devPR;
                }
            });
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
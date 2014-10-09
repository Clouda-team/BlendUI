define(
    function(require) {
        /**
         * api通用函数
         */
        var config = require('./config');
        var devPR = config.DEVICE_PR;
        
        var util  = {};

        util.getBasePath = function(link ) {
            var a = document.createElement('a');
            a.href = link;
            return a.href;
        };

        util.stringifyFilter = function(key,val){
            if(typeof val ==="function"){
                return val.toString();
            }else{
                return val;
            }
        };

        util.filterPositionOption = function(options,delKeys,defaultOptions){
            var layerOut = ['left', 'top', 'width', 'height','right','bottom'];
            var _options = defaultOptions||{};
            for(var n in options){
                if(options[n] === undefined || (delKeys&&delKeys.indexOf(n)>=0)) continue;
                _options[n] = layerOut.indexOf(n)>=0?options[n]*devPR:options[n];
            }
            return _options;
        };

        util.apiFn = function(handler, args) {
            try {
                var api = window.nuwa_core || window.nuwa_runtime;
                var api2 = window.nuwa_widget || window.lc_bridge;
                var fn,value;
                if(api2&&(fn=api2[handler])){
                    api = api2; 
                }else{
                    fn = api[handler];
                }
                value  = fn.apply(api, args);
                //android 4.4 true false返回为字符串
                if(value==="ture"){
                    value = true;
                }else if(value==="false"){
                    value = false;
                }
                return value;
            }catch (e) {
                console.log('BlendUI_Api_Error:'+ handler +  '======'+fn);
                console.log(e);
            }
        };


        return util;
    }
);

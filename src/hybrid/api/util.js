define(
    function(require) {

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

        util.filterPositionOption = function(options,delKeys){
            var layerOut = ['left', 'top', 'width', 'height','right','bottom'];
            var _options = {};
            for(var n in options){
                if(options[n] === undefined || (delKeys&&delKeys.indexOf(n)>=0)) continue;
                _options[n] = layerOut.indexOf(n)>=0?options[n]*devPR:options[n];
            }
            return _options;
        };

        util.apiFn = function(handler, args) {
            try {
                var api = window.nuwa_frame || window.lc_bridge;
                var value = api[handler].apply(api, args);
                if(value==="ture"){
                    value=true;
                }else if(value==="false"){
                    value = false;
                }
                return value;
            }catch (e) {
                console.log('BlendUI_Api_Error:'+ handler + '======');
                console.log(e.stack);
            }
        };
        return util;
    }
);

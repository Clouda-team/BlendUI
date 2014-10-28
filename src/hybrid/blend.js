define(
    function(require) {
        var lib = require('../common/lib');
        var runtime = require('./runtime');

        /**
         * @class blend
         * @singleton
         */
        var blend = {};
        var controls = {};
        var isIOS = /iP(ad|hone|od)/.test(navigator.userAgent);

        //有些android手机只执行一次runtimeready
        document.addEventListener('runtimeready', function() {
           blend.readyState = true;
        },false);

        /**
         * 版本信息
         *
         * @property {String} version info
         */
        blend.version = '0.1';

        /**
         * 开放的Api接口entend到blend中
         *
         * @property {Object} Api接口
         */
        blend.api = {};

        /**
         * 注册控件到系统中
         *
         * @param {Control} control 控件实例
         * @return null
         */
        blend.register = function(control) {
            if(controls[control.id]){
                throw (control.type || "") + " New Object Already Exists";
            }else{
              controls[control.id] = control;  
            }
        };

        /**
         * 注销控件
         *
         * @param {Control} control 控件实例
         * @return null
         */
        blend.cancel = function(control) {
            //console.log("reg: " + control.id);
            delete controls[control.id];
        };

        /**
         * 根据id获取实例
         *
         * @param {string} id 控件id
         * @return {Control}
         */
        blend.get = function(id) {
            return controls[id];
        };

        /**
         * runtime ready事件
         * @param {function} 触发函数
         */
        blend.ready = function(callback) {
            var handler = function() {
                outTimeFun && clearTimeout(outTimeFun);
                if (/complete|loaded|interactive/.test(document.readyState)) {
                    callback(blend);
                }else{
                    document.addEventListener('DOMContentLoaded', function() {
                        callback(blend);
                    }, false);
                }
                document.removeEventListener('runtimeready', handler);
            };
            if (blend.readyState || window.nuwa_runtime||window.lc_bridge) {
                handler();
            }else {
                var outTimeFun = setTimeout(handler, 200000);
                document.addEventListener('runtimeready', handler, false);
            }
        };

        /**
         * runtime layer接口
         * @todo remove
         * @property {Object}
         */
        blend.api.layer = runtime.layer;

        /**
         * runtime layerGroup接口
         * @todo remove
         * @property {Object} layerGroup
         */
        blend.api.layerGroup = runtime.layerGroup;

        /**
         * runtime core接口
         * @todo remove
         * @property {Object} core
         */
        blend.api.core = runtime.core;

        //把layer的事件触发绑定到blend上快捷使用

        ['on','off','fire','once','postMessage'].forEach(function(n,i){
            blend[n] = function(){
                runtime.layer[n].apply(runtime.layer,arguments);
            };
        });

        //把coreapi和layer上可直接操作的接口直接暴露给blend.api;
        lib.extend(blend,runtime.core);
        lib.extend(blend,{
            "layerStopRefresh":runtime.layer.stopPullRefresh,
            "layerBack":runtime.layer.back,
            "layerStopLoading":runtime.layer.stopLoading,
            "getLayerId":runtime.layer.getCurrentId,
            "layerSetPullRefresh":runtime.layer.setPullRefresh
        });

        //触发函数
        var mainCall = {};
        blend.start = blend.layerInit = function(id,callback){
            mainCall[id] = callback;
        };

        blend._lanch = function(id,dom){
            
            mainCall[id]&&mainCall[id].call(blend, dom);
        };

        //unload的时候注销所有组件;
        window.addEventListener("unload",function(e){
            for(var i in controls){
                controls[i].destroy&&controls[i].destroy();
            }
        });
        
        return blend;
    }
);

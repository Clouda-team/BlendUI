define(["require",'./../common/lib',"./configs","./events",'../../usecase/js/lib/jquery-2.1.1.js','./api'],
    function(require) {
        var lib = require('./../common/lib');
        var configs = require('./configs');
        var events = require('./events');

        // require('../../third_party/jquery-2.1.1.js');

        /**
         * @class blend
         * @singleton
         */
        var blend = {};
        var controls = {};
        var cbs={};//临时存储，blend.layerInit 的 layerId对应的执行函数


        /**
         * 版本信息
         *
         * @property {String} version info
         */
        blend.version = 'alpha';

        /**
         * 开放的Api接口entend到blend中
         *
         * @property {Object} Api接口
         */

        // blend.api = require('./api');
        lib.extend(blend,require('./api'));


        // {};
        // //main.api.core.removeSplashScreen
        // var noop = function(){};
        // blend.api.core={};
        // blend.api.core.removeSplashScreen = noop;

        // blend.api.layer = {};
        // blend.api.layer.on = events.on;
        // blend.api.layer.off = events.off;
        // blend.api.layer.fire = events.fire;
        // blend.api.layer.once = events.once;

        // blend.api.layerStopRefresh = function(id){
        //     Layer.prototype.endPullRefresh(blend.get(id));
        // };

        
        
        /**
         * 开放的Api接口entend到blend中
         *
         * @property {Object} Api接口
         */
        blend.layerInit = function(layerId,callback){
            if (layerId == '0') {
                blend.activeLayer = $(".page:first");
                callback && callback();
            }
            cbs[layerId] = callback;
        };
        document.addEventListener("onrender",function(eve){
            if (eve.detail && cbs[eve.detail]) {
                cbs[eve.detail].call(blend.get(eve.detail),blend.get(eve.detail).main);//native 无法传递 layer 对象，所以无法使用 this
            }
        });

        /**
         * 当前的active apge 记录到blend中
         *
         * @property {Object} activeLayer
         */
        blend.activeLayer = $('.page');


        /**
         * 是否处于Runtime环境中
         *
         * @property {boolean} inRuntime
         */
        blend.inRuntime = function() {
            return false;
        };//runtime.inRuntime();


        var config = {
            DOMPrefix: 'data-ui',
            classPrefix: {
                'ui' : 'ui',
                'skin' : 'skin',
                'state' : 'state'
            }
        };


        /**
         * 设置config
         *
         * @property {Object} info
         */
        blend.config = function(info) {
            lib.extend(config, info);
        };

        /**
         * 获取config
         *
         * @property {String} name
         */
        blend.getConfig = function(name) {
            return config[name];
        };

        /**
         * 从ID获取Control
         *
         * @param {String} element
         *
         * @return {Control} control
         */
        blend.getUI = function(element) {
            element = $(element)[0];
            do {
                //如果元素是document
                if (!element || element.nodeType == 9) {
                    return null;
                }
                if (element.getAttribute('data-blend')) {
                    return controls[element.getAttribute('data-blend-id')];
                }
            }while ((element = element.parentNode) != document.body);
        };

        /**
         * 注册控件到系统中
         *
         * @param {Control} control 控件实例
         * @return null
         */
        blend.register = function(control) {
            console.log('reg: ' + control.id);
            controls[control.id] = control;
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

        blend.create = function(type, options) {

        };

        /**
         * 根据id获取实例
         *
         * @param {string} id 控件id
         * @return {Control}
         */
        blend.get = function(id) {
            if (id === "0") {
                if (!controls[id]) {
                    controls[id] = new blend.Layer({id:"0"});
                    if ($(".page").length){
                        controls[id].main = $(".page")[0];
                    }else{
                        console.warn(" '0' page need to have classes .pages>.page>.page-content ");
                    }
                    
                }
            }
            return controls[id];
        };

        blend.on = events.on;
        blend.once = events.once;
        blend.off = events.off;
        blend.fire = events.fire;

        /**
        * 添加运行版本判断
        *
        */
        (function(){
            var ua = navigator.userAgent;

            var android = ua.match(/(Android);?[\s\/]+([\d.]+)?/);
            var ipad = ua.match(/(iPad).*OS\s([\d_]+)/);
            var ipod = ua.match(/(iPod)(.*OS\s([\d_]+))?/);
            var iphone = !ipad && ua.match(/(iPhone\sOS)\s([\d_]+)/);

            // Android
            if (android) {
                $("html").addClass('android');
            }
            // iOS
            if (ipad || iphone || ipod) {
                $("html").addClass('ios');
            }
            if (iphone || ipod) {
                $("html").addClass('iphone');
            }
            if (ipad) {
                $("html").addClass('ipad');
            }
            
        })();

        blend.layerStack = [];
        

        blend.configs = configs;

        return blend;
    }
);

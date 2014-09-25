define(
    function(require) {

        /**
         * @class blend.layerApi
         * @singleton
         * @private
         */
        var config = require('./config');
        var event = require('./event');
        var layer = {};
        var devPR = config.DEVICE_PR;
        var initLayerId = '0';
        var getBasePath = function(link ) {
            var a = document.createElement('a');
            a.href = link;
            return a.href;
        };

        var stringifyFilter = function(key,val){
            if(typeof val ==="function"){
                return val.toString();
            }else{
                return val;
            }
        };

        var filterOption = function(options,delKeys){
            var layerOut = ['left', 'top', 'width', 'height'];
            var _options = {};
            for(var n in options){
                if(options[n] === undefined || (delKeys&&delKeys.indexOf(n)>=0)) continue;
                _options[n] = layerOut.indexOf(n)>=0?options[n]*devPR:options[n];
            }
            return _options;
        };

        var apiFn = function(handler, args) {
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

        /**
         * 创建独立layer
         * @method {Function} prepare

         * @param {Object} options Layer的参数
         * @param {String} options.link 页面url
         * @param {Boolean} options.pullToRefresh 是否可以上拉刷新
         * @return {String} pagerid
         * @private
         */
        layer.prepare = function(layerId, options) {
            //subLayer
            var layerOptions = filterOption(options);
            layerOptions.url = getBasePath(layerOptions.url);
            apiFn('prepareLayer', [layerId, JSON.stringify(layerOptions)]);
            return layerId;
        };

        /**
         * 激活创建的layer
         * @method {Function} resume

         * @param {string} layerId 页面layerId
         * @return pagerid
         * @private
         */
        layer.resume = function(layerId, options) {
            if(layer.isActive(layerId)) return;
            var _options = {
                'fx': 'slide',
                'reverse': false,
                'duration': 'normal'
            };
            if (options) {
                options['fx'] && (_options['fx'] = options['fx']);
                options['reverse'] && (_options['reverse'] = options['reverse']);
                options['duration'] && (_options['duration'] = options['duration']);
            }
            apiFn('resumeLayer', [layerId, JSON.stringify(_options)]);

            setTimeout(function() {
                layer.canGoBack(layerId) && layer.clearHistory(layerId);
            },500);

            layer.fire('in', false, layerId);
        };

        /**
         * 退出激活的layer
         * @method {Function} back
         * @return null
         */
        layer.back = function(layerId ) {
            layerId = layerId || "";
            apiFn('backToPreviousLayer', [layerId]);
        };

        /**
         * 刷新独立打开的layer
         * @method {Function} reload
         *
         * @return layerId
         * @private
         */
        layer.reload = function(layerId, url) {
            if (arguments.length === 1 || arguments.length === 0) {
                url = layerId;
                layerId = layer.getCurrentId();
            }
            if (!url) {
                url = layer.getCurrentUrl();
                layer.replaceUrl(layerId, url);
            }else {
                url = getBasePath(url);
                apiFn('layerLoadUrl', [layerId, url]);
            }
            return layerId;
        };

        /**
         * replace url打开的layer
         * @method {Function} reload
         *
         * @return layerId
         * @private
         */
        layer.replaceUrl = function(layerId, url) {
            layer.fire('replace', layerId, url);
            return layerId;
        };

        /**
         * 销毁独立打开的layer
         * @method {Function} destroy
         *
         * @return layerId
         * @private
         */
        layer.destroy = function(layerId) {
            if (!layerId) layerId = layer.getCurrentId();
            apiFn('destroyLayer', [layerId]);
            //layer.fire("layerDestroyEvent",false,layerId);
            return layerId;
        };

        /**
         * 开启下拉刷新
         */
        layer.setPullRefresh = function(layerId,isCan,options){
            if(!layerId) layerId = layer.getCurrentId();
            options = JSON.stringify(options);
            apiFn('layerSetPullRefresh',[layerId,isCan,options]);
        };
        /**
         *
         * 取消拉动刷新
         * @method {Function} destroy
         * @return layerId
         */
        layer.stopPullRefresh = function(layerId) {
            if (!layerId) layerId = layer.getCurrentId();
            apiFn('layerStopRefresh', [layerId]);
            return layerId;
        };

        /**
         * 检测layerId是否存在，
         * @param {String} layerId
         * @return {Boolean} 是否存在
         */
        //todo: 这几个函数可以用一个数组包起来
        layer.isAvailable = function(layerId ) {
            return apiFn('isLayerAvailable', arguments);
        };

        /**
         * 当前页面所在的layer id
         * @return {String} layerId
         */
        layer.getCurrentId = function() {
            return apiFn('currentLayerId', arguments);
        };

        /**
         * 当前页面的url
         * @return {String} url
         */
        layer.getCurrentUrl = function() {
            return apiFn('currentLayerUrl', arguments);
        };


        /**
         * 消除页面的loading状态
         * @return {String} layerId
         */
        layer.stopLoading = function(layerId) {
            layerId = layerId || layer.getCurrentId();
            return apiFn('layerStopLoading', [layerId]);
        };


        /**
         *
         * 注册layer事件触发
         * @method {Function} on
         *
         * @param {String} type
         * @param {Function} handler
         * @param {String} layerId
         *
         * @return layerId
         * @private
         */
        layer.on = event.on;
        layer.once = event.once;
        /**
         *
         * 移除layer事件
         * @method {Function} off
         *
         * @param {String} type
         * @param {Function} handler
         * @param {String} layerId
         *
         * @return layerId
         * @private
         */
        layer.off = event.off;

        /**
         * 触发事件
         * @method {Function} fire
         * @param {String} type 事件类型名字
         * @param {Object||String} message 发送的数据信息可以字符串或者json数据
         * @param {String} targetId 发送的目标layerId,如为false侧是广播,如此参数=="top"侧向原始layer发送;
         *
         * @return
         */
        layer.fire = function(type, targetId, message, callback) {
             if (!targetId) {
                targetId = '';
             }else if (targetId == 'top') {
                targetId = initLayerId;
             }
             var sender = layer.getCurrentId();
             var messData = {};
             messData.data = message || '';
             messData.target = targetId;
             messData.origin = sender;
             if (callback) {
                messData.callEvent = 'call_'+ sender + '_'+ (1 * new Date());
                var handler = function(event) {
                    callback(event['data']);
                    layer.off(messData.callEvent);
                };
                layer.on(messData.callEvent, handler);
             }

             apiFn('layerPostMessage', [sender, targetId, type, encodeURIComponent(JSON.stringify(messData,stringifyFilter))]);
        };

        /**
         * 发送消息
         * @method {Function} postMessage
         *
         * @param {Object||String} message 发送的数据信息可以字符串或者json数据
         * @param {String} targetId 发送的目标layerId,如为false侧是广播,如此参数=="top"侧向原始layer发送;
         *
         * @return
         */

        layer.postMessage = function(message, targetId, callback) {
             layer.fire('message', targetId, message, callback);
        };


        /**
         * 获取layer原始url
         * @return String
         */
        layer.getOriginalUrl = function(layerId) {
            if (!layerId) layerId = layer.getCurrentId();
            return apiFn('layerGetOriginalUrl', [layerId]);
        };

        /**
         * 获取layer当前url
         * @return String
         */
        layer.getUrl = function(layerId) {
            if (!layerId) layerId = layer.getCurrentId();
            return apiFn('layerGetUrl', [layerId]);
        };

        /**
         * 当前url是否可以回退
         * @return Boolean
         */
        layer.canGoBack = function(layerId) {
            if (!layerId) layerId = layer.getCurrentId();
            return apiFn('layerCanGoBack', [layerId]);
        };

        /**
         * 当前url是否可以回退或者前进
         * @return 历史step
         */
        layer.canGoBackOrForward = function(steps, layerId) {
            if (!layerId) layerId = layer.getCurrentId();
            return apiFn('layerCanGoBackOrForward', [layerId, steps || 1]);
        };

        /**
         * 当前layer是否处于激活状态
         *　@return Boolean
         */
        layer.isActive = function(layerId) {
            if (!layerId) layerId = layer.getCurrentId();
            return apiFn('isLayerActive', [layerId]);
        };

        /**
         * 清除layer history历史
         * @return null
         */
        layer.clearHistory = function(layerId) {
            if (!layerId) layerId = layer.getCurrentId();
            return apiFn('layerClearHistory', [layerId]);
        };

        /**
         * 设置layer的position属性{"left","top","height","width"}
         */
        layer.setLayout = function( options ){
            var _options = filterOption(options);
            return apiFn('setLayerLayout',[JSON.stringify(_options)]);
        };

        return layer;
    }
);

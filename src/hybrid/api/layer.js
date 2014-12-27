/**
* @file layer.js
* @path hybrid/api/layer.js
* @desc native layer相关api;
* @author clouda-team(https://github.com/clouda-team)
*/
define(
    function(require) {

        /**
         * @class blend.layerApi
         * @singleton
         * @private
         */
        var event = require('./event');
        var util = require('./util');
        var layer = {};
        var initLayerId = '0';
        var getBasePath = util.getBasePath;

        var stringifyFilter = util.stringifyFilter;

        var filterOption = util.filterPositionOption;

        var apiFn = util.apiFn;

        /**
         * 创建独立layer
         * @param {string} layerId 创建的layer的id,app全局唯一
         * @param {Object} options Layer的参数
         * @param {string} options.url 页面url
         * @param {boolean} options.pullToRefresh 是否可以上拉刷新
         * @return {string} layerId
         * @private
         */
        layer.prepare = function(layerId, options) {
            // subLayer
            var layerOptions = filterOption(options);
            if (layerOptions.url) {
                layerOptions.url = getBasePath(layerOptions.url);
            }
            if(layerOptions.sliderLayer){
                layerOptions.width = (layerOptions.width||(window.innerWidth*1.5))+"";
            }
            
            apiFn('prepareLayer', [
                layerId,
                JSON.stringify(layerOptions)
            ]);
            return layerId;
        };

        /**
         * 激活创建的layer
         * @param {string} layerId 页面layerId
         * @param {Object} options 页面出现参数
         *    slow 500，normal 300， quick 100
         * @private
         */
        layer.resume = function(layerId, options) {
            if (layer.isActive(layerId)) {
                return;
            }
            var _options = {
                'fx': 'slide',
                'reverse': false,
                'duration': 300,
                'cover': false
            };
            var replaceString = {
                'slow': 500,
                'normal': 300,
                'quick': 100
            };
            _options = filterOption(options, false, _options);
            if (replaceString[_options['duration']]) {
                _options['duration'] = replaceString[_options['duration']];
            }
            apiFn('resumeLayer', [
                layerId,
                JSON.stringify(_options)
            ]);
            setTimeout(function() {
                layer.canGoBack(layerId) && layer.clearHistory(layerId);
            }, 500);
            layer.fire('in', false, layerId);
        };

        /**
         * 退出激活的layer
         * @param {string} layerId 退出后返回到的layerId
         */
        layer.back = function(layerId) {
            layerId = layerId || '';
            apiFn('backToPreviousLayer', [
                layerId
            ]);
        };

        /**
         * 隐藏sublayer
         * @param {string} layerId 要隐藏的subLayer Id
         */
        layer.hideSubLayer = function(layerId) {
            layerId = layerId || '';
            apiFn('hideSubLayer', [
                layerId
            ]);
        };

        /**
         * 刷新独立打开的layer
         * @param {string} [layerId] 要刷新的layerId
         * @param {string} [url] 要刷新的页面url
         * @return {string} layerId
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
            }
            else {
                url = getBasePath(url);
                apiFn('layerLoadUrl', [
                    layerId,
                    url
                ]);
            }  
            return layerId;
        };

        layer.replaceUrl = function(layerId, url) {
            layer.fire('replace', layerId, url);
            return layerId;
        };

        layer.destroy = function(layerId) {
            layerId = layerId || layer.getCurrentId();
            apiFn('destroyLayer', [
                layerId
            ]);
            // layer.fire('layerDestroyEvent',false,layerId);
            return layerId;
        };

        layer.setPullRefresh = function(layerId, isCan, options) {
            layerId = layerId || layer.getCurrentId();
            options = JSON.stringify(options);
            apiFn('layerSetPullRefresh', [
                layerId,
                isCan,
                options
            ]);
        };

        layer.stopPullRefresh = function(layerId) {
            layerId = layerId || layer.getCurrentId();
            apiFn('layerStopRefresh', [
                layerId
            ]);
            return layerId;
        };

        /**
         * 检测layerId是否存在，
         * @param {string} layerId 检测layerId
         * @return {boolean} 是否存在
         */
        layer.isAvailable = function(layerId) {
            return apiFn('isLayerAvailable', arguments);
        };

        /**
         * 当前页面所在的layer id
         * @return {string} layerId
         */
        layer.getCurrentId = function() {
            return apiFn('currentLayerId', arguments);
        };

        /**
         * 当前页面的url
         * @return {string} url
         */
        layer.getCurrentUrl = function() {
            return apiFn('currentLayerUrl', arguments);
        };

        layer.stopLoading = function(layerId) {
            layerId = layerId || layer.getCurrentId();
            return apiFn('layerStopLoading', [
                layerId
            ]);
        };

        layer.on = event.on;
        layer.once = event.once;


        layer.off = event.off;


        layer.fire = function(type, targetId, message, callback) {
            if (!targetId) {
                targetId = '';
            }
            else if (targetId === 'top') {
                targetId = initLayerId;
            }
            var sender = layer.getCurrentId();
            var messData = {};
            messData.data = message || '';
            messData.target = targetId;
            messData.origin = sender;
            if (callback) {
                messData.callEvent = 'call_' + sender + '_' + (1 * new Date());
                var handler = function(event) {
                    callback(event['data']);
                    layer.off(messData.callEvent);
                };
                layer.on(messData.callEvent, handler);
            }

            apiFn('layerPostMessage', [
                sender,
                targetId,
                type,
                encodeURIComponent(JSON.stringify(messData, stringifyFilter))
            ]);
        };

        layer.postMessage = function(message, targetId, callback) {
            layer.fire('message', targetId, message, callback);
        };


        // 获取layer原始url
        layer.getOriginalUrl = function(layerId) {
            layerId = layerId || layer.getCurrentId();
            return apiFn('layerGetOriginalUrl', [
                layerId
            ]);
        };

        // 获取layer当前url
        layer.getUrl = function(layerId) {
            layerId = layerId || layer.getCurrentId();
            return apiFn('layerGetUrl', [
                layerId
            ]);
        };

        // 当前url是否可以回退
        layer.canGoBack = function(layerId) {
            layerId = layerId || layer.getCurrentId();
            return apiFn('layerCanGoBack', [
                layerId
            ]);
        };

        // 当前url是否可以回退或者前进
        layer.canGoBackOrForward = function(steps, layerId) {
            layerId = layerId || layer.getCurrentId();
            return apiFn('layerCanGoBackOrForward', [
                layerId,
                steps || 1
            ]);
        };

        /**
         * 当前layer是否处于激活状态
         * @param {string} [layerId] 要测试的layerId
         * @return {boolean} native返回值
         */
        layer.isActive = function(layerId) {
            layerId = layerId || layer.getCurrentId();
            return apiFn('isLayerActive', [
                layerId
            ]);
        };

        /**
         * 清除layer history历史
         * @param {string} [layerId] 要清除的layerId
         * @return {Object} native返回码
         */
        layer.clearHistory = function(layerId) {
            layerId = layerId || layer.getCurrentId();
            return apiFn('layerClearHistory', [
                layerId
            ]);
        };
        // showSlider
        layer.showSlider = function(layerId) {
            layerId = layerId || layer.getCurrentId();
            return apiFn('showSlider', [
                layerId
            ]);
        };

        // hideSlider
        layer.hideSlider = function(layerId) {
            layerId = layerId || layer.getCurrentId();
            return apiFn('hideSlider', [
                layerId
            ]);
        };

        // 设置subLayer的大小
        layer.setLayout = function(layerId, options) {
            var _options = filterOption(options);
            return apiFn('layerSetLayout', [
                layerId,
                JSON.stringify(_options)
            ]);
        };

        return layer;
    }
);

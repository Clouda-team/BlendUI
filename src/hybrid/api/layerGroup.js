define(
    function(require) {

        /**
         * @class blend.Api.layer
         * @singleton
         * @private
         */
        var config = require('./config');
        var event = require('./event');
        var layerGroup = {};
        var devPR = config.DEVICE_PR;
        var getBasePath = function(link ) {
            var a = document.createElement('a');
            a.href = link;
            return a.href;
        };

        // native api回调
        var apiFn = function(handler, args) {
            try {
                var api = window.nuwa_frame || window.lc_bridge;
                return api[handler].apply(api, args);
            }catch (e) {
                console.log('BlendUI_Api_Error:'+ handler + '======');
                console.log(e);
            }
        };

        /**
         * 通知runtime创建pagerGroup，成功回掉返回 runtime句柄winid
         *
         * @param {String} groupId id
         * @param {Array} layers 本地或网络url链接组成的Array
         * @param {Object} options pager数组
         * @return null
         * @private
         */

        layerGroup.create = function(groupId, layers, options) {
            var layerInfo = {
                id: groupId || uniqid(),
                infos: layers
            };
            layers.forEach(function(n, i) {
                n.url = getBasePath(n.url);
            });

            if (options.active) {
                layerInfo.active = options.active;
            }
            var groupOptions = {};

            //过滤没用字段和devPR;
            ['left', 'top', 'width', 'height'].forEach(function(n, i) {
                if (options[n] !== undefined) {
                    groupOptions[n] = options[n] * devPR;
                }
            });

            apiFn('addLayerGroup', [JSON.stringify(layerInfo), JSON.stringify(groupOptions)]);
            return groupId;
        };

        /**
         * 激活GroupId下面的对应的layerId
         * @method {Function} showLayer
         * @return groupId
         * @private
         */
        layerGroup.showLayer = function(groupId, layerId) {
            apiFn('showLayerInGroup', arguments);
            //@todo return
            return groupId;
        };

        /**
         * 在group中增加layer
         * @private
         * @return groupId
         */
        layerGroup.addLayer = function(groupId, layerGroup) {
            apiFn('addLayerInGroup', arguments);
            //@todo return
            return groupId;
        };

        /**
         * 在group中删除layer
         * @private
         * @return groupId
         */
        layerGroup.removeLayer = function(groupId, layerId) {
            apiFn('removeLayerInGroup', arguments);
            //@todo return
            return groupId;
        };

        /**
         * 在group中更新layer
         * @private
         * @return groupId
         */
        layerGroup.updateLayer = function(groupId, layerId, layerOptions) {
            apiFn('updateLayerInGroup', arguments);
            //@todo return
            return groupId;
        };

        /*layerGroup.toggleScroll = function(groupId) {
            layerGroup.setScroll(groupId, !layerGroup.isScroll(groupId));
        };

        layerGroup.isScroll = function(groupId ) {
            return apiFn('canLayerGroupScroll', arguments);
        };

        layerGroup.setScroll = function(groupId, isCan) {
            //console.log(groupId+"=="+isCan);
            apiFn('setCanLayerGroupScroll', arguments);
        };*/


        //todo: layergroup也支持跨webview的event吧

        return layerGroup;

    }
);

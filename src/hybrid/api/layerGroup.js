define(
    function(require) {

        /**
         * @class blend.Api.layer
         * @singleton
         * @private
         */
        var event = require('./event');
        var layer = require('./layer');
        var util = require('./util');

        var layerGroup = {};

        var getBasePath = util.getBasePath;

        var stringifyFilter = util.stringifyFilter;

        var filterOption = util.filterPositionOption;

        var apiFn = util.apiFn;

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

            var groupOptions = filterOption(options,['active']);
            
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
        layerGroup.addLayer = function(groupId, options) {
            apiFn('addLayerInGroup', [groupId,JSON.stringify(options)]);
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
        layerGroup.updateLayer = function(groupId,layerOptions) {
            apiFn('updateLayerInGroup', arguments);
            //@todo return
            return groupId;
        };

        layerGroup.toggleScroll = function(layerId,groupId) {
            if(arguments.length==1){
               groupId =  layerId;
               layerId = layer.getCurrentId(); 
            }
            layerGroup.setScroll(layerId,groupId, !layerGroup.isScroll(layerId, groupId));
        };

        layerGroup.isScroll = function(layerId, groupId) {
            if(arguments.length==1){
               groupId =  layerId;
               layerId = layer.getCurrentId(); 
            }
            return apiFn('canLayerGroupScroll', [layerId, groupId]);
        };

        layerGroup.setScroll = function(layerId, groupId, isCan) {
            if(arguments.length==2){
                isCan = groupId;
                groupId = layerId;
                layerId = layer.getCurrentId();
            }
            setTimeout(function(){
                apiFn('setCanLayerGroupScroll', [layerId, groupId, isCan]);
            },100);
        };

        layerGroup.removeLayerGroup = function(groupId) {
            apiFn('removeLayerGroup',arguments);
        };

        layerGroup.hideLayerGroup = function(groupId) {
            apiFn('hideLayerGroup',arguments);
        };

        layerGroup.layerGroupSetLayout = function(groupId, options) {
            var _options = filterOption(options);
            return apiFn('layerGroupSetLayout',[groupId,JSON.stringify(_options)]);
        };

        return layerGroup;
    }
);

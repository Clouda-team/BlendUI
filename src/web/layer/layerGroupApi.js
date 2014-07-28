define(

    /**
     * layerGroupApi，封装group api 事件。
     * 本api依赖于 crema css， index.html页面需要有 div.pages 容器。
     * refresh 需要设定refresh的容易：page-content
     *
     */

    function(require) {

        var api = {};

        var layerapi = require('./layerapi');
        /**
         * @class blend.Api.layer
         * @singleton
         * @private
         */
        var devPR = window.devicePixelRatio || 2;


        /**
         * 创建pagerGroup，成功回掉返回 runtime句柄winid
         *
         * @param {String} groupId id
         * @param {Array} layers 本地或网络url链接组成的Array
         * @param {Object} options pager数组
         * @return null
         * @private
         */

        api.create = function(groupId, layers, options, context) {
            var layerInfo = {
                id: groupId || uniqid(),
                infos: layers
            };
            if (options.active) {
                layerInfo.active = options.active;
            }
            var groupOptions = {};

            ['left', 'top', 'width', 'height'].forEach(function(n, i) {
                if (options[n] !== undefined) {
                    groupOptions[n] = options[n] * devPR;
                }
            });
            var dom;
            for (var i = 0, len = layers.length; i < len; i++) {
                //load these apis.
                dom = document.createElement('div');
                dom.className = 'page';

                layerapi.prepare(layers[i].id, options, dom);

                context.main.appendChild(dom);

            }

            // window.lc_bridge.addLayerGroup(JSON.stringify(layerInfo), JSON.stringify(groupOptions));


            return groupId;
        };

        /**
         * 激活GroupId下面的对应的layerId
         * @method {Function} showLayer
         * @return groupId
         * @private
         */
        api.showLayer = function(groupId, layerId, context) {//groupId no use

            if (context.__layers[layerId]) {
                context.__layers[layerId].in();

                context.activeId = layerId;
            }else {
                console.warn('no layerid found...' + layerId);
            }
            // window.lc_bridge.showLayerInGroup(groupId, layerId);
            //@todo return
            return groupId;
        };

        /**
         * 在group中增加layer
         * @private
         * @return groupId
         */
        api.addLayer = function(groupId, layerGroup) {
            window.lc_bridge.addLayerInGroup(groupId, layerGroup, index);
            //@todo return
            return groupId;
        };

        /**
         * 在group中删除layer
         * @private
         * @return groupId
         */
        api.removeLayer = function(groupId, layerId) {
            window.lc_bridge.removeLayerInGroup(groupId, layerId);
            //@todo return
            return groupId;
        };

        /**
         * 在group中更新layer
         * @private
         * @return groupId
         */
        api.updateLayer = function(groupId, layerId, layerOptions) {
            window.lc_bridge.updateLayerInGroup(groupId, layerId, layerOptions);
            //@todo return
            return groupId;
        };



        return api;
    }
);

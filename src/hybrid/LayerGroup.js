/**
 * @file LayerGroup.js
 * @path hybrid/LayerGroup.js
 * @extends Control
 * @desc LayerGruop类，内含多个Layer，可以放置在手机屏幕的任何位置，系统会自动管理多个Layer之间的滑动关系
 * @author clouda-team(https://github.com/clouda-team)
 */
define(
    function(require) {
        var lib = require('../common/lib');
        var runtime = require('./runtime');
        var Control = require('./Control');
        var layerGroupApi = runtime.layerGroup;
        var layerApi = runtime.layer;

        /**
         * LayerGroup结构化函数;
         * @constructor
         * @extends Control
         * @param {Object} options 有创建独立layer所需要的条件
         * @param {Array} options.layers LayerGroup中的Layer参数options
         * @param {string} options.layers.url layer的link
         * @param {boolean} [options.layers.active=false] layer默认展示
         * @param {boolean} [options.layers.autoload=false] 是否自动加载
         * @param {string} [options.layers.id] layer的id
         * @param {Function} [options.layers.onload] webview页面onload的回调
         * @param {Function} [options.layers.onshow] layer被唤起时会触发此事件
         * @param {Function} [options.layers.onhide] layer被隐藏时会触发此事件
         * @param {boolean} [options.layers.pullToRefresh] 是否支持下拉刷新
         * @param {Array|string} [options.layers.ptrIcon] 下拉时显示的图标。
         * @param {Array|string} [options.layers.ptrText] 下拉时显示的文字。
         * @param {string} [options.layers.ptrColor] 文字颜色
         * @param {Function} [options.layers.ptrOnsuccess] 成功后的回调
         * @param {Function} [options.layers.ptrOnfail] 失败后的回调
         * @param {string} [options.id] layerGroup实例id
         * @param {string} [options.top=0] layerGroup距离屏幕top的坐标
         * @param {string} [options.left=0] layerGroup距离屏幕left的坐标
         * @param {string} [options.width] layer像素宽度，默认全屏
         * @param {string} [options.height] layer像素高度，默认全屏
         */
        var LayerGroup = function(options) {
            // if(!(this instanceof LayerGroup)){
            //    return new LayerGroup(options);
            // }
            Control.call(this, options);
            this.layerId = layerApi.getCurrentId();
            this._init(options);
        };

        // 继承于control
        lib.inherits(LayerGroup, Control);

        LayerGroup.prototype.constructor = LayerGroup;

        /**
         * 组件的类型
         *
         * @cfg {string} type
         */
        LayerGroup.prototype.type = 'layerGroup';

        /**
         * layerGroup是否可以拖动切换
         *
         * @cfg {boolean} scrollEnabled
         */
        LayerGroup.prototype.scrollEnabled = true;

        /**
         * position值
         */
        LayerGroup.prototype.top = 0;
        LayerGroup.prototype.left = 0;
        LayerGroup.prototype.width = window.innerWidth;
        LayerGroup.prototype.height = window.innerHeight;

        /**
         * @private
         * 对象初始化, 私有方法;
         * @param {Object} options 创建group的初始化参数,
         * @return {LayerGroup} this
         */
        LayerGroup.prototype._init = function(options) {
            var me = this;
            var layers = {};
            var activeId = null;
            // 结构化layers为object
            if (!me.layers || !me.layers.length) {
                return;
            }

            for (var i = 0, len = me.layers.length; i < len; i++) {
                if (!me.layers[i].id) {
                    me.layers[i].id = lib.getUniqueID();
                }
                if (me.layers[i].active) {
                    activeId = me.layers[i].id;
                }
                layers[me.layers[i].id] = me.layers[i];
            }

            me._layers = layers;

            me.activeId = activeId || me.layers[0].id;

            // 监听事件
            me._initEvent();

            me.render();

            // todo;
            return this;
        };

        /**
         * @private
         * 事件初始化
         */
        LayerGroup.prototype._initEvent = function() {
            var me = this;
            var layersLen = me.layers.length;
            var selectedFn = function(event) {
                // console.info('group selected:' + event['groupId']);
                if (event.groupId === me.id) {
                    if (me.activeId === me.layers[0].id
                        && event.layerId === me.layers[0].id) {
                        return;
                    }
                    if (me.activeId === me.layers[layersLen - 1].id
                        && event.layerId === me.layers[layersLen - 1].id) {
                        return;
                    }
                    event.detail = event.layerId;
                    me.onshow && me.onshow.call(me, event);
                    me.onselected && me.onselected.call(me, event);
                    if (me._layers[event.layerId].onshow) {
                        me._layers[event.layerId].onshow.call(me);
                    }
                    if (me.activeId !== event.layerId && me._layers[me.activeId].onhide) {
                        me._layers[me.activeId].onhide.call(me);
                    }
                    me.activeId = event.layerId;
                }
            };
            /* 暂不支持滚动触发
            var scrollFn = function() {
                var oTime = +new Date();
                var _op = 0;
                return function(event) {
                   // console.info('group scroll:'+ event['groupId']);
                   // console.info('group scroll:'+ event['groupPixelOffset']);
                   // console.info('group scroll:'+ event['layerId']);
                   // console.info('group scroll:'+ event['groupPercentOffset']);
                   var nTime = +new Date();
                   var _stop = (event['groupPercentOffset'] == 0 || event['groupPercentOffset'] == 1);
                   if (_stop || (nTime - oTime) < 100) {
                        return;
                   }
                   oTime = nTime;

                   var _swipe = event['groupPixelOffset'] - _op > 0 ? 'left': 'right';
                   var _dir = event['layerId'] == me.activeId ? 'left': 'right';
                   _op = event['groupPixelOffset'];
                   event['swipe'] = _stop ? 'stop': _swipe;
                   event['dir'] = _stop ? 'stop': _dir;
                   if (event['groupId'] == me.id) {
                       me.onscroll && me.onscroll.call(me, event);
                   }
                }
                };*/
            document.addEventListener('groupSelected', selectedFn, false);
            // document.addEventListener('groupScrolled', scrollFn(), false);
            document.addEventListener('layerLoadFinish', function(e) {
                var _layer = me._layers[e.origin];
                if (_layer && _layer.onload) {
                    _layer.onload && _layer.onload.call(me);
                }
                if (_layer && _layer.pullToRefresh) {
                    layerApi.setPullRefresh(_layer.id, true, {
                        'pullText': _layer.pullText,
                        'loadingText': _layer.loadingText,
                        'releaseText': _layer.releaseText,
                        'pullIcon': _layer.pullIcon,
                        'pullBgColor': _layer.pullBgColor

                    });
                }
                _layer.state = 'loaded';
            }, false);

            /*document.addEventListener('groupStateChanged',
            function(event) {
                console.log('groupStateChanged '
                + event['groupId']
                + ' '
                + event['layerId']
                + '  ' + event['groupState']);
            }, false);*/
        };

        /**
         * 获取layer对象
         * @param {string} layerId layer的id
         * @return {Object} layer对象
         */
        LayerGroup.prototype.getLayerValueById = function(layerId) {
            return this._layer[layerId];
        };

        /**
         * 创建渲染页面
         * @return {LayerGroup} this
         */
        LayerGroup.prototype.paint = function() {
            var me = this;
            var options = {
                left: me.left,
                top: me.top,
                width: me.width,
                height: me.height,
                scrollEnabled: me.scrollEnabled,
                active: me.activeId

            };
            layerGroupApi.create(me.id, me.layers, options);
            return this;
        };

        /**
         * 激活相应layer
         * @param {string} layerId layer的id
         * @return {LayerGroup} this
         */
        LayerGroup.prototype.active = function(layerId) {
            layerGroupApi.showLayer(this.id, layerId);
            return this;
        };

        /**
         * 删除layer
         * @param {string} layerId group中layer id
         * @return {LayerGroup} this
         */
        LayerGroup.prototype.remove = function(layerId) {
            layerGroupApi.removeLayer(this.id, layerId);
            delete this._layers[layerId];
            return this;
        };

        /**
         * 增加layer
         * @param {Object} layerOptions layer Options
         * @param {Number} [index=last] 插入到第index个下标之后
         * @return {Layer}
         */
        LayerGroup.prototype.add = function(layerOptions, index) {
            if (!layerOptions.id) {
                layerOptions.id = lib.getUniqueID();
            }

            layerGroupApi.addLayer(this.id, layerOptions);

            this._layers[layerOptions.id] = layerOptions;

            return this;
        };

        LayerGroup.prototype.update = function(layerId, layerOptions) {
            layerGroupApi.updateLayer(this.id, layerId, layerOptions);

            lib.extend(this._layers[layerOptions.id], layerOptions);
            return this;
        };

        LayerGroup.prototype.destroy = function() {
            layerGroupApi.removeLayerGroup(this.id);
            Control.prototype.destroy.apply(this, arguments);
        };

        LayerGroup.prototype.isScroll = function() {
            return layerGroupApi.isScroll(this.layerId, this.id);
        };

        LayerGroup.prototype.setScroll = function(isCan) {
            layerGroupApi.setScroll(this.layerId, this.id, isCan);
        };

        LayerGroup.prototype.toggleScroll = function() {
            layerGroupApi.toggleScroll(this.layerId, this.id);
        };

        LayerGroup.prototype.hide = function() {
            layerGroupApi.hideLayerGroup(this.id);
        };

        LayerGroup.prototype.show = function() {
            layerGroupApi.showLayerGroup(this.id);
        };

        LayerGroup.prototype.setLayout = function(options) {
            var me = this;
            [
                'top',
                'left',
                'width',
                'height'
            ].forEach(function(n, i) {
                if (options[n]) {
                    me[n] = options[n];
                }
                else {
                    options[n] = me[n];
                }
            });
            // options.height = options.height-options.top;
            layerGroupApi.layerGroupSetLayout(this.id, options);
        };

        return LayerGroup;
    }
);

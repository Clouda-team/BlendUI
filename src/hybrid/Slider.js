/**
* @file Slider.js
* @path hybrid/Slider.js
* @extends Control
* @desc 幻灯片基类
* @author clouda-team(https://github.com/clouda-team)
*/
define(
    function(require) {
        var lib = require('../common/lib');
        var runtime = require('./runtime');
        var Control = require('./Control');
        var sliderApi = runtime.component.slider;


        /**
         * Slider 初始化参数;
         * @constructor
         * @param {Object} options 有创建独立slider所需要的条件
         * @param {string} [options.id] slider实例id
         * @param {string} [options.top=0] slider距离屏幕top的坐标
         * @param {string} [options.left=0] slider距离屏幕left的坐标
         * @param {string} [options.width] slider像素宽度，默认全屏
         * @param {string} [options.height] slider像素高度，默认全屏
         * @param {string} [options.bgColor] 背景颜色，默认透明
         * @param {string} [options.hasIndicator] 是否显示滑动指示器
         * @param {string} [options.inactiveColor] 指示器默认颜色
         * @param {string} [options.activeColor] 指示器focus颜色
         * @param {string} [options.verticalMargin] 指示器底部距离
         * @param {string} [options.unitSize] 指示器底部距离
         * @param {string} [options.unitSpace] 指示器底部距离
         * @param {Obeject} [options.images] 图片json数据 {}
         * @param {Function} [options.tap] 点击slider的事件回调
         * @param {Function} [options.slide] 发生slide的事件回调
         * @return {Slider} this
         */
        var Slider = function(options) {
            Control.call(this, options);
            this._init(options);
            return this;
        };

        // 继承control类;
        lib.inherits(Slider, Control);

        Slider.prototype.constructor = Slider;

        /**
         * @private
         * 实例初始化,根据传参数自动化实例方法调用, 私有方法;
         * @param {Object} options 创建layer的初始化参数
         * @return {Slider} this;
         */
        Slider.prototype._init = function(options) {
            this._initEvent();

            this.render();

            return this;
        };

        // 默认属性
        Slider.prototype.type = 'slider';

        /**
         * @private
         * 事件初始化
         * @return {Slider} this
         */
        Slider.prototype._initEvent = function() {
            var me = this;

            sliderApi.on('sliderTap', function(event) {
                me.tap && me.tap.apply(me, arguments);
                me.fire('sliderTap', arguments, me);
            }, me.id, me);

            sliderApi.on('sliderSlide', function(event) {
                me.slide && me.slide.apply(me, arguments);
                me.fire('sliderSlide', arguments, me);
            }, me.id, me);

            // 销毁之后撤销绑定
            me.on('afterdistory', function() {
                sliderApi.off('tap', 'all', me.id, me);
                sliderApi.off('slide', 'all', me.id, me);
            });

            window.addEventListener('unload', function(e) {
                me.destroy();
            });

            return me;
        };

        /**
         * 创建渲染页面
         * @return {Slider} this 当前实例
         */
        Slider.prototype.paint = function() {
            var me = this;
            sliderApi.add(me.id, {
                top: me.top,
                left: me.left,
                width: me.width,
                height: me.height,
                fixed: me.fixed

            });

            sliderApi.addItems(me.id, {
                images: me.images

            });

            if (me.bgColor) {
                // @todo 处理颜色
                sliderApi.setConfig(me.id, {
                    backgroundColor: me.bgColor

                });
            }

            // 是否添加指示器
            if (me.hasIndicator) {
                sliderApi.setupIndicator(me.id, {
                    activeColor: me.activeColor,
                    inactiveColor: me.inactiveColor,
                    unitSize: me.unitSize,
                    unitSpace: me.unitSpace,
                    verticalMargin: me.verticalMargin

                });
            }
            return this;
        };

        Slider.prototype.prev = function() {
            sliderApi.prev(this.id);
        };

        Slider.prototype.next = function() {
            sliderApi.next(this.id);
        };

        Slider.prototype.slideTo = function(index) {
            sliderApi.slideTo(this.id, index, true);
        };

        /**
         * 销毁
         */
        Slider.prototype.destroy = function() {
            sliderApi.remove(this.id);
            Control.prototype.destroy.apply(this, arguments);
        };

        return Slider;
    }
);

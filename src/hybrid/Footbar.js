/**
 * @file Footbar.js
 * @path hybrid/Footbar.js
 * @desc 底部菜单基类
 * @author clouda-team(https://github.com/clouda-team)
 */
define(
    function(require) {
        var lib = require('../common/lib');
        var runtime = require('./runtime');
        var Control = require('./Control');
        var footbarApi = runtime.component.footbar;


        /**
         * footbar 初始化参数
         * @constructor
         * @param {Object} options 有创建独立Footbar所需要的条件
         * @param {string} [options.id] Footbar实例id
         * @param {Object} [options.menus] 菜单json数据 {}
         * @return {Footbar} this
         */
        var Footbar = function(options) {
            Control.call(this, options);
            this._init(options);
            return this;
        };

        // 继承control类;
        lib.inherits(Footbar, Control);

        Footbar.prototype.constructor = Footbar;

        /**
         * 实例初始化,根据传参数自动化实例方法调用, 私有方法;
         * @private
         * @param {Object} options 创建layer的初始化参数同结构化options参数
         * @return {Footbar} this
         */
        Footbar.prototype._init = function(options) {
            this._initEvent();

            this.render();

            return this;
        };

        // 默认属性
        Footbar.prototype.type = 'footbar';

        /**
         * 事件初始化
         * @private
         * @return {Footbar} this
         */
        Footbar.prototype._initEvent = function() {
            var me = this;

            footbarApi.on('toolbarMenuSelected', function(event) {
                me.selected && me.selected.apply(me, arguments);
                me.fire('selected', arguments, me);
            }, me.id, me);

            // 销毁之后撤销绑定
            me.on('afterdistory', function() {
                footbarApi.off('toolbarMenuSelected', 'all', me.id, me);
            });

            window.addEventListener('unload', function(e) {
                me.destroy();
            });

            return me;
        };

        /**
         * 创建渲染页面
         * @return {Footbar} this 当前实例
         */
        Footbar.prototype.paint = function() {
            var me = this;
            footbarApi.add(me.id, {
                top: me.top,
                left: me.left,
                width: me.width,
                height: me.height,
                fixed: me.fixed
            });

            footbarApi.setMenu(me.id, {
                menus: me.menus

            });
            return this;
        };

        // updata
        Footbar.prototype.updataMenu = function(data) {
            footbarApi.updateMenu(this.id,{
                menus: data
            });
        };

        // show
        Footbar.prototype.show = function() {
            footbarApi.show(this.id);
        };

        // hide
        Footbar.prototype.hide = function() {
            footbarApi.hide(this.id);
        };


        /**
         * 销毁
         */
        Footbar.prototype.destroy = function() {
            footbarApi.remove(this.id);
            Control.prototype.destroy.apply(this, arguments);
        };

        return Footbar;
    }
);

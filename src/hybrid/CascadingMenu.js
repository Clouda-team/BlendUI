/**
 * @file CascadingMenu.js
 * @path hybrid/CascadingMenu.js
 * @desc 级联菜单基类
 * @author clouda-team(https://github.com/clouda-team)
 */
define(
    function(require) {
        var lib = require('../common/lib');
        var runtime = require('./runtime');
        var Control = require('./Control');
        var cascadingMenuApi = runtime.component.cascadingMenu;


        /**
         * cascadingMenuApi 初始化参数
         * @constructor
         * @param {Object} options 有创建独立CascadingMenu所需要的条件
         * @param {string} [options.id] CascadingMenu实例id
         * @param {Array} [options.menus] 菜单json数据 {}
         * @param {number} [options.top] 菜单top值
         * @param {number} [options.left] 菜单left值
         * @param {number} [options.width] 菜单的宽
         * @param {number} [options.height] 菜单的高
         * @return {CascadingMenu} this
         */
        var CascadingMenu = function(options) {
            Control.call(this, options);
            this._init(options);
            return this;
        };

        // 继承control类;
        lib.inherits(CascadingMenu, Control);

        CascadingMenu.prototype.constructor = CascadingMenu;

        /**
         * 实例初始化,根据传参数自动化实例方法调用, 私有方法;
         * @private
         * @param {Object} options 创建layer的初始化参数同结构化options参数
         * @return {CascadingMenu} this
         */
        CascadingMenu.prototype._init = function(options) {
            this._initEvent();

            this.render();

            return this;
        };

        // 默认属性
        CascadingMenu.prototype.type = 'cascadingMenu';

        /**
         * 事件初始化
         * @private
         * @return {CascadingMenu} this
         */
        CascadingMenu.prototype._initEvent = function() {
            var me = this;

            cascadingMenuApi.on('cascadingMenuSelected', function(event) {
                me.selected && me.selected.apply(me, arguments);
                me.fire('selected', arguments, me);
            }, me.id, me);

            // 销毁之后撤销绑定
            me.on('afterdistory', function() {
                cascadingMenuApi.off('cascadingMenuSelected', 'all', me.id, me);
            });

            window.addEventListener('unload', function(e) {
                me.destroy();
            });

            return me;
        };

        /**
         * 创建渲染页面
         * @return {CascadingMenu} this 当前实例
         */
        CascadingMenu.prototype.paint = function() {
            var me = this;
            cascadingMenuApi.add(me.id, {
                top: me.top,
                left: me.left,
                width: me.width,
                height: me.height,
                fixed: me.fixed
            });

            cascadingMenuApi.setMenu(me.id, {
                menus: me.menus
            });
            return this;
        };

        // show
        CascadingMenu.prototype.show = function() {
            cascadingMenuApi.show(this.id);
        };

        // hide
        CascadingMenu.prototype.hide = function() {
            cascadingMenuApi.hide(this.id);
        };

        // 选择菜单中的某个项
        CascadingMenu.prototype.selectItem= function( data ){
            cascadingMenuApi.setItemSelected(this.id,{
                menus: [data]
            });
        }

        /**
         * 销毁
         */
        CascadingMenu.prototype.destroy = function() {
            //cascadingMenuApi.remove(this.id);
            Control.prototype.destroy.apply(this, arguments);
        };

        return CascadingMenu;
    }
);

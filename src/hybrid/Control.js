/**
 * @file Control.js
 * @path hybrid/Control.js
 * @desc 对象基类
 * @author clouda-team(https://github.com/clouda-team)
 */
define(
    function(require) {
        var lib = require('../common/lib');
        var blend = require('./blend');
        var runtime = require('./runtime');

        /**
         * 对象基类
         * @constructor
         * @param {Object} options 类的属性设置;
         */
        function Control(options) {
            options = options || {};

            if (!this.id && !options.id) {
                this.id = lib.getUniqueID() + (1 * new Date());
            }
            this.main = options.main ? options.main : this.initMain(options);

            this.initOptions(options);

            blend.register(this);

            this.currentStates = {};
            this._listener = {};
        }

        Control.prototype = {
            'constructor': Control,
            'currentStates': null,

            /**
             * 事件存储数组
             * @private
             * @property {Object} _listener
             */

            '_listener': null,

            /**
             * 获取当前组件的类型
             * @return {string} type
             */
            'getType': function() {
                // layout, layer, component, navbar
                return this.type || 'control';
            },

            /**
             * @protected
             * 初始化所有options
             */

            'initOptions': function(options) {
                options = options || {};
                this.setProperties(options);
            },

            /**
             * 初始化Main元素并返回
             * @return {Object} DOM
             */
            'initMain': function() {
                var main = document.createElement('div');
                main.setAttribute('data-blend', this.getType());
                main.setAttribute('data-blend-id', this.id);
                return main;
            },

            /**
             * 渲染Control，可以是DOM也可以是Native，一般来说，子控件不继承此方法，而是实现paint方法
             * @return {Dom} 页面内主元素
             */
            'render': function() {
                // created, webviewready, pageonload, disposed
                this.fire('beforerender');

                // 为控件主元素添加id
                if (!this.main.id) {
                    this.main.id = lib.getUniqueID();
                }

                // 子控件实现这个
                if (this.paint()) {
                    this.fire('afterrender');
                }
                else {
                    this.fire('renderfailed');
                }
                return this.main;
            },
            // 子类需要重写的渲染类
            'paint': function() {},

            'appendTo': function(DOM) {
                this.main.appendChild(DOM);
            },

            /**
             * 把自己从dom中移除，包括事件，但不销毁自身实例
             */
            'dispose': function() {
                this.fire('beforedistory');
                try {
                    runtime[this.type].destroy(this.id);
                }
                catch (e) {
                    console.log('runtime组件无destory方法');
                }
                this.fire('afterdistory');
            },

            /**
             * 销毁自身
             */
            'destroy': function() {
                this.dispose();
                blend.cancel(this);
            },

            /**
             *
             * 获取属性
             * @param {string} name 属性名
             * @return {string} 属性name的值
             */
            'get': function(name) {
                var method = this['get' + lib.toPascal(name)];

                if (typeof method === 'function') {
                    return method.call(this);
                }

                return this[name];
            },

            /**
             * 设置控件的属性值
             * @param {string} name 属性名
             * @param {*} value 属性值
             * @return {NULL}
             */
            'set': function(name, value) {
                var method = this['set' + lib.toPascal(name)];

                if (typeof method === 'function') {
                    return method.call(this, value);
                }

                var property = {};
                property[name] = value;
                this.setProperties(property);
            },

            /**
             * 设置属性
             * @param {Object} properties 类的属性
             */
            'setProperties': function(properties) {
                lib.extend(this, properties);
            },

            /**
             * 禁用控件
             */
            'disable': function() {
                this.addState('disabled');
            },

            /**
             * 启用控件
             */
            'enable': function() {
                this.removeState('disabled');
            },

            /**
             * 判断控件是否不可用
             * @return {boolean} 是否不可用
             */
            'isDisabled': function() {
                return this.hasState('disabled');
            },

            /**
             * 显示控件
             */

            'in': function() {
                this.removeState('hidden');
                this.fire('show');
            },

            /**
             * 隐藏控件
             */
            'out': function() {
                this.addState('hidden');
                this.fire('hide');
            },

            /**
             * 切换控件的显隐状态
             */
            'toggle': function() {
                this[this.isHidden() ? 'in' : 'out']();
            },

            /**
             * 判断控件是否隐藏
             * @return {boolean} 是否隐藏
             */
            'isHidden': function() {
                return this.hasState('hidden');
            },

            /**
             * 为控件添加状态
             * @param {string} state 状态名
             */
            'addState': function(state) {
                if (!this.hasState(state)) {
                    this.currentStates[state] = true;
                }
            },

            /**
             * 移除控件的状态
             *
             * @param {string} state 状态名
             */
            'removeState': function(state) {
                if (this.hasState(state)) {
                    this.currentStates[state] = false;
                }
            },

            /**
             * 开关控件的状态
             * @param {string} state 状态名
             */
            'toggleState': function(state) {
                var methodName = this.hasState(state) ? 'removeState' : 'addState';
                this[methodName](state);
            },

            /**
             * 判断当前控件是否处于某状态
             * @param {string} state 状态名
             * @return {boolean} 是否处于某状态
             */
            'hasState': function(state) {
                return !!this.currentStates[state];
            },

            /**
             * 注册事件
             * @param {string} type 事件名字
             * @param {Function} callback 绑定的回调函数
             */
            'on': function(type, callback) {
                var t = this;
                if (!t._listener[type]) {
                    t._listener[type] = [];
                }
                t._listener[type].push(callback);
            },

            /**
             * 解绑事件
             * @param {string} type 事件名字
             * @param {Function} callback 绑定的回调函数
             */
            'off': function(type, callback) {
                var events = this._listener[type];
                if (!events) {
                    return;
                }
                if (!callback) {
                    delete this._listener[type];
                    return;
                }
                events.splice(events.indexOf(callback), 1);
                if (!events.length) {
                    delete this._listener[type];
                }
            },

            /**
             * 触发事件
             * @param {string} type 事件名字
             * @param {Array} argAry 传给事件的参数
             * @param {Object} context 事件的this指针
             */
            'fire': function(type, argAry, context) {
                var events = this._listener[type];
                var i;
                var len;
                if (!type) {
                    throw new Error('未指定事件名');
                }
                context = context || this;
                if (events) {
                    for (i = 0, len = events.length; i < len; i++) {
                        events[i].apply(context, argAry);
                    }
                }
            }

        };

        return Control;
    }
);

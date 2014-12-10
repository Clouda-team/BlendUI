/**
* @file config.js
* @path hybrid/api/config.js
* @desc naitve组件相关设置文件
* @author clouda-team(https://github.com/clouda-team)
*/
define(
    function(require) {

        /**
         * @class LayoutRule
         * 用于控制组件内元素的相对定位，
         * 对应的值不应被修改
         */
        var config = {

            /**
             * Rule that aligns the child's left edge with its RelativeLayout
             * parent's left edge.
             */
            ALIGN_PARENT_LEFT: 9,

            /**
             * Rule that aligns the child's top edge with its RelativeLayout
             * parent's top edge.
             */
            ALIGN_PARENT_TOP: 10,

            /**
             * Rule that aligns the child's right edge with its RelativeLayout
             * parent's right edge.
             */
            ALIGN_PARENT_RIGHT: 11,

            /**
             * Rule that aligns the child's bottom edge with its RelativeLayout
             * parent's bottom edge.
             */
            ALIGN_PARENT_BOTTOM: 12,

            /**
             * Rule that centers the child with respect to the bounds of its
             * RelativeLayout parent.
             */
            CENTER_IN_PARENT: 13,

            /**
             * Rule that centers the child horizontally with respect to the
             * bounds of its RelativeLayout parent.
             */
            CENTER_HORIZONTAL: 14,

            /**
             * Rule that centers the child vertically with respect to the
             * bounds of its RelativeLayout parent.
             */
            CENTER_VERTICAL: 15,

            IOS: /iP(ad|hone|od)/i.test(navigator.userAgent),

            /**
             * devicePixelRatio
             */
            DEVICE_PR: (/iP(ad|hone|od)/.test(navigator.userAgent)) ? 1 : (window.devicePixelRatio || 2)

        };

        return config;
    }
);

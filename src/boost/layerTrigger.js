define(["src/boost/sizzle", "src/boost/meta"], function (Sizzle, meta) {
    "use strict";
    var LAYER_TRIGGER = "blend-layer-trigger";
    var LAYER_BACK = "blend-layer-back";
    var LAYER_FX = "blend-layer-fx";

    function findParentByTagName(element, tagName) {
        tagName = tagName.toUpperCase();
        while (element && element.nodeName != tagName) {
            element = element.parentNode;
        }
        return element;
    }

    function isDefaultPrevented(src) {
        return src.defaultPrevented ? src.defaultPrevented() : src.returnValue === false;
    }

    var layer;

    function openInLayer(url) {
        if (layer && layer.distory) {
            layer.distory();
        }

        layer = new Blend.ui.Layer({
            url: url,
            active: true,
            fx: meta.get(LAYER_FX, "slide")
        });
    }

    var rtrim = /^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g;

    function trim(text) {
        return text == null ?
            "" :
            (text + "").replace(rtrim, "");
    }

    function isBackTrigger(element) {
        var selector = meta.get(LAYER_BACK);
        if (selector && Sizzle.matchesSelector(element, selector)) {
            return true;
        }
        return false;
    }

    function isLayerTrigger(element) {
        var selector = meta.get(LAYER_TRIGGER);
        if (selector && Sizzle.matchesSelector(element, selector)) {
            return true;
        }
        return false;
    }

    function preventDefault(event) {
        event.preventDefault();
        event.returnValue = false;
    }

    function layerTriggerHandler(event) {
        var target;
        var href;

        if (isDefaultPrevented(event)) {
            return;
        }

        target = findParentByTagName(event.target, "A");

        if (!target || !target.hasAttribute("href")) {
            return;
        }

        href = trim(target.getAttribute("href"));

        //判断是否是回退的触发器
        if (isBackTrigger(target)) {
            preventDefault(event);
            Blend.ui.layerBack();
        }
        //是否是Layer触发按键
        else if (isLayerTrigger(target)) {
            preventDefault(event);
            openInLayer(href);
        }
    }

    var inited = false;

    function init() {
        if (inited) {
            return;
        }
        inited = true;
        document.addEventListener("click", layerTriggerHandler, false);
    }

    return {
        init: init
    };
});

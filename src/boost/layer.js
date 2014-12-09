define(function () {

    var LAYER_TRIGGER = "blend.layer.trigger";
    var LAYER_FX = "blend.layer.fx";

    var layerConfig;

    function getMetaConfig() {
        var metas = document.getElemtnetsByTagName("META");
        var metaLen = metas.length;
        var index;
        var elem;
        var name;
        var content;
        var config = {};

        /**
         * no
         * all
         * class:class-name
         * target:target-name
         * urlmatch:/regexp/
         * data-xxx-xxx:xxx
         */
        config[LAYER_TRIGGER] = "no";

        /**
         *
         */
        config[LAYER_FX] = "slide";

        if (metaLen > 0) {
            for (index = 0; index < metaLen; index++) {
                elem = metas[index];
                name = elem.name;
                if (config.hasOwnProperty(name)) {
                    content = elem.content;
                    config[name] = content;
                }
            }
        }

        return config;
    }

    function execConfig(str) {
        //TODO 做更多的解析
        return str === "all";
    }

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

    function openLayerURL(url) {
        if (layer) {
            layer.distory();
        }

        layer = new Blend.ui.Layer({
            url: url,
            active: true
        });
    }

    function layerTriggerHandler(event) {
        var target;

        if (isDefaultPrevented(event)) {
            return;
        }

        target = findParentByTagName(event.target, "A");

        if (!target || !target.hasAttribute("href")) {
            return;
        }

        href = target.getAttribute("href");

        //try {
        if (execConfig(layerConfig[LAYER_TRIGGER])) {
            event.preventDefault();
            event.returnValue = false;
            openLayerURL(href);
        }
        //} catch (e) {
        //}
    }

    var inited = false;

    function init() {
        if (inited) {
            return;
        }
        inited = true;
        layerConfig = getMetaConfig();
        var triggerConfig = triggerConfig[LAYER_TRIGGER];
        if (triggerConfig !== "no") {
            document.addEventListener("click", layerTriggerHandler, false);
        }
    }

    return {
        init: init
    };
});

require(["src/boost/layer"], function (layer) {
    layer.init();
    //document.addEventListener("blendready",
    //    //Blend.ui.ready(
    //    function () {
    //        layer.init();
    //    });
    setTimeout(function () {
        console.log("*********** inited ***********");
    }, 3000);
}, null, true);

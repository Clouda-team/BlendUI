define(function(require){
    var expect = chai.expect;
    var assert = chai.assert;
    describe('Naitve层接口存在', function () {
        var bridge = window.nuwa_frame || window.lc_bridge ||{};
        
        it('组件接口', function () {
            assert.ok(bridge.addComponent, "addComponent接口");
            assert.ok(bridge.componentExecuteNative, "componentExecuteNative接口");
        });
        
        it('Layer接口', function () {
            assert.ok(bridge.prepareLayer, "prepareLayer接口");
            assert.ok(bridge.resumeLayer, "resumeLayer接口");
            assert.ok(bridge.backToPreviousLayer, "backToPreviousLayer接口");
            assert.ok(bridge.hideSubLayer, "hideSubLayer接口");
            assert.ok(bridge.layerLoadUrl, "layerLoadUrl接口");
            assert.ok(bridge.destroyLayer, "destroyLayer接口");
            assert.ok(bridge.layerSetPullRefresh, "layerSetPullRefresh接口");
            assert.ok(bridge.layerStopRefresh, "layerStopRefresh接口");
            assert.ok(bridge.isLayerAvailable, "isLayerAvailable接口");
            assert.ok(bridge.currentLayerUrl, "currentLayerUrl接口");
            assert.ok(bridge.currentLayerId, "layerStopRefresh接口");
            assert.ok(bridge.layerStopLoading, "layerStopLoading接口");
            assert.ok(bridge.layerPostMessage, "layerPostMessage接口");
            assert.ok(bridge.layerGetOriginalUrl, "layerGetOriginalUrl接口");
            
            assert.ok(bridge.layerGetUrl, "layerGetUrl接口");
            assert.ok(bridge.layerCanGoBack, "layerCanGoBack接口");
            assert.ok(bridge.layerCanGoBackOrForward, "layerCanGoBackOrForward接口");
            
            assert.ok(bridge.isLayerActive, "isLayerActive接口");
            assert.ok(bridge.layerClearHistory, "layerClearHistory接口");
            assert.ok(bridge.layerSetLayout, "layerSetLayout接口");
        });
        
    });

});
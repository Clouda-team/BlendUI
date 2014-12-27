define(['../../src/hybrid/Layer'],function(Layer){
    var expect = chai.expect;
    describe('Layer测试', function () {
        this.timeout(50000);
        describe('Layer',function(){
            it('验证Layer类', function () {
                expect(Layer).to.be.a('function');
                expect(Layer).to.be.instanceof(Function);
                expect(Layer).to.throw(Error);
                expect(Layer.prototype.type).to.equal('layer');
            });
            it('创建Layerd对象', function () {
                var testLayer;
                var createLayerNoUrl = function(){
                    testLayer = new Layer({
                        'id':"test"
                    });
                }
                var createLayerHaveUrl = function(){
                    testLayer = new Layer({
                        'id':"test1",
                        'url':'a.html'
                    });
                }
                var activeLayer = function(){
                    testLayer.in();
                }
                var outLayer = function(){
                    testLayer.out();
                }
                expect(createLayerNoUrl).to.throw(Error);
                expect(createLayerHaveUrl).to.not.throw(Error);
                expect(testLayer).to.be.instanceof(Layer);
                expect(testLayer.id).to.equal('test1');
                expect(testLayer.in).to.be.a('function');
                expect(activeLayer).to.not.throw(Error);
                expect(testLayer.isActive()).to.be.true;
                expect(outLayer).to.not.throw(Error);
                expect(testLayer.isActive()).to.not.be.true;
                expect(testLayer.canGoBack()).to.not.be.true;
                //testLayer.getUrl() 是异步的;
                expect(testLayer.url).to.match(/^http:/);
                   
            });
        });
        
        describe('layer的侧边栏',function(){
            var createSideNotarg = function(){
                Layer.addSidebar()
            }
            var createSide = function(){
                Layer.addSidebar({
                    url:'http://baidu.com'
                })
            }
            it('侧边栏addSidebar方法', function () {
                expect(Layer).to.have.property('addSidebar');
                expect(Layer.addSidebar).to.be.a('function');
                expect(Layer.addSidebar).to.be.instanceof(Function);
                expect(createSideNotarg).to.throw(Error);
                expect(createSide).to.not.throw(Error);
            });

            it('侧边栏showSidebar方法', function () {
                expect(Layer).to.have.property('showSidebar')
            });

            it('侧边栏hideSidebar方法', function () {
                expect(Layer).to.have.property('hideSidebar')
            });

            it('侧边栏destorySidebar方法', function () {
                expect(Layer).to.have.property('destorySidebar')
            });
        });
    });
});
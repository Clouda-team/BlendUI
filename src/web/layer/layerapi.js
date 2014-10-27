define(

    /**
     * layerapi，封装一些管理基本事件。
     * 本api依赖于 crema css， index.html页面需要有 div.pages 容器。
     * refresh 需要设定refresh的容易：page-content
     * @static
     */

    function(require) {
        var api = {};

        var pixelRatio = window.devicePixelRatio || 1;//定义点阵

        api.prepare = function(id, options, context, dom) {

            dom = dom || context.main;
            
            //1. set position
            if (dom !== context.main) {//dom is not absolute context.main, then append dom to context.main;

                context.main.appendChild(dom);
            }
            $(context.main).css({top:options.top, left: options.left, right: options.right, bottom: options.bottom});
            $(context.main).css({"height":'calc(100% - '+(options.top + options.bottom) +'px)',"width":'calc(100% - '+(options.left + options.right) +'px)'});
            
            context.startLoading();

            $.ajax({
                url: options.url,
                type: 'get',
                dataType:"html",
                success: function(data) {
                    // console.log("--------",data);
                    //hybird版本的web页面是带有页头和页尾的，所以，需要进行.page筛选。
                    //data html 预处理
                    if (data.indexOf('<html') !== -1) {
                        
                        data = $(".page",data).html();
                    }


                    if (context.hasState("slidein") ) {
                        context.once("onshow",function(){
                            dom.innerHTML = data;
                            context.fire('onrender');
                        });
                    }else{
                        dom.innerHTML = data;
                        context.fire('onrender');
                    }

                    //动画中渲染页面会有bug发生，所以需要等待渲染好页面
                   
                },
                error: function(err) {
                    context.fire('renderfailed');
                }
            });

        };

        api.resume = function(context) {

            var container;
            if ( context.myGroup ) {//获取当前layer的
                console.log("in layer group..." + context.myGroup.index);
                container = $(context.myGroup.main) ;
            }else{
                container = $(".pages");
            }

            // if (!context.state) {//state 空，说明context可用
                // context.
                if (!$('#'+ context.main.id).length) {
                    $(context.main).appendTo(container);
                    
                }
            // }else { //等待fire
            //     context.once('onrender', function() {
            //         if (!$('#'+ context.main.id).length) {
            //             $(context.main).appendTo(container);
                        
            //         }
            //     });

            // }
        };

        //for unbind
        var pullEvents = {};

        api.startPullRefresh = function(context) {
            //0.初始化dom,挂载在page-content上
            var container = $(context.main).find('.page-content');
            if (!container.length) {
                console.log('pull to refresh should has .page-content');
                return false;
            }
            container.addClass("pull-to-refresh-content");
            if (!$(".pull-to-refresh-layer",context.main).length){
                $(".page-content",context.main).before('<div class="pull-to-refresh-layer"> <div class="preloader"></div><div class="pull-to-refresh-arrow"></div><div class="pull-to-refresh-label"></div> </div>');
            }

            var tipLayer = $(".pull-to-refresh-layer",context.main).css("padding-top",container.css("padding-top"));//padding-top
            tipLayer.css("margin-top",container.position().top);
            var isTouched,
                isMoved,
                touchesStart = {},
                isScrolling,
                touchesDiff,
                touchStartTime,
                refresh = false,
                useTranslate = false,
                startTranslate = 0;

            //private function
            var afterRefresh = function(container) {
                // tipLayer.removeClass('refreshing');
                container.removeClass('refreshing').addClass('transitioning');
                $(".pull-to-refresh-label",tipLayer).text(context.loadingText);//todo: 让这个可自定义
                context.transitionEnd(function () {
                    container.removeClass('transitioning');
                    // tipLayer.removeClass('pull-up show-refresh-layer');
                    tipLayer.removeClass('pull-up refreshing');
                });
            };
            var afterNoRefresh = function(container){
                // tipLayer.removeClass('refreshing').addClass('transitioning');
                // $(".pull-to-refresh-label",tipLayer).text(context.loadingText);//todo: 让这个可自定义
                context.transitionEnd(function () {
                    container.removeClass('transitioning');
                    // tipLayer.removeClass('show-refresh-layer');
                });
            };

            pullEvents.handleTouchStart = function(e)  {
                if (isTouched) return false;
                if (container.hasClass("refreshing")) {
                    return false;
                }else{
                    isMoved = false;
                }
                
                if (container[0].scrollTop > 0) {//解决原生滚定条问题的兼容
                    isTouched = false;
                }else{
                    isTouched = true;
                }
                
                isScrolling = undefined;
                touchesStart.x = e.type === 'touchstart' ? e.targetTouches[0].pageX : e.pageX;
                touchesStart.y = e.type === 'touchstart' ? e.targetTouches[0].pageY : e.pageY;
                touchStartTime = (new Date()).getTime();

                //更新container , 需要更新么？
                // container = $(context.main).find('.page-content');
            };
            

            pullEvents.handleTouchMove = function(e) {
                if (!isTouched) return false;
                var pageX = e.type === 'touchmove' ? e.targetTouches[0].pageX : e.pageX;
                var pageY = e.type === 'touchmove' ? e.targetTouches[0].pageY : e.pageY;
                if (typeof isScrolling === 'undefined') {
                    isScrolling = !!(isScrolling || Math.abs(pageY - touchesStart.y) > Math.abs(pageX - touchesStart.x));
                }
                // console.log("isScrolling",isScrolling);
                if (!isScrolling) {
                    // console.log("not scrolling...")
                    isTouched = false;
                    return false;
                }
                if (!isMoved) {
                    
                    container.removeClass('transitioning');
                    startTranslate = tipLayer.hasClass('refreshing') ? 44 : 0;
                    useTranslate = true;
                    
                }
                
                isMoved = true;
                touchesDiff = pageY - touchesStart.y;

                if (touchesDiff < 0 && !container[0].style.webkitTransform) {//解决原生滚定条问题的兼容
                    isTouched = false;
                    return false;
                }
                if (container.hasClass("refreshing")) {
                    //处理刷新中，上滑的操作
                    e.preventDefault();
                    if (touchesDiff > 0) {

                        container[0].style.webkitTransform = 'translate3d(0,' + (Math.pow(touchesDiff, 0.85) + startTranslate) + 'px,0)';
                    }else{
                        container[0].style.webkitTransform = 'translate3d(0, -' + (Math.pow(-touchesDiff, 0.85) - startTranslate) + 'px,0)';
                    }
                }else if (touchesDiff > 0 && container[0].scrollTop <= 0 || tipLayer.hasClass('pull-up')) {
                    // tipLayer.addClass("show-refresh-layer");
                    if (useTranslate) {
                        e.preventDefault();
                        container[0].style.webkitTransform = 'translate3d(0,' + (Math.pow(touchesDiff, 0.85) + startTranslate) + 'px,0)';
                    }
                    if ((useTranslate && Math.pow(touchesDiff, 0.85) > 44) || (!useTranslate && touchesDiff >= 88)) {
                        refresh = true;
                        tipLayer.addClass('pull-up');
                        $(".pull-to-refresh-label",tipLayer).text(context.releaseText);
                    }
                    else {
                        refresh = false;
                        tipLayer.removeClass('pull-up');
                        $(".pull-to-refresh-label",tipLayer).text(context.pullText);
                    }
                } else {
                    refresh = false;
                    return false;
                }
            };
            pullEvents.handleTouchEnd = function(e) {
                if (container.hasClass("refreshing")) {
                    return false;
                }
                if (!isTouched || !isMoved) {
                    isTouched = false;
                    isMoved = false;
                    return false;
                }
                if ($(".page-content:last").scrollTop <= 5) {//原生滚动条回弹问题
                    $(".page-content:last").scrollTop(0);
                }
                container.addClass('transitioning');
                // container.css("webkitTransform",'');
                container[0].style.webkitTransform = '';
                if (refresh) {
                    tipLayer.addClass('refreshing');
                    container.addClass('refreshing');

                    $(".pull-to-refresh-label",tipLayer).text(context.loadingText);
                    // isMoved = false;

                    context.fire('layerPullDown');//发送事件

                    context.once('layerPullEnd', function() {//监听本次结束

                        afterRefresh(container);
                    });
                }else{
                    afterNoRefresh(container);
                }
                isTouched = false;
                isMoved = false;
            };

            context.on('touchstart', pullEvents.handleTouchStart);
            context.on('touchmove', pullEvents.handleTouchMove);
            context.on('touchend', pullEvents.handleTouchEnd);


        };

        api.isRefreshing = function(context) {//关闭refresh提示
            var container = $(context.main).find('.page-content');
            return container.hasClass("refreshing");
        };

        api.endPullRefresh = function(context) {//关闭refresh提示
            context.fire('layerPullEnd');
        };
        api.stopPullRefresh = function(context) {

            $(context.main).removeClass('pull-to-refresh-content');
            context.off('touchstart', pullEvents.handleTouchStart);
            context.off('touchmove', pullEvents.handleTouchMove);
            context.off('touchend', pullEvents.handleTouchEnd);
        };

        //设置page 的 events 内部动画类
        var pageEvents = {};

        /*
         * 此api将赋予layer 左右swipe的能力
         * 如果有container，则说明，swipe在container内部进行swipe，比如
         * layergroup是一个container，则，swipe仅在此layergroup支持左右滑动，不支持其他layer
         * @returns false
        */
        api.startSwipe = function(context, container) {

            //内部变量
            var isTouched = false,
            isMoved = false,
            touchesStart = {},
            isScrolling,
            activePage,
            previousPage,
            previousContext,
            viewContainerWidth,
            touchesDiff,
            allowViewTouchMove = true,
            touchStartTime,
            activeNavbar,
            previousNavbar,
            activeNavElements,
            previousNavElements,
            activeNavBackIcon,
            previousNavBackIcon,
            el;

            //绑定events
            activePage = $(context.main);

            container = container || $('.pages');
            // console.log("container.... " + container[0].className);

            console.log('startSwipe init ... ' + context.id);

            var swipeBackPageActiveArea = 0;//30;//设定左侧可以触发滑动的区域 （其他区域不滑动）,0 为全部区域
            //boxShadow 整体决定是否显现


            pageEvents.handleTouchStart = function(e) {
                if (!allowViewTouchMove || isTouched) return false;
                isMoved = false;
                isTouched = true;
                isScrolling = undefined;
                touchesStart.x = e.type === 'touchstart' ? e.targetTouches[0].pageX : e.pageX;
                touchesStart.y = e.type === 'touchstart' ? e.targetTouches[0].pageY : e.pageY;
                touchStartTime = (new Date()).getTime();
            };

            pageEvents.handleTouchMove = function(e) {
                if (!isTouched) return false;
                var pageX = e.type === 'touchmove' ? e.targetTouches[0].pageX : e.pageX;
                var pageY = e.type === 'touchmove' ? e.targetTouches[0].pageY : e.pageY;

                touchesDiff = pageX - touchesStart.x;

                if (typeof isScrolling === 'undefined') {
                    isScrolling = !!(isScrolling || Math.abs(pageY - touchesStart.y) > Math.abs(touchesDiff));
                }
                if (isScrolling) {
                    isTouched = false;
                    return false;
                }

                //isMoved * touchesDiff < 0 表示swipe的方向变了，更换配合滑动的页面.

                if (!isMoved || isMoved * touchesDiff < 0) {//isMoved 0 代表没有动， 1 表示swiperight -1 代表 swipeleft，正负与touchdiff的正负相同


                    isMoved = false;//防止中途return，初始化isMoved = false


                    var cancel = false;

                    viewContainerWidth = container.width();

                    //两种情况，1.普通layer具备swipe后退功能（ TODO ），2. layergroup具备swipe功能
                    // previousPage = container.find('.page-on-left:not(.cached)');
                    // var mlen = context.myGroup.layers.length;
                    // var mindex = (context.index+ (touchesDiff>0)?1:-1);
                    // mindex = (mindex > mlen) ? (mindex - mlen):(mindex < 0 ? (mindex + mlen) : mindex);//TODO 复杂的计算，也许应该抽离出去
                    var mid = context.myGroup.getIdByStep(touchesDiff > 0 ? -1 : 1);
                    console.log('re init layer prvious...', mid);

                    // console.log("----------",mid);

                    if (previousPage) {
                        previousPage[0].style.webkitTransform = '';
                    }
                    previousContext = context.myGroup.__layers[mid];
                    previousPage = $(previousContext.main);




                    if (mid === context.id) {//自己转自己，会黑屏，不转场
                        cancel = true;
                    }else {
                        //校准class
                        if (touchesDiff > 0) {
                            previousPage.removeClass('page-on-right').addClass('page-on-left');
                        }else {
                            previousPage.removeClass('page-on-left').addClass('page-on-right');
                        }
                    }
                    // console.log('111111111',context.myGroup);

                    if (swipeBackPageActiveArea && Math.abs(touchesStart.x - container.offset().left) > swipeBackPageActiveArea) cancel = true;
                    if (previousPage.length === 0 || activePage.length === 0) cancel = true;
                    if (cancel) {
                        isTouched = false;
                        return false;
                    }

                }
                isMoved = (touchesDiff > 0) ? 1 : -1;

                e.preventDefault();
                // if (touchesDiff < 0) touchesDiff = 0;//小于0 代表向右
                var percentage = Math.abs(touchesDiff / viewContainerWidth);

                // Transform pages
                activePage[0].style.webkitTransform = ('translate3d(' + touchesDiff + 'px,0,0)');
                // if (1 ) activePage[0].style.boxShadow = '0px 0px 12px rgba(0,0,0,' + (0.5 - 0.5 * percentage) + ')';

                var pageTranslate = touchesDiff - isMoved * viewContainerWidth;
                if ( pixelRatio === 1) pageTranslate = Math.round(pageTranslate);

                previousPage[0].style.webkitTransform = ('translate3d(' + pageTranslate + 'px,0,0)');
                previousPage[0].style.opacity = 0.9 + 0.1 * percentage;
            };

            pageEvents.handleTouchEnd = function(e) {
                if (!isTouched || !isMoved) {
                    isTouched = false;
                    isMoved = false;
                    return false;
                }
                isTouched = false;
                isMoved = false;
                if (touchesDiff === 0) {
                    $([activePage[0], previousPage[0]]).css({opacity: '', boxShadow: ''});
                    //.transform('')
                    activePage[0].style.webkitTransform = '';
                    previousPage[0].style.webkitTransform = '';

                    return false;
                }
                var absTouchesDiff = Math.abs(touchesDiff);

                var timeDiff = (new Date()).getTime() - touchStartTime;
                var pageChanged = false;
                // Swipe back to previous page
                if (
                        timeDiff < 300 && absTouchesDiff > 10 ||
                        timeDiff >= 300 && absTouchesDiff > viewContainerWidth / 2
                    ) {
                    // console.log(touchesDiff);
                    if (touchesDiff > 0) {
                        activePage.removeClass('page-on-center page-on-left').addClass('page-on-right');
                        previousPage.removeClass('page-on-right page-on-left').addClass('page-on-center');
                    } else {
                        activePage.removeClass('page-on-center page-on-right').addClass('page-on-left');
                        previousPage.removeClass('page-on-right page-on-left').addClass('page-on-center');
                    }


                    pageChanged = true;
                }
                // Reset custom styles
                // Add transitioning class for transition-duration
                $([activePage[0], previousPage[0]]).css({opacity: '', boxShadow: ''}).addClass('page-transitioning');

                activePage[0].style.webkitTransform = '';
                previousPage[0].style.webkitTransform = '';

                allowViewTouchMove = false;

                if (pageChanged) {
                    previousContext.fire('beforeshow');
                    context.fire("beforehide");
                }

                context.transitionEnd(function () {
                    $([activePage[0], previousPage[0]]).removeClass('page-transitioning');

                    allowViewTouchMove = true;
                    if (pageChanged) {
                        previousContext.fire('onshow');
                        context.fire("onhide");
                    }
                });
            };

            //绑定事件
            context.on('touchstart', pageEvents.handleTouchStart);
            context.on('touchmove', pageEvents.handleTouchMove);
            context.on('touchend', pageEvents.handleTouchEnd);
        };
        api.endSwipe = function(context) {
            // $(context.main).removeClass("pull-to-refresh-content");
            context.off('touchstart', pageEvents.handleTouchStart);
            context.off('touchmove', pageEvents.handleTouchMove);
            context.off('touchend', pageEvents.handleTouchEnd);
        };


        //========  hybird api ==============
        api.backLayer = function(id) {
            blend.get(id).out();
        };
        //========  hybird end ==============

        return api;
    }
);

/**
 * runtime demo;
 */
(function (main, layer,LayerGroup) {
     //如果非runtime环境直接走默认链接形式
    //if(!main.inRuntime()) return;
    
    //create layerGroup
    //alert($('#Content').offset().top);
    //alert(window.devicePixelRatio);
    /* document.addEventListener("touchmove", function(e){
        //return false;
    }, true); */
    
    var layerGroup = new LayerGroup({
        id:"5",
        layers:[
            {
                id:'6',
                url:'http://fedev.baidu.com/~zhangjianguang/lightapp/usecase/index_1.html',
                onshow:function(){
                    //alert("layer_6_show");
                },
                onhide:function(){
                    //alert("layer_6_hide");
                }
            },
            {
                id:'7',
                url:'http://fedev.baidu.com/~zhangjianguang/lightapp/usecase/index_2.html',
                onshow:function(){
                    //alert("layer_7_show");
                },
                onhide:function(){
                    //alert("layer_7_hide");
                },
                'autoload':false
            },
            {
                id:'8',
                url:'http://fedev.baidu.com/~zhangjianguang/lightapp/usecase/index_4.html',
                onshow:function(){
                    //alert("layer_8_show");
                },
                onhide:function(){
                    //alert("layer_8_hide");
                },
                'autoload':true
            }
        ],
        onselected: function( event ){
            $("#Menu a").removeClass('cur');
            $("#Menu a[data-index='"+event['layerId']+"']").addClass('cur');
        },
        left:0,
        top:44
        //,
        //height:320,
        //width:320
    });
    
    var _layer = null;
    var ss = "sss";
    //role="link" 创建新的pager进行切换
    $('a[role="link"]').click(function(e){
        var $t = $(this);
        e.preventDefault();
        _layer = main.get($t.attr("data-index"));
        if(_layer){
            _layer.in();
        }else{
            _layer = new layer({
                "id":$t.attr("data-index"),
                "url":$t.attr('href'),
                "active":true,
                "pullToRefresh":true
                /*,"ptrFn":function(){
                    alert("ptrFn:"+this.id+"_event")
                }*/
                //,"reverse":true
                //,"duration":'slow'
                //,"fx":"fade"
                ,"onshow":function(){
                    //alert(ss);
                    //alert(this.type);
                }
                ,"onhide":function(){
                    //alert(ss+"hide");
                }
                ,"afterrender":function(event){
                    alert("afterrender:"+this.id+"_event")
                }
                ,"onload":function(event){

                }
                ,"changeUrl":function(event){
                    console.log(url);
                }
            });

        }        
    });
    
    //role="tap" 容器内的layer进行切换
    
    $('a[role="tap"]').bind('click', function(e) {
        e.preventDefault();
        var $t = $(this);
        /* $("#Menu a").removeClass('cur');
        $t.addClass('cur'); */
        layerGroup.active($t.data('index'));
    });

    //测试注册事件机制
    var layerApi = main.api.layer;
    /*layerApi.on('message',function(event){
        if(event['origin']==_layer['id']){
            _layer.out();
            alert(event.data);
        }
    });*/
    var aa = function(event){
        alert("origin:"+event['origin']);
        alert("reciever:"+event['reciever']);
        alert("data:"+ event['data']);
    };
    layerApi.on('close',aa);
    /*layerApi.on('book',aa);*/

    /*layerApi.on('book',function(event){
        //alert(event['reciever']);
        alert(event['sender']);
        alert(event['origin']);
        alert("book2:"+event.data);
    });*/

    //因为aa已经绑定到book事件 所以此次绑定无效
    



})(Blend,Blend.Layer,Blend.LayerGroup);
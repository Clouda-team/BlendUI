define(function(require){

	var SMSAuth = function(elem,options){
		
		this.elem = elem[0]?elem[0]:elem;

		this._initConf(options);	//初始化配置信息

		this._initEvent();	//
		return this;

	};

	SMSAuth.prototype.constructor = SMSAuth;


	SMSAuth.prototype._initConf = function(options){
		// 初始化配置
		this.conf = {
			"keyWord":options.keyWord||"",
			"dataType":options.dataType||"int",
			"dataLength":options.dataLength||0,
			"fromPhoneNum":options.fromPhoneNum||"",
			"waitTime":60
		}
	};


	SMSAuth.prototype._initEvent = function(){

		var that = this;

		this.listen = function(options){

			// if(typeof options === "object"){
			// 	that._initConf(options);
			// }


			var successCallback = function(data){
				//回填
				//alert(JSON.stringify(data));
				that.elem.value = data.vrification;

			};

			var errorCallback = function(data){
				//错误回调
				console.error("fail to get the verify code");
			}

			/*device.sms.smsVrification(successCallback, errorCallback, {
                fromPhoneNum: '15118820708',
                keyWord: '来自支付宝',
                dataType: 'String',
                waitTime: 60,
                dataLength: 4,
                timePeriod: '2014-11-17 14:46:00'
            });*/
			
			var finalOpt = dealOptions(that.conf,options);
			
			console.log(finalOpt);


			nuwa.pm.absorb("device",function(inst){
            
				inst.on('error',function(err){
                	throw new Error('error in absorb plugin');
            	});

				inst.on('progress',function(percentage){
            		console.log('plugin device percentage = ' + percentage);
            	});

				inst.on('complete',function(err){
	                var device = nuwa.require('device');
	                
	                finalOpt.timePeriod = +new Date() + "";
	                //alert(JSON.stringify(finalOpt));
	                //alert(successCallback.toString());
	                //alert(errorCallback.toString());
					device.sms.smsVrification(successCallback,errorCallback,finalOpt);
            	});
        	});
		};

	}


	var dealOptions = function(conf,options){
		if(!options){
			return conf;
		}else{
			return {
				"keyWord":options.keyWord||conf.keyWord,
				"dataType":options.dataType||conf.dataType,
				"dataLength":options.dataLength||conf.dataLength,
				"fromPhoneNum":options.fromPhoneNum||conf.fromPhoneNum,
				"waitTime":60
			}
		}

	};


	SMSAuth.prototype.check = function(){

		// var ua = navigator.userAgent,
		// 	reg = /BaiduLightAppRuntime\/\d+(\.\d+)+/g,
		// 	arr,version;
        
		// arr = ua.match(reg);
		// version = arr?arr[0].split("/")[1]+"":"0";
		
		// return (version>="2.5"?true:false);

	}

	return SMSAuth;

});
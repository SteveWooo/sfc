'use struct';
var exports = {};
var BASE_URL = "localhost";
var BASE_PORT = 1234;
var SPRITE_TYPE_ORIGIN = 0;
var SPRITE_TYPE_IMG = 1;
var SPRITE_TYPE_TEXT = 2;
var SPRITE_TYPE_INPUT = 3;

var define = function(src,callback){
	var args = [];
	function createEle(_src){
		var script = document.createElement('script');
		script.type = "text/javascript";
		script.src = _src + ".js";
		var name = _src.substring(_src.lastIndexOf('/')+1,_src.length);
		document.body.appendChild(script);
		script.onload = function(){
			args[name] = exports[name];
			args.length++;
			if(args.length === src.length){
				if(callback === undefined)return;
				callback(args);
			}
		}
	}
	for(var i=0;i<src.length;i++){
		createEle(src[i]);
	}
}

var ws = new Object();

function wsinit(){
	ws = {
		client:null,
		setJavascript:function(js){
			var script = document.createElement('script');
			script.innerHTML = js;
			script.type = "text/javascript";
			document.body.appendChild(script);
			// console.log(exports)
		},
		callbacks:{},
	}

	try{
		ws.client = new WebSocket('ws://'+BASE_URL+':'+BASE_PORT);
	}
	catch(e){
		console.log(e)
	}
	ws.client.onerror = function(err){
		console.log(err);
		// sfc.initByAMD();
	}
}

var sfc_require = function(src,name,callback){
	ws.client.send(JSON.stringify({
		type:"javascript",
		src:src,
		name:name
	}));
	ws.callbacks[name] = callback;

	ws.client.onmessage = function(evt){
		msg = JSON.parse(evt.data);
		if(msg.type === 'javascript'){
			if(msg.success!=true){
				console.error(msg.errmsg);
				return;
			}

			ws.setJavascript(msg.js);
			if(msg.name !== undefined){
				ws.callbacks[msg.name](exports[msg.moduleName]);
			}
		}
		else{
			console.log('type error');
		}
	}

	ws.client.onerror = function(error){
		console.log(error);
	}
}

var sfc = {
	MVOE_UP:2,
	MOVE_DOWN:8,
	MOVE_LEFT:4,
	MOVE_RIGHT:6,
	canvas:null,
	ctx:null,
	Updater:null,
	Res:null,
	Sprite:function(){},
	Layer:function(){},
	Stage:function(){},
	Director:null,
	P:null,
	gl:null,
	getWebGLContext:function(){},
	initShaders:function(){},

	setInterval:function(callback,time){
		sfc.Director.timer.setInterval(callback,time);
	},
	setTimeout:function(callback,time){
		sfc.Director.timer.setTimeout(callback,time);
	},
	//工具类

	find:function(key,value){
		if(sfc.Updater == null)return;
		var obj = [];
		var loop = function(tree){
			for(var i=0;i<tree.length;i++){
				if(tree[i].child){
					loop(tree[i].child);
				}else {
					if(tree[i][key] === value){
						obj.push(tree[i]);
					}
				}
			}
		}
		loop(sfc.Updater.renderTree);
		return obj;
	},
	//查询

	screenModifyX:null,
	screenModifyY:null,

	//参数类

	loadCount:0,
	initByAMD:function(){// load by AMD
		this.windowInit();
		define(['Resources']);
		define(['js/Sfc_lib/Base','js/Sfc_lib/Updater','js/Sfc_lib/Director','js/Sfc_lib/Events','js/Sfc_lib/Pointer','js/Sfc_lib/Collider'],this.setBases);//get canvas Updater
	},
	init:function(){// load by websocket
		this.windowInit();
		sfc_require('Resources');
		var requireCount = 6;
		sfc_require('js/Sfc_lib/Base','Base',function(model){
			model.init();
			sfc.Sprite = model.Sprite;
			sfc.Layer = model.Layer;
			sfc.Stage = model.Stage;
			sfc.loadCount ++;
			if(sfc.loadCount >= requireCount){
				sfc.Enter();
			}
			
		});
		sfc_require('js/Sfc_lib/Updater','Updater',function(model){
			sfc.Updater = model;
			sfc.loadCount ++;
			if(sfc.loadCount >= requireCount){
				sfc.Enter();
			}
		});
		sfc_require('js/Sfc_lib/Director','Director',function(model){
			sfc.Director = model;
			sfc.loadCount ++;
			if(sfc.loadCount >= requireCount){
				sfc.Enter();
			}
		});
		sfc_require('js/Sfc_lib/Events','Event',function(model){
			
			sfc.loadCount ++;
			if(sfc.loadCount >= requireCount){
				sfc.Enter();
			}
		});
		sfc_require('js/Sfc_lib/Pointer','Pointer',function(model){
			sfc.Pointer = model;
			sfc.loadCount ++;
			if(sfc.loadCount >= requireCount){
				sfc.Enter();
			}
		});
		sfc_require('js/Sfc_lib/Collider','Collider',function(model){
			sfc.Collider = model;
			sfc.loadCount ++;

			if(sfc.loadCount >= requireCount){
				sfc.Enter();
			}
		});
	},
	
	canvasTopModify:null,
	windowInit:function(){//禁止屏幕滚动
		var body = document.body;
		this.canvas = document.getElementById('canvas');
		if(config.useWebGL == true){
			define(['js/Sfc_lib/WebglUtils'],function(){
				sfc.getWebGLContext = getWebGLContext;
				sfc.initShaders = initShaders;
				sfc.gl = sfc.getWebGLContext(sfc.canvas);
				if(!sfc.gl){
					console.error("You browser didn't support WebGL");
					return ;
				}
			})
		}else {
			this.ctx = sfc.canvas.getContext('2d');
			//用于计算点击事件的距离偏差
		}
		body.scrollTop = body.clientHeight-body.parentNode.clientHeight;
			//把页面滑到最下

		var topModify = document.body.clientHeight - document.body.parentNode.clientHeight;
		//计算顶部滑动距离

		this.canvasTopModify = topModify*(1600/document.body.clientHeight);
		//计算画布中的顶部矫正距离

		window.onscroll = function(){//监听页面滑动事件，防止页面滚动。ps：其实在touchMove事件中已经防止了滑动，这里作进一步预防
			document.body.scrollTop = topModify;
		},
		this.screenModifyX = parseFloat(this.canvas.width)/parseFloat(document.body.clientWidth);
		this.screenModifyY = parseFloat(this.canvas.height)/parseFloat(document.body.clientHeight);
	},

	setBases:function(args){
		args['Base'].init();
		
		/*
		**三大场景封装包
		*/
		sfc.Sprite = args['Base'].Sprite;
		sfc.Layer = args['Base'].Layer;
		sfc.Stage = args['Base'].Stage;

		sfc.Updater = args['Updater'];//更新器

		sfc.Director = args['Director'];//导演类 主线
		
		sfc.Collider = args['Collider'];//碰撞器

		sfc.P = args['Pointer'];//点生成器
		/*
			new sfc.Pointer.point(x,y);
		*/

		sfc.Enter();
	},
	update:function(){
		this.Updater.update();
	},

	Enter:function(){
		sfc.Director.init();
		if(!config.useWS){
			define(['app']);
		}else {
			sfc_require('app')
		}
	},
}


//begin with here
define(['config'],function(){
	if(config.useWS){
		wsinit();
		ws.client.onopen = function(){
			sfc.init();
			ws.client.onclose = function(){
				alert('连接丢失');
			}
		}
	}
	else {
		sfc.initByAMD();
	}
})
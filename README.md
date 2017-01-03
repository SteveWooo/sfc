#1. 开始

###在app.js里面填充如下：（demo）

	(function(){
		'use struct';

		//begin with code here...

		var stage = new sfc.Stage();
		var layer = new sfc.Layer({
			x:10,
			y:10,
			width:100,
			height:100,
		});
		stage.add(layer);

		var background = new sfc.Sprite({//创建背景精灵
			x:0,
			y:0,
			width:900,
			height:1600,
			type:SPRITE_TYPE_ORIGIN,
			color:"#fff",
			name:"background"
		})

		var sprite = new sfc.Sprite({
			x:0,
			y:0,
			width:20,
			height:30,
			type:SPRITE_TYPE_ORIGIN,
			color:"#e1e",
			name:"rect"
		});

		sprite.update = function(){//修改精灵更新动画
			this.x++;
			this.y++;
			this.render();
		}

		layer.add(background);
		layer.add(sprite);
		//增加到场景


		sprite.on('touchstart',function(e){
			console.log(e);
		});//触碰事件

		//以下为必须写入的函数
		sfc.Director.stageChange(stage);
		sfc.Director.main();

	}())

#2. 文件架构

##非nodejs加载机制（websocket加载暂时不稳定）
	src : {
		index.html,    //主页入口
		config.js,     //配置项目
		Resources.js,  //资源加载配置文件
		app.js, 	   //开发者入口文件
		js : {
			sfc.js,    //框架入口文件（在index.html中被引入）
			Sfc_lib : {
				...    //框架库文件
			}
		}
	}

#3. 一些说明

######1)sfc框架中的时间单位规定为1/60秒，即以一帧为时间单位，因此以下用到所有frameTime都是帧时间，而不是常规秒数

######2)sfc框架中默认画布宽高比为900:1600，截掉手机屏幕上方溢出部分，剩下的才是正文部分。因此在pc浏览器上或者平板上观看该框架的成品时，有可能会因画布上方被截走的场景画布过多，导致布局坍塌，离开场景。

######3)sfc框架所有定位为绝对定位，x最大值在任何浏览器上都是900。y高度不一定,但最小值时0。因此封装了sfc.P.maxX和sfc.P.maxY两个数值，可供开发者自由使用

#4. 创建场景，层，精灵（Stage Layer Sprite）

	var stage = new sfc.Stage({
		//Stage暂无参数传入
	})

	var layer = new sfc.Layer({
		x:0,			//图层x坐标
		y:0,			//图层y坐标
		width:100,		//图层宽度
		height:100,		//图层高度
	})

	var sprite = new sfc.Sprite({
		x:0,			//精灵x坐标
		y:0,			//精灵y坐标
		width:100,		//精灵宽度
		height:100,		//精灵高度
		type:SPRITE_TYPE_ORIGIN,
		/*
		* SPRITE_TYPE_ORIGIN,   //方块类型，单纯长宽颜色属性配置
		* SPRITE_TYPE_TEXT,		//文本类型，支持换行
		* SPRITE_TYPE_INPUT		//输入类型，默认使用prompt
		*/
		color:"#e1e",			//颜色
		name:"rect"				//我忘了我为啥设置这个
	})
	stage.add(layer);
	layer.add(sprite);

#5. Stage(场景)
####1)往Stage中加入层，stage中的层才能被加入渲染容器中。
	stage.add(layer)

####2)场景切换后，渲染容器中的所有渲染对象都将改变成stage中的sprite。
	sfc.Director.stageChange(stage);


#6. Layer(层)
####1)往Layer中加入精灵，才能把sprite加入渲染容器中。
	layer.add(sprite)
		
#7. Sprite(精灵)：

####1)SPRITE_TYPE_ORIGIN 矩形Sprite初始化可用属性

	number : {
		x:true,
		y:true,
		width:true,
		height:true,,
		type:true,
		
		shadowBlur:true,
		shadowOffsetX:true,
		shadowOffsetY:true,

		opacity:true
	},
	string : {
		name:true,
		color:true,
		borderColor:true,
		shadowColor:true
	}

####2)SPRITE_TYPE_TEXT 文本可用属性

	number : {
		x:true,
		y:true,
		width:true,
		height:true,,
		type:true,
		
		shadowBlur:true,
		shadowOffsetX:true,
		shadowOffsetY:true,

		opacity:true
	},
	string : {
		fontSize:true,
		name:true,
		color:true,
		text:true,
		fontStyle:true,
		borderColor:true,
		shadowColor:true
	}

####3)SPRITE_TYPE_INPUT 输入可用属性

	number : {
		x:true,
		y:true,
		width:true,
		height:true,,
		type:true,
		
		shadowBlur:true,
		shadowOffsetX:true,
		shadowOffsetY:true,

		opacity:true
	},
	string : {
		fontSize:true,
		name:true,
		color:true,
		text:true,
		fontStyle:true,
		value:true,
		borderColor:true,
		shadowColor:true
	}

##Sprite Api:
###1)帧处理
	sprite.update()
	
#####demo:使sprite每帧x＋1；
	sprite.update = function(){
		this.x ++;
	}
	
###2)渐进渐出
	sprite.fadeIn(frameTime);
	sprite.fadeOut(frameTime)

#####demo:1秒内opacity从0到sprite设置好的opacity（默认1）；

	sprite.fadeIn(60)

###3)缓动
	sprite.move(way,frameTime,distancePerFrame)

######参数way：sfc.MVOE_RIGHT;sfc.MOVE_LEFT;sfc.MOVE_UP;sfc.MOVE_DOWN。控制移动方向
######参数frameTime:非0正整数。控制缓动时间
######参数distancePerFrame:数字。控制每帧移动的距离。

#####demo:30帧（500毫秒）往右移动300像素。
	sprite.move(sfc.MOVE_RIGHT,30,10);

#####demo:30帧内x方向＋300像素；同时60帧内y方向＋420像素。
	sprite.move(sfc.MOVE_RIGHT,30,10);
	sprite.move(sfc.MOVE_DOWN,60,7);

###4)事件监听
	sprite.on(eventName,callback);

######参数eventName：touchstart,touchend。（touchmove参数可在全局调用）;
######参数callback：回调函数，传入一个e参数，可获取e.x,e.y直接得到touch坐标 ;

#####demo:sprite监听触碰开始事件，用户触碰sprite时控制台上输出一句话
	sprite.on('touchstart', function(e){
		console.log("I have been touched.Touch position"+e.x+","+e.y);
	})

#8. 碰撞
###1)Sprite碰撞检测
	sfc.Collider.touchCheck(obj1,obj2);

######返回true：两物体碰撞

#9. 异步加载js

###1)define(['modelRoute'],callback)
######假如在main.js同层目录下有一个文件名为test.js的模块文件要导入

####main.js:
	define(['test'], function(args){
		console.log(args['test']);//输出test模块内的所有内容
	})

####test.js:
	exports.test = {
		hi:function(){
			alert("hello world");
		}
	}

#10. WebGL
######目前仅封装了gl的初始化。正在兼容坐标系

####1)config.js:
	useWebGL:true

####2)gl工具：
	sfc.gl;//webgl的Context工具库

####3)着色器初始化：
	sfc.initShaders(gl,vertextShader_source,frageShader_source);//着色器初始化


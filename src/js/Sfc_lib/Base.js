exports.Base = {
	init:function(){
		
	},
	Sprite:function(para){
		var self = this;
		if(para == undefined){
			para = {
				type:SPRITE_TYPE_ORIGIN
			}
		}
		if(para.opacity == undefined){
			para.opacity = 1;
		}
		var paraTypes = {//类型列表
			number : {
				x:true,
				y:true,
				width:true,
				height:true,
				sx:true,
				sy:true,
				swidth:true,
				sheight:true,
				rotate:true,
				type:true,
				
				borderThick:true,
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
		}
		var typeCheck = function(){
			for(var i in para){
				if(!(i in paraTypes[typeof para[i]])){
					throw 'sprite type error:typeof '+i+' error in sprite constructor';
				}
			}
		}
		//检查输入参数类型
		try{
			typeCheck();	
		}catch(e){
			console.error(e);
			return;
		}

		var getModifyPoint = function(){//矫正点坐标
			if(para.x == undefined || para.y == undefined){
				// throw 'params error:please input sprite init location';
				return;
			}
			var x = para.x;
			var y = para.y;
			var point = new sfc.P.point(x,y);
			para.x = point.x;
			para.y = point.y;
		}
		getModifyPoint();

		var typeInit = function(type){
			if(type == null || undefined){
				para.type = SPRITE_TYPE_ORIGIN;
				this.__proto__.type = SPRITE_TYPE_ORIGIN;
			}
			switch(type){
				case SPRITE_TYPE_INPUT:
					self.value = "";
					self.fontSize = (self.height-20);
					self.fontStyle = self.fontSize + "px Georgia";
					self.on('touchstart',function(){
						var i = prompt(self.value);
						if(!i)return;
						self.value = i;
					});
				break;

			}
		}
		typeInit(para.type);

		this.__proto__ = para;//赋值

		this.onAnimate = {
			Switch:false,
			para:{},
			slices:{},
			animateTime:0,
		}
		var that = this;
		this.renderFn = {//渲染类
			originRender:function(){
				sfc.ctx.globalAlpha = that.opacity;
				sfc.ctx.shadowBlur = that.shadowBlur;
				sfc.ctx.shadowColor = that.shadowColor;
				sfc.ctx.shadowOffsetX = that.shadowOffsetX;
				sfc.ctx.shadowOffsetY = that.shadowOffsetY;
				sfc.ctx.fillStyle=that.color;
				sfc.ctx.fillRect(that.x,that.y,that.width,that.height);
			},
			imgRender:function(){
				//TODO image loader
			},
			textRender:function(){
				sfc.ctx.globalAlpha = that.opacity;
				sfc.ctx.font = that.fontStyle;
				sfc.ctx.fillStyle = that.color;
				var lineCount = Math.ceil(that.text.length*that.fontSize/that.width);
				var everyLine = Math.floor(that.width/that.fontSize);
				for(var i = 0;i<lineCount;i++){
					sfc.ctx.fillText(that.text.substring(i*everyLine,(i===lineCount-1?that.text.length:(i+1)*everyLine)),
						that.x,that.y+i*that.fontSize+i*that.lineHeight);
				}
			},
			inputRender:function(){
				sfc.ctx.globalAlpha = that.opacity;
				sfc.ctx.shadowBlur = that.shadowBlur;
				sfc.ctx.shadowColor = that.shadowColor;
				sfc.ctx.shadowOffsetX = that.shadowOffsetX;
				sfc.ctx.shadowOffsetY = that.shadowOffsetY;
				sfc.ctx.fillStyle = that.color;
				sfc.ctx.fillRect(that.x,that.y,that.width,that.height);

				//渲染输入内容
				sfc.ctx.shadowBlur = 0;
				sfc.ctx.shadowColor = 0;
				sfc.ctx.shadowOffsetX = 0;
				sfc.ctx.shadowOffsetY = 0;
				sfc.ctx.font = that.fontStyle;
				sfc.ctx.fillStyle = that.color||"#000";
				sfc.ctx.fillText(that.value.substring(0,Math.floor(that.width/that.fontSize)),that.x+10,that.y+that.height/1.4);
			}
		}
		this.animationDeal = function(){

		}
		this.render = function(){
			//animation
			if(this.onAnimate.Switch){
				for(var i in this.onAnimate.slices){
					this.i += this.onAnimate.slices[i];
				}
				if(++this.onAnimate.animateTime>=this.onAnimate.para.time){
					this.onAnimate.Switch = false;
					this.onAnimate.animateTime = 0;
				}

			}
			//render here
			sfc.ctx.save();
			switch(this.type){
				case SPRITE_TYPE_ORIGIN:
					this.renderFn.originRender();
				break;

				case SPRITE_TYPE_IMG:
					this.renderFn.imgRender();
				break;

				case SPRITE_TYPE_TEXT:
					this.__proto__.fontSize = parseInt(this.fontStyle.substring(0,this.fontStyle.indexOf('p')));
					this.__proto__.lineHeight = this.lineHeight || 16;
					this.renderFn.textRender();
				break;

				case SPRITE_TYPE_INPUT:
					this.renderFn.inputRender();
				break;
				default:
					throw("sprite type error:Do not found Sprite type");
				break;
			}
			sfc.ctx.restore();
		}
		this.update = function(dTime){

		}

		this.sfcUpdate = function(dTime){
			this.updateMove();
			this.updateFade();
			this.render();
		}

		//move
		function MoveObject(way,time,speed){
			this.nowTime = 0;
			this.time = time;
			this.way = way;
			this.speed = speed;
			var moveSelf = this;
			this.move = function(obj){
				switch(moveSelf.way){
					case 2:
						obj.y -= moveSelf.speed;
					break;
					case 8:
						obj.y += moveSelf.speed;
					break;
					case 4:
						obj.x -= moveSelf.speed;
					break;
					case 6:
						obj.x += moveSelf.speed;
					break;
					default:
					return ;
				}
				moveSelf.nowTime ++ ;
			}

		}
		this.moveTree = {
			moveObjects:[]
		}
		this.updateMove = function(){
			for(var i=0;i<self.moveTree.moveObjects.length;i++){
				if(self.moveTree.moveObjects[i].nowTime >= self.moveTree.moveObjects[i].time){
					self.moveTree.moveObjects.splice(i,1);
					i--;
					continue;
				}
				self.moveTree.moveObjects[i].move(self);
			}
		}
		this.move = function(way,time,speed){
			if(way == null || way != parseInt(way) || 
			   time == null || time != parseInt(time) || 
			   speed == null || speed != parseInt(speed)){
				console.error("Object params error,moveObject's params must all int");
			return ;
			}
			var m = new MoveObject(way,time,speed);
			self.moveTree.moveObjects.push(m);
		}
		

		this.moveToX = function(x){
			this.x = x;
		}

		//fade
		this.opacityConfig = {
			time:null,
			speed:null,
			realOpacity:null,
			way:1,
			nowTime:0
		}

		this.updateFade = function(){
			if(self.opacityConfig.time == null){
				return false;
			}
			if(self.opacityConfig.nowTime >= self.opacityConfig.time){
				self.opacity = self.opacityConfig.realOpacity;
				self.opacityConfig = {
					time:null,
					speed:null,
					realOpacity:null,
					way:1,
					nowTime:0
				}
				return ;
			}
			self.opacityConfig.nowTime += self.opacityConfig.speed;
			self.opacity = self.opacityConfig.speed + self.opacity;
			self.opacityConfig.nowTime ++;
			if(self.opacityConfig.speed < 0 && self.opacity <= 0){
				self.opacity = 0;
				return;
			}
		}
		this.fadeIn = function(time){
			self.opacityConfig.realOpacity = self.opacity;
			self.opacityConfig.time = time;
			self.opacityConfig.speed = parseFloat(self.opacity)/parseFloat(time);
			self.opacity = 0;
		}

		this.fadeOut = function(time){
			self.opacityConfig.realOpacity = 0;
			self.opacityConfig.time = time;
			self.opacityConfig.speed = -parseFloat(self.opacity)/parseFloat(time);
		}

		this.on = function(event,callback){//事件
			switch(event){
				case 'touchstart':
					sfc.Updater.eventPush('touchstart',this);
					this.onTouchStart = callback;
				break;

				case 'touchmove':
					this.onTouchMove = callback;
				break;

				case 'touchend':
					sfc.Updater.eventPush('touchend',this);
					this.onTouchEnd = callback;
				break;
			}
		}
		this.onTouchStart = function(e){
			
		}
		this.onTouchMove = function(e){

		}
		this.onTouchEnd = function(e){

		}

		//animates
		this.animate = function(para){
			/*
				para = {
					toX:xxx,
					toY:xxx,
					toWidth:xxx,
					toHeight:xxx,

					toSx:xxx,
					toSy:xxx,
					toSwidth:xxx,
					toSheight:xxx,

					toChartlet:xxx,

					toRotate:xxx,

					time:xxx,
				}
			*/
			this.onAnimate.Switch = true;
			this.onAnimate.para = para;
			this.onAnimate.animateTime = 0;
			for(var i in para){
				this.onAnimate.slices[i] = para[i]/para[time];
			}
		}
			
		
	},
	Layer:function(para){
		//todo：整体缩放，整体移动
		var layerSelf = this;
		this.__proto__ = {
			x:undefined,
			y:undefined,
			width:undefined,
			height:undefined,
		}
		if(para.x === undefined || para.y === undefined || para.width === undefined || para.height === undefined){
			console.error('params error:params lost');
			return ;
		}
		if(this.width<=1){
			this.width = sfc.P.maxX * this.width;
		}
		this.__proto__ = para;

		this.child = [];
		this.add = function(sprite){
			var that = this;
			var setPosition = function(sprite){
				sprite.x += that.x;
				sprite.y += that.y;
				return sprite;
			}
			this.child.push(setPosition(sprite));
		}
		this.remove = function(sprite){
			for(var i=0;i<layerSelf.child.length;i++){
				if(layerSelf.child[i] == sprite){
					layerSelf.child.splice(i,1);
					break;
				}
			}
		}
	},
	Stage:function(){
		//TODO stage class 
		var stageSelf = this;
		this.child = [];
		this.add = function(layer){
			this.child.push(layer);
		}
		this.remove = function(layer){
			for(var i=0;i<stageSelf.child.length;i++){
				if(stageSelf.child[i] == layer){
					stageSelf.child.splice(i,1);
					break;
				}
			}
		}
	},
}
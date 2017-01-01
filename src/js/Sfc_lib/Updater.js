exports.Updater = {
	renderTree:[],//TODO change sprite's zindex
	pushStage:function(stage){
		this.renderTree.push(stage);
	},
	clearStage:function(){
		this.renderTree = [];
	},
	update:function(){
		var ans = 0;
		this.looper(this.renderTree);//render update
		
		sfc.Director.timer.update();//timerEvent update
	},
	looper:function(tree){
		for(var i = 0;i<tree.length;i++){
			if(tree[i].child){
				this.looper(tree[i].child);
			}else {
				tree[i].update();
				tree[i].sfcUpdate();
			}
		}
	},
	//常规渲染

	eventPush:function(event,obj){
		switch(event){
			case 'touchstart':
				this.touchStartTree.push(obj);
			break;
			case 'touchend':
				this.touchEndTree.push(obj);
			break;
		}
	},

	touchStartTree:[],
	updateToushStart:function(e){
		for(var i =0;i<this.touchStartTree.length;i++){
			if(sfc.Collider.touchCheck(e,this.touchStartTree[i])){
				this.touchStartTree[i].onTouchStart(e);
			}
			
		}
	},

	touchEndTree:[],
	updateToushEnd:function(e){
		for(var i =0;i<this.touchEndTree.length;i++){
			if(sfc.Collider.touchCheck(e,this.touchEndTree[i])){
				this.touchEndTree[i].onTouchEnd(e);
			}
			
		}
	},
	//事件循环渲染
}
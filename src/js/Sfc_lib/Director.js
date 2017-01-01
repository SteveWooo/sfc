exports.Director = {
	timer:{
		time:0,
		update:function(){
			this.time ++;
			if(this.intervals.length === 0 && this.timeouts.length === 0)return;
			for(var i=0;i<this.intervals.length;i++){
				if(this.time >= this.intervals[i].endTime){
					this.intervals[i].endFunc();
				}
			}
			for(var i=0;i<this.timeouts.length;i++){
				if(this.time >= this.timeouts[i].endTime){
					this.timeouts[i].endFunc();
				}
			}
		},
		intervals:[],
		timeouts:[],
		setInterval:function(callback,time){
			var obj = {
				id:sfc.Director.timer.intervals.length,
				beginTime:sfc.Director.timer.time,
				callback:callback,
				endTime:sfc.Director.timer.time + time,
				times:time,
				endFunc:function(){
					this.beginTime = this.endTime;
					this.endTime = this.beginTime+this.times;
					this.callback();
				},
				destroy:function(){
					for(var i=0;i<sfc.Director.timer.intervals.length;i++){
						if(sfc.Director.timer.intervals[i].id === this.id){
							sfc.Director.timer.intervals.splice(i,1);
							return true;
						}
					}
					return false;
				}
			}
			this.intervals.push(obj);
			return obj;
		},
		setTimeout:function(callback,time){
			var obj = {
				id:sfc.Director.timer.timeouts.length,
				beginTime:sfc.Director.timer.time,
				callback:callback,
				endTime:sfc.Director.timer.time + time,
				destroy:function(){
					for(var i=0;i<sfc.Director.timer.timeouts.length;i++){
						if(sfc.Director.timer.timeouts[i].id === this.id){
							sfc.Director.timer.timeouts.splice(i,1);
							console.log('destroy');
							return true;
						}
					}
					return false;
				},
				endFunc:function(){
					this.callback();
					this.destroy();
				},
			}
			this.timeouts.push(obj);
			return obj;
		}
	},
	init:function(){
		this.timer.time = 0;
	},
	stageChange:function(stage){
		sfc.Updater.clearStage();
		sfc.Updater.pushStage(stage);
	},
	main:function(){
		sfc.update();
		sfc.req = requestAnimationFrame(sfc.Director.main);
	}
}
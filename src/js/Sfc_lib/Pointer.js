exports.Pointer = {
	point:function(x,y){
		this.x = x;
		this.y = y+sfc.canvasTopModify;
		//TODO:这里想办法修改成全体百分比布局
		return this;
	},
	cx:sfc.canvas.width/2,
	cy:sfc.canvas.height/2,

	minX:0,
	maxX:sfc.canvas.width,

	minY:0,
	maxY:sfc.canvas.height-sfc.canvasTopModify,
}
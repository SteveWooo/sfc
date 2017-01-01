(function(){
	'use struct';

	//begin with code here...
	return ;

	var stage = new sfc.Stage();
	var layer = new sfc.Layer({
		x:100,
		y:100,
		width:100,
		height:100
	});
	stage.add(layer);

	var bg = new sfc.Sprite();
	bg.x = 0;
	bg.y = 0;
	bg.width = sfc.canvas.width;
	bg.height = sfc.canvas.height;
	bg.color = "#fff";

	var rect = new sfc.Sprite();
	rect.x = 0;
	rect.y = 0;
	rect.width = 100;
	rect.height = 100;
	rect.color = "red";

	rect.on('touchstart', function(e){
		this.y += 100;
	})
	layer.add(bg);
	layer.add(rect);


	//以下为必须写入的函数
	sfc.Director.stageChange(stage);//加入舞台

	try{
		sfc.Director.main();
		//heiheihei
	}catch(e){
		console.error(e)
	}
}())

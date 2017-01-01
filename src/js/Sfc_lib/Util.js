exports.Util = {
	number:1,
}

var ls = {
	set:function(key,value){
		window.localStorage[key] = value;
	},
	get:function(key,defaultValue){
		return window.localStorage[key] || defaultValue;
	},
	setObject:function(key,value){
		window.localStorage[key] = JSON.stringify(value);
	},
	getObject:function(key){
		if(window.localStorage[key] == null)return null;
		return JSON.parse(window.localStorage[key]||{});
	}
}

// var stage = new sfc.Stage();
	// var layer = new sfc.Layer({
	// 	x:10,
	// 	y:10,
	// 	width:100,
	// 	height:100,
	// 	rotate:0,
	// });
	// stage.add(layer);

	// var background = new sfc.Sprite({
	// 	x:0,
	// 	y:0,
	// 	width:900,
	// 	height:1600,
	// 	type:SPRITE_TYPE_ORIGIN,
	// 	color:"#fff",
	// 	name:"background"
	// })

	// var sprite = new sfc.Sprite({
	// 	x:0,
	// 	y:0,
	// 	width:20,
	// 	height:30,
	// 	type:SPRITE_TYPE_ORIGIN,
	// 	color:"#e1e",
	// 	name:"rect"
	// });

	// sprite.update = function(){
	// 	// this.x++;
	// 	// this.y++;
	// 	this.render();
	// }
	// layer.add(background);
	// layer.add(sprite);

	// sprite.on('touchstart',function(e){
	// 	console.log(e);
	// });
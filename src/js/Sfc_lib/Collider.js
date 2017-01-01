exports.Collider = {
	touchCheck:function(e,obj){
		if( e.x>=obj.x && e.x<=obj.x+obj.width && 
		    e.y>=obj.y && e.y<=obj.y+obj.height ){
			return true;
		}
		return false;
	}
}
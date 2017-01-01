
// main();

document.addEventListener('touchstart',function(e){
	e.x = e.touches[0].clientX * sfc.screenModifyX;
	e.y = e.touches[0].clientY * sfc.screenModifyY + sfc.canvasTopModify;

	sfc.Updater.updateToushStart(e);
})

document.addEventListener('touchmove',function(e){
	e.x = e.touches[0].clientX * sfc.screenModifyX;
	e.y = e.touches[0].clientY * sfc.screenModifyY;

	e.preventDefault();
})

document.addEventListener('touchend',function(e){
	e.x = e.changedTouches[0].clientX * sfc.screenModifyX;
	e.y = e.changedTouches[0].clientY * sfc.screenModifyY + sfc.canvasTopModify;

	sfc.Updater.updateToushEnd(e);
})
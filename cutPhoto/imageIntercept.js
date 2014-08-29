function ImgInterceptTool(option) {
	var isIE = (window.navigator.userAgent.indexOf("IE") == -1) ? false : true;
	var selectAreaId, showImgId, selectArea, showImg, resizeBtnId;
	var proportion = 0.813 //宽/高
	var flag = false;
	var oldX, oldY;
	var multiple;//图片显示与原尺寸的比例倍数
	var maxSize = {
			"x": 300,
			"y": 500
	};
	
	//需要获取的最终的信息 default
	var interceptInfo = {
			"x": 0,
			"y": 0,
			"width": 142.8 / option.multiple,
			"height": 200 / option.multiple
	};
	
	this.show = function() {
		//初始化
		if(option){
			if(option.proportion)
				proportion = option.proportion;
			if(option.selectAreaId && option.showImgId) {
				maxSize.y = option.height;
				proportion = option.proportion;
				selectAreaId = option.selectAreaId;
				showImgId = option.showImgId;
				
				selectArea = document.getElementById(selectAreaId);
				showImg = document.getElementById(showImgId);
				
				resizeBtnId = selectArea.children[0].id;

				document.getElementById(option.backImgId).src = option.imagePath;
				showImg.src = option.imagePath;
				multiple =  option.multiple;
			}else{
				throw new Error("The option.ids can not be empty,please set right dom's id to it!");
				return;
			}
		}
		
		setFlagById(selectAreaId, resizeBtnId);
		bindOnmouseMoveById(selectAreaId,resizeBtnId);
		
		if(isIE){
			showImg.style.clip = "rect(0px, 142.8px, 200px, 0px)";
		}
		
		//处理如果图片显示高度小于200
		if(option.height < 200){
			showImg.style.clip = "rect(0px, " + (option.height * proportion) + "px, " + option.height + "px, 0px)";
			selectArea.style.height = option.height + "px";
			selectArea.style.width = option.height * proportion + "px";;
		}

	};
	
	function setFlagById() {
		for(var i = 0; i < arguments.length; i++) {
			
			document.getElementById(arguments[i]).onmousedown = function(e) {
				//获取鼠标点击的值（起点）
				var eve = e || window.event;
				oldX = eve.clientX;
				oldY = eve.clientY;
				flag = true;
			};

			document.getElementById(arguments[i]).onmouseup = function(e) {
				flag = false;
			};

			document.getElementById(arguments[i]).onmouseout = function(e) {
				flag = false;
			};
		}
	}

	function bindOnmouseMoveById() {
		for(var i = 0; i < arguments.length; i++) {
			document.getElementById(arguments[i]).onmousemove = function(e) {
				//阻止事件冒泡机制
				var eve = e || window.event;
				if(isIE){
					window.event.cancelBubble = true;
				}else {
					eve.stopPropagation(); 
				}
				
				var state = 0;
				
				if(this === document.getElementById(resizeBtnId)) {
					state = 1;
				}else if(this === document.getElementById(selectAreaId)) {
					state = 2;
				}
				
				changeSelectArea(eve.clientX - oldX, eve.clientY - oldY, state);
				
				
				//赋值 -> 下一次移动的时候用
				oldX = eve.clientX;
				oldY = eve.clientY;

			};
		}
	};
	
	function changeSelectArea(offsetX, offsetY, state){
		if(!flag) 
			return
			
		if(state === 0)
			return
			
		var width, height, left, top;

		//判断是执行的哪个事件 1: resize; 2: move
		if(state === 1) {
			
			left = parseInt(selectArea.style.left) || 0;
			top = parseInt(selectArea.style.top) || 0;
			
			//获取拉伸之后的高度与宽度
			height = (parseInt(selectArea.style.height) || 200 ) + offsetY;
			width = height * proportion  + offsetX;

			//判断是否超出边界
			if(width + left > maxSize.x){
				width = maxSize.x - left;
			}
			
			if(height + top > maxSize.y){
				height = maxSize.y - top;
			}
			
			selectArea.style.width = width + "px";
			selectArea.style.height = height + "px";
			
		}else if(state === 2) {
			//获取绝对定位的数值
			left = (parseInt(selectArea.style.left) || 0)  + offsetX;
			top = (parseInt(selectArea.style.top) || 0 ) + offsetY;

			height = parseInt(selectArea.style.height) || 200;
			width = height * proportion;
			
			
			//判断是否超出边界
			if(width + left > maxSize.x){
				left = maxSize.x - width;
			}else{
				left = left < 0 ? 0 : left;
			}
			
			if(height + top > maxSize.y){
				top = maxSize.y - height;
			}else{
				top = top < 0 ? 0 : top;
			}
			
			selectArea.style.left = left + "px";
			selectArea.style.top = top + "px";

		}
		
		//设置要截取的画面
		showImg.style.clip = "rect(" + top + "px " + (left + width) +"px " + (top + height) + "px " + left +"px)";
		
		setInterceptInfo(left, top, width, height);
		
	};
	
	function setInterceptInfo (x, y, width, height) {
		x = x < 0 ? 0 : x;
		y = y < 0 ? 0 : y;
		interceptInfo = {
				"x": x / multiple,
				"y": y / multiple,
				"width": width / multiple,
				"height": height / multiple
		};
	};
	
	this.getInterceptInfo = function() {
		return interceptInfo;
	};
}

var option = {
	"imagePath": "Bluehills.jpg", //图片路径
	"height": 300 / 800 * 600, //根据图片高度与宽度计算出的实际显示高度
	"multiple":  300 / 800, //根据图片宽度与实际显示的比例 
	"proportion": 0.813,  //显示的比例，0.813为1寸照片的比例
	"selectAreaId": "editArea", //选区的id
	"backImgId": "backImg",  //后置的图片id
	"showImgId": "showImg"  //前置的图片id
}

var hander = new ImgInterceptTool(option);
hander.show();

document.getElementById("showBtn").onclick = function() {
	alert("x: " + hander.getInterceptInfo().x + 
		  " y: " + hander.getInterceptInfo().y + 
		  " width: " + hander.getInterceptInfo().width + 
		  " height:" + hander.getInterceptInfo().height );
}


###功能说明

下载本页的全部文件可以预览，打开index.html文件

本功能为在页面上实现一个图片剪切的功能，由前台返回预览裁剪的位置数据，后台进行裁剪。
写了一个**ImgInterceptTool**组件。

使用方法为：
    
    var hander = new ImgInterceptTool(option);
    hander.show();

其中option的值为一个json形式的内容：
    
    var option = {
		"imagePath": "Bluehills.jpg", //图片路径
		"height": 300 / 800 * 600, //根据图片高度与宽度计算出的实际显示高度
		"multiple":  300 / 800, //根据图片宽度与实际显示的比例 
		"proportion": 0.813,  //显示的比例，0.813为1寸照片的比例
		"selectAreaId": "editArea", //选区的id
		"backImgId": "backImg",  //后置的图片id
		"showImgId": "showImg"  //前置的图片id
    }

其中的必须值为：imagePath、height、multiple、selectAreaId、backImgId、showImgId

需要：
	
	<link rel="stylesheet" type="text/css" href="imageIntercept.css">
	<script type="text/javascript" src="imageIntercept.js"></script>

页面的html：
 
    <div class="outer">
		<img src="" class="afterImg" id="backImg">
		<img src="Bluehills.jpg" class="beforeImg" id="showImg">
		<div class="inner" id="editArea">
			<div class="rect bottom-right-btn" id="resize"></div>
		</div>		
	</div>


如果以后需要后台的处理文件再上传到这。

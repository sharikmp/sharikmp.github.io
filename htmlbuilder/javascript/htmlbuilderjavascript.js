window.addEventListener('load', function () {
	document.getElementById('sampleeditor').setAttribute('contenteditable', 'true');
});

function format(command, value) {
	document.execCommand(command, false, value);
	getHTML();
}

function insertImage() {
	var url = document.getElementById('txtFormatUrl').value;
	var w = document.getElementById('imgwidth').value;
	if (w == '' || w == null) {
		w = "500";
	}
	document.execCommand('insertHTML', false, '<img src="' + url + '"  width="' + w + '" height="auto" style="border: 1px solid #ddd; float:right;" ></img>');
	document.getElementById('txtFormatUrl').value = '';
	getHTML();
}

function setUrl() {
	var url = document.getElementById('txtFormatUrl').value;
	var sText = document.getSelection();
	document.execCommand('insertHTML', false, '<a href="' + url + '">' + sText + '</a>');
	document.getElementById('txtFormatUrl').value = '';
	getHTML();
}


function getHTML() {
	var title = document.getElementById('posttitle').value;
	var htmlsourcecode = document.getElementById('sampleeditor').innerHTML;
	if (htmlsourcecode != '' && htmlsourcecode != null) {
		htmlsourcecode = '<!DOCTYPE html><html><head><title>'+title+'</title><style>#postcontenttitle{border: 1px solid #ddd; padding:5px 5px 5px 5px;background:#6792EF;background: linear-gradient(270deg, rgba(255, 255, 255, 1) 0%, rgba(132, 189, 255, 0.804359243697479) 100%);}#postcontent{background:rgb(255, 255, 255);//background:linear-gradient(270deg, rgba(255, 255, 255, 1) 0%, rgba(132, 189, 255, 0.804359243697479) 100%);border:1px solid #ddd;padding:20px;font-family:arial;font-size:15px;}#maincontainer{padding-right:20px;padding-bottom:50px;padding-left:20px}.footer{left:0;bottom:5px;width:100%!important;min-width:300px;background:#6792EF;background: linear-gradient(270deg, rgba(255, 255, 255, 1) 0%, rgba(132, 189, 255, 0.804359243697479) 100%);border: 1px solid #ddd;color:black;text-align:center;padding-top:20px;padding-bottom:1px}.footer a{color:black;text-decoration:underline;font-weight:bold}</style></head><body><div id="postcontent"><br/><div id="postcontenttitle" style="text-align: center;"><h3>' + title + '</h3></div><br/><br/><br/>' + htmlsourcecode;
		htmlsourcecode += '<br/><br/><br/><br/><div class="footer"> <address> Posted on:' + new Date().toLocaleString() + '<br/>By <a id="developer" href="mailto:sharik.madhyapradeshi@gmail.com">Sharik Madhyapradeshi</a>.<br> The City Of Joy, West Bengal,<br> With Love From India </address></div>';
		htmlsourcecode += '</div><br/></body></html>';
		document.getElementById('test').innerHTML = htmlsourcecode;
		var elmnt = document.getElementById("htmlcode");
		elmnt.value = htmlsourcecode;
		elmnt.style.display = "inline";
		document.getElementById('copyButton').style.display = "inline";
	}

}


function copyToClipboard(id) {
  var copyText = document.getElementById(id);
  copyText.select();
  document.execCommand("copy");
  document.getElementById('copiedMessage').innerHTML = 'Copied!';
}

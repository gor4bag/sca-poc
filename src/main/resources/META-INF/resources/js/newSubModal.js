/**
 * POPUP WINDOW CODE v1.1
 * Used for displaying DHTML only popups instead of using buggy modal windows.
 *
 * By Seth Banks (webmaster at subimage dot com)
 * http://www.subimage.com/
 *
 * Contributions by Eric Angel (tab index code) and Scott (hiding/showing selects for IE users)
 *
 * Up to date code can be found at http://www.subimage.com/dhtml/subModal
 *
 * This code is free for you to use anywhere, just keep this comment block.
 *
 * History
 * May/2006  Alexandre Fernandes Changes to use inside JSF tag
 * June/2006 Alexandre Fernandes Changes to add drag and drop functionality
 */


// Popup code
var gReturnFunc;
var gPopupIsShown = false;

var gParam = null;

var gHideSelects = false;


var gInnerFrameHtml = '' + 
	'	<iframe id="popupFrame" src="'+ window.theContextRoot+'/inc/loading.jsp" scrolling="auto" frameborder="0" allowtransparency="true" name="popupFrame"></iframe>';

	
var gInnerHtml = '' +
	'<table class="popupTable" cellpadding="0px" cellspacing="0px">' +
	'  <tr>' +
	'    <td>' + 
	'      <table class="popupHeaderTable" cellpadding="0px" cellspacing="0px">' +
	'        <tr>' +
	'          <td id="titleBar" class="popupHeaderColumn" onselectstart="return false" ondragstart="return false">' +
	'	         <div id="popupTitleBar">' + 
	'		       <div id="popupTitle" onselectstart="return false" ondragstart="return false">&nbsp;</div>' + 
	'            </div>' +
	'          </td>' +
	'          <td class="popupHeaderButtonColumn">' +
	'            <div><a href="javascript:void(0);" onclick="popupCloseButtonClicked();" style="border-style:none;border:0px;text-decoration:none;">' +
	'              <img style="border-style:none;border:0px" id="popupCloseButtonImg" src="'+ window.theContextRoot+'/images/close-window.gif" onmousedown="popupCloseButtonMouseEvt(true);" onmouseup="popupCloseButtonMouseEvt(false);" onmouseout="popupCloseButtonMouseEvt(false);"/>' +
	'            </a></div>' +
	'	       </td>' +
	'        </tr>' +
	'      </table>' + 
	'    </td>' +
	'  </tr>' +
	'  <tr>' +
	'    <td class="popupContentsRow" valign="top">' +
	'      <div id="popupInner">' +    
	gInnerFrameHtml + 
	'      </div>' + 	
	'    </td>'
	'  </tr>' +
	'</table>';

// Variables used to drag and drop funct.
var isIE=document.all;
var isDrag=false;

var gTabIndexes = new Array();
// Pre-defined list of tags we want to disable/enable tabbing into
var gTabbableTags = new Array("A","BUTTON","TEXTAREA","INPUT","IFRAME");	

// If using Mozilla or Firefox, use Tab-key trap.
if (!document.all) {
	document.onkeypress = keyDownHandler;
}

var testes = '';


/**
 * Initializes popup code on load.	
 */
function initPopUp() {
	// Add the HTML to the body
	testes += 'init; ';
	body = document.body; //.getElementsByTagName('body')[0];
	popmask = document.createElement('div');
	popmask.id = 'popupMask';
	popcont = document.createElement('div');
	popcont.id = 'popupContainer';
	popcont.innerHTML = gInnerHtml;
	body.appendChild(popmask);
	body.appendChild(popcont);
	
	// check to see if this is IE version 6 or lower. hide select boxes if so
	// maybe they'll fix this in version 7?
	var brsVersion = parseInt(window.navigator.appVersion.charAt(0), 10);
	if (brsVersion <= 6 && window.navigator.userAgent.indexOf("MSIE") > -1) {
		gHideSelects = true;
	}

	document.onmousedown=ddInit;
	document.onmouseup=ddStop;
	
	if ( typeof hasInitPopupOnLoadFunction != 'undefined' )
		initPopupOnLoad();

	
}

function ddStop(e) {
	ddEnabled=false;
	/*
	gPopupFrame.style.opacity = "1";
	gPopupFrame.style.filter = "alpha(opacity=100)";
	gPopupInner.style.opacity = "1";
	gPopupInner.style.filter = "alpha(opacity=100)";
	gPopupContainer.style.opacity = "1";
	gPopupContainer.style.filter = "alpha(opacity=100)";
	*/
}

function ddInit(e){
	if ( gPopupIsShown == true )
	{
		topObj=isIE ? "BODY" : "HTML";
		hotObj=isIE ? event.srcElement : e.target;  
		while (hotObj.id!="titleBar"&&hotObj.tagName!=topObj){
			hotObj=isIE ? hotObj.parentElement : hotObj.parentNode;
		}  
		if (hotObj.id=="titleBar"){
			var popupContainer = document.getElementById("popupContainer");
			offsetx=isIE ? event.clientX : e.clientX;
			offsety=isIE ? event.clientY : e.clientY;
			nowX=parseInt(popupContainer.style.left);
			nowY=parseInt(popupContainer.style.top);

		    ddEnabled = true;
		    document.onmousemove = dd;
    
		}
	}
}

function dd(e){
  if (!ddEnabled) return;
  	newX = isIE ? event.clientX-offsetx : e.clientX-offsetx;
  	newY = isIE ? event.clientY-offsety : e.clientY-offsety;
  	
  	/*
	gPopupFrame.style.opacity = ".7";
	gPopupFrame.style.filter = "alpha(opacity=70)";
	gPopupInner.style.opacity = ".7";
	gPopupInner.style.filter = "alpha(opacity=70)";
	gPopupContainer.style.opacity = ".7";
	gPopupContainer.style.filter = "alpha(opacity=70)";
	*/
	
	var popupContainer = document.getElementById("popupContainer");	
	popupContainer.style.left = nowX+newX;
    popupContainer.style.top = nowY+newY;

  	return false;  
}

addEvent(window, "load", initPopUp);

/**
	* @argument url - url to display
	* @argument title - title to display
	* @argument width - int in pixels
	* @argument height - int in pixels
	* @argument returnFunc - function to call when returning true from the window.
*/
function showPopWin(url, title, width, height, returnFunc, param) {

	testes += 'show; ';

	gPopupIsShown = true;
	
	gParam = param;
	
	disableTabIndexes();
	
	var mask = document.getElementById("popupMask");
	mask.style.display = "block";
	
	var popupContainer = document.getElementById("popupContainer");
	popupContainer.style.display = "block";
	popupContainer.style.width = width + "px";
	popupContainer.style.height = height + "px";

	// need to set the width of the iframe to the title bar width because of the dropshadow
	// some oddness was occuring and causing the frame to poke outside the border in IE6
	var popupFrame = document.getElementById("popupFrame");
	popupFrame.style.width = (width - 30) + "px";
	popupFrame.style.height = (height - 30) + "px";
	
	// set the url to loading first
	var innerDiv = document.getElementById("popupInner");
	innerDiv.innerHTML = gInnerFrameHtml;
	
	// adding event to know when popup loads
	popupFrame = document.getElementById("popupFrame");
	addEvent(popupFrame, "load", setRequestFinished);
	
	// then set the url to the new page
	popupFrame.src = url;
	
	// calculate where to place the window on screen
	centerPopWin(width, height);

	var titleDiv = document.getElementById("popupTitle"); 
	if ( title == null || title == "" ) title = "&nbsp;&nbsp;&nbsp;";
	titleDiv.innerHTML = title;

	gReturnFunc = returnFunc;
	// for IE
	if (gHideSelects == true) {
		hideSelectBoxes();
	}
	
	window.scrollTo(0,0);

}

/**
 * Popup has loaded.
 */
function setRequestFinished()
{
	setInnerRequestFinished(true);
}

/**
 * Moves popup to the center of the page, given width and height.
 * @argument width
 * @argument height
 */ 
function centerPopWin(width, height) {
	if (gPopupIsShown == true) {
		var popupContainer = document.getElementById("popupContainer");
		if (width == null || isNaN(width)) {
			width = popupContainer.offsetWidth;
		}
		if (height == null) {
			height = popupContainer.offsetHeight;
		}
		
		var fullHeight = getViewportHeight();
		var fullWidth = getViewportWidth();
		
		var theBody = document.documentElement;
		
		var scTop = parseInt(theBody.scrollTop,10);
		var scLeft = parseInt(theBody.scrollLeft,10);
		var scHeight = parseInt(document.body.scrollHeight,10);
		var scWidth = parseInt(document.body.scrollWidth,10);
		
		var mask = document.getElementById("popupMask");
		mask.style.height = scHeight + "px";
		mask.style.width = scWidth + "px";
		mask.style.top = scTop + "px";
		mask.style.left = scLeft + "px";

		var newTop = (scTop + ((fullHeight - height) / 2));
		if ( newTop <= 0 ) newTop = 10;
		popupContainer.style.top = newTop + "px";
		
		var newLeft = (scLeft + ((fullWidth - width) / 2));
		if ( newLeft <= 0 ) newLeft = 10;
		popupContainer.style.left = newLeft + "px";
		
	}
}
addEvent(window, "resize", centerPopWin);
window.onscroll = centerPopWin;

/**
 * @argument callReturnFunc - bool - determines if we call the return function specified
 * @argument returnVal - anything - return value 
 */
function hidePopWin(callReturnFunc) {
	
	testes += 'hide; ';
	
	gPopupIsShown = false;
	var mask = document.getElementById("popupMask");
	if (mask == null) {
		return;
	}

	var popupFrame = document.getElementById("popupFrame");
	removeEvent(popupFrame, "load", setRequestFinished, false);

	// invoking the callback function
	if (callReturnFunc == true && gReturnFunc != null) {
		var ret = null;

		if ( popupFrame &&
					popupFrame.contentDocument &&
					popupFrame.contentDocument.getElementById("returnValInput") ) {

			ret = popupFrame.contentDocument.getElementById("returnValInput").value;

		} else if (window.frames["popupFrame"].document &&
			window.frames["popupFrame"].document.getElementById("returnValInput")) {

			ret = window.frames["popupFrame"].document.getElementById("returnValInput").value;
		}

		if ( gParam != null )
		{
			gReturnFunc(ret,gParam);
		}
		else
		{
			gReturnFunc(ret);
		}
	}

	restoreTabIndexes();
	
	// display all select boxes
	if (gHideSelects == true) {
		displaySelectBoxes();
	}

	mask.style.display = "none";
	
	var popupContainer = document.getElementById("popupContainer");
	popupContainer.style.display = "none";

	var innerDiv = document.getElementById("popupInner");
	innerDiv.innerHTML = gInnerFrameHtml;

    document.onmousemove = null;

	setRequestFinished();
}

function popupCloseButtonClicked() {
	hidePopWin(false);
}

function popupCloseButtonMouseEvt(mouseDown) {
	var button = document.getElementById("popupCloseButtonImg");
	if ( mouseDown )
		button.src = theContextRoot+"/images/close-window-down.gif";
	else
		button.src = theContextRoot+"/images/close-window.gif";
}

// Tab key trap. iff popup is shown and key was [TAB], suppress it.
// @argument e - event - keyboard event that caused this function to be called.
function keyDownHandler(e) {
    if (gPopupIsShown && e.keyCode == 9)  return false;
}

// For IE.  Go through predefined tags and disable tabbing into them.
function disableTabIndexes() {
	if (document.all) {
		var i = 0;
		for (var j = 0; j < gTabbableTags.length; j++) {
			var tagElements = document.getElementsByTagName(gTabbableTags[j]);
			for (var k = 0 ; k < tagElements.length; k++) {
				gTabIndexes[i] = tagElements[k].tabIndex;
				tagElements[k].tabIndex="-1";
				i++;
			}
		}
	}
}

// For IE. Restore tab-indexes.
function restoreTabIndexes() {
	if (document.all) {
		var i = 0;
		for (var j = 0; j < gTabbableTags.length; j++) {
			var tagElements = document.getElementsByTagName(gTabbableTags[j]);
			for (var k = 0 ; k < tagElements.length; k++) {
				tagElements[k].tabIndex = gTabIndexes[i];
				tagElements[k].tabEnabled = true;
				i++;
			}
		}
	}
}

/**
* Hides all drop down form select boxes on the screen so they do not appear above the mask layer.
* IE has a problem with wanted select form tags to always be the topmost z-index or layer
*
* Thanks for the code Scott!
*/
function hideSelectBoxes() {
	for(var i = 0; i < document.forms.length; i++) {
		for(var e = 0; e < document.forms[i].length; e++){
			if(document.forms[i].elements[e].tagName == "SELECT") {
				document.forms[i].elements[e].style.visibility="hidden";
			}
		}
	}
}

/**
* Makes all drop down form select boxes on the screen visible so they do not reappear after the dialog is closed.
* IE has a problem with wanted select form tags to always be the topmost z-index or layer
*/
function displaySelectBoxes() {
	for(var i = 0; i < document.forms.length; i++) {
		for(var e = 0; e < document.forms[i].length; e++){
			if(document.forms[i].elements[e].tagName == "SELECT") {
			document.forms[i].elements[e].style.visibility="visible";
			}
		}
	}
}

function getParam()
{
	return gParam;
}

	
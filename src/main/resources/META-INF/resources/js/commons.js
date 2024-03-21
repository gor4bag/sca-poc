
/**
 *  Function that makes a control readOnly or not readOnly, also applying the correct style.
 */
function applyReadOnlyStyle(control,readonly)
{
	control.readOnly = readonly;
	if ( readonly )
	{
		control.className = "formInputPercDisabled";
	} else {
		control.className = "formInputPerc";
	}
}

// This method is invoked from the onload event handler of the body
function setInitialFocus(objectID) {
    var focusElement = document.getElementById(objectID);
    if(focusElement != null && focusElement.tagName != "SPAN") {
        focusElement.focus();
    }
	return true;
}

// Selects or unselects all checkboxs with a name within a form
function selectAll(form, checkbox, name) {
    var elements = form.elements;
    for (i = 0; i < elements.length; i++) {
        if (elements[i].name == name) {
            elements[i].checked = !checkbox.checked;
            elements[i].click();
        }
    }
}

function toggleVisible(element, flag) {
	if (flag.value == 'false') {
     	flag.value = 'true';
		element.style.display = 'none';
	} else {
     	flag.value = 'false';
		element.style.display = '';
	}
}

function changeImage(element, status, imageUp, imageDown){
	var image = document.getElementById(element);

    if (status.value == 'true') {
    	image.src = imageUp;
    	status.value == 'false';
    } else {
    	image.src = imageDown;
    	status.value == 'true';
    }

}


function radioButtonClick(thisObj, radioButtonName, rowId, highLightedClass, nonHighLightedClass) {
	var form = thisObj.form;
	for(i = 0; i < form.elements.length; i++) {
		if (form.elements[i].name == radioButtonName) {
			form.elements[i].checked = false;
			getRow(form.elements[i], rowId).className = nonHighLightedClass;
		}
	}
	thisObj.checked = true;
	getRow(thisObj, rowId).className = highLightedClass;
}

function getRow(element, rowId) {
	currentRow = element;
	while (currentRow.id != rowId) {
		currentRow = currentRow.parentNode;
	}
    return currentRow;
}

/**
 * This function checks or unchecks all checkboxes whose names start
 * with a prefixed String (checkboxGroupName parameter) inside a given
 * control (parentControlName parameter).
 * It assumes that will be invoked from another checkbox control
 * (selectAllControl parameter).
 * author: afernandes
 * param: selectAllControl the checkbox to select all elements on the page
 * param: parentControlName the name of a parent grid to avoid looking
 *  inside the whole page
 * param: rowCheckboxName the checkbox of each row of the list
 * param: selectGroupControlName (optional) if the list is grouped,
 * 	the name of the select group controls
 */
function selectPage(selectAllControl, parentControlName, rowCheckboxName, selectGroupControlName)
{
	var checkboxList = document.getElementById(parentControlName).getElementsByTagName("input");
	for ( var i = 0; i < checkboxList.length; i++ )
	{
		if ( checkboxList[i].name.indexOf(rowCheckboxName) >= 0 && !checkboxList[i].disabled )
		{
			checkboxList[i].checked = selectAllControl.checked;
		}
	}
	if ( selectGroupControlName != null )
	{
		selectPage(selectAllControl, parentControlName, selectGroupControlName)
	}
}

/**
 * These two functions check or uncheck a checkbox control for a Select All option,
 * depending if all checkbox group elements (checkboxGroupName parameter) inside
 * a given parent control (parentControlName parameter) are all checked or not.
 * author: afernandes
 */
function verifySelectPageControl(selectAllControlName, parentControlName, rowCheckboxName)
{
    document.getElementById(selectAllControlName).checked = verifyPageSelected(parentControlName, rowCheckboxName);
}
function verifyPageSelected(parentControlName, rowCheckboxName)
{
	var checkboxList = document.getElementById(parentControlName).getElementsByTagName("input");
	for ( var i = 0; i < checkboxList.length; i++ )
	{
		if ( checkboxList[i].name.indexOf(rowCheckboxName) >= 0 )
		{
			if ( !checkboxList[i].checked ) return false;
		}
	}
	return true;
}


/**
* These three functions handles Select All and Select Group options
* in a groupByDatatable, checking or unchecking depending if all
* checkbox group elements (checkboxGroupName parameter) inside
* a given parent control (parentControlName parameter) are all checked or not.
*/
function selectGroup(groupName, selectGroupControl, parentControlName, rowCheckboxName, selectAllControlName){

	var inputList = document.getElementById(parentControlName).getElementsByTagName("input");
	var groupStart = document.getElementById('startGroup_'+groupName).value;
	var groupEnd = document.getElementById('endGroup_'+groupName).value;

	for ( var i = groupStart; i <= groupEnd; i++ ) {
		var checkBox = document.getElementById(rowCheckboxName + '['+i+']');
		if ( !checkBox.disabled ) {
			checkBox.checked = selectGroupControl.checked;
		}
	}
	if ( selectAllControlName != null )
	{
		var selGroupBaseName = selectGroupControl.name;
		if ( selGroupBaseName.indexOf('[') )
		{
			selGroupBaseName = selGroupBaseName.substring(0,selGroupBaseName.indexOf('['));
		}
		verifySelectGroupPageControl(groupName, selGroupBaseName, selectAllControlName, parentControlName, rowCheckboxName)
	}
}
function verifySelectGroupPageControl(groupName, selectGroupControlName, selectAllControlName, parentControlName, rowCheckboxName)
{
	document.getElementById(selectAllControlName).checked = verifyPageSelected(parentControlName, rowCheckboxName);
    verifyGroupSelected(groupName, selectGroupControlName, parentControlName, rowCheckboxName);
}
function verifyGroupSelected(groupName, selectGroupControlName, parentControlName, rowCheckboxName)
{
	var result = true;
	var groupStart = document.getElementById('startGroup_'+groupName).value;
	var groupEnd = document.getElementById('endGroup_'+groupName).value;
	var groupSelect = document.getElementById(selectGroupControlName+'['+groupStart+']');
	if ( groupSelect != null )
	{
		for ( var i = groupStart; i <= groupEnd; i++ ) {
			var checkBox = document.getElementById(rowCheckboxName + '['+i+']');
			if ( !checkBox.checked ) result = false;
		}
		groupSelect.checked = result;
	}
}


/**
 * Serializes all input and select controls inside the given parent control.
 * The specified prefix is added on the name of each input or select.
 */
function serializeInputFields(prefix, parentControlName)
{
	// inputs
	var paramString = "";
	var inputList = document.getElementById(parentControlName).getElementsByTagName("input");
	for ( var i = 0; i < inputList.length; i++ )
	{
		if ( !inputList[i].disabled )
		{
			if ( (inputList[i].type != 'radio' && inputList[i].type != 'checkbox')
			  || ( inputList[i].type == 'radio' && inputList[i].checked )
			  || ( inputList[i].type == 'checkbox' && inputList[i].checked ) )
			{
				paramString += '&' + prefix + encodeURIComponent(inputList[i].name) + '=' + encodeURIComponent(inputList[i].value);
			}
		}
	}
	// selects
	var selectList = document.getElementById(parentControlName).getElementsByTagName("select");
	for ( var i = 0; i < selectList.length; i++ )
	{
		paramString += '&' + prefix + encodeURIComponent(selectList[i].name) + '=' + encodeURIComponent(selectList[i].value);
	}
	return paramString;
}


/**
 * This variable and the function are required to allow
 * the testing framework to know when ajax request finishes
 */
function setInnerRequestFinished(finished)
{
	window.top.innerRequestFinished = finished;
}

/**
 * COMMON DHTML FUNCTIONS
 * These are handy functions I use all the time.
 *
 * By Seth Banks (webmaster at subimage dot com)
 * http://www.subimage.com/
 *
 * Up to date code can be found at http://www.subimage.com/dhtml/
 *
 * This code is free for you to use anywhere, just keep this comment block.
 */

/**
 * X-browser event handler attachment and detachment
 * TH: Switched first true to false per http://www.onlinetools.org/articles/unobtrusivejavascript/chapter4.html
 *
 * @argument obj - the object to attach event to
 * @argument evType - name of the event - DONT ADD "on", pass only "mouseover", etc
 * @argument fn - function to call
 */
function addEvent(obj, evType, fn){
 if (obj.addEventListener){
    obj.addEventListener(evType, fn, false);
    return true;
 } else if (obj.attachEvent){
    var r = obj.attachEvent("on"+evType, fn);
    return r;
 } else {
    return false;
 }
}
function removeEvent(obj, evType, fn, useCapture){
  if (obj.removeEventListener){
    obj.removeEventListener(evType, fn, useCapture);
    return true;
  } else if (obj.detachEvent){
    var r = obj.detachEvent("on"+evType, fn);
    return r;
  } else {
    alert("Handler could not be removed");
  }
}


/**
 * Code below taken from - http://www.evolt.org/article/document_body_doctype_switching_and_more/17/30655/
 *
 * Modified 4/22/04 to work with Opera/Moz (by webmaster at subimage dot com)
 *
 * Gets the full width/height because it's different for most browsers.
 */
function getViewportHeight() {
	if (window.innerHeight!=window.undefined) return window.innerHeight;
	if (document.compatMode=='CSS1Compat') return document.documentElement.clientHeight;
	if (document.body) return document.body.clientHeight;
	return window.undefined;
}
function getViewportWidth() {
	if (window.innerWidth!=window.undefined) return window.innerWidth;
	if (document.compatMode=='CSS1Compat') return document.documentElement.clientWidth;
	if (document.body) return document.body.clientWidth;
	return window.undefined;
}

function verifySystemDefault(systemDefaultCheckbox, inputId, defaultValue) {
   	 var input = document.getElementById(inputId);
     if (systemDefaultCheckbox.checked) {
        if (input.type == 'checkbox') {
        	input.checked = defaultValue == 'Y' || defaultValue == 'true';
        } else {
	     	input.value = defaultValue;
        }
     	input.disabled = true;
     } else {
     	input.disabled = false;
     }
}


// copyright 1999 Idocs, Inc. http://www.idocs.com
// Distribute this script freely but keep this notice in place
function numbersonly(myfield, e, dec)
{
var key;
var keychar;

if (window.event)
   key = window.event.keyCode;
else if (e)
   key = e.which;
else
   return true;
keychar = String.fromCharCode(key);

// control keys
if ((key==null) || (key==0) || (key==8) ||
    (key==9) || (key==13) || (key==27) )
   return true;

// numbers
else if ((("0123456789").indexOf(keychar) > -1))
   return true;

// decimal point jump
else if (dec && (keychar == "."))
   {
   myfield.form.elements[dec].focus();
   return false;
   }
else
   return false;
}


/*
 * Selects the first radio button of a form with a given name if none is checked
 */
function selectFirstItem(formName, radioButtonName) {
	var elements = document.forms[formName].elements;
	for (var i = 0; i < elements.length; i++) {
		element = elements[i];
		if (element.checked) {
		    return; // one is already selected
		}
	}
	for (var i = 0; i < elements.length; i++) {
		element = elements[i];
		if (element.name == radioButtonName) {
			element.click();
			return;
		}
	}
}


// ajax functions

function ajaxRequestComplete(t)
{
}

function ajaxRequestSuccess(t)
{
    var s = t.responseText;
    var i = s.indexOf('<!-- Login Screen');
    if (i >= 0)
    {
       window.top.location = window.top.location;
    }
}

function ajaxRequestFailure(t)
{
    window.top.location.reload();
}

function handleExpiredSession()
{
	window.top.location.reload();
}

function ajaxRequestLoaded(t)
{
}

function wasChanged(obj,name) {
	var selected = document.getElementById(obj.name.substring(0,obj.name.lastIndexOf(':')+1)+name);
	selected.value = 'true';
}

function checkform(formulario,checkado, elemento) {
    dml=document.getElementById(formulario);
    var allc = dml.getElementsByTagName("input");
    for (i=1;i<allc.length;i++) {
       if (allc.item(i).type=='checkbox') {
         if (allc.item(i).name.lastIndexOf(elemento) != -1) {
            if (document.getElementById(checkado).value == 1) {
		      allc.item(i).checked = false;
		     } else {
		      allc.item(i).checked = true;
             }
           }
        }
     }
     if (document.getElementById(checkado).value == 1) {
		document.getElementById(checkado).value = 0;
     } else {
         document.getElementById(checkado).value = 1;
     }
}

function disableSelect(obj,name,type) {
 if (type == true) {
    var selected = document.getElementById(obj.name.substring(0,obj.name.lastIndexOf(':')+1)+name);
    selected.disabled = type;
 } else {
   var selected = document.getElementById(obj.control.name.substring(0,obj.control.name.lastIndexOf(':')+1)+name);
   selected.disabled = type;
 }
}

function maxLength(textAreaField, limit) {
	var ta = document.getElementById(textAreaField);

	if (ta.value.length >= limit) {
		ta.value = ta.value.substring(0, limit-1);
	}
}

function limitTextArea(element, limit) {
	if (element.value.length > limit) {
		element.value = element.value.substring(0, limit);
	}
}
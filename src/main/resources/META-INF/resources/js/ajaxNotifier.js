/* *********************************************************************
 Change History:
 * Oct/2006 - Alexandre Fernandes - Creation

 ********************************************************************* */

/**
 * Javascript function that supports the custom JSF component gg:modal.
 * Can be used by any other component to invoke some method in the backing bean.
 * More info: please refer to HtmlModalRenderer
 * @param actionUrl the url to call
 * @param tagId the id of the control (the id indicated on the JSP file)
 * @param componentId the clientId of the control (the id generated in the HTML file)
 * @param param parameter that will be sent to the server in the call
 * @param callbackFunction (optional) to inform the callback function for when the request ends
 */
function ajaxNotifier(actionUrl, tagId, componentId, param, callbackFunction)
{
	window.status = msgOpening + actionUrl + "..."; 
	var mainGrid = document.getElementsByClassName('mainGrid');
	if ( mainGrid != null && mainGrid.length > 0 )
		mainGrid[0].style.cursor = 'wait';
	
	// param can also be a function
	if ( param != null && param > '' )
	{
		var generatedParams = null;
		var str = "if ( typeof " + param + " == 'function' ) generatedParams = " + param + "()" ;
		eval(str);
		if ( generatedParams != null )
		{
			param = generatedParams;
		}
	}
	
    var pars = '&affectedAjaxComponent=' + encodeURIComponent(componentId) + 
      '&param=' + encodeURIComponent(param);
    setInnerRequestFinished(false);
    var myAjax = new Ajax.Request( 
          actionUrl, 
         { method: 'post', 
           parameters: pars, 
           asynchronous: false, 
           onSuccess: 
           	 function(t) { 
           	 	//alert(t.responseText);
          		setInnerRequestFinished(true); 
				// create a function named onAjaxNotifierFor_[controlId] to get it executed 
				// just after the response is received successfuly from the server
				eval("if ( typeof onAjaxNotifierFor_" + tagId + " != 'undefined' ) onAjaxNotifierFor_" + tagId + "()");
       		 }, 
           on404: 
           	 function(t) { 
           	 	//alert('Failure: ' + t.status);
				// create a function named onAjaxUpdate404For_[controlId] to get it executed 
				// just after a 404 response is received from the server
				eval("if ( typeof onAjaxNotifier404For_" + tagId + " != 'undefined' ) onAjaxNotifier404For_" + tagId + "()");
           	 }, 
           onFailure: 
           	 function(t) { 
           	 	//alert('Failure: ' + t.status);
				// create a function named onAjaxNotifierErrorFor_[controlId] to get it executed 
				// just after an error response is received from the server
				eval("if ( typeof onAjaxNotifierErrorFor_" + tagId + " != 'undefined' ) onAjaxNotifierErrorFor_" + tagId + "()");
           	 },
           onComplete:
           	 function(t) {
				// create a function named afterAjaxNotifierFor_[controlId] to get it executed
				// just after the page is refreshed with new data
				window.status = msgDone;
				eval("if ( typeof afterAjaxNotifierFor_" + tagId + " != 'undefined' ) afterAjaxNotifierFor_" + tagId + "()");
				if ( callbackFunction != null && typeof callbackFunction == 'function' )
				{
					eval("callbackFunction()");
				}
           	 } 
         } ); 
		if ( mainGrid != null && mainGrid.length > 0 )
			mainGrid[0].style.cursor = 'auto';

         
} 


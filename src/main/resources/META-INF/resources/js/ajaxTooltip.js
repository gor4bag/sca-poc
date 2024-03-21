/************************************************************************************************************
	This Java Script was developed to render tooltips for the component gg:tooltip
	
	Param: String which mouse has stopped over
	Returns: String returned from UI method call - OBS.: The component TAG defines what method to call.
	
	************************************************************************************************************/	
			
			var shadowSize = 4;
			var tooltipMaxWidth = 300;
			var tooltipMinWidth = 100;
			var iframe = false;
			var tooltip_is_msie = (navigator.userAgent.indexOf('MSIE')>=0 && navigator.userAgent.indexOf('opera')==-1 && document.all)?true:false;
			var tooltipShadow = false;
			var tooltipDiv = false;
			var timeOut;
		
			function tooltipMouseDelay(maxWidth, minWidth, contextPath, param, e, idTooltip, actionUrl){
				tooltipMaxWidth = parseInt(maxWidth);
				tooltipMinWidth = parseInt(minWidth);
				timeOut = window.setTimeout("renderTooltip('"+ contextPath +"', '"+ param +"', "+ e.clientX +", "+ e.clientY +", '"+ idTooltip +"', '"+actionUrl+"');", 1000);
			}
			

			function renderTooltip(contextPath, param, x, y, idTooltip, actionUrl){
			    new Ajax.Updater(idTooltip,
				                 actionUrl,
				                 {asynchronous: false ,
				                  parameters: '&param='+param 
				                  , onSuccess: function(t){handleSuccess(t, contextPath, param, x, y, idTooltip, actionUrl);}
				                 })
				         
			}
 			
 			function hideTooltip(idTooltip){
 				window.clearTimeout(timeOut);
 				var tooltipDiv = document.getElementById(idTooltip+'_div');
				tooltipDiv.style.display='none';
			}
			
			function handleSuccess(t, contextPath, param, x, y, idTooltip, actionUrl){
				document.getElementById(idTooltip+'_div').innerHTML = t.responseText;
				tooltipDiv = document.getElementById(idTooltip+'_div');
			  	String.prototype.startsWith = function(s) { return this.indexOf(s)==0; }
				if(t.responseText.startsWith('<!-- Login Screen')){
					window.top.location = contextPath + '/home.jsp';
				}else{

					var bodyWidth = Math.max(document.body.clientWidth,document.documentElement.clientWidth) - 20;
			
					tooltipDiv.style.display='block';
					var st = Math.max(document.body.scrollTop,document.documentElement.scrollTop);
					if(navigator.userAgent.toLowerCase().indexOf('safari')>=0)st=0; 
					var leftPos = x + 10;
		
					tooltipDiv.style.width = null;	// Reset style width if it's set 
					tooltipDiv.style.left = leftPos + 'px';
					tooltipDiv.style.top = y + 10 + st + 'px';
						
					if(tooltipDiv.offsetWidth > tooltipMaxWidth){	/* Exceeding max width of tooltip ? */
						tooltipDiv.style.width = tooltipMaxWidth + 'px';
					}
		
					var tooltipWidth = tooltipDiv.offsetWidth;		
		
					if(tooltipWidth < tooltipMinWidth)tooltipWidth = tooltipMinWidth;
				
					tooltipDiv.style.width = tooltipWidth + 'px';        
					
				}
			}
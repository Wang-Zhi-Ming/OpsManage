function isJsonString(str) {
      	try {
            if (typeof JSON.parse(str) == "object") {
                return true;
            }
        } catch(e) {
        }
        return false;
    }

function DynamicSelect(ids,value){
	$("#" + ids +" option").each(function(){ 
		$(this).prop("selected",false);   
	})
	$("#" + ids +" option[value='" + value +"']").prop("selected",true);	
}

function make_crontab_select(){
    $.ajax({  
        url : '/api/sched/crontab/',  
        type : 'get', 
        success : function(response){
        		$('#div_crontab').show()
        		$('#div_interval').hide()
				$("#select-crontab").empty()
				var crontabHtml = '<select class="form-control" name="crontab" id="select-crontab" required="required">'
				var selectHtml = ''; 
				for (var i=0; i <response.length; i++){
					 selectHtml += '<option name="crontab" value="'+ response[i]["id"] +'">' + response[i]["minute"] + '&nbsp;' + 
					                response[i]["hour"] + '&nbsp;' + response[i]["day_of_week"]  + '&nbsp;' + response[i]["day_of_month"] + 
					                '&nbsp;' + response[i]["month_of_year"] +'</option>' 
				};                        
				crontabHtml =  crontabHtml + selectHtml + '</select>';
				$("#select-crontab").html(crontabHtml);			            	
	            },
	    	error:function(response){
	    		console.log(response)
	    	}	            
    });		
}

function make_interval_select(){
    $.ajax({  
        url : '/api/sched/intervals/',  
        type : 'get', 
        success : function(response){
        		$('#div_crontab').hide()
        		$('#div_interval').show()
				$("#select-interval").empty();
				var intervalHtml = '<select class="form-control" name="crontab" id="select-interval" required="required">'
				var selectHtml = ''; 
				for (var i=0; i <response.length; i++){
					 selectHtml += '<option name="interval" value="'+ response[i]["id"] +'">' + response[i]["every"] + '&nbsp;' + response[i]["period"] + '</option>' 
				};                        
				crontabHtml =  intervalHtml + selectHtml + '</select>';
				$("#select-interval").html(crontabHtml);				        		
            	
            },
	    	error:function(response){
	    		console.log(response)
	    	}	            
    });	
}

function requests(method,url,data){
	var ret = '';
	$.ajax({
		async:false,
		url:url, //????????????
		type:method,  //????????????
       	success:function(response){
             ret = response;
        },
        error:function(data){
            ret = {};
        }
	});	
	return 	ret
}

var language =  {
	"sProcessing" : "?????????...",
	"sLengthMenu" : "?????? _MENU_ ?????????",
	"sZeroRecords" : "??????????????????",
	"sInfo" : "????????? _START_ ??? _END_ ??????????????? _TOTAL_ ???",
	"sInfoEmpty" : "????????? 0 ??? 0 ??????????????? 0 ???",
	"sInfoFiltered" : "(??? _MAX_ ???????????????)",
	"sInfoPostFix" : "",
	"sSearch" : "??????: ",
	"sUrl" : "",
	"sEmptyTable" : "??????????????????",
	"sLoadingRecords" : "?????????...",
	"sInfoThousands" : ",",
	"oPaginate" : {
		"sFirst" : "??????",
		"sPrevious" : "??????",
		"sNext" : "??????",
		"sLast" : "??????"
	},
	"oAria" : {
		"sSortAscending" : ": ?????????????????????",
		"sSortDescending" : ": ?????????????????????"
	}
}


function InitDataTable(tableId,url,buttons,columns,columnDefs)
{
  oOverviewTable =$('#'+tableId).dataTable(
		  {
			  	"dom": "Bfrtip",
	    		"bScrollCollapse": false, 				
	    	    "bRetrieve": true,			
	    		"destroy": true, 
	    		"buttons" :buttons, 	    		
	    		"data":	requests('get',url),
	    		"columns": columns,
	    		"columnDefs" :columnDefs,			  
	    		"language" : language,
	    			
	    	});
}

function RefreshTable(tableId, urlData)
{
  $.getJSON(urlData, null, function( dataList )
  {
    table = $(tableId).dataTable();
    oSettings = table.fnSettings();
    
    table.fnClearTable(this);

    for (var i=0; i<dataList.length; i++)
    {
      table.oApi._fnAddData(oSettings, dataList[i]);
    }

    oSettings.aiDisplay = oSettings.aiDisplayMaster.slice();
    table.fnDraw();
  });
}

function AutoReload(tableId,url)
{
  RefreshTable('#'+tableId, url);
  setTimeout(function(){AutoReload(url);}, 30000);
}

function RefreshTaskResultTable(tableId, urlData){
	$.getJSON(urlData, null, function( dataList ){
    table = $('#'+tableId).dataTable();
    oSettings = table.fnSettings();
    
    table.fnClearTable(this);

    for (var i=0; i<dataList['results'].length; i++)
    {
      table.oApi._fnAddData(oSettings, dataList['results'][i]);
    }

    oSettings.aiDisplay = oSettings.aiDisplayMaster.slice();
    table.fnDraw();
    
    if (dataList['next']){
  	  $("button[name='page_next']").attr("disabled", false).val(dataList['next']);	
    }else{
  	  $("button[name='page_next']").attr("disabled", true).val();
    }
    if (dataList['previous']){
  	  $("button[name='page_previous']").attr("disabled", false).val(dataList['previous']);	
    }else{
  	  $("button[name='page_previous']").attr("disabled", true).val();
    } 
  });	
}

function InitTaskResultDataTable(tableId,url,buttons,columns,columnDefs){
	  var data = requests('get',url)
	  oOverviewTable =$('#'+tableId).dataTable(
			  {
				  	"dom": "Bfrtip",
				  	"buttons":buttons,
		    		"bScrollCollapse": false, 				
		    	    "bRetrieve": true,	
		    		"destroy": true, 
		    		"data":	data['results'],
		    		"columns": columns,
		    		"columnDefs" :columnDefs,			  
		    		"language" : language,
		    		"iDisplayLength": 20,
		    		"order": [[ 0, "ase" ]],
		    		"autoWidth": false	    			
		    	});
	  if (data['next']){
		  $("button[name='page_next']").attr("disabled", false).val(data['next']);	
	  }else{
		  $("button[name='page_next']").attr("disabled", true).val();
	  }
	  if (data['previous']){
		  $("button[name='page_previous']").attr("disabled", false).val(data['next']);	
	  }else{
		  $("button[name='page_previous']").attr("disabled", true).val();
	  }	  
}

function makeCeleryTaksResultsListTableList(){
    var columns = [                
                   {"data": "id"},
                   {"data": "task_id"},
                   {"data": "status"},
                   {"data": "task_name"},
                   {"data": "task_kwargs"},
                   {"data": "date_done"},
                   {"data": "result"},
	               ]
   var columnDefs = [                       
	    		        {
   	    				targets: [7],
   	    				render: function(data, type, row, meta) {  	    					
   	                        return '<div class="btn-group  btn-group-xs">' +		    	                           
//	    	                           '<button type="button" name="btn-task-logs" value="'+ row.id +'" class="btn btn-default" data-toggle="modal"><span class="fa fa-search-plus" aria-hidden="true"></span>' +	
//	    	                           '</button>' + 	    	                           
	    	                           '<button type="button" name="btn-task-delete" value="'+ row.id +'" class="btn btn-default" aria-label="Justify"><span class="glyphicon glyphicon-trash" aria-hidden="true"></span>' +	
	    	                           '</button>' +			                            
	    	                           '</div>';
   	    				},
   	    				"className": "text-center",
	    		        },
	    		      ]	
    var buttons = []    
    InitTaskResultDataTable('celeryTaksResultsListTable','/api/sched/celery/result/',buttons,columns,columnDefs);	
}

$(document).ready(function() {	
	
    $("#add_interval_button").click(function(){
    	$('#modfInterval').val("").hide()
    	$('#addInterval').show()
    }); 	

    $("#add_crontab_button").click(function(){
    	$('#modfCrontab').val("").hide()
    	$('#addCrontab').show()
    });     
    
    if ($("#taskTableList").length) {
    	function makeTaskList(){
		    var columns = [
		                    {"data": "id"},
			                {"data": "name"},
			                {"data": "task"},		
			                {"data": "kwargs"},	
			                {"data": "last_run_at"},	
			                {"data": "total_run_count","sClass": "text-center"},
			                {"data": "enabled","sClass": "text-center"},	
			               ]
		    var buttons = [{
                text: '<span class="fa fa-plus"></span>',
                className: "btn-xs",
                action: function ( e, dt, node, config ) {
                	$('#addTaskModal').modal("show");	
                }
			}]	
		    var columnDefs = [	
								{
									targets: [5],
									render: function(data, type, row, meta) {
								        return '<span class="badge badge-warning">'+ row.total_run_count +'</span>'
									},
								},	
								{
									targets: [6],
									render: function(data, type, row, meta) {
										if(row.enabled==1){
											var status = '<span class="label label-success">??????</span>'
										}else if(row.enabled==0){
											var status = '<span class="label label-danger">??????</span>'
										}
								        return status
									},
								},								
	    	    		        {
		    	    				targets: [7],
		    	    				render: function(data, type, row, meta) {
		    	                        return '<div class="btn-group  btn-group-xs">' +	
			    	                           '<button type="button" name="btn-task-edit" value="'+ row.id +'" class="btn btn-default"  aria-label="Justify"><span class="fa fa-pencil-square-o" aria-hidden="true"></span>' +	
			    	                           '</button>' +		                				                            		                            			                          
			    	                           '<button type="button" name="btn-task-delete" value="'+ row.id +'" class="btn btn-default" aria-label="Justify"><span class="glyphicon glyphicon-trash" aria-hidden="true"></span>' +	
			    	                           '</button>' +			                            
			    	                           '</div>';
		    	    				},
		    	    				"className": "text-center",
	    	    		        },
	    	    		      ]
		    
		    InitDataTable('taskTableList','/api/sched/celery/',buttons,columns,columnDefs);
		    //??????30?????????table
		    setTimeout(function(){AutoReload('taskTableList','/api/sched/celery/');}, 30000);    		
    	}
    	makeTaskList()
	    
	}
    
    if ($("#crontabList").length) {
    	function makeCrontabList(){
		    var columns = [
			                {"data": "id"},
			                {"data": "minute"},
			                {"data": "hour"},		
			                {"data": "day_of_week"},	
			                {"data": "day_of_month"},	
			                {"data": "month_of_year","sClass": "text-center"},	
			               ]
		    var buttons = [{
                text: '<span class="fa fa-plus"></span>',
                className: "btn-xs",
                action: function ( e, dt, node, config ) {
                	$('#modfCrontab').val("").hide()
                	$("#addCrontabModal").modal("show")
                }
			}]		    
		    var columnDefs = [					               
	    	    		        {
	    	    				targets: [6],
	    	    				render: function(data, type, row, meta) {
	    	                        return '<div class="btn-group  btn-group-xs">' +	
		    	                           '<button type="button" name="btn-crontab-edit" value="'+ row.id +'" class="btn btn-default"  aria-label="Justify"><span class="fa fa-pencil-square-o" aria-hidden="true"></span>' +	
		    	                           '</button>' +		                				                            		                            			                          
		    	                           '<button type="button" name="btn-crontab-delete" value="'+ row.id +'" class="btn btn-default" aria-label="Justify"><span class="glyphicon glyphicon-trash" aria-hidden="true"></span>' +	
		    	                           '</button>' +			                            
		    	                           '</div>';
	    	    				},
	    	    				"className": "text-center",
	    	    			}]
		    
		    InitDataTable('crontabList','/api/sched/crontab/',buttons,columns,columnDefs);
		    //??????30?????????table
		    //setTimeout(function(){AutoReload('crontabList','/api/sched/crontab/');}, 30000);    		
    	}
    	makeCrontabList()
	    
	}     
    
    if ($("#intervalList").length) {
    	function makeIntervalList(){
		    var columns = [
		                {"data": "id"},
		                {"data": "every"},
		                {"data": "period"},		                				                
		               ]
		    var buttons = [{
                text: '<span class="fa fa-plus"></span>',
                className: "btn-xs",
                action: function ( e, dt, node, config ) {
			    	$('#modfInterval').val("").hide()
			    	$('#addIntervalModal').modal("show")
                }
			}]			    
		    var columnDefs = [					               
	    	    		        {
	    	    				targets: [3],
	    	    				render: function(data, type, row, meta) {
	    	                        return '<div class="btn-group  btn-group-xs">' +	
		    	                           '<button type="button" name="btn-interval-edit" value="'+ row.id +'" class="btn btn-default" aria-label="Justify"><span class="fa fa-pencil-square-o" aria-hidden="true"></span>' +	
		    	                           '</button>' +		                				                            		                            			                          
		    	                           '<button type="button" name="btn-interval-delete" value="'+ row.id +'" class="btn btn-default" aria-label="Justify"><span class="glyphicon glyphicon-trash" aria-hidden="true"></span>' +	
		    	                           '</button>' +			                            
		    	                           '</div>';
	    	    				},
	    	    				"className": "text-center",
	    	    			}]
		    
		    InitDataTable('intervalList','/api/sched/intervals/',buttons,columns,columnDefs);
		    //??????30?????????table
		    //setTimeout(function(){AutoReload('intervalList','/api/sched/intervals/');}, 30000);
      }
    	makeIntervalList()
	}     
        
    
    $('#addInterval').on('click', function() {
		var btnObj = $(this);
		btnObj.attr('disabled',true);		
		$.ajax({
			url:'/api/sched/intervals/', //????????????
			type:"POST",  //????????????
		    processData: false,
		    datatype:"JSON",				
			data:$("#addIntervalForm").serialize(),  //????????????
			success:function(response){
				btnObj.removeAttr('disabled');
				RefreshTable('#intervalList', '/api/sched/intervals/');
            	new PNotify({
                    title: 'Success!',
                    text: "????????????",
                    type: 'success',
                    styling: 'bootstrap3'
                });				
				
			},
	    	error:function(response){
	    		btnObj.removeAttr('disabled');
            	new PNotify({
                    title: "????????????",
                    text: response,
                    type: 'error',
                    styling: 'bootstrap3'
                }); 	    		
	    	}
		})	    	
    });
    
    $('#addCrontab').on('click', function() {
		var btnObj = $(this);
		btnObj.attr('disabled',true);		
		$.ajax({
			url:'/api/sched/crontab/', //????????????
			type:"POST",  //????????????
		    processData: false,
		    datatype:"JSON",				
			data:$("#addCrontabForm").serialize(),  //????????????
			success:function(response){
				btnObj.removeAttr('disabled'); 				
				RefreshTable('#crontabList', '/api/sched/crontab/');	
            	new PNotify({
                    title: 'Success!',
                    text: "????????????",
                    type: 'success',
                    styling: 'bootstrap3'
                });				
			},
	    	error:function(response){
	    		btnObj.removeAttr('disabled');
            	new PNotify({
                    title: "????????????",
                    text: response,
                    type: 'error',
                    styling: 'bootstrap3'
                }); 	    		
	    	}
		})	    	
    });
    
	$('#intervalList tbody').on('click',"button[name='btn-interval-edit']", function(){
		var btnObj = $(this);
		btnObj.attr('disabled',true);		  
		var vIds = $(this).val();
	    $.ajax({  
	        url : '/api/sched/intervals/'+ vIds + '/',  
	        type : 'get', 
	        success : function(response){
	            	btnObj.removeAttr('disabled');
	            	$('#interval_every').val(response['every'])
	            	DynamicSelect('interval_period',response['period'])
	            	$('#addIntervalModal').modal('toggle');	            	
	            	$('#addInterval').hide()
	            	$('#modfInterval').val(vIds).show()
	            },
		    	error:function(response){
		    		btnObj.removeAttr('disabled');
	            	new PNotify({
	                    title: "????????????????????????????????????",
	                    text: response,
	                    type: 'error',
	                    styling: 'bootstrap3'
	                }); 		    		
		    	}	            
	    });		
	});    
		
	$('#intervalList tbody').on('click',"button[name='btn-interval-delete']", function(){
		var btnObj = $(this);
		btnObj.attr('disabled',true);		  
		var vIds = $(this).val();
		var every = $(this).parent().parent().parent().find("td").eq(1).text(); 
		var period = $(this).parent().parent().parent().find("td").eq(2).text();
		$.confirm({
		    title: '????????????',
		    content: period + ': ' + every + '<br><strong>[???]:???????????????????????????Celery??????</strong>',
		    type: 'red',
		    buttons: {
		        ??????: function () {
		    	$.ajax({  
		            cache: true,  
		            type: "DELETE",  
				    dataType: "json",
					data:{
						"id":vIds,
					}, 		            
		            url:'/api/sched/intervals/'+ vIds + '/',   
		            error: function(request) {  
		            	new PNotify({
		                    title: 'Ops Failed!',
		                    text: "????????????",
		                    type: 'error',
		                    styling: 'bootstrap3'
		                });       
		            },  
		            success: function(request) {  
		            	new PNotify({
		                    title: 'Success!',
		                    text: "????????????",
		                    type: 'success',
		                    styling: 'bootstrap3'
		                }); 
		            	RefreshTable('#intervalList', '/api/sched/intervals/');
		            }  
		    	});
		        },
		        ??????: function () {
		        	btnObj.removeAttr('disabled');
		            return true;			            
		        },			        
		    }
		});		
	}); 	
	
	$('#crontabList tbody').on('click',"button[name='btn-crontab-edit']", function(){
		var btnObj = $(this);
		btnObj.attr('disabled',true);		  
		var vIds = $(this).val();
	    $.ajax({  
	        url : '/api/sched/crontab/'+ vIds + '/',  
	        type : 'get', 
	        success : function(response){
	            	btnObj.removeAttr('disabled');
	            	$('#crontab_minute').val(response['minute'])
	            	$('#crontab_hour').val(response['hour'])
	            	$('#crontab_day_of_week').val(response['day_of_week'])
	            	$('#crontab_day_of_month').val(response['day_of_month'])
	            	$('#crontab_month_of_year').val(response['month_of_year'])
	            	$('#addCrontabModal').modal('toggle');
	            	$('#addCrontab').hide()
	            	$('#modfCrontab').val(vIds).show()	            	
	            },
		    	error:function(response){
		    		btnObj.removeAttr('disabled');
	            	new PNotify({
	                    title: "????????????????????????????????????",
	                    text: response,
	                    type: 'error',
	                    styling: 'bootstrap3'
	                }); 		    		
		    	}	            
	    });		
	});  	
    
	$('#crontabList tbody').on('click',"button[name='btn-crontab-delete']", function(){
		var btnObj = $(this);
		btnObj.attr('disabled',true);		  
		var vIds = $(this).val();
		$.confirm({
		    title: '????????????',
		    content: '??????id?????????' + vIds + '??????????????????  <br><strong>[???]:???????????????????????????Celery??????</strong>',
		    type: 'red',
		    buttons: {
		        ??????: function () {
		    	$.ajax({  
		            cache: true,  
		            type: "DELETE",  
				    dataType: "json",
					data:{
						"id":vIds,
					}, 		            
		            url:'/api/sched/crontab/'+ vIds + '/',   
		            error: function(request) {  
		            	new PNotify({
		                    title: 'Ops Failed!',
		                    text: "????????????",
		                    type: 'error',
		                    styling: 'bootstrap3'
		                });       
		            },  
		            success: function(request) {  
		            	new PNotify({
		                    title: 'Success!',
		                    text: "????????????",
		                    type: 'success',
		                    styling: 'bootstrap3'
		                }); 
		            	RefreshTable('#crontabList', '/api/sched/crontab/');
		            }  
		    	});
		        },
		        ??????: function () {
		        	btnObj.removeAttr('disabled');
		            return true;			            
		        },			        
		    }
		});		
	});	
	
    $('#modfInterval').on('click', function() {
		var btnObj = $(this);
		var vIds = $(this).val();
		btnObj.attr('disabled',true);	
		$.ajax({
			url: '/api/sched/intervals/'+ vIds + '/', //????????????
			type:"PUT",  //????????????
		    processData: false,
		    datatype:"JSON",				
			data:$("#addIntervalForm").serialize(),  //????????????
			success:function(response){
				btnObj.removeAttr('disabled');
				RefreshTable('#intervalList', '/api/sched/intervals/');		
            	new PNotify({
                    title: '<strong>????????????:</strong>',
                    text: "????????????",
                    type: 'success',
                    styling: 'bootstrap3'
                }); 				
			},
	    	error:function(response){
	    		btnObj.removeAttr('disabled');
            	new PNotify({
                    title: "????????????",
                    text: response,
                    type: 'error',
                    styling: 'bootstrap3'
                }); 	    		
	    	}
		})	    	
    });	
    
    $('#modfCrontab').on('click', function() {
		var btnObj = $(this);
		var vIds = $(this).val();
		btnObj.attr('disabled',true);	
		$.ajax({
			url: '/api/sched/crontab/'+ vIds + '/', //????????????
			type:"PUT",  //????????????
		    processData: false,
		    datatype:"JSON",				
			data:$("#addCrontabForm").serialize(),  //????????????
			success:function(response){
				btnObj.removeAttr('disabled');
				RefreshTable('#crontabList', '/api/sched/crontab/');		
            	new PNotify({
                    title: '<strong>????????????:</strong>',
                    text: "????????????",
                    type: 'success',
                    styling: 'bootstrap3'
                }); 				
			},
	    	error:function(response){
	    		btnObj.removeAttr('disabled');
            	new PNotify({
                    title: "????????????",
                    text: response,
                    type: 'error',
                    styling: 'bootstrap3'
                }); 	    		
	    	}
		})	    	
    });	   
	 
    var select_type = ''
	$("#schetype").change(function(){
		 var obj = document.getElementById("schetype"); 
		 var index = obj.selectedIndex;
		 select_type = obj.options[index].value; 	
		   if (select_type=="select_crontab"){
			   make_crontab_select()	   
		   }else if(select_type=="select_interval"){
			   make_interval_select()			   			   
		   }		 
	 }); 

    $('#add_task_button').on('click', function() {
		var btnObj = $(this);
		btnObj.attr('disabled',true);
		var formData = new FormData();
		if (select_type=="select_crontab"){
			formData.append('crontab',$('#select-crontab option:selected').val());
		}else if(select_type=="select_interval"){
			formData.append('interval',$('#select-interval option:selected').val());
		}
		formData.append('task',$('#task option:selected').val());
		formData.append('name',$('#task_name').val());
		formData.append('args',$('#args').val());
		formData.append('kwargs',$('#kwargs').val());
		formData.append('queue',$('#queue').val());
		formData.append('expires',$('#expires').val());
		formData.append('enabled',$('#enabled option:selected').val());
		$.ajax({
			url: '/api/sched/celery/', //????????????
			type:"POST",  //????????????
		    processData: false,
		    contentType: false,			
			data:formData,  //????????????
			success:function(response){
				btnObj.removeAttr('disabled');				
				RefreshTable('#taskTableList', '/api/sched/celery/');		
            	new PNotify({
                    title: '<strong>????????????:</strong>',
                    text: "????????????",
                    type: 'success',
                    styling: 'bootstrap3'
                }); 				
			},
	    	error:function(response){
	    		btnObj.removeAttr('disabled');
            	new PNotify({
                    title: "????????????",
                    text: response.responseText,
                    type: 'error',
                    styling: 'bootstrap3'
                }); 	    		
	    	}
		})	    	
    });	    
    
	$('#taskTableList tbody').on('click',"button[name='btn-task-edit']", function(){
		var btnObj = $(this);
		btnObj.attr('disabled',true);		  
		var vIds = $(this).val();
	    $.ajax({  
	        url : '/api/sched/celery/'+ vIds + '/',  
	        type : 'get', 
	        success : function(response){
	            	btnObj.removeAttr('disabled');
//	            	$('#interval_every').val(response['every'])
//	            	DynamicSelect('interval_period',response['period'])
	            	$('#task_name').val(response['name'])
	            	DynamicSelect('task',response['task'])
	            	//$('#task').attr('disabled',true);	
	            	$('#args').val(response['args']);
	            	$('#kwargs').val(response['kwargs']);
	            	$('#queue').val(response['queue']);
	            	$('#expires').val(response['expires']);
	            	if (response['crontab'] > 0){
	            		make_crontab_select()	            		
	            		DynamicSelect('schetype','select_crontab')
		        		DynamicSelect('select-crontab',response['crontab'])
	            	}else if(response['interval'] > 0){
	            		make_interval_select()
	            		DynamicSelect('schetype','select_interval')
		        		DynamicSelect('select-interval',response['interval'])	            		
	            	}
	            	if (response['enabled']){
	            		DynamicSelect('enabled',1)
	            	}else{
	            		DynamicSelect('enabled',0)
	            	}	            	
	            	$('#addTaskModal').modal('toggle');	            	
	            	$('#add_task_button').hide()
	            	$('#modf_task_button').val(vIds).show()
	            },
		    	error:function(response){
		    		btnObj.removeAttr('disabled');
	            	new PNotify({
	                    title: "????????????????????????????????????",
	                    text: response.responseText,
	                    type: 'error',
	                    styling: 'bootstrap3'
	                }); 		    		
		    	}	            
	    });		
	});  
	
    $('#modf_task_button').on('click', function() {
		var btnObj = $(this);
		var vIds = $(this).val();
		btnObj.attr('disabled',true);
		var formData = new FormData();
		if (select_type=="select_crontab"){
			formData.append('crontab',$('#select-crontab option:selected').val());
			formData.append('interval','');
		}else if(select_type=="select_interval"){
			formData.append('interval',$('#select-interval option:selected').val());
			formData.append('crontab','');
		}
		formData.append('task',$('#task option:selected').val());
		formData.append('name',$('#task_name').val());
		formData.append('args',$('#args').val());
		formData.append('kwargs',$('#kwargs').val());
		formData.append('queue',$('#queue').val());
		formData.append('expires',$('#expires').val());
		formData.append('enabled',$('#enabled option:selected').val());		
		$.ajax({
			url: '/api/sched/celery/'+ vIds + '/', //????????????
			type:"PUT",  //????????????
		    processData: false,
		    contentType: false,			
			data:formData,  //????????????
			success:function(response){
				btnObj.removeAttr('disabled');
				RefreshTable('#taskTableList', '/api/sched/celery/');		
            	new PNotify({
                    title: '<strong>????????????:</strong>',
                    text: "????????????",
                    type: 'success',
                    styling: 'bootstrap3'
                }); 				
			},
	    	error:function(response){
	    		btnObj.removeAttr('disabled');
            	new PNotify({
                    title: "????????????",
                    text: response.responseText,
                    type: 'error',
                    styling: 'bootstrap3'
                }); 	    		
	    	}
		})	    	
    });	
    
	$('#taskTableList tbody').on('click',"button[name='btn-task-delete']", function(){
		var btnObj = $(this);
		btnObj.attr('disabled',true);		  
		var vIds = $(this).val();
		var task_name = $(this).parent().parent().parent().find("td").eq(1).text();
		$.confirm({
		    title: '????????????',
		    content: task_name,
		    type: 'red',
		    buttons: {
		        ??????: function () {
		    	$.ajax({  
		            cache: true,  
		            type: "DELETE",  
				    dataType: "json",
					data:{
						"id":vIds,
					}, 		            
		            url:'/api/sched/celery/'+ vIds + '/',   
		            error: function(request) {  
		            	new PNotify({
		                    title: 'Ops Failed!',
		                    text: response.responseText,
		                    type: 'error',
		                    styling: 'bootstrap3'
		                });       
		            },  
		            success: function(request) {  
		            	new PNotify({
		                    title: 'Success!',
		                    text: "????????????",
		                    type: 'success',
		                    styling: 'bootstrap3'
		                }); 
		            	RefreshTable('#taskTableList', '/api/sched/celery/');
		            }  
		    	});
		        },
		        ??????: function () {
		        	btnObj.removeAttr('disabled');
		            return true;			            
		        },			        
		    }
		});		
	});	 
	
	if($("#regTaskList").length){
		$("#regTaskList").change(function(){
			   var obj = document.getElementById("regTaskList"); 
			   var index = obj.selectedIndex;
			   var value = obj.options[index].value; 
			   RefreshTaskResultTable('celeryTaksResultsListTable', '/api/sched/celery/result/?task_name='+value)
		});			
	}	
	
	if($("#celeryTaksResultsListTable").length){
	    $("button[name^='page_']").on("click", function(){
	      	var url = $(this).val();
	      	$(this).attr("disabled",true);
	      	if (url.length){
	      		RefreshTaskResultTable('celeryTaksResultsListTable', url);
	      	}      	
	    	$(this).attr('disabled',false);
	      }); 			
	    makeCeleryTaksResultsListTableList()  
	 
		$('#celeryTaksResultsListTable tbody').on('click',"button[name='btn-task-delete']",function(){
			var vIds = $(this).val();  
	    	var td = $(this).parent().parent().parent().find("td")
	    	var node =  td.eq(1).text()
			$.confirm({
			    title: '??????????????????',
			    content: '<strong>??????ID</strong> <code>' + node + '</code>?',
			    type: 'red',
			    buttons: {
			             ??????: function () {		       
					$.ajax({
						url:"/api/sched/celery/result/" + vIds + '/', 
						type:"DELETE",  		
						success:function(response){
			            	new PNotify({
			                    title: 'Success!',
			                    text: '????????????',
			                    type: 'success',
			                    styling: 'bootstrap3'
			                }); 
			            	RefreshTaskResultTable('celeryTaksResultsListTable', '/api/sched/celery/result/')
						},
				    	error:function(response){
				           	new PNotify({
				                   title: 'Ops Failed!',
				                   text: response.responseText,
				                   type: 'error',
				                   styling: 'bootstrap3'
				               }); 
				    	}
					});	
			        },
			        ??????: function () {
			            return true;			            
			        },			        
			    }
			});			  		 	
	    });		    
	    
	}	
    
})
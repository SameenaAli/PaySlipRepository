var myApp = angular.module('myApp',['ui.bootstrap''flow']);

myApp.config(['$httpProvider', function($httpProvider) {
$httpProvider.interceptors.push('httpInterceptor');
$httpProvider.defaults.headers.common = {};
$httpProvider.defaults.headers.post = {};
$httpProvider.defaults.headers.put = {};
$httpProvider.defaults.headers.patch = {};
$httpProvider.defaults.useXDomain = true;
delete $httpProvider.defaults.headers.common['X-Requested-With'];
}]);
myApp.factory('httpInterceptor', function ($q, $rootScope, $log) {

    var numLoadings = 0;

    return {
        request: function (config) {

            numLoadings++;

            // Show loader
            $rootScope.$broadcast("loader_show");
            return config || $q.when(config)

        },
        response: function (response) {

            if ((--numLoadings) === 0) {
                // Hide loader
                $rootScope.$broadcast("loader_hide");
            }

            return response || $q.when(response);

        },
        responseError: function (response) {

            if (!(--numLoadings)) {
                // Hide loader
                $rootScope.$broadcast("loader_hide");
            }

            return $q.reject(response);
        }
    };
});
myApp.config(['flowFactoryProvider', function (flowFactoryProvider) {
  flowFactoryProvider.defaults = {
    target: 'upload.php',
    permanentErrors: [404, 500, 501],
    maxChunkRetries: 1,
    chunkRetryInterval: 5000,
    simultaneousUploads: 4,
    singleFile: true
  };
  flowFactoryProvider.on('catchAll', function (event) {
    //console.log('catchAll', arguments);
  });
  }]);

myApp.directive("loader", function ($rootScope) {
    return function ($scope, element, attrs) {
        $scope.$on("loader_show", function () {
            return element.show();
        });
        return $scope.$on("loader_hide", function () {
            return element.hide();
        });
    };
});

myApp.controller('MainCtrl',['$scope', '$http','$dialog','$location', function($scope,$http,$dialog,$location){

	$scope.id='';
	
	$http.get('http://localhost:4567/getEmployees').success(function(data){ //192.168.1.52
		$scope.employeeDetails = data;
	 	
	});
	
	var t = '<div class="modal-dialog">' +
              '<div class="modal-content">' +
                '<div class="modal-header">' +
                 '<button type="button" class="close" ng-click="close()" aria-hidden="true">&times;</button>' +
                  '<h4 class="modal-title">View Employee Details</h4>' +
                '</div>' +
                '<div class="modal-body">' +
                  '<div style="margin: 0 auto; width: 100px"> <img class="thumbnailImg" style="width:100px;height:100px;margin:10px;" src="{{viewEmployeeDetails.empImage}}"   /></div>' + '<div class="table">'+
				'<table width="100%" border="0" cellspacing="0" cellpadding="0">'+
				
				'<tr>'+
					'<th>Employee ID</th><td>{{viewEmployeeDetails.empNo}}</td>'+
					'<th>Employee Name</th><td><h3>{{viewEmployeeDetails.firstName}}  {{viewEmployeeDetails.lastName}}</h3></td>'+
					'<th>Email ID</th><td>{{viewEmployeeDetails.emailId}}</td>'+
					'<th>Alternate Email ID</th><td>{{viewEmployeeDetails.alternateEmailId}}</td>'+
					'<th>Status</th><td>{{viewEmployeeDetails.employeeStatus}}</td>'+
				'</tr>'+
				'<tr>'+	
					'<th>PAN No.</th><td>{{viewEmployeeDetails.panNo}}</td>'+
					'<th>PF No.</th><td>{{viewEmployeeDetails.pfNumber}}</td>'+
					'<th>Bank Name</th><td>{{viewEmployeeDetails.bankName}}</td>'+
					'<th>Bank Details</th><td>{{viewEmployeeDetails.bankAccountNo}}</td>'+
					'<th>Joining Date</th><td>{{viewEmployeeDetails.joiningDate}}</td>'+
				'</tr>'+
				'<tr>'+
	     				'<th>Designation</th><td>{{viewEmployeeDetails.designation}}</td>'+
						'<th>Location</th><td>{{viewEmployeeDetails.location}}</td>'+
						'<th>Date Of Birth</th><td>{{viewEmployeeDetails.dateOfBirth}}</td>'+
						'<th>Marriage Date</th><td>{{viewEmployeeDetails.marriageDate}}</td>'+
						'<th>Contact No.</th><td>{{viewEmployeeDetails.contactNumber}}</td>'+
				'</tr>'+
				'<tr>'+
						'<th>Alternate Contact No.</th><td>{{viewEmployeeDetails.alternateContactNumber}}</td>'+
						'<th>Emergengy Contact Person </th><td>{{viewEmployeeDetails.emergencyContactPerson}}</td>'+
				'</tr>'+

				'</table>'+
			'</div>'+
			'</div>' +
                '<div class="modal-footer">' +
                  '<button type="button" class="btn btn-default" ng-click="close()">Close</button>' +
                '</div>' +
              '</div><!-- /.modal-content -->' +
            '</div><!-- /.modal-dialog -->';
 
    $scope.opts = {
        backdrop: true,
        keyboard: true,
        backdropClick: true,
        template: t, // OR: 
		//templateUrl: 'viewDialogWindow.html',
        controller: 'ViewDialogController',
		resolve: {
			idParam: function(){
				return $scope.id;
			}
		}
	};

    $scope.openDialog = function (id) {
		$scope.id=id;
	    var d = $dialog.dialog($scope.opts);
		d.open().then(function (result) {
		    if (result) {
                alert('dialog closed with result: ' + result);
            }
        });
    };

}]);
myApp.controller('ViewDialogController',['$scope','$http', 'dialog','idParam',function($scope,$http,dialog,idParam) {
	$scope.viewEmployeeDetails={};
	$http.get('http://localhost:4567/getEmployees').success(function(data){
			$scope.employeeDetails =data;
			$scope.viewEmployeeDetails =_.findWhere($scope.employeeDetails,{empNo:idParam});
					//	console.log($scope.viewEmployeeDetails);
				if(!$scope.viewEmployeeDetails.empImage){
					$scope.viewEmployeeDetails.empImage="imgs/empty.png";
				}
				if($scope.viewEmployeeDetails.employeeStatus == true){
					$scope.viewEmployeeDetails.employeeStatus='Active';
				}else{
					$scope.viewEmployeeDetails.employeeStatus='Inactive';
				}
				
		});
		$scope.close = function (result) {
			dialog.close(result);
		};
}]);
myApp.controller('UpdateOldEmployee',['$rootScope','$scope','$window','$location', '$http', function($rootScope,$scope,$window,$location,$http){
		
		
		$scope.newEmployee={};
		var id = $window.empid;
		$scope.dateField={};
	$scope.updateEmployee=function(){
		//console.log($window.imageName);
		if($window.imageName){
			$scope.newEmployee.empImage=$window.imageName;
		}
		//console.log("DOM"+$scope.newEmployee.marriageDate);
		if (!moment($scope.newEmployee.dateOfBirth,'DD-MM-YYYY').isValid()) {
			$scope.dateField.dateOfBirth = moment($scope.newEmployee.dateOfBirth).format("DD-MM-YYYY");
			$scope.newEmployee.dateOfBirth=$scope.dateField.dateOfBirth ;
		}
		if (!moment($scope.newEmployee.joiningDate,'DD-MM-YYYY').isValid()) {
			$scope.dateField.joiningDate = moment($scope.newEmployee.joiningDate).format("DD-MM-YYYY");
			$scope.newEmployee.joiningDate=$scope.dateField.joiningDate ;
		}
		if($scope.newEmployee.marriageDate){
			if(!moment($scope.newEmployee.marriageDate,'DD-MM-YYYY').isValid()){
				$scope.dateField.dateOfMarriage = moment($scope.newEmployee.marriageDate).format("DD-MM-YYYY");
				$scope.newEmployee.marriageDate=$scope.dateField.dateOfMarriage ;
			}
		}else{
			$scope.newEmployee.marriageDate="";
		}
		//console.log($scope.newEmployee);
		$http.post('http://localhost:4567/updateEmployee', $scope.newEmployee).success(function(data){
				
		if(data=='1 rows updated'){
				alert("Record Updated ");
			}else{
				alert("Record Not Updated" );
			}
			$window.location.href = "employeeDetails.html";
				
		});
	
	}

	var id=parseInt(id);
	$http.get('http://localhost:4567/getEmployeeById/'+id).success(function(data){
		$scope.newEmployee =data;
		if($scope.newEmployee.employeeStatus == true){
			$scope.newEmployee.employeeStatus=true;
		}else{
			$scope.newEmployee.employeeStatus=false;
		}
				
	});
}]);

myApp.controller('AddNewEmployee',['$rootScope','$scope','$http','$routeParams','$route','$location','$window', function($rootScope,$scope,$http,$routeParams,$route,$location,$window){
   
	$scope.newEmployee={};
	$scope.newDateField={};
	$scope.newEmployee.employeeStatus=true;

	$scope.addNewEmployee = function(){
		$scope.newEmployee.empImage=$window.imageName;
		//console.log("DOB"+$scope.newEmployee.dateOfBirth);
		
		if (!moment($scope.newEmployee.dateOfBirth,'DD-MM-YYYY').isValid()) {
			$scope.newDateField.dateOfBirth = moment($scope.newEmployee.dateOfBirth).format("DD-MM-YYYY");
			$scope.newEmployee.dateOfBirth=$scope.newDateField.dateOfBirth ;
		
		}
		if (!moment($scope.newEmployee.joiningDate,'DD-MM-YYYY').isValid()) {
			$scope.newDateField.joiningDate = moment($scope.newEmployee.joiningDate).format("DD-MM-YYYY");
			$scope.newEmployee.joiningDate=$scope.newDateField.joiningDate ;
		}
		
		if($scope.newEmployee.marriageDate){
			if(!moment($scope.newEmployee.marriageDate,'DD-MM-YYYY').isValid()){
				$scope.newDateField.dateOfMarriage = moment($scope.newEmployee.marriageDate).format("DD-MM-YYYY");
				$scope.newEmployee.marriageDate=$scope.newDateField.dateOfMarriage ;
				}
		}else{
			$scope.newEmployee.marriageDate="";
		}
		//console.log($scope.newEmployee);
		if(!$scope.newEmployee.empImage){
			$scope.newEmployee.empImage="imgs/empty.png";
			
		}
		
		$http.post('http://localhost:4567/addEmployee', $scope.newEmployee).success(function(data){	
				
			if(data=='1 rows affected'){
				alert("Record Added ");
			}else{
				alert("Record Not Added" );
			}
			//$scope.resetData();
			$window.location.reload();

		});
	
	};
	

}]);
myApp.controller('FormCtrl',['$rootScope','$scope', '$http', function($rootScope,$scope,$http){
	

	$scope.showtable  = false;
	$scope.days =[];
	var empObj;
	var boolVal = false;
	var boolDisplay=true;
	$scope.monthList =[];
	$scope.yearList =[];
	$scope.lopDays =[];
	$scope.employeeData=[];
	//For calculating 12% of Basic
	$scope.$watch('employeeData.basic * 12 / 100', function (value) {
		
		if(value){
			$scope.employeeData.pfEmployee =value;
			$scope.employeeData.totalDeductions=value + 200;
			//$scope.employeeData.grossEarnings=value + 200;
		}else{
			$scope.employeeData.pfEmployee ='';
			
		}
    });

	for(i=0;i<=31;i++){
	   $scope.days.push({key: i,label:i});
    }
	$http.get('http://localhost:4567/getEmployeesByStatus').success(function(data){ 
		$scope.employeeDetails =data;
		$scope.monthList = $scope.getMonthList();
		$scope.yearList =$scope.getYearList();
		if(boolDisplay){
			$http.get('http://localhost:4567/getCurrentYearMonthWithNoOfDays').success(function(data){ 
				 boolDisplay = false;
				$scope.employeeData.month=data.month;
				$scope.employeeData.year=data.year;
				$scope.employeeData.totalNoOfDays=data.noOfDays;
				//$scope.employeeData.lopdays='0';
			});
		}
		
	});
	
	$scope.changeMonthList=function(){
		$scope.employeeData.totalNoOfDays=0;
		$scope.employeeData.month='';
		$scope.monthList = $scope.getMonthList();
	}
	$scope.updateTotalNoOfDays=function(y,m){
			
		$http.get('http://localhost:4567/getNoOfDaysForGivenYearAndMonth/getDate?year='+y+'&month='+m).success(function(data){ 
			$scope.employeeData.month=data.month;
				$scope.employeeData.year=data.year;
				$scope.employeeData.totalNoOfDays=data.noOfDays;
				//$scope.employeeData.lopdays='0';
		});
	}
	$scope.getMonthList = function(){
		months = [];
        startOfMonth = moment().month(0).startOf("month");
        months.push({key: 0, label: startOfMonth.format('MMMM')});
        for (i = 1; i < 12; i++) {
               months.push({key: i, label: startOfMonth.add('months', 1).format('MMMM')});
            }
        return months;
	};
	$scope.getYearList = function(){
		years = [];
		startYear = moment().startOf("year");
        for (i = 1; i <= 3; i++) {
         years.push({key:i, label:startYear.format('YYYY')});
             startYear = startYear.subtract('years', 1);
         }
		return years;
	};
    $scope.getEmployeeId = function(employeeId){
		if($scope.employeeData){
			empObj = $scope.employeeData;
			//console.log(empObj);
			boolVal=true;
		 }
		$scope.employeeData =_.findWhere($scope.employeeDetails,{empNo:employeeId});
		$scope.employeeData.medical='1250';
		$scope.employeeData.conveyence='800';
		$scope.employeeData.esi='0';
		$scope.employeeData.professionalTax='200';
		$scope.employeeData.basic='0';
		$scope.employeeData.hra='0';
		$scope.employeeData.exgratia='0';
		$scope.employeeData.lta='0';
		$scope.employeeData.performanceBonus='0';
		$scope.employeeData.otherAllowance='0';
		$scope.employeeData.tds='0';
		$scope.employeeData.otherDeductions='0';
		
		

		if(boolVal){
			$scope.employeeData.month = empObj.month;
			$scope.employeeData.year = empObj.year;
			$scope.employeeData.totalNoOfDays = empObj.totalNoOfDays;
			$scope.employeeData.comments = empObj.comments;
			
		}
		
		$scope.showtable  = true;
	};
	
	$scope.sendMail = function(){
	
		
		//console.log($scope.employeeData);
		$scope.employeeData =_.findWhere($scope.employeeDetails,{empNo:$scope.employeeDetails.selectedEmpId});
		
		//console.log($scope.employeeData);
		$http.post('http://localhost:4567/submit', $scope.employeeData).success(function(data){
			$scope.resetData();
			//console.log(data);
			if(data=='Email successfully sent'){
				alert("Email is sent to " + $scope.employeeData.firstName +" "+ $scope.employeeData.lastName);
			}else{
				alert("Mail cannot be sent" );
			}
	  });
    	
		$scope.showtable = false;
		
		
	};
	$scope.resetData = function(){
		$scope.employeeData.totalDeductions='';
		$scope.employeeData.grossEarnings='';
		$scope.employeeData.totalPayable='';
		$scope.employeeDetails.selectedEmpId='';
		$scope.employeeData.medical='';
		$scope.employeeData.conveyence='';
		$scope.employeeData.esi='';
		$scope.employeeData.professionalTax='';
		$scope.employeeData.basic='';
		$scope.employeeData.hra='';
		$scope.employeeData.exgratia='';
		$scope.employeeData.lta='';
		$scope.employeeData.performanceBonus='';
		$scope.employeeData.otherAllowance='';
		$scope.employeeData.tds='';
		$scope.employeeData.otherDeductions='';
	};
	$scope.updateGrossEarning = function(grossEarning){
	
		$scope.employeeData.grossEarnings=grossEarning;
	};
	$scope.updateTotalDeduction = function(totalDeduction){
		$scope.employeeData.totalDeductions=totalDeduction;
	};
	
}]);
//**************************LeaveManagement*******************

myApp.controller('LeaveManagement',['$rootScope','$scope','$http','$dialog','$location','$window', function($rootScope,$scope,$http,$dialog,$location,$window){
	$scope.id='';
	$scope.boolMsg=false;
	$scope.boolDisplay=true;
	$scope.searchEmployee={empNo:"",firstName:"",lastName:"",fromDate:"",toDate:""};
	$scope.applyDateRange = function(sdate,edate){
			$scope.searchEmployee.fromDate=moment(sdate.trim()).format("DD-MM-YYYY");
			$scope.searchEmployee.toDate=moment(edate.trim()).format("DD-MM-YYYY");
		
	};
		$scope.submitSearch=function(){
		
			$scope.boolDisplay=false;
			
				
			//console.log($scope.searchEmployee);
			$http.get('http://localhost:4567/searchByCriteria/leaveManagement?id='+$scope.searchEmployee.empNo+'&firstName='+$scope.searchEmployee.firstName+'&lastName='+$scope.searchEmployee.lastName+'&fromDate='+$scope.searchEmployee.fromDate+'&toDate='+$scope.searchEmployee.toDate).success(function(data){
			//console.log(data);
			
					if(data=='Please Select Atleast One Search Criteria'){
					$scope.boolMsg=false;
						alert("Please Select Atleast One Search Criteria");
						$http.get('http://localhost:4567/getEmployeeLeaveDetails').success(function(data){ 
							$scope.employeeDetails =data;
					});
						
					}else if(data!='No Records Found'){
						$scope.employeeDetails=data;
						$scope.searchEmployee.empNo='';
						$scope.searchEmployee.firstName='';
						$scope.searchEmployee.lastName='';
						$scope.searchEmployee.fromDate='';
						$scope.searchEmployee.toDate='';
						$scope.boolMsg=false;
					}else{
						$scope.employeeDetails={};
						$scope.searchEmployee.empNo='';
						$scope.searchEmployee.firstName='';
						$scope.searchEmployee.lastName='';
						$scope.searchEmployee.fromDate='';
						$scope.searchEmployee.toDate='';
						$scope.boolMsg=true;
					}
		});
	
		
	
	};
	if(	$scope.boolDisplay){
		$http.get('http://localhost:4567/getEmployeeLeaveDetails').success(function(data){ 
			$scope.employeeDetails =data;
		});
	}

	var t = '<div class="modal-dialog">'+
				'<div class="modal-content">'+
					'<div style="margin:10px;">'+
						'<button type="button" class="close" ng-click="close()" aria-hidden="true">&times;</button>'+
						'<h4 class="modal-title" style="font-weight:bold;">Leave Details</h4>'+
					'</div>'+
				'<div class="modal-body" >'+
	       		 	'<div class="table">'+
						'<div >'+
							'<div class="row-form clearfix">'+
								'<div class="span3" style="font-size:15px;margin:10px;">Employee ID</div>'+
								'<div class="span3" style="margin:10px;">{{employeeDetails.empNo}}</div>'+
							'</div>'+
							'<div class="row-form clearfix">'+
								'<div class="span3" style="font-size:15px;margin:10px;">Employee Name</div>'+
								'<div class="span3" style="margin:10px;">{{employeeDetails.firstName}}  {{employeeDetails.lastName}}</div>'+
							'</div> '+
							'<div class="row-form clearfix">'+
								'<div class="span3" style="font-size:15px;margin:10px;">Email ID</div>'+
                                '<div class="span3" style="margin:10px;">{{employeeDetails.emailId}}</div>'+
							'</div>'+
							'<div ng-show="boolDisplay" >'+
								'<h2 style="display:block;left-margin:20px;color:red;">No Records Found</h2>'+
							'</div>'+

					'</div>'+
					'<table width="100%" border="0" cellspacing="0" cellpadding="0" ng-show="!boolDisplay">'+
						'<tr>'+
							'<th>From Date</th>'+
							'<th>To date</th>'+
							'<th>Availed</th>'+
							'<th>Leave Type</th>'+
							'<th></th>'+
							'<th></th>'+
						'</tr>'+
						'<tr ng-repeat="leave in leaveEmployeeDetails" >'+
							'<td>{{leave.fromDate}}</td>'+
							'<td>{{leave.toDate}}</td>'+
							'<td>{{leave.differenceBetweenFromDateToDate}}</td>'+
					        '<td>{{leave.leaveType}}</td>'+
							'<td><a ng-click="editLeave({{leave.empNo}},{{leave.uniqueId}})" id="urlPathEmployee" style="cursor: pointer;text-decoration:none;"  class="btn btn-small" title="Edit">Edit</a></td>'+
							'<td><a ng-click="deleteLeave({{leave.empNo}},{{leave.uniqueId}})" style="cursor: pointer;text-decoration:none;"  class="btn btn-small" title="Delete">Delete</a></td>'+
						'</tr>'+
					'</table>'+
				'</div>'+
			'</div>'+
      '<div class="modal-footer">'+
           '<button type="button" class="btn btn-default" ng-click="close()">Close</button>'+
       '</div>'+
   '</div>'+
'</div>';
 
 
    $scope.opts = {
        backdrop: true,
        keyboard: true,
        backdropClick: true,
        template: t, // OR: 
		//templateUrl: 'viewLeaveDialogWindow.html',
        controller: 'LeaveDialogController',
		resolve: {
			idParam: function(){
				return $scope.id;
			}
		}
	};
	
	$scope.openDialog = function (id) {
				$scope.id=id;
				var d = $dialog.dialog($scope.opts);
				d.open().then(function (result) {
					if (result) {
						alert('dialog closed with result: ' + result);
					}
				});
		};
		
		$scope.registerLeaves=function(leaveObj){
			//console.log(leaveObj);
			if(leaveObj.lop > 0){
				 var r = confirm(leaveObj.firstName+" " +leaveObj.lastName+" exceed the total leaves.");
				 if (r == true) {
						$window.location.href = "registerLeave.html?id="+leaveObj.empNo;
				}
			}else{
				$window.location.href = "registerLeave.html?id="+leaveObj.empNo;
			}
		}
}]);


myApp.controller('LeaveDialogController',['$scope','$http', 'dialog','idParam','$window',function($scope,$http,dialog,idParam,$window) {
	$scope.leaveEmployeeDetails={};
	$scope.boolDisplay=false;
	$scope.deleteLeaveObj={};
	$http.get('http://localhost:4567/getEmployeeByIdForApplyingNewLeave/'+idParam).success(function(data){//192.168.1.52
			$scope.employeeDetails =data;
		});

	$http.get('http://localhost:4567/getEmployeeAppliedLeaveDetailsById/'+idParam).success(function(data){
			if(data){
				$scope.boolDisplay=false;
				$scope.leaveEmployeeDetails=data;	
			}else{
				$scope.boolDisplay=true;
				$scope.leaveEmployeeDetails={};
			}
				
	});
	$scope.close = function (result) {
			dialog.close(result);
			$window.location.reload();
	};
	$scope.editLeave=function(id,uId){
			$window.location.href = "updateLeave.html?id="+id+"&Uid="+uId;
	}
	$scope.deleteLeave=function(id,uId){
	$scope.deleteLeaveObj={empNo:id,uniqueId:uId};
	//console.log($scope.deleteLeaveObj);
			$http.post('http://localhost:4567/deleteEmployeeAppliedLeaveDetailsByLeaveId',$scope.deleteLeaveObj).success(function(data){
					$http.get('http://localhost:4567/getEmployeeAppliedLeaveDetailsById/'+id).success(function(data){
						if(data){
							$scope.boolDisplay=false;
							$scope.leaveEmployeeDetails=data;	
						}else{
							$scope.boolDisplay=true;
							$scope.leaveEmployeeDetails={};
						}
					});
			});
	}
}]);

myApp.controller('RegisterLeave',['$rootScope','$scope','$http','$window', function($rootScope,$scope,$http,$window){
	
	var id = $window.empid;               
	$scope.leaveType=[{key:0,label:'Sick Leave'},{key:1,label:'Casual Leave'},{key:3,label:'Vacations'}];
	$scope.newdate={};
	$http.get('http://localhost:4567/getEmployeeByIdForApplyingNewLeave/'+id).success(function(data){
		$scope.newEmployee =data;
	});
	$scope.cancelLeave=function(){
		$window.location.href = "leaveManagement.html";
	
	}
	$scope.submitLeave = function(){
	if (!moment($scope.newEmployee.fromDate,'DD-MM-YYYY').isValid()) {
			$scope.newdate.fromDate = moment($scope.newEmployee.fromDate).format("DD-MM-YYYY");
			$scope.newEmployee.fromDate=$scope.newdate.fromDate;
		}
		if (!moment($scope.newEmployee.toDate,'DD-MM-YYYY').isValid()) {
			$scope.newdate.toDate = moment($scope.newEmployee.toDate).format("DD-MM-YYYY");
			$scope.newEmployee.toDate=$scope.newdate.toDate;
		}
		
		//console.log($scope.newEmployee);
		$http.post('http://localhost:4567/applyForNewLeave',$scope.newEmployee).success(function(data){
			if(data=='1 rows affected'){
				$window.location.href = "leaveManagement.html";
			}
		});
	};
}]);
myApp.controller('UpdateLeave',['$rootScope','$scope','$http','$window', function($rootScope,$scope,$http,$window){
	
	var id = $window.empid;   
	var uId = $window.Uid;	
	$scope.leaveType=[{key:0,label:'Sick Leave'},{key:1,label:'Casual Leave'},{key:3,label:'Vacations'}];
	$scope.newdate={};
		$http.get('http://localhost:4567/getEmployeeAppliedLeaveDetailsById/'+id).success(function(data){
		
			$scope.updateLeaveEmployeeDetails =_.findWhere(data,{uniqueId:parseInt(uId)});
			
		});
		
	
	$scope.submitUpdatedLeave = function(){
		if (!moment($scope.updateLeaveEmployeeDetails.fromDate,'DD-MM-YYYY').isValid()) {
			$scope.newdate.fromDate = moment($scope.updateLeaveEmployeeDetails.fromDate).format("DD-MM-YYYY");
			$scope.updateLeaveEmployeeDetails.fromDate=$scope.newdate.fromDate;
		}
		if (!moment($scope.updateLeaveEmployeeDetails.toDate,'DD-MM-YYYY').isValid()) {
			$scope.newdate.toDate = moment($scope.updateLeaveEmployeeDetails.toDate).format("DD-MM-YYYY");
			$scope.updateLeaveEmployeeDetails.toDate=$scope.newdate.toDate;
		}
		
	   //console.log($scope.updateLeaveEmployeeDetails);
		$http.post('http://localhost:4567/updateEmployeeAppliedLeaveDetailsByLeaveId',$scope.updateLeaveEmployeeDetails).success(function(data){
			if(data=='1 Rows Affected'){
				$window.location.href = "leaveManagement.html";
			}
		});
	};
}]);

//********************HOLIDAY LIST******************************/

myApp.controller('HolidayList',['$scope','$http','$window',function($scope,$http,$window) {
	
	$scope.holidayList={};
	$http.get('http://localhost:4567/getHolidayList').success(function(data){
		$scope.holidayList=data;
			
	});
	
}]);

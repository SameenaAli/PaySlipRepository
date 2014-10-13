var PFValue;
	$(document).ready(function () {
		$("#sendbutton").click(function() {
		    $("#sum").html(0);
			$("#sums").html(0);
			$('#resetForm')[0].reset();
			$('#empName').each(function(){
				$(this).prop('selectedIndex',0);
			});
			$('#lopDays').each(function(){
				$(this).prop('selectedIndex',0);
			});
			
   		}); 
	});	
	$(document).ready(function(){
 
       
        $(".txt").each(function() {
			$(this).keyup(function(){
                calculateSum();
            });
        });
 
    });
 function isNumberKey(evt){
	
    var charCode = (evt.which) ? evt.which : evt.keyCode; //event.keyCode
	
    if (charCode > 31 && charCode !=8 && charCode !=0 && charCode !=46 && (charCode < 48 || charCode > 57 ))
        return false;
    return true;
}

    function calculateSum() {
 
        var sum = 2050;
		   $(".txt").each(function() {
			if(!isNaN(this.value) && this.value.length!=0) {
                sum += parseFloat(this.value);
            }
 
        });
      	$("#sum").each(function() {
			var element = angular.element($('#sum'));
			var controller = element.controller();
			var scope = element.scope();
			scope.employeeData.grossEarnings = sum.toFixed(2);
			PFValue=scope.employeeData.pfEmployee;
			scope.$apply(function(){
				scope.updateGrossEarning(scope.employeeData.grossEarnings);
			});
		});
		  
        $("#sum").html(sum.toFixed(2));
		
    }
	$(document).ready(function(){
 
        
        $(".numericData").each(function() {
				
            $(this).keyup(function(){
                calculateSum1();
            });
        });
 
    });
 
	function calculateSum1() {
//alert(PFValue);
        var sum1 = PFValue + 200;
        
        $(".numericData").each(function() {
 
           
            if(!isNaN(this.value) && this.value.length!=0) {
                sum1 += parseFloat(this.value);
            }
 
        });
		
		$("#sums").each(function() {
			var element = angular.element($('#sums'));
			var controller = element.controller();
			var scope = element.scope();
			scope.employeeData.totalDeductions = sum1.toFixed(2);
			scope.$apply(function(){
				scope.updateTotalDeduction(scope.employeeData.totalDeductions);
			});
		});
       
        $("#sums").html(sum1.toFixed(2));
		
    }
	
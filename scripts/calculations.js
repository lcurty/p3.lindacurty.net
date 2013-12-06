// JavaScript Document
	
$(document).ready(function () {
		resetForms();
		var start_date						= $.datepicker.formatDate('m/d/yy', new Date());
		$('input[name=start_date]').val(start_date);
		$('input[name=loan]').val(150000);
		$('input[name=interest]').val(5);
		$('input[name=term]').val(30);
		calculate();
});

function resetForms() {
    document.forms['loan_details'].reset();
}

// Listeners
$('button').click(calculate);

// Calculation function
function calculate() {
	// Tabla rasa
	var minimum									= 0;
	var interest_paid						= 0;
	var interest_saved					= 0;
	var years_shortened					= 0;
	var months_shortened				= 0;
	var mortgage_table					= '';
	var error										= '';

	// Set up arrays
  var one_time_arr 						= new Array();
  var chng_payment_arr 				= new Array();
  var chartData								= new Array();
  var orig_arr 								= new Array();
  var new_arr 								= new Array();
  var month_arr 							= new Array();

	// Data
	var loan										= $('input[name=loan]').val().replace(/[$,]/g, '');
	var interest 								= $('input[name=interest]').val();
	var term										= $('input[name=term]').val();
	var start_date							= $('input[name=start_date]').val();
	var actual									= $('input[name=actual]').val().replace(/[$,]/g, '');

	// Populate arrays for and error check Amoritization Table fields
	
	var ot											= 1;
	$('.one_time').each(function() {
			if(this.value != ''){
				one_time_arr.push(this.value.replace(/[$,]/g, ''));
				var value = $(this).val().replace(/^\s\s*/, '').replace(/\s\s*$/, '').replace(/[$.,]/g, '');
				var intRegex = /^\d+$/;
				if(!intRegex.test(value)) {
					error 								+= "<p>One Time Payment Value on Payment " + ot + " must be numeric.</p>";
				}
			} else {
				one_time_arr.push(0);
			}
			ot++;
	});
	
	var cp											= 1;
	$('.chng_payment').each(function() {
			if(this.value != ''){
				chng_payment_arr.push(this.value.replace(/[$,]/g, ''));
				var value = $(this).val().replace(/^\s\s*/, '').replace(/\s\s*$/, '').replace(/[$.,]/g, '');
				var intRegex = /^\d+$/;
				if(!intRegex.test(value)) {
					error 								+= "<p>Change Payment Value on Payment " + cp + " must be numeric.</p>";
				}
			} else {
				one_time_arr.push(0);
			}
			cp++;
	});
	
	//Error checking on Loan Inputs		
	if($('input[name=start_date]').val() === "") {
		var start_date					= new Date();
	} else {
		var txtVal =  start_date;
		if(!isDate(txtVal))
			error 								+= "<p>Please enter a valid date. mm/dd/yyyy</p>";
	}
	if($('input[name=loan]').val() === "") {
		error		 								+= "<p>Enter Loan Value</p>";
	} else {
		var value = $('input[name=loan]').val().replace(/^\s\s*/, '').replace(/\s\s*$/, '').replace(/[$.,]/g, '');
    var intRegex = /^\d+$/;
		if(!intRegex.test(value)) {
			error 								+= "<p>Loan Value must be numeric.</p>";
		}
	}
	if ($('input[name=interest]').val() === "") {
		error 									+= "<p>Enter Interest Rate</p>";
	} else {
		var value = $('input[name=interest]').val().replace(/^\s\s*/, '').replace(/\s\s*$/, '').replace(/[.]/g, '');
    var intRegex = /^\d+$/;
		if(!intRegex.test(value)) {
			error 								+= "<p>Interest Rate must be numeric.</p>";
		}
	}
	if($('input[name=term]').val() === "") {
		error 									+= "<p>Enter Length of Loan in Years</p>";
	} else {
		var value = $('input[name=term]').val().replace(/^\s\s*/, '').replace(/\s\s*$/, '').replace(/[.]/g, '');
    var intRegex = /^\d+$/;
		if(!intRegex.test(value)) {
			error 								+= "<p>Length of Loan must be numeric.</p>";
		}
	}
	
	// Calculate payment details
	var m_interest						= interest / 1200;
	var months								= term * 12;
	var n_interest						= Math.pow((1 + m_interest),(months));
	var minimum								= (loan * (m_interest * n_interest)/ (n_interest - 1)).toFixed(2);
	var principle							= loan;
	var principle_paid				= 0;
	var total_interest				= 0;
	var this_month						= new Date(start_date);								
	var payment								= (Number(actual) > Number(minimum))?actual:minimum;
	
	// Set-up Original Values
	var orig_principle				= loan;
	var orig_principle_paid		= 0;
	var orig_total_interest		= 0;
	
	// Error checking on Actual Monthly Payment
	if($('input[name=actual]').val() != "") {
		var value = $('input[name=actual]').val().replace(/^\s\s*/, '').replace(/\s\s*$/, '').replace(/[$.,]/g, '');
    var intRegex = /^\d+$/;
		if(!intRegex.test(value)) {
			error 								+= "<p>Actual Monthly Value must be numeric.</p>";
		} else if(Number(actual) < Number(minimum)) {
			intended_actual					= (Number(minimum) + Number(actual)).toFixed(2);
			error 									+= "<p>If entered, Actual Monthly Value must be greater than minimum value. For instance, if your minimum payment is $" + minimum + ", and you actually pay $" + intended_actual + ", you should enter $" + intended_actual + " rather than $" + actual + ".</p>";
		}
	}
	
	// Loop through Calculations for Amoritization Table
	for (var i=1; i<=months; i++){
		var display_month				= $.datepicker.formatDate('mm/dd/yy', new Date(this_month));
		var principle						= (principle - principle_paid).toFixed(2);
		var interest_paid				= (principle * m_interest).toFixed(2);
		var this_chng_payment		= (chng_payment_arr[i-1] != undefined)?chng_payment_arr[i-1]:0;
		var this_one_time				= (one_time_arr[i-1] != undefined)?one_time_arr[i-1]:0;
		var total_interest			= (parseFloat(interest_paid) + parseFloat(total_interest)).toFixed(2);

		//Calculate Payment Based on Variables Entered
		var payment							= (Number(this_chng_payment) > Number(payment))?this_chng_payment:payment;
		var fix_payment					= payment;
		var payment							= Number(payment) + Number(this_one_time);
		var principle_paid			= (payment - interest_paid).toFixed(2);
		var principle_paid			= (Number(principle)<Number(principle_paid))?principle:principle_paid;
		var total_due						= (parseFloat(principle) + parseFloat(interest_paid)).toFixed(2);
		var payment							= (Number(payment)<Number(total_due))?payment:total_due;
		
		//Calculate Original Values
		var orig_principle			= (orig_principle - orig_principle_paid).toFixed(2);
		var orig_interest_paid	= (orig_principle * m_interest).toFixed(2);
		var orig_principle_paid	= (minimum - orig_interest_paid).toFixed(2);
		var orig_total_interest	= (parseFloat(orig_interest_paid) + parseFloat(orig_total_interest)).toFixed(2);

		//Only add row to amortization table if payment is Due
		if(Number(principle) > 0) {
			mortgage_table				+= 
															'<tr>' +
																'<td class="center">' + i + '</td>' +
																'<td>' + display_month + '</td>' +
																'<td>$<span class="digits2">' + principle + '</span></td>' +
																'<td>$<span class="digits2">' + interest_paid + '</span></td>' +
																'<td>$<span class="digits2">' + principle_paid + '</span></td>' +
																'<td>$<span class="digits2">' + payment + '</span></td>' +
																'<td>$<span class="digits2">' + total_interest + '</span></td>' +
																'<td><input type="text" name="one_time' + i + '" value="' + this_one_time + '" class="one_time"></td>' +
																'<td><input type="text" name="chng_payment' + i + '" value="' + this_chng_payment + '" class="chng_payment"></td>' +
															'</tr>';
					payment						= fix_payment;
			var new_date					= $.datepicker.formatDate('mm/dd/yy', new Date(this_month));
			var new_months				= i;
		}
		var set_month						= this_month.getMonth() + 1;
		this_month.setMonth(set_month);	
		
		// Populate Arrays for chart	
		new_arr.push(Number(principle));
		orig_arr.push(Number(orig_principle));
		month_arr.push(display_month);
		
	};

	// Calculations for adjustments				
	var interest_saved		= (parseFloat(orig_total_interest) - parseFloat(total_interest)).toFixed(2);
	var years_shortened		= parseInt((Number(months) - Number(new_months)) / 12);
	var months_shortened	= parseInt((months - new_months) - (years_shortened * 12));
	
	// Print to page
	$('#minimum').html(minimum);
	$('#total_interest').html(total_interest);
	$('#interest_saved').html(interest_saved);
	$('#new_date').html(new_date);
	$('#years_shortened').html(years_shortened);
	$('#months_shortened').html(months_shortened);
	$('#mortgage_table').html(mortgage_table);
	$('#mortgage_table').html(mortgage_table);
	$('#error').html(error);

	// Style		
	$('tr:even').addClass('even');
	$('.digits2').number(true,2);
	
	// Draw Chart
	$('#payment_graph').highcharts({
			chart: { type: 'area' },
			title: { 
				text: 'Principle Reduction' ,
				style: { color: '#447D79' }
			},
			xAxis: { 
				title: { 
					text: 'Months', 
					style: { color: '#555555' }
				}
			},
			yAxis: {
				title: { 
					text: 'Principle', 
					style: { color: '#555555' }
				}
			},
			series: [{
					name: 'Original Value',
					data: orig_arr,
					color: '#DDDDDD'
			}, {
					name: 'Adjusted Value',
					data: new_arr,
					color: '#99CCBB'
			}],
			plotOptions: {
				area: {
					marker: {enabled: false}
				}
			},
			legend: {
				itemStyle: { color: '#555555' }
			},
	});

}

function isDate(txtDate) {
	var currVal = txtDate;
	if(currVal == '')
		return false;
 
	//Declare Regex 
	var rxDatePattern = /^(\d{1,2})(\/|-)(\d{1,2})(\/|-)(\d{4})$/;
	var dtArray = currVal.match(rxDatePattern); // is format OK?
 
	if (dtArray == null)
		return false;
	
	//Checks for mm/dd/yyyy format.
	dtMonth = dtArray[1];
	dtDay= dtArray[3];
	dtYear = dtArray[5];
 
	if (dtMonth < 1 || dtMonth > 12)
		return false;
	else if (dtDay < 1 || dtDay> 31)
		return false;
	else if ((dtMonth==4 || dtMonth==6 || dtMonth==9 || dtMonth==11) && dtDay ==31)
		return false;
	else if (dtMonth == 2)
	{
		 var isleap = (dtYear % 4 == 0 && (dtYear % 100 != 0 || dtYear % 400 == 0));
		 if (dtDay> 29 || (dtDay ==29 && !isleap))
			return false;
	}
	return true;
}
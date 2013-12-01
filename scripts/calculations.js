// JavaScript Document
	
$(document).ready(function () {
//		var orig_arr;
//		var new_arr;
//		var month_arr	;
    resetForms();
		var start_date						= $.datepicker.formatDate('m/d/yy', new Date());
		$('input[name=start_date]').val(start_date);
		$('input[name=loan]').val(5000);
		$('input[name=interest]').val(5);
		$('input[name=term]').val(1);
		calculate();
});

function resetForms() {
    document.forms['loan_details'].reset();
}

// Listeners
$(document).on("change", "input", calculate);
//$('input').keyup(calculate);
//$('#amortization').keyup(calculate);
//$('select,input[type=date]').change(calculate);

// Calculation function
function calculate() {
	// Tabla rasa
	var minimum									= 0;
	var interest_paid						= 0;
	var interest_saved					= 0;
	var years_shortened					= 0;
	var months_shortened				= 0;
	var mortgage_table					= '';

	// Data
	var loan										= $('input[name=loan]').val();
	var interest 								= $('input[name=interest]').val();
	var term										= $('input[name=term]').val();
	var start_date							= $('input[name=start_date]').val();
	var actual									= $('input[name=actual]').val();
	
  var one_time_arr = new Array();
	  $('.one_time').each(function() {
				one_time_arr.push(this.value);
		});
  var chng_payment_arr = new Array();
	  $('.chng_payment').each(function() {
				chng_payment_arr.push(this.value);
		});
				
	// Calculate minimum payment
	if($('input[name=start_date]').val() === "")
		var start_date						= new Date();
	if($('input[name=loan]').val() === "") {
		var minimum 							= "Enter Loan Value";
		var total_interest				= "Enter Loan Value";
	}
	else if ($('input[name=interest]').val() === "") {
			var minimum 						= "Enter Interest Rate";
			var total_interest			= "Enter Interest Rate";
	}
	else if($('input[name=term]').val() === "") {
			var minimum 						= "Enter Length in Years";
			var total_interest			= "Enter Length in Years";
	}
	else {
		var m_interest						= interest / 1200;
		var months								= term * 12;
		var n_interest						= Math.pow((1 + m_interest),(months));
		var minimum								= (loan * (m_interest * n_interest)/ (n_interest - 1)).toFixed(2);
		var principle							= loan;
		var principle_paid				= 0;
		var total_interest				= 0;
		var this_month						= new Date(start_date);								
		var orig_principle				= loan;
		var orig_principle_paid		= 0;
		var orig_total_interest		= 0;
		var payment							= (Number(actual) > Number(minimum))?actual:minimum;
//		var orig_arr							= [];
//		var new_arr 							= [];
//		var month_arr							= [];
		
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
			
			
//			new_arr.push(principle);
//			orig_arr.push(orig_principle);
//			month_arr.push(display_month);
		};
//		build_chart(month_arr, orig_arr, new_arr);
		
//		var lineChartData = {
//			labels : month_arr,
//			datasets : [
//				{
//					fillColor : "rgba(220,220,220,0.5)",
//					strokeColor : "rgba(220,220,220,1)",
//					pointColor : "rgba(220,220,220,1)",
//					pointStrokeColor : "#fff",
//					data : new_arr
//				},
//				{
//					fillColor : "rgba(151,187,205,0.5)",
//					strokeColor : "rgba(151,187,205,1)",
//					pointColor : "rgba(151,187,205,1)",
//					pointStrokeColor : "#fff",
//					data : orig_arr
//				}
//			]
//		}


		//Get the context of the Monthly Payment Graph
		//var myLine = new Chart(document.getElementById("payment_graph").getContext("2d")).Line(lineChartData);
	}
				
	var interest_saved		= (parseFloat(orig_total_interest) - parseFloat(total_interest)).toFixed(2);
	var years_shortened		= parseInt((Number(months) - Number(new_months)) / 12);
	var months_shortened	= (months - new_months) - (years_shortened * 12);

	$('#minimum').html(minimum);
	$('#total_interest').html(total_interest);
	$('#interest_saved').html(interest_saved);
	$('#new_date').html(new_date);
	$('#years_shortened').html(years_shortened);
	$('#months_shortened').html(months_shortened);
	$('#mortgage_table').html(mortgage_table);
//	$('#month_arr').html(month_arr);
//	$('#new_arr').html(new_arr);
		
	
	$('tr:even').addClass('even');
	$('.digits2').number(true,2);
}

//function build_chart(month_arr, orig_arr, new_arr) {
//		$(function () { 
//				$('#payment_graph').highcharts({
//					chart: { type: 'area' },
//					title: { text: 'Principle Reduction' },
//					xAxis: { categories: month_arr },
//					yAxis: { 
//						title: { text: 'Fruit eaten' }
//					},
//					series: [
//						{
//							name: 'Original',
//							data: orig_arr
//						}, {
//							name: 'Adjusted',
//							data: new_arr
//						}
//					]
//				});
//		});
//
//}
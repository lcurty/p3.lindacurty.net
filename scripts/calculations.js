// JavaScript Document
	
$(document).ready(function () {
    resetForms();
		var start_date				= $.datepicker.formatDate('m/d/yy', new Date());
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
$('input').keyup(calculate);
$('select,input[type=date]').change(calculate);

// Calculation function
function calculate() {
	// Tabla rasa
	var minimum						= 0;
	var interest_paid			= 0;
	var interest_saved		= 0;
	var years_shortened		= 0;
	var months_shortened	= 0;
	var mortgage_table		= '';

	// Data
	var loan							= $('input[name=loan]').val();
	var interest 					= $('input[name=interest]').val();
	var term							= $('input[name=term]').val();
	var start_date				= $('input[name=start_date]').val();
	var actual						= $('input[name=actual]').val();

	
	// Calculate minimum payment
	if($('input[name=start_date]').val() === "")
		var start_date			= new Date();
	if($('input[name=loan]').val() === "") {
		var minimum 				= "Enter Loan Value";
		var total_interest	= "Enter Loan Value";
	}
	else if ($('input[name=interest]').val() === "") {
			var minimum 				= "Enter Interest Rate";
			var total_interest	= "Enter Interest Rate";
	}
	else if($('input[name=term]').val() === "") {
			var minimum 				= "Enter Length in Years";
			var total_interest	= "Enter Length in Years";
	}
	else {
		var m_interest				= interest / 1200;
		var months						= term * 12;
		var n_interest				= Math.pow((1 + m_interest),(months));
		var minimum						= (loan * (m_interest * n_interest)/ (n_interest - 1)).toFixed(2);
		
		// Mortgage Table
		var principle					= loan;
		var principle_paid		= 0;
		var total_interest		= 0;
		var this_month				= new Date(start_date);								
	
		for (var i=1; i<=months; i++){
			var display_month		= $.datepicker.formatDate('mm/dd/yy', new Date(this_month));
			var principle				= (principle - principle_paid).toFixed(2);
			var interest_paid		= (principle * m_interest).toFixed(2);
			var payment					= (Number(actual) > Number(minimum))?actual:minimum;
			var principle_paid	= (payment - interest_paid).toFixed(2);
			var total_interest	= (parseFloat(interest_paid) + parseFloat(total_interest)).toFixed(2);
			if(Number(principle)<0){
				break;
			}
					mortgage_table	+= 
														'<tr>' +
															'<td>' + display_month + '</td>' +
															'<td>$<span class="digits2">' + principle + '</span></td>' +
															'<td>$<span class="digits2">' + interest_paid + '</span></td>' +
															'<td>$<span class="digits2">' + principle_paid + '</span></td>' +
															'<td>$<span class="digits2">' + payment + '</span></td>' +
															'<td>$<span class="digits2">' + total_interest + '</span></td>' +
														'</tr>';
			var set_month				= this_month.getMonth() + 1
			this_month.setMonth(set_month);		
			
		};
		
				
		var interest_saved		= 0;
		var years_shortened		= 0;
		var months_shortened	= 0;
	
		$('#minimum').html(minimum);
		$('#total_interest').html(total_interest);
		$('#interest_saved').html(interest_saved);
		$('#years_shortened').html(years_shortened);
		$('#months_shortened').html(months_shortened);
		$('#mortgage_table').html(mortgage_table);
	}
	$('tr:even').addClass('even');
	$('.digits2').number(true,2);
}


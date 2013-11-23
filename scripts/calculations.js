// JavaScript Document
	
$(document).load(function(e) {
	var loan			= 0;
	var interest 	= 0;
	var term			= 0;
	var date			= 0;
	var actual		= 0;
});

// Listeners
$('input').keyup(calculate);
$('select,input[type=date]').change(calculate);

// Calculation function
function calculate() {
	
	// Data
	var loan							= $('input[name=loan]').val();
	var interest 					= $('input[name=interest]').val();
	var term							= $('input[name=term]').val();
	var start_date				= $('input[name=start_date]').val();
	var actual						= $('input[name=actual]').val();

	// Tabla rasa
	var minimum						= 0;
	var interest_paid			= 0;
	var interest_saved		= 0;
	var years_shortened		= 0;
	var months_shortened	= 0;
	var mortgage_table		= '';
	
	// Calculate minimum payment
	var m_interest				= interest / 1200;
	var months						= term * 12
	var n_interest				= Math.pow((1 + m_interest),(months))
	var minimum						= (loan * (m_interest * n_interest)/ (n_interest - 1)).toFixed(2);
	
	// Mortgage Table
	var principle					= loan;
	var principle_paid		= 0;
	var total_interest		= 0;
	var this_month				= new Date(start_date);								

	for (var i=1; i<=months; i++){
		var display_month		= $.datepicker.formatDate('MM dd, yy', new Date(this_month));
		var principle				= (principle - principle_paid).toFixed(2);
		var interest_paid		= (principle * m_interest).toFixed(2);
		var payment 				= minimum;
		var principle_paid	= (payment - interest_paid).toFixed(2);
		var total_interest	= (parseFloat(interest_paid) + parseFloat(total_interest)).toFixed(2);
				mortgage_table	+= 
													'<tr>' +
														'<td>' + display_month + '</td>' +
														'<td>' + principle + '</td>' +
														'<td>' + interest_paid + '</td>' +
														'<td>' + principle_paid + '</td>' +
														'<td>' + payment + '</td>' +
														'<td>' + total_interest + '</td>' +
													'</tr>';
		var set_month				= this_month.getMonth() + 1
		this_month.setMonth(set_month);		
	};
	
			
	var interest_saved		= 0;
	var years_shortened		= 0;
	var months_shortened	= 0;

	$('#interest').html(interest);
	$('#term').html(term);
	$('#loan').html(loan);
	$('#m_interest').html(m_interest);
	$('#minimum').html(minimum);
	$('#total_interest').html(total_interest);
	$('#interest_saved').html(interest_saved);
	$('#years_shortened').html(years_shortened);
	$('#months_shortened').html(months_shortened);
	$('#mortgage_table').html(mortgage_table);
					
}

// Make sure the developer knows that there is a JS error

var Loudmouth = (function(my){
	var complaints = [], original_onerror = window.onerror, config = {}, original_alert = window.alert;

	var complainLoudly = function(){
		if (complaints.length > 0) {

			var complaints_str = 'There was a JavaScript exception';
			if (complaints.length > 1) complaints_str = 'There were ' + complaints.length + ' JavaScript exceptions';
			complaints_str += " when the page was loading:\n";

			var error;
			while ( (complaint = complaints.pop()) != null){
				complaints_str += "\n-------------------";
				for ( var p in complaint){
					if (complaint.hasOwnProperty(p)) complaints_str += "\n" + p + " : " + complaint[p];
				}
			};
  		complaints_str += "\n-------------------\n\n";

	  	alert(complaints_str);
		} else {
			console.log("This loudmouth has nothing to complain about, kthxbye!");
		};

		return this;
	};

	var complainSilently = function(){
		var complaint;
		while( (complaint = complaints.pop()) != null){
			hollaback(complaint);
		};
	};

	// Report errors back to the server
	var hollaback = function(error_info) {
		error_info.href = window.location.href;
		if ( Loudmouth.hollaback_url() ) {
			var image_str = "<img src='" + Loudmouth.hollaback_url() + '?error_info=' + JSON.stringify(error_info) + "'>";
			console.log(image_str);
			$(document).append(image_str);
		} else {
			console.log("Warning: Loudmouth.js captured a complaint, but the hollaback server URL is not defined, so I'm telling you about the problem: ");
			console.log(error_info);
		};
	};
	
	// URL for reporting errors
	my.hollaback_url = function(target_url){
		if (target_url) config.hollaback_url = target_url;
		return config.hollaback_url;
	};

	var addError = function(errorMessage, url, lineNumber){
		addComplaint('error', {errorMessage: errorMessage, url: url, lineNumber: lineNumber});
	};

	var addComplaint = function(type, error_info){
		error_info.type = type;
		complaints.push(error_info);
	};

	my.captureAlerts = function(){
		console.log("Loudmouth will capture all window.alert calls");
		window.alert = function() {
			addComplaint('alert', {alert_message: arguments[0]});
			console.log("Loudmouth saw this alert: " + arguments[0]);
			return original_alert.apply(this, arguments);
		};
		return this;  // Enable chaining
	};

	// Complain right away
	my.watch = function(){
		var watch_onerror = function(errorMessage, url, lineNumber){
			addError(errorMessage, url, lineNumber);
			complainLoudly();
			return original_onerror ? original_onerror.call(errorMessage, url, lineNumber) : original_onerror;
		};
		window.onerror = watch_onerror;
		return this;  // Enable chaining
	};

	// Keep track of all complaints quietly
	my.lurk = function(){
		var lurk_onerror = function(errorMessage, url, lineNumber){
			addError(errorMessage, url, lineNumber);
			complainSilently();
			return original_onerror ? original_onerror.call(errorMessage, url, lineNumber) : original_onerror;
		};
		window.onerror = lurk_onerror;
		if ( ! Loudmouth.hollaback_url() ) {
			console.log("Warning: The hollaback server URL is not defined, so errors will not be reported back to the server. Use Loudmouth.hollaback_url(<your url>) to tell Loudmouth where to shout.");
		}
		return this;  // Enable chaining
	};

	// Stop watching
	my.goAway = function(){
		window.onerror = original_onerror;
		return this;  // Enable chaining
	};

	return my;

})(Loudmouth || {});
	
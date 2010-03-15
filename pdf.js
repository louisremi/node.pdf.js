var sys = require('sys'),
	events = require('events');

exports.generate = function( url, outputName, options ) {
	// Callback can only be the last arg
	var callback = arguments[arguments.length -1];	
	// Callback need to be a function
	if(typeof callback !== "function") {
		callback = null;
	}
	
	// Turn options into normalized and escaped arguments
	var optionsArray = [], o;
	for(o in options) {
		optionsArray.concat(
			// turn pageSize or page-size to --page-size 
			"--" + o.replace(/([A-Z])/g, "-$1").toLowerCase(),
			// arguments should be escaped!!
			options[o].split(" ").join("")
		);
	}
	
	sys.exec("./wkhtmltopdf "+url+" "+outputName, function(err, stdout, stderr) {
		if(callback) {
			// err is not considered an error if the last line of stderr is "Done"
			if(err && !/\sDone\s*$/.test(stderr)) {
				callback(err, stderr);
			} else {
				callback(null, stdout);
			}
		}
	});
};
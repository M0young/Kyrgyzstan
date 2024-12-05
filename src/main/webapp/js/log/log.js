var LOG = {
	write:function(log_code, log_level, message) {
		$.ajax({
			url:"./logger/addLogTracker.do",
			type: "POST",
			data: {"log_code": log_code,"log_level": log_level,"message": message},
			dataType: 'json',
			success:function(result) {
				return false;
				console.log(result.rs)
				if(result.rs == "complete") {
					return false;
				}
			}
		});
	}
};
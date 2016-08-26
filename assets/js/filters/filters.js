var QiSatApp = angular.module('QiSatApp');

QiSatApp.filter("limitName", function (){
	return function (input, size) {
		size = (size || 55);
		if (input.length <= size ) return input;
		var output = input.substring (0, size) + "...";
		return output;
	};
});

QiSatApp.filter('zpad', function() {
	return function(input, n) {
		var zeros;
		n = (n || 2);
		if(input === undefined) input = ""
		if(input.length >= n) return input
		zeros = "0".repeat(n);
		return (zeros + input).slice(-1 * n);
	};
});

QiSatApp.filter("byTypes", function (){
	return function (courses, types, operation) {
		// console.log('byTypes:'+count++);
		var filtered = [];
		if(!types || ( Array.isArray(types) && types.length == 0)) return courses;

		if(Array.isArray(types)) {
			switch(operation){
				case 'separated' :
						types.map(function(type){
									filtered.push(courses.filter(function(course){
											return course.categorias.find(function(tipo){ return tipo.id == type })
									    })
									)});
					break;
				case 'unity' :
						var result = [];
						types.map(function(type){
								filtered = courses.filter(function(course){
									return course.categorias.find(function(tipo){ return tipo.id == type })
							    });

							    result = result.concat( filtered.filter(function(course){ return result.indexOf(course) < 0 }));
							});

						filtered = result;
					break;
				case 'intersection' :
				default: 
					types.map(function(type){
								filtered = courses.filter(function(course){
									return course.categorias.find(function(tipo){ return tipo.id == type })
							    });
							});
			}
		}else if(typeof types == 'string' || typeof types == 'number' ){
			filtered = courses.filter(function(course){
									return course.categorias.find(function(tipo){ return tipo.id == types })
							    });
		}

		return filtered;
	};
});
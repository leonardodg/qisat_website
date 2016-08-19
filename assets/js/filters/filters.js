var QiSatApp = angular.module('QiSatApp');

QiSatApp.filter("limitName", function (){
	return function (input, size) {
		size = (size || 55);
		if (input.length <= size ) return input;
		var output = input.substring (0, size) + "...";
		return output;
	};
});

QiSatApp.filter("byTypes", function (){
	return function (courses, types, operation) {
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

						courses = filtered;
					break;
				case 'unity' :
						var result = [];
						types.map(function(type){
								filtered = courses.filter(function(course){
									return course.categorias.find(function(tipo){ return tipo.id == type })
							    });

							    result = result.concat( filtered.filter(function(course){ return result.indexOf(course) < 0 }));
							});

						courses = result;
					break;
				case 'intersection' :
				default: 
					types.map(function(type){
								courses = courses.filter(function(course){
									return course.categorias.find(function(tipo){ return tipo.id == type })
							    });
							});
			}
		}else if(typeof types == 'string' || typeof types == 'number' ){
			courses = courses.filter(function(course){
									return course.categorias.find(function(tipo){ return tipo.id == types })
							    });
		}

		return courses;
	};
});

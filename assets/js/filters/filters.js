var QiSatApp = angular.module('QiSatApp');

QiSatApp.filter("limitName", function (){
	return function (input, size) {
		size = (size || 55);
		if (input.length <= size ) return input;
		var output = input.substring (0, size) + "...";
		return output;
	};
}).filter("filterTypeOnline", function (){
	return function (courses, types) {
		var filtered = [];

		// console.log(courses.length);
		// console.log(types);

		if(!types || types.length == 0) return courses;
		types.map(function(type){
			filtered = filtered.concat( courses.filter(function(course){
							return course.categorias.find(function(tipo){ return tipo.id == type }) && !filtered.find(function(item){ item.id == course.id })
					    }));
		});

		return filtered;
	};
});
(function() {
    'use strict';

	 angular
	 	.module('QiSatApp')
	 	.filter("limitName", function (){
			return function (input, size) {
				size = (size || 55);
				if (input.length <= size ) return input;
				var output = input.substring (0, size) + "...";
				return output;
			};
		})

	 	.filter("nameInstructor", function (){
			return function (input, size) {
				if(input){
					var output = input.toLowerCase(), length = input.length, regex = /(da|de){2}/;
					output = output.split(' ');
					size = (size || 25);
					output = output.map(function(nome, i){
						if(regex.test(nome)) 
							return nome;
						else if(length>=size && i > 0 && i < output.length-1)
							return nome.charAt(0).toUpperCase() + '.';
						else
							return nome.charAt(0).toUpperCase() + nome.substring(1);
					});

					if(output.join(' ').length >= size)
						output[output.length-1] = output[output.length-1].charAt(0).toUpperCase() + '.';

					return output.join(' ');
				}
			};
		})

	 	.filter('zpad', function() {
			return function(input, n) {
				var zeros;
				n = (n || 2);
				if(input === undefined) input = ""
				if(input.length >= n) return input
				zeros = "0".repeat(n);
				return (zeros + input).slice(-1 * n);
			};
		})
		
	 	.filter("byTypes", function (){
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
}());
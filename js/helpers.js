/* exported getElement createElement */
/**
 * Retrieves an element from the DOM by ID
 * @param  {string} el HTML element ID
 * @return {object}    DOM element object
 */
function getElement ( el ) {
	return document.getElementById( el );
}

/**
 * Creates DOM elements
 * @param  {string} element 	HTML element
 * @param  {object} attributes 	Objects containg attribute:value pairs
 * @return {object} 			The created DOM element
 */
function createElement ( element, attributes ) {
	var newElement = document.createElement( element );
	if ( arguments.length > 1 ) {
		var attributeArray = Object.getOwnPropertyNames( attributes );
		attributeArray.forEach(function (attribute) {
			newElement[attribute] = this[attribute];
		}, attributes);

	}
	return newElement;
}

function getEl( el ) {
	return document.getElementById( el );
}

function crEl( element, object ) {
	var objectProto = {
		className: 'className',
		type: 'type',
		innerHTML: 'innerHTML'
	};
	var newElement = document.createElement( element );
	if ( arguments.length > 1 ) {
		if ( object.hasOwnProperty( 'className' ) ) newElement.className = object.className;
		if ( object.hasOwnProperty( 'type' ) ) newElement.type = object.type;
		if ( object.hasOwnProperty( 'innerHTML' ) ) newElement.innerHTML = object.innerHTML;
		if ( object.hasOwnProperty( 'value' ) ) newElement.value = object.value;
	}
	return newElement;
}

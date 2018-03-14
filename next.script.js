const categories = [
    'Advice', 'Club', 'Club Members', 'DDLC', 'Games', 'Life', 
	'Literature', 'Media', 'Misc', 'Mod', 'Monika', 'Philosophy', 
	'Psychology', 'Romance', 'School', 'Society', 'Technology', 
	'Trivia', 'Writing', 'You'
];

function htmlToEl(html) {
	let template = document.createElement('template');
    html = html.trim(); // Never return a text node of whitespace as the result
	template.innerHTML = html;

    return template.content.firstChild;
}

function clean(str, space) {
	str = str.replace(/[^\w\s]|_/g, "")
	str = space ? str : str.replace(/ /g, "_");
	return str.toLowerCase();
}

function addCategory() {
	let dropper = htmlToEl('<div class="control pad-bottom"><span class="select"><select></select></span></div>'); // Create bare. dropdown element tree.
	let select = dropper.firstChild.firstChild; // Get a reference to the `<select>` element.

	dropper.appendChild(htmlToEl('<button class="button is-danger"><span class="icon is-small"><i class="fas fa-times"></i></span></button>')); // Add the remove button to the tree.
	categories.forEach(el => {
		let cat = document.createElement('option');
		cat.innerHTML = el;

		cat.setAttribute('value', clean(el, true));
		select.appendChild(cat);
	});

	dropper.lastChild.setAttribute('onclick', 'removeCategory(this)');
	document.getElementById('categories').appendChild(dropper);
}

function removeCategory(el) {
	document.getElementById('categories').removeChild(el.parentElement);
}
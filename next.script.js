const categories = [
    'Advice', 'Club', 'Club Members', 'DDLC', 'Games', 'Life', 
	'Literature', 'Media', 'Misc', 'Mod', 'Monika', 'Philosophy', 
	'Psychology', 'Romance', 'School', 'Society', 'Technology', 
	'Trivia', 'Writing', 'You'
];

/**
 * Converts a HTML string into an element.
 * 
 * @param {String} html HTML string to convert.
 * @returns {HTMLElement} Generated element.
 */
function htmlToEl(html) {
	let template = document.createElement('template');
    html = html.trim(); // Never return a text node of whitespace as the result
	template.innerHTML = html;

    return template.content.firstChild;
}

function clean(str, space) {
	let ret = str.replace(/[^\w\s]|_/g, "");
	ret = space ? ret : ret.replace(/ /g, "_");

	return str.toLowerCase();
}

function addCategory() {
	let dropper = htmlToEl('<div class="field is-grouped pad-bottom"><div class="control"><span class="select"><select></select></span></div></div>'); // Create bare. dropdown element tree.
	let deleteButton = htmlToEl('<div class="control"><button class="button is-danger"><span class="icon is-small"><i class="fas fa-times"></i></span></button></div>'); // Generate the delete button.
	let select = dropper.firstChild.firstChild.firstChild; // Get a reference to the `<select>` element.

	categories.forEach(el => {
		let cat = document.createElement('option');
		cat.innerHTML = el;

		cat.setAttribute('value', clean(el, true));
		select.appendChild(cat);
	});

	deleteButton.setAttribute('onclick', 'removeEl(this, "categories")');
	dropper.appendChild(deleteButton); // Add the remove button to the tree.
	document.getElementById('categories').appendChild(dropper);
}

function addDialogue() {
	// Generate base field, and generate buttons separately.
	let field = htmlToEl('<div class="field is-grouped pad-bottom"><span class="control is-expanded"><input type="text" class="input" placeholder="An example line of dialogue."></span></div>');
	let poseButton = htmlToEl('<span class="control"><button class="button is-primary">Pose</button></span>');
	let faceButton = htmlToEl('<span class="control"><button class="button is-primary">Face</button></span>');
	let deleteButton = htmlToEl('<span class="control"><button class="button is-danger"><span class="icon"><i class="fas fa-times"></i></span></button></span>');

	// poseButton.setAttribute('onclick', 'selectPose(this)');
	// faceButton.setAttribute('onclick', 'selectFace(this)');
	deleteButton.setAttribute('onclick', 'removeEl(this, "dialogue")');

	field.appendChild(poseButton);
	field.appendChild(faceButton);
	field.appendChild(deleteButton);
	document.getElementById('dialogue').appendChild(field);
}

function removeEl(el, container) {
	document.getElementById(container).removeChild(el.parentElement);
}

function selectPose(el) {}
function selectFace(el) {}

// https://stackoverflow.com/questions/4941004/putting-images-with-options-in-a-dropdown-list
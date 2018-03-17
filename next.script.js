const categories = [
    'Advice', 'Club', 'Club Members', 'DDLC', 'Games', 'Life', 
	'Literature', 'Media', 'Misc', 'Mod', 'Monika', 'Philosophy', 
	'Psychology', 'Romance', 'School', 'Society', 'Technology', 
	'Trivia', 'Writing', 'You'
];

document.getElementById('image-deselect').setAttribute('onclick', 'closeSelectors()');

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
	let deleteButton = htmlToEl('<div class="control"><button class="button is-danger" title="Remove dialogue"><span class="icon is-small"><i class="fas fa-times"></i></span></button></div>'); // Generate the delete button.
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
	let poseButton = htmlToEl('<span class="control"><button class="button is-primary" title="Pose"><span class="icon is-small"><i class="fas fa-child"></i></span></button></span>');
	let faceButton = htmlToEl('<span class="control"><button class="button is-primary" title="Face"><span class="icon is-small"><i class="fas fa-smile"></i></span></button></span>');
	let deleteButton = htmlToEl('<span class="control"><button class="button is-danger" title="Remove dialogue"><span class="icon"><i class="fas fa-times"></i></span></button></span>');

	let faceSelect = createSelector('face', 18, 'selected-face');
	let poseSelect = createSelector('pose', 5, 'selected-pose');

	// Add click events for opeening image selectors, and create the selectors.
	poseButton.setAttribute('onclick', 'openSelector(this)');
	poseButton.appendChild(poseSelect);

	faceButton.setAttribute('onclick', 'openSelector(this)');
	faceButton.appendChild(faceSelect);

	deleteButton.setAttribute('onclick', 'removeEl(this, "dialogue")');

	// Append buttons to field, and then add the field to the page.
	field.appendChild(poseButton);
	field.appendChild(faceButton);
	field.appendChild(deleteButton);

	document.getElementById('dialogue').appendChild(field);

	// Select initial values.
	selectItem(faceSelect.firstChild, 'selected-face');
	selectItem(poseSelect.firstChild, 'selected-pose');
}

function createSelector(imgStart, range, attr) {
	// Create initial container.
	let selector = htmlToEl('<div class="image-selector"></div>');

	// Generate images and add to container.
	for (let i = 0; i < range; i++) {
		let n = i.toString().length === 1 ? `0${1}` : i;
		let img = htmlToEl(`<img src="assets/${imgStart}${n}.png">`);

		img.setAttribute('onclick', `selectItem(this, "${attr}")`);
		img.setAttribute('num', i.toString());
		selector.appendChild(img);
	}

	return selector;
}

function selectItem(el, attr) {
	el.parentElement.childNodes.forEach(e => e.classList.remove('highlighted'));
	el.classList.add('highlighted');
	el.parentElement.parentElement.parentElement.setAttribute(attr, el.getAttribute('num'));
}

function openSelector(el) {
	let children = Array.from(el.childNodes).filter(el => el.classList.contains('image-selector'));

	if (!children.length) return;

	children[0].classList.add('open');
	document.getElementById('image-deselect').classList.add('open');
}

function closeSelectors() {
	document.querySelectorAll('.image-selector.open').forEach(el => el.classList.remove('open'));
	document.getElementById('image-deselect').classList.remove('open');
}

function removeEl(el, container) {
	document.getElementById(container).removeChild(el.parentElement);
}

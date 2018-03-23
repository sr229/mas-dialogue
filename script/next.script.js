const categories = [
    'Advice', 'Club', 'Club Members', 'DDLC', 'Games', 'Life', 
	'Literature', 'Media', 'Misc', 'Mod', 'Monika', 'Philosophy', 
	'Psychology', 'Romance', 'School', 'Society', 'Technology', 
	'Trivia', 'Writing', 'You'
];
const codeTemplate = `
init 5 python:
	addEvent(Event(persistent.event_database, eventlabel="{{label}}", category=[{{categories}}], prompt="{{prompt}}"{{specialOption}}))

label {{label}}:
{{dialogue}}
    return
`.trim();

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
	let deleteButton = htmlToEl('<div class="control"><button class="button is-danger" title="Remove category"><span class="icon is-small"><i class="fas fa-times"></i></span></button></div>'); // Generate the delete button.
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
		let n = i.toString().length === 1 ? `0${i}` : i;
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

function checkValues() {
	let isErrored = false; // Lets us know whether to continue and generate the code at the end of checking.

	let label = document.getElementById('diag-label');
	let labelError = document.getElementById('label-error');

	let prompt = document.getElementById('diag-prompt');
	let promptError = document.getElementById('prompt-error');

	let categories = document.getElementById('categories');
	let categoriesError = document.getElementById('categories-error');

	let dialogue = document.getElementById('dialogue');
	let dialogueError = document.getElementById('dialogue-error');
	let dialogueError2 = document.getElementById('dialogue-error-2');

	if (!label.value) {
		isErrored = true;

		label.classList.add('is-danger');
		labelError.classList.remove('hidden');
	} else {
		label.classList.remove('is-danger');
		labelError.classList.add('hidden');
	}

	if (!prompt.value) {
		isErrored = true;

		prompt.classList.add('is-danger');
		promptError.classList.remove('hidden');
	} else {
		prompt.classList.remove('is-danger');
		promptError.classList.add('hidden');
	}

	if (!categories.childNodes.length) {
		isErrored = true;
		categoriesError.classList.remove('hidden');
	} else categoriesError.classList.add('hidden');

	if (!dialogue.childNodes.length) {
		isErrored = true;
		dialogueError.classList.remove('hidden');
	} else dialogueError.classList.add('hidden');

	if (Array.from(dialogue.childNodes).filter(c => c.firstChild.firstChild.value).length !== dialogue.childNodes.length) {
		isErrored = true;
		dialogueError2.classList.remove('hidden');
	} else dialogueError2.classList.add('hidden');

	if (!isErrored) generateCode();
}

function generateCode() {
	// Get or create panel element.
	let panel = document.getElementById('generated-code') || htmlToEl('<div class="panel" id="generated-code"><p class="panel-heading">Output</p><div class="panel-block"><pre><code class="language-renpy line-numbers" id="code"></code></pre></div></div>');
	let codeEl = panel.querySelector('#code');

	let label = `monika_${clean(document.getElementById('diag-label').value, false)}`;
	let prompt = document.getElementById('diag-prompt').value;
	let categories = 
	Array.from(document.getElementById('categories').childNodes).map(v => v.firstChild.firstChild.firstChild.value); // The firstChild bullshit is on Bulma.
	categories = categories.map(v => `"${v}"`).join(', ');
	let specialOption = document.querySelector('input[type="radio"][name="diag-options"]:checked').value;
	let dialogue = Array.from(document.getElementById('dialogue').childNodes).map(c => [c.firstChild.firstChild.value, c.getAttribute('selected-face'), c.getAttribute('selected-pose')]); // Likewise here.
	dialogue = dialogue.map(d => `    m ${Number(d[2]) + 1}${'abcdefghijklmnopqr'[d[1]]} "${d[0]}"`).join('\n'); // Convert raw dialogue values into the proper string.
	specialOption = specialOption !== 'none' ? `, ${specialOption}=true` : '';

	let code = codeTemplate.replace(/{{(label|categories|prompt|specialOption|label|dialogue)}}/g, (_, v) => {
		switch (v) {
			case 'label':
				return label;
			case 'categories':
				return categories;
			case 'prompt':
				return prompt;
			case 'specialOption':
				return specialOption;
			case 'label':
				return label;
			case 'dialogue':
				return dialogue;
		}
	});

	codeEl.innerHTML = code;
	Prism.highlightElement(codeEl);

	if (!document.getElementById('generated-code')) document.body.insertBefore(panel, document.getElementsByClassName('footer')[0]);
}

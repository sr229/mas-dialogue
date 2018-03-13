var word = { 1:"pose", 2:"face" };
var poseHash = { 0:"1", 1:"2", 2:"3", 3:"4", 4:"5"};
var faceHash = { 
	0:"a", 1:"b", 2:"c", 3:"d", 4:"e", 5:"f", 6:"g", 
	7:"h", 8:"i", 9:"j", 10:"k", 11:"l", 12:"m", 
	13:"n", 14:"o", 15:"p", 16:"q", 17:"r" 
};
var availableCategories = [ 
	'Advice', 'Club', 'Club Members', 'Ddlc', 'Games', 'Life', 
	'Literature', 'Media', 'Misc', 'Mod', 'Monika', 'Philosophy', 
	'Psychology', 'Romance', 'School', 'Society', 'Technology', 
	'Trivia', 'Writing', 'You' 
];

function process()
{
	var label = "monika_" + 
		clean(document.getElementById("label").value, false);
		
	var labelText = "eventlabel=\"" + label + "\",";
		
	var categoryText = "";
	var categoryTable = document.getElementById("category-table");
	for (var i = 0; i < categoryTable.rows.length; i++) {
		var raw = categoryTable.rows[i].cells[0].childNodes[0];
		var choice = raw.options[raw.selectedIndex].value;
		categoryText = categoryText + "\'" + choice + "\',";
	}
	categoryText = categoryText.slice(0, -1);
	categoryText = "category=[" + categoryText + "],";
	
	var promptText = "prompt=\"" + 
		document.getElementById("prompt").value + 
		"\",";
	
	var randomText = "";
	if (document.getElementById("random-true").checked) {
		var randomText = "random=True,";
	}
	
	var poolText = "";
	if (document.getElementById("pool-true").checked) {
		var poolText = "pool=True,";
	} 
	
	var argumentText = (
		"persistent.event_database," + labelText + 
		categoryText + promptText + randomText + poolText
		).slice(0, -1);
	
	var lines = [];
	var dialogueTable = document.getElementById("dialogue-table");
	for (var i = 0; i < dialogueTable.rows.length; i++) {
		var tempTable = dialogueTable.rows[i].cells[0].childNodes[0];
		var box = tempTable.rows[0].cells[0].childNodes[0];
		var pf = makeFPString(
			box.getAttribute("data-num-1"), 
			box.getAttribute("data-num-2")
		);
		lines.push("m " + pf + "\"" + box.value + "\"");
	}
	var linesText = "";
	lines.forEach(function(element) {
		linesText = linesText + tab(1) + element;
	});
	
	var finalText = "" +
		"init 5 python:" + tab(1) + "addEvent(" + "Event(" + 
		argumentText + ")" + ")" + tab(0) +
		tab(0) + "label " + label + ":" + linesText + tab(1) + "return\n";
	
	document.getElementById("formatted-text").innerHTML = finalText;
}

function makeFPString(poseIndex, faceIndex) 
{
	var poseString = (poseIndex==null) ? "" : poseHash[poseIndex];
	var faceString = (faceIndex==null) ? "" : faceHash[faceIndex];
	var space = (poseIndex==null && faceIndex==null) ? "" : " ";
	return poseString + faceString + space;
}

function addRow(table, cells) 
{
    var tableRow = document.createElement("tr");
    var tableData = [];
    for (var i = 0; i < cells.length; i++) {
		tableData.push(document.createElement("td"));
		tableData[i].appendChild(cells[i]);
		tableRow.appendChild(tableData[i]);
	}
    table.appendChild(tableRow);
}

function addCategory() {
	var cells = [];
    var dropBox = document.createElement("select");

    availableCategories.forEach(function(element) {
		var option = document.createElement("option");
		option.setAttribute("value", clean(element, true));
		option.innerHTML = element;
		dropBox.appendChild(option);
	});
    cells.push(dropBox);
    
    var cancelButton = document.createElement("button");
    cancelButton.innerHTML = "X";
    cancelButton.setAttribute("onclick", "removeRow(this, 2)");
    cells.push(cancelButton);
    
    addRow(document.getElementById("category-table"), cells);
}

function addDialogue()
{
	var container = document.getElementById("dialogue-table");
	var innerTable = document.createElement("table");
	
	var numPosePicsInRow = 3;
	var numFacePicsInRow = 3;
	
	addRow(innerTable, makeFirstLine());
	addRow(innerTable, 
		[makePictureTable(
			1, numPosePicsInRow, Object.keys(poseHash).length
		)]
	);
	addRow(innerTable, 
		[makePictureTable(
			2, numFacePicsInRow, Object.keys(faceHash).length
		)]
	);
	addRow(container, [innerTable]);
	
	toggleVisibility(innerTable.rows[1]);
	toggleVisibility(innerTable.rows[2]);
}

function makeFirstLine() {
	var firstLine = [];
	
    var textBox = document.createElement("input");
    textBox.setAttribute("type", "text");
    textBox.setAttribute("placeholder", "An example line of dialogue.");
    firstLine.push(textBox);
    
    var poseButton = document.createElement("button");
    poseButton.innerHTML = "Pick Pose";
    poseButton.setAttribute("onclick", "togglePicTable(this, 1, 3)");
    firstLine.push(poseButton);
    
    var faceButton = document.createElement("button");
    faceButton.innerHTML = "Pick Face";
    faceButton.setAttribute("onclick", "togglePicTable(this, 2, 3)");
    firstLine.push(faceButton);
    
    var cancelButton = document.createElement("button");
    cancelButton.innerHTML = "X";
    cancelButton.setAttribute("onclick", "removeRow(this, 5)");
    firstLine.push(cancelButton);
    
    return firstLine;
}

function makePictureTable(tableType, numPicsInRow, numPics) 
{
	var table = document.createElement("table");
	table.setAttribute("id", tableType + "-table");
	
	for (var i = 0; i < numPics; i++) {
		if (i%numPicsInRow == 0) {
			var temp = [];
		}
		var path = "" + 
			"assets/" + word[tableType] + ("00" + i).slice(-2) + ".png";
		var alt = "Monika " + word[tableType] + i;
		temp.push(makeImageButton(path, alt, tableType, i));
		if (i%numPicsInRow == (numPicsInRow-1)) {
			addRow(table, temp);
		}
	}
	if (numPics%numPicsInRow != 0) {
		addRow(table, temp);
	}
	
	return table;
}

function makeImageButton(path, flavor, tableType, picIndex)
{
	var pic = document.createElement("img");
	pic.setAttribute("src", path);
	pic.setAttribute("alt", flavor);
	
	var button = document.createElement("button");
	button.setAttribute("onclick", 
		"updateExpression(this, " + tableType + ", " + picIndex + ")");
	button.appendChild(pic);
	return button;
}

function updateExpression(ref, tableType, picIndex)
{
	var textBox = getAncestor(ref, 6).rows[0].cells[0].childNodes[0];
	textBox.setAttribute("data-num-" + tableType, picIndex);
	togglePicTable(ref, tableType, 6);
}

function togglePicTable(item, tableType, n) 
{
	var table = getAncestor(item, n);
	toggleVisibility(table.rows[tableType]);
}

function toggleVisibility(item) {
	var isVisible = (item.style.display === "none") ? "block" : "none";
	item.style.display = isVisible;
}

function removeRow(item, n) 
{
	var toBeRemoved = getAncestor(item, n);
	toBeRemoved.parentNode.removeChild(toBeRemoved);
}

function getAncestor(item, n)
{
	for (var i = 0; i < n; i++) {
		item = item.parentElement;
	}
	return item;
}

function clean(str, space)
{
	str = str.replace(/[^\w\s]|_/g, "")
	str = space ? str : str.replace(/ /g, "_");
	return str.toLowerCase();
}

function tab(n)
{
	return "\n" + Array(n+1).join("    ");
}

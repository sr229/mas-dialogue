function process()
{
	var label = "monika_" + 
		clean(document.getElementById("label").value);
		
	var labelText = "\"" + label + "\",";
	
	var promptText = "prompt=\"" + 
		document.getElementById("prompt").value + 
		"\",";
		
	var categoryText = "";
	var categoryTable = document.getElementById("category_table");
	for (var i = 0; i < categoryTable.rows.length; i++) {
		var raw = categoryTable.rows[i].cells[0].childNodes[0].value;
		categoryText = categoryText + "\"" + clean(raw) + "\",";
	}
	categoryText = categoryText.slice(0, -1);
	categoryText = "category=[" + categoryText + "],";
	
	var randomText = "";
	if (!document.getElementById("random_true").checked) {
		var randomText = "random=False,";
	}
	
	var poolText = "";
	if (document.getElementById("pool_true").checked) {
		var poolText = "pool=True,";
	} 
	
	var argumentText = (
		"persistent.event_database," + labelText + 
		promptText + categoryText + randomText + poolText
		).slice(0, -1);
	
	var lines = [];
	var dialogueTable = document.getElementById("dialogue_table");
	for (var i = 0; i < dialogueTable.rows.length; i++) {
		var raw = dialogueTable.rows[i].cells[0].childNodes[0].value;
		lines.push("m \"" + raw + "\"");
	}
	var linesText = "";
	lines.forEach(function(element) {
		linesText = linesText + tab(1) + element;
	});
	
	var finalText = "" +
		"init 5 python:" + tab(1) + "addEvent(" + "Event(" + 
		argumentText + ")" + ")" + tab(0) +
		tab(0) + "label " + label + ":" + linesText + tab(1) + "return";
	
	document.getElementById("formatted_text").innerHTML = finalText;
}

function addCategory() {
	var cells = [];
    
    var textBox = document.createElement("input");
    textBox.setAttribute("type", "text");
    textBox.setAttribute("placeholder", "Decorations");
    cells.push(textBox);
    
    var cancelButton = document.createElement("button");
    cancelButton.innerHTML = "X";
    cancelButton.setAttribute("onclick", "removeLine(this)");
    cells.push(cancelButton);
    
    addRow("category_table", cells);
}

function addDialogue() {
	var cells = [];
	
    var textBox = document.createElement("input");
    textBox.setAttribute("type", "text");
    textBox.setAttribute("placeholder", "This is an example line of dialogue.");
    cells.push(textBox);
    
    var cancelButton = document.createElement("button");
    cancelButton.innerHTML = "X";
    cancelButton.setAttribute("onclick", "removeLine(this)");
    cells.push(cancelButton);
    
    addRow("dialogue_table", cells);
}

function addRow(tableID, cells) 
{
    var tableRow = document.createElement("tr");
    var tableData = [];
    for (var i = 0; i < cells.length; i++) {
		tableData.push(document.createElement("td"));
		tableData[i].appendChild(cells[i]);
		tableRow.appendChild(tableData[i]);
	}
    document.getElementById(tableID).appendChild(tableRow);
}

function removeLine(x) 
{
	var r = x.parentElement.parentElement;
	r.parentNode.removeChild(r);
}

function clean(str)
{
	return str.replace(/[^\w\s]|_/g, "").toLowerCase().replace(/ /g, "_");
}

function tab(n)
{
	return "\n" + Array(n+1).join("    ");
}

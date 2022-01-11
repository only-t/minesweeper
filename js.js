function getGameArea() {
	return document.getElementById("game_area");
}

function generateBombs(bombs) {
	while (bombs > 0) {
		for (var j = 0, row; row = getGameArea().rows[j]; j++) {
			for (var x = 0, cell; cell = row.cells[x]; x++) {
				if (Math.random() > 0.95 && cell.hasBomb == false && bombs > 0) {
					bombs--;
					cell["hasBomb"] = true;
				}
			}
		}
	}
}

function generateFlags(bombs) {
	var flags = document.getElementById("flags");
	
	flags.innerHTML = bombs;
}

function startTime() {
	var time = document.getElementById("time");
	var min = 0;
	var sec = 0;
	
	time.innerHTML = "0:0";
	
	var counter = function() {
		sec++;
		
		if (sec >= 60) {
			min++;
			sec = 0;
		}
		
		time.innerHTML = min + ":" + sec;
	}

	timer = setInterval(counter, 1000);
}

function restartTime() {
	if (window.timer !== undefined) {
		clearInterval(timer);
	}
	
	document.getElementById("time").innerHTML = "0:0";
	
	startTime();
}

function stopTime() {
	clearInterval(timer);
}

function reload(width, height, bombs) {
	var game_area = document.getElementById("game_area");
	game_area.innerHTML = "";

	for (var i = 1; i <= height; i++) {
		var row = game_area.insertRow();

		for (var j = 1; j <= width; j++) {
			var cell = row.insertCell();

			cell["hasBomb"] = false;
			cell["squareNumber"] = cell.cellIndex + 1 + width*cell.parentNode.rowIndex;
			cell["isFlagged"] = false;
			
			cell.innerHTML = "<button onclick='checkBox(this.parentElement)' oncontextmenu='spawnFlag(this.parentElement); return false;'></button>";
		}
	}
	
	generateBombs(bombs);
	restartTime();
	generateFlags(bombs);
}

window.onload = function() {
	reload(8, 8, 10);
}

function changeDifficulty(difficulty) {
	var width = 8;
	var height = 8;
	var bombs = 10;

	switch (difficulty) {
		case "easy":
			var width = 8;
			var height = 8;
			var bombs = 10;
			
			break;
		case "normal":
			var width = 16;
			var height = 16;
			var bombs = 40;
	
			break;
		case "hard":
			var width = 30;
			var height = 16;
			var bombs = 99;
	
			break;
		default:
			var width = 8;
			var height = 8;
			var bombs = 10;
			
			break;
	}

	reload(width, height, bombs);
}

function enableRestart() {
	document.getElementById("restart").removeAttribute("disabled");
}

function disableGameArea() {
	for (var j = 0, row; row = getGameArea().rows[j]; j++) {
		for (var x = 0, cell; cell = row.cells[x]; x++) {
			cell.firstChild.setAttribute("disabled", true);
		}
	}
}

function disableRestart() {
	document.getElementById("restart").setAttribute("disabled", true);
}

function restart() {
	changeDifficulty(document.getElementById("difficulty").value);
	
	restartTime();
	
	disableRestart();
}

function revealBombs(winning_reveal) {
	var game_area = getGameArea();
	
	for (var j = 0, row; row = getGameArea().rows[j]; j++) {
		for (var x = 0, cell; cell = row.cells[x]; x++) {
			if (cell.hasBomb == true) {
				cell.firstChild.innerHTML = "<img src='bomb.png' alt='Bomb' width='14' height='17'>";

				if (winning_reveal) {
					cell.firstChild.style.backgroundColor = "lightgreen";
				} else {
					cell.firstChild.style.backgroundColor = "red";
				}
			}
		}
	}
}

function countNumber(box) {
	var box_index = box.cellIndex;
	var row_index = box.parentNode.rowIndex;
	var game_area = getGameArea();
	
	var bombs = 0;
	
	for (var i = -1; i <= 1; i++) {
		for (var j = -1; j <= 1; j++) {
			if (row_index + i >= 0 && row_index + i <= game_area.rows.length - 1 && box_index + j >= 0 && box_index + j <= game_area.rows[0].cells.length - 1) {
				var boxToCheck = game_area.rows[row_index + i].cells[box_index + j];
				
				if (boxToCheck.hasBomb) {
					bombs++;
				}
			}
		}
	}
	
	if (bombs == 0) {
		for (var i = -1; i <= 1; i++) {
			for (var j = -1; j <= 1; j++) {
				if (row_index + i >= 0 && row_index + i <= game_area.rows.length - 1 && box_index + j >= 0 && box_index + j <= game_area.rows[0].cells.length - 1) {
					var boxToCheck = game_area.rows[row_index + i].cells[box_index + j];
					
					if (boxToCheck.firstChild.hasAttribute("disabled") == false && boxToCheck.isFlagged == false) {
						boxToCheck.firstChild.innerHTML = "";
						boxToCheck.firstChild.setAttribute("disabled", true);
						
						boxToCheck.firstChild.innerHTML = countNumber(boxToCheck);
					}
				}
			}
		}

		return "";
	}
	
	return bombs;
}

function revealBox(box) {
	var button = box.firstChild;
	
	button.setAttribute("disabled", true);
	button.innerHTML = countNumber(box);
}

function checkIfWin() {
	var game_area = getGameArea();
	var bombsExist = false

	for (var j = 0, row; row = game_area.rows[j]; j++) {
		for (var x = 0, cell; cell = row.cells[x]; x++) {
			if (cell.hasBomb && !cell.isFlagged) {
				bombsExist = true
			}
		}
	}

	if (!bombsExist) {
		alert("You Win!")

		enableRestart();
		disableGameArea();
		stopTime();
		
		revealBombs(true);

		for (var j = 0, row; row = game_area.rows[j]; j++) {
			for (var x = 0, cell; cell = row.cells[x]; x++) {
				if (!cell.hasAttribute("disabled") && !cell.hasBomb) {
					revealBox(cell)
				}
			}
		}
	}
}

function checkBox(box) {
	if (box.isFlagged) {
		return;
	}
	
	if (box.hasBomb) {
		alert("Boooom! You lost!");
		
		enableRestart();
		disableGameArea();
		stopTime();
		
		revealBombs(false);
	} else {
		revealBox(box);
	}
}

function Flag(box) {
	box.firstChild.innerHTML = "<img src='flag.png' alt='Flag' width='14' height='17'>";
	box.isFlagged = true;
	
	var flags = document.getElementById("flags").innerHTML;
	
	flags--;
	document.getElementById("flags").innerHTML = flags;

	if (box.hasBomb) {
		checkIfWin()
	}
}
function Unflag(box) {
	box.firstChild.innerHTML = "";
	box.isFlagged = false;
	
	var flags = document.getElementById("flags").innerHTML;
	
	flags++;
	
	document.getElementById("flags").innerHTML = flags;
}

function spawnFlag(box) {
	if (box.isFlagged) {
		Unflag(box);
	} else if (document.getElementById("flags").innerHTML > 0) {
		Flag(box);
	}
}
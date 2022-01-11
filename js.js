function getPoleGry() {
	return document.getElementById("pole_gry");
}

function generateBombs(iloscBomb) {
	while (iloscBomb > 0) {
		for (var j = 0, row; row = getPoleGry().rows[j]; j++) {
			for (var x = 0, cell; cell = row.cells[x]; x++) {
				if (Math.random() > 0.95 && cell.hasBomb == false && iloscBomb > 0) {
					iloscBomb--;
					cell["hasBomb"] = true;
				}
			}
		}
	}
}

function generateFlags(bomby) {
	var iloscFlag = document.getElementById("flagi");
	
	iloscFlag.innerHTML = bomby;
}

function startCzas() {
	var zegar = document.getElementById("czas");
	var min = 0;
	var sek = 0;
	
	zegar.innerHTML = "0:0";
	
	var liczenieCzasu = function() {
		sek++;
		
		if (sek >= 60) {
			min++;
			sek = 0;
		}
		
		zegar.innerHTML = min + ":" + sek;
	}

	licznik = setInterval(liczenieCzasu, 1000);
}

function restartCzas() {
	if (window.licznik !== undefined) {
		clearInterval(licznik);
	}
	
	document.getElementById("czas").innerHTML = "0:0";
	
	startCzas();
}

function stopCzas() {
	clearInterval(licznik);
}

function reload(szerokosc, wysokosc, bomby) {
	var pole_gry = document.getElementById("pole_gry");
	pole_gry.innerHTML = "";

	for (var i = 1; i <= wysokosc; i++) {
		var row = pole_gry.insertRow();

		for (var j = 1; j <= szerokosc; j++) {
			var cell = row.insertCell();

			cell["hasBomb"] = false;
			cell["squareNumber"] = cell.cellIndex + 1 + szerokosc*cell.parentNode.rowIndex;
			cell["isFlagged"] = false;
			
			cell.innerHTML = "<button onclick='sprawdzPole(this.parentElement)' oncontextmenu='postawFlage(this.parentElement); return false;'></button>";
		}
	}
	
	generateBombs(bomby);
	restartCzas();
	generateFlags(bomby);
}

window.onload = function() {
	reload(8, 8, 10);
}

function zmianaTrudnosci(trudnosc) {
	var szerokosc = 8;
	var wysokosc = 8;
	var bomby = 10;

	switch (trudnosc) {
		case "latwy":
			var szerokosc = 8;
			var wysokosc = 8;
			var bomby = 10;
			
			break;
		case "sredni":
			var szerokosc = 16;
			var wysokosc = 16;
			var bomby = 40;
	
			break;
		case "trudny":
			var szerokosc = 30;
			var wysokosc = 16;
			var bomby = 99;
	
			break;
		default:
			var szerokosc = 8;
			var wysokosc = 8;
			var bomby = 10;
			
			break;
	}

	reload(szerokosc, wysokosc, bomby);
}

function wlaczRestart() {
	document.getElementById("restart").removeAttribute("disabled");
}

function wylaczPoleGry() {
	for (var j = 0, row; row = getPoleGry().rows[j]; j++) {
		for (var x = 0, cell; cell = row.cells[x]; x++) {
			cell.firstChild.setAttribute("disabled", true);
		}
	}
}

function wylaczRestart() {
	document.getElementById("restart").setAttribute("disabled", true);
}

function restart() {
	zmianaTrudnosci(document.getElementById("poziom_trudnosci").value);
	
	restartCzas();
	
	wylaczRestart();
}

function odkryjBomby(czy_wygrana) {
	var pole_gry = getPoleGry();
	
	for (var j = 0, row; row = getPoleGry().rows[j]; j++) {
		for (var x = 0, cell; cell = row.cells[x]; x++) {
			if (cell.hasBomb == true) {
				cell.firstChild.innerHTML = "<img src='bomba.png' alt='Bomba' width='14' height='17'>";

				if (czy_wygrana) {
					cell.firstChild.style.backgroundColor = "lightgreen";
				} else {
					cell.firstChild.style.backgroundColor = "red";
				}
			}
		}
	}
}

function policzLiczbe(pole) {
	var index_pola = pole.cellIndex;
	var index_rzedu = pole.parentNode.rowIndex;
	var pole_gry = getPoleGry();
	
	var iloscBomb = 0;
	
	for (var i = -1; i <= 1; i++) {
		for (var j = -1; j <= 1; j++) {
			if (index_rzedu + i >= 0 && index_rzedu + i <= pole_gry.rows.length - 1 && index_pola + j >= 0 && index_pola + j <= pole_gry.rows[0].cells.length - 1) {
				var poleSprawdzajace = pole_gry.rows[index_rzedu + i].cells[index_pola + j];
				
				if (poleSprawdzajace.hasBomb) {
					iloscBomb++;
				}
			}
		}
	}
	
	if (iloscBomb == 0) {
		for (var i = -1; i <= 1; i++) {
			for (var j = -1; j <= 1; j++) {
				if (index_rzedu + i >= 0 && index_rzedu + i <= pole_gry.rows.length - 1 && index_pola + j >= 0 && index_pola + j <= pole_gry.rows[0].cells.length - 1) {
					var poleSprawdzajace = pole_gry.rows[index_rzedu + i].cells[index_pola + j];
					
					if (poleSprawdzajace.firstChild.hasAttribute("disabled") == false && poleSprawdzajace.isFlagged == false) {
						poleSprawdzajace.firstChild.innerHTML = "";
						poleSprawdzajace.firstChild.setAttribute("disabled", true);
						
						poleSprawdzajace.firstChild.innerHTML = policzLiczbe(poleSprawdzajace);
					}
				}
			}
		}

		return "";
	}
	
	return iloscBomb;
}

function odkryjPole(pole) {
	var przycisk = pole.firstChild;
	
	przycisk.setAttribute("disabled", true);
	przycisk.innerHTML = policzLiczbe(pole);
}

function sprawdzCzyWygrana() {
	var pole_gry = getPoleGry();
	var saBomby = false

	for (var j = 0, row; row = pole_gry.rows[j]; j++) {
		for (var x = 0, cell; cell = row.cells[x]; x++) {
			if (cell.hasBomb && !cell.isFlagged) {
				saBomby = true
			}
		}
	}

	if (!saBomby) {
		alert("Wygrałeś!")

		wlaczRestart();
		wylaczPoleGry();
		stopCzas();
		
		odkryjBomby(true);

		for (var j = 0, row; row = pole_gry.rows[j]; j++) {
			for (var x = 0, cell; cell = row.cells[x]; x++) {
				if (!cell.hasAttribute("disabled") && !cell.hasBomb) {
					odkryjPole(cell)
				}
			}
		}
	}
}

function sprawdzPole(pole) {
	if (pole.isFlagged) {
		return;
	}
	
	if (pole.hasBomb) {
		alert("Booom!");
		
		wlaczRestart();
		wylaczPoleGry();
		stopCzas();
		
		odkryjBomby(false);
	} else {
		odkryjPole(pole);
	}
}

function Flag(pole) {
	pole.firstChild.innerHTML = "<img src='flaga.png' alt='Flaga' width='14' height='17'>";
	pole.isFlagged = true;
	
	var iloscFlag = document.getElementById("flagi").innerHTML;
	
	iloscFlag--;
	document.getElementById("flagi").innerHTML = iloscFlag;

	if (pole.hasBomb) {
		sprawdzCzyWygrana()
	}
}
function Unflag(pole) {
	pole.firstChild.innerHTML = "";
	pole.isFlagged = false;
	
	var iloscFlag = document.getElementById("flagi").innerHTML;
	
	iloscFlag++;
	
	document.getElementById("flagi").innerHTML = iloscFlag;
}

function postawFlage(pole) {
	if (pole.isFlagged) {
		Unflag(pole);
	} else if (document.getElementById("flagi").innerHTML > 0) {
		Flag(pole);
	}
}
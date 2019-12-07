class Timer {
	ontick(func){ func(); }
	constructor(func, delay){
		this.func = func;
		this.delay = delay;
		this.interval = setInterval(this.ontick, delay, this.func)
	}
	stop(){ clearInterval(this.interval); }
	changeInterval(newInterval){
		this.stop();
		this.interval = setInterval(this.ontick, newInterval, this.func);
		this.delay = newInterval;
	}
}

function loadData() {
	return JSON.parse(window.localStorage.getItem("saved data"));
}

if (loadData() == null) {
	var energy = 0;
	var toUpgrTick = 4;
	var toUpgrInc = 4;
	var upgVal = 2;
	var incVal = 1;
	var tickspeed = 1000;
	var autosave = false;
}
else {
	var data = loadData()
	var energy = data["energy"];
	var toUpgrTick = data["toUpgrTick"];
	var toUpgrInc = data["toUpgrInc"];
	var upgVal = data["upgVal"];
	var incVal = data["incVal"];
	var tickspeed = data["tickspeed"];
	var autosave = data["autosave"];
}
var tabs = ["main tab", "particle conversion", "options"];

function ToggleAutoSave() {
	var autosavebut = document.getElementById("autosave");
	if (autosavebut.innerHTML == "Enable autosave") {
		autosavebut.innerHTML = "Disable autosave";
		autosavebut.className = "BetterButton red";
		autosave = true;
	}
	else {
		autosavebut.innerHTML = "Enable autosave";
		autosavebut.className = "BetterButton green";
		autosave = false;
	}
}

function saveData() {
	var save = {
		energy: energy,
		toUpgrTick: toUpgrTick,
		toUpgrInc: toUpgrInc,
		upgVal: upgVal,
		incVal: incVal,
		tickspeed: tickspeed,
		autosave: autosave,
	}
	window.localStorage.setItem("saved data", JSON.stringify(save));
}

function hardReset(){
	energy = 0;
	toUpgrTick = 4;
	toUpgrInc = 4;
	upgVal = 2;
	incVal = 1;
	tickspeed = 1000;
}

var autosaveInterval = (autosave) ? setInterval(saveData, 1000):null;

function incEnergy(){
	energy += 0.01 * incVal * (1000 / tickspeed);
	energy = Number.parseFloat(Number(energy).toFixed(5));
	if (!isFinite(energy)){
		energy = 0;
	}
}


function changeTab(tabName){
	tabs.forEach(tab => document.getElementById(tab).hidden = true)
	document.getElementById(tabName).hidden = false;
}

function UpdateIncText(){
	document.getElementById("increment value").innerHTML = "You get " + incVal + " eV/tick";
	document.getElementById("tickspeed").innerHTML = "Tickspeed: " + 1 / (tickspeed / 1000) + " times/sec";
}

function incUpgr(){
	if (energy >= toUpgrInc){
		incVal *= upgVal;
		energy -= toUpgrInc;
		toUpgrInc *= 4;
	}
}

function loop(){
	document.getElementById("energy").innerHTML = "You have " + Number.parseInt(energy) + " eV";
	document.getElementById("upgInc").className = (energy >= toUpgrInc) ? "BetterButton green" : "BetterButton red";
	document.getElementById("upgTick").className = (energy >= toUpgrTick) ? "BetterButton green" : "BetterButton red";
	var upgTickName = (energy < toUpgrTick) ? "Get " + toUpgrTick + " eV to upgrade tickspeed":"Upgrade tickspeed";
	var upgIncName = (energy < toUpgrInc) ? "Get " + toUpgrInc + " eV to upgrade incrementation":"Upgrade incrementation";
	document.getElementById("upgInc").innerHTML = upgIncName;
	document.getElementById("upgTick").innerHTML = upgTickName;
	UpdateIncText();
	if (autosave && autosaveInterval === null){
		autosaveInterval = setInterval(saveData, 1000);
	} else if (!autosave && autosaveInterval != null) {
		clearInterval(autosaveInterval);
	}
	if ((autosave && document.getElementById("autosave").innerHTML == "Enable autosave") || (!autosave && document.getElementById("autosave").innerHTML == "Disable autosave")){
		ToggleAutoSave();
	}
}

setInterval(loop, 20)
var inc_timer = new Timer(incEnergy, 10)

function tickUpgr(){
	if (energy >= toUpgrTick){
		tickspeed -= tickspeed * 0.11;
		energy -= toUpgrTick;
		toUpgrTick *= 4;
	}
}

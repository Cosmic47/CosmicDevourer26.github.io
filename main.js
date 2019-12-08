class Timer {
	constructor(func, delay){
		this.func = func;
		this.delay = delay;
		this.interval = setInterval(this.func, delay)
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
	var resources = {
		down_quarks: 0,
		up_quarks: 0,
		electrons: 0,
		proton: 0,
		neutron: 0,
	}
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
	var resources = data["resources"];
}
var tabs = ["main tab", "particle conversion", "options"];
var resource_one_buttons = {
	"down_quarks": "buy-one-down-quark", 
	"up_quarks": "buy-one-up-quark",
	"electrons": "buy-one-electron"};
var resource_max_buttons = {
	"down_quarks": "buy-max-down-quarks", 
	"up_quarks": "buy-max-up-quarks",
	"electrons": "buy-max-electrons"};
var resources_list = ["down_quarks", "up_quarks", "electrons"]
var prices_for_elementary_particles = {
	"down_quarks": 2300000, 
	"up_quarks": 4720000, 
	"electrons": 500000,}

function buyParticle(particle_name, buyMax){
	if (energy >= prices_for_elementary_particles[particle_name]){
		if(!buyMax){
			energy -= prices_for_elementary_particles[particle_name];
			resources[particle_name] += 1;
		}
		else {
			var bought = Math.floor(energy / prices_for_elementary_particles[particle_name]);
			energy -= bought * prices_for_elementary_particles[particle_name];
			resources[particle_name] += bought;
		}
	}
}

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
		resources: resources,
	}
	window.localStorage.setItem("saved data", JSON.stringify(save));
}

function hardReset(){
	window.localStorage.clear();
	window.location.reload();
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
	document.getElementById("energy").innerHTML = "You have " + Math.floor(energy) + " eV";
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
	for(var resource of resources_list){
		document.getElementById(resource).innerHTML = "(" + resources[resource] + ")";
		if(energy >= prices_for_elementary_particles[resource]){
			
			document.getElementById(resource_one_buttons[resource]).className = "BetterButton green";
			document.getElementById(resource_max_buttons[resource]).className = "BetterButton green";
		}
		else {
			document.getElementById(resource_one_buttons[resource]).className = "BetterButton red";
			document.getElementById(resource_max_buttons[resource]).className = "BetterButton red";
		}
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

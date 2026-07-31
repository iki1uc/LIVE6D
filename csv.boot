export async function loadCSV(file){
  const text = await fetch(file).then(r => r.text());
  return text.trim().split("\n").map(r => r.split(","));
}

export async function loadBootModules(){
  const boot = {};

  boot.funktion  = await loadCSV("achse-funktion-3.csv");
  boot.modul     = await loadCSV("achse-modul-12.csv");
  boot.quelle    = await loadCSV("achse-quelle-12.csv");
  boot.kopplung  = await loadCSV("arg-ebene-kopplung-5.csv");
  boot.zweck     = await loadCSV("mechanismus-zweck-4.csv");
  boot.aufgabe   = await loadCSV("modul-aufgabe-4.csv");
  boot.runtime   = await loadCSV("runtime-gr-e-3.csv");
  boot.felder    = await loadCSV("system-felder-3.csv");

  return boot;
}


let data = [];

document.getElementById("upload").addEventListener("change", handleFile);
document.getElementById("search").addEventListener("input", renderTable);
document.getElementById("lineFilter").addEventListener("change", renderTable);
document.getElementById("areaFilter").addEventListener("change", renderTable);

function handleFile(e){

const file = e.target.files[0];
const reader = new FileReader();

reader.onload = function(evt){

const workbook = XLSX.read(evt.target.result,{type:"binary"});
const sheet = workbook.Sheets[workbook.SheetNames[0]];

data = XLSX.utils.sheet_to_json(sheet);

populateFilters();
renderTable();

};

reader.readAsBinaryString(file);

}

function populateFilters(){

const lines = [...new Set(data.map(d=>d.line))];
const areas = [...new Set(data.map(d=>d.area))];

const lineSelect = document.getElementById("lineFilter");
const areaSelect = document.getElementById("areaFilter");

lineSelect.innerHTML='<option value="">Todas las Líneas</option>';
areaSelect.innerHTML='<option value="">Todas las Áreas</option>';

lines.forEach(l=>{
lineSelect.innerHTML+=`<option value="${l}">${l}</option>`;
});

areas.forEach(a=>{
areaSelect.innerHTML+=`<option value="${a}">${a}</option>`;
});

}

function renderTable(){

const search = document.getElementById("search").value.toLowerCase();
const lineFilter = document.getElementById("lineFilter").value;
const areaFilter = document.getElementById("areaFilter").value;

const tbody = document.getElementById("tableBody");
tbody.innerHTML="";

let ipCount={};
let f112Used=0;
let f113Used=0;
let f111Used=0;

let filtered=data.filter(row=>{

return(

(!lineFilter || row.line===lineFilter) &&
(!areaFilter || row.area===areaFilter) &&
Object.values(row).join(" ").toLowerCase().includes(search)

);

});

filtered.forEach(row=>{

if(row.switch==="F111") f111Used++;
if(row.switch==="F112") f112Used++;
if(row.switch==="F113") f113Used++;

ipCount[row.ip]=(ipCount[row.ip]||0)+1;

});

filtered.forEach(row=>{

const tr=document.createElement("tr");

if(ipCount[row.ip]>1){
tr.classList.add("duplicate");
}

tr.innerHTML=`

<td>${row.line}</td>
<td>${row.area}</td>
<td>${row.nodo}</td>
<td>${row.switch}</td>
<td>${row.puerto}</td>
<td>${row.ip}</td>
<td>${row.equipo}</td>
<td>${row.dominio}</td>
<td>${row.mac}</td>
<td>${row.estacion}</td>

`;

tbody.appendChild(tr);

});

document.getElementById("totalNodes").innerText=filtered.length;
document.getElementById("f111Used").innerText=f111Used;
document.getElementById("f112Used").innerText=f112Used;
document.getElementById("f113Used").innerText=f113Used;

document.getElementById("duplicateIPs").innerText=
Object.values(ipCount).filter(v=>v>1).length;

}

let zoom = 1;

function zoomIn(){

if(zoom < 4){

zoom += 0.2;

document.getElementById("plantMap").style.transform =
`scale(${zoom})`;

}

}

function zoomOut(){

if(zoom > 1){

zoom -= 0.2;

document.getElementById("plantMap").style.transform =
`scale(${zoom})`;

}

}

function logout(){

localStorage.removeItem("logged");
window.location.href = "Login.html";

}

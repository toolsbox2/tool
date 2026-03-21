// ===== SIDEBAR =====
function openLeft(){
if(leftMenu){
leftMenu.style.transform="translateX(0)";
overlay.classList.add("show");
}
}

function closeLeft(){
if(leftMenu){
leftMenu.style.transform="translateX(-100%)";
overlay.classList.remove("show");
}
}

function openRight(){
if(rightMenu){
rightMenu.style.transform="translateX(0)";
overlay.classList.add("show");
}
}

function closeRight(){
if(rightMenu){
rightMenu.style.transform="translateX(100%)";
overlay.classList.remove("show");
}
}

// ===== SEARCH =====
const searchInput=document.getElementById("toolSearch");

if(searchInput){
const tools=document.querySelectorAll(".tool");

searchInput.addEventListener("keyup",function(){
let value=this.value.toLowerCase();

tools.forEach(tool=>{
let name=tool.getAttribute("data-name") || "";
tool.style.display=name.includes(value)?"block":"none";
});
});
}

// ================= BACK BUTTON =================
window.onpopstate=function(){
closeLeft();
closeRight();
};


// ===== JPG TO PDF =====

// SAFE LOAD
const input = document.getElementById("imageInput");
const preview = document.getElementById("preview");
const dropArea = document.getElementById("dropArea");
const convertBtn = document.getElementById("convertBtn");

let images = [];

// CLICK
if(dropArea){
dropArea.onclick = ()=> input.click();
}

// SELECT
if(input){
input.addEventListener("change",(e)=>{
preview.innerHTML=""; // 🔥 FIX
images=[];
addImages(e.target.files);
});
}

// ADD IMAGES
function addImages(files){

for(let file of files){

if(!file.type.startsWith("image/")) continue;

images.push(file);

const reader = new FileReader();

reader.onload=(e)=>{

const box = document.createElement("div");
box.className="imgBox";

const img = document.createElement("img");
img.src=e.target.result;

const del = document.createElement("button");
del.className="deleteBtn";
del.innerHTML="✖";

del.onclick=()=>{
box.remove();
images = images.filter(f=>f!==file);
};

box.appendChild(img);
box.appendChild(del);
preview.appendChild(box);

};

reader.readAsDataURL(file);
}
}

// CLEAR
function clearAll(){
images=[];
preview.innerHTML="";
}

// CONVERT
if(convertBtn){
v

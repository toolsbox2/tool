// ================= SIDEBAR =================

function openLeft(){
document.getElementById("leftMenu").style.transform="translateX(0)";
document.getElementById("overlay").classList.add("show");
history.pushState({menu:"left"},"");
}

function closeLeft(){
document.getElementById("leftMenu").style.transform="translateX(-100%)";
document.getElementById("overlay").classList.remove("show");
}

function openRight(){
document.getElementById("rightMenu").style.transform="translateX(0)";
document.getElementById("overlay").classList.add("show");
history.pushState({menu:"right"},"");
}

function closeRight(){
document.getElementById("rightMenu").style.transform="translateX(100%)";
document.getElementById("overlay").classList.remove("show");
}

window.onpopstate=function(){
closeLeft();
closeRight();
};

// ================= BACK BUTTON =================
window.onpopstate=function(){
closeLeft();
closeRight();
};

// ================= SEARCH =================
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

// ================= IMAGE SYSTEM =================

const input = document.getElementById("imageInput");
const preview = document.getElementById("preview");
const dropArea = document.getElementById("dropArea");
const convertBtn = document.getElementById("convertBtn");

let images = [];

// CLICK upload
if(dropArea){
dropArea.addEventListener("click", ()=> input.click());
}

// FILE SELECT (FIXED)
if(input){
input.addEventListener("change", (e)=>{
addImages(e.target.files);
input.value = ""; // IMPORTANT FIX
});
}

// DRAG DROP
if(dropArea){
dropArea.addEventListener("dragover",(e)=>{
e.preventDefault();
dropArea.style.borderColor="#ff5252";
});

dropArea.addEventListener("dragleave",()=>{
dropArea.style.borderColor="#444";
});

dropArea.addEventListener("drop",(e)=>{
e.preventDefault();
addImages(e.dataTransfer.files);
});
}

// ADD IMAGES (MAIN FIX)
function addImages(files){

for(let file of files){

if(!file.type.startsWith("image/")) continue;

images.push(file);

const reader = new FileReader();

reader.onload = function(e){

const div = document.createElement("div");
div.style.position="relative";

const img = document.createElement("img");
img.src = e.target.result;

const del = document.createElement("button");
del.innerHTML="✖";
del.style.position="absolute";
del.style.top="2px";
del.style.right="2px";
del.style.background="red";
del.style.color="white";
del.style.border="none";
del.style.cursor="pointer";

del.onclick = ()=>{
div.remove();
images = images.filter(f => f !== file);
};

div.appendChild(img);
div.appendChild(del);

preview.appendChild(div);

};

reader.readAsDataURL(file);

}

}

// ================= CONVERT =================

if(convertBtn){
convertBtn.addEventListener("click", async ()=>{

if(images.length === 0){
alert("Select images first");
return;
}

const { jsPDF } = window.jspdf;
const pdf = new jsPDF();

for(let i=0;i<images.length;i++){

const imgData = await toBase64(images[i]);

const img = new Image();
img.src = imgData;

await new Promise(res => img.onload = res);

const width = pdf.internal.pageSize.getWidth();
const height = (img.height * width) / img.width;

if(i > 0) pdf.addPage();

pdf.addImage(imgData,"JPEG",0,0,width,height);

}

pdf.save("Hridoy-PDF.pdf");

});
}

// BASE64
function toBase64(file){
return new Promise((resolve,reject)=>{
const reader = new FileReader();
reader.readAsDataURL(file);
reader.onload = ()=> resolve(reader.result);
reader.onerror = err => reject(err);
});
}

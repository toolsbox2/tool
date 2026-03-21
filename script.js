// ===== SAFE ELEMENT LOAD =====
const leftMenu = document.getElementById("leftMenu");
const rightMenu = document.getElementById("rightMenu");
const overlay = document.getElementById("overlay");

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

// overlay click close
if(overlay){
overlay.onclick=()=>{
closeLeft();
closeRight();
};
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

// ===== BACK BUTTON =====
window.onpopstate=function(){
closeLeft();
closeRight();
};

// ===== JPG TO PDF =====
const input = document.getElementById("imageInput");
const preview = document.getElementById("preview");
const dropArea = document.getElementById("dropArea");
const convertBtn = document.getElementById("convertBtn");

let images = [];

// CLICK
if(dropArea){
dropArea.onclick = ()=> input.click();
}

// SELECT MULTIPLE FILE
if(input){
input.addEventListener("change",(e)=>{
addImages(e.target.files);
input.value="";
});
}

// ===== ADD IMAGES =====
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

// DELETE BUTTON
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

// ===== CLEAR =====
function clearAll(){
images=[];
if(preview) preview.innerHTML="";
}

// ===== CONVERT (HIGH QUALITY + A4 + MULTI FILE) =====
if(convertBtn){

convertBtn.onclick = async ()=>{

if(images.length===0){
alert("Select images first");
return;
}

// progress create
let progress = document.createElement("div");
progress.style.marginTop="10px";
progress.innerHTML="⏳ Processing...";
preview.appendChild(progress);

const { jsPDF } = window.jspdf;

// A4 size
const pdf = new jsPDF("p","mm","a4");

for(let i=0;i<images.length;i++){

const imgData = await toBase64(images[i]);

const img = new Image();
img.src = imgData;

await new Promise(res=>img.onload=res);

// A4 width
const pageWidth = 210;
const pageHeight = 297;

// image ratio fit
let ratio = Math.min(pageWidth / img.width, pageHeight / img.height);

let width = img.width * ratio;
let height = img.height * ratio;

let x = (pageWidth - width)/2;
let y = (pageHeight - height)/2;

if(i>0) pdf.addPage();

// HIGH QUALITY
pdf.addImage(imgData,"JPEG",x,y,width,height,undefined,"FAST");

// progress update
progress.innerHTML = `⏳ Processing ${i+1}/${images.length}`;
}

pdf.save("Hridoy-PDF.pdf");

progress.innerHTML="✅ Done!";
};
}

// ===== BASE64 =====
function toBase64(file){
return new Promise((resolve,reject)=>{
const reader = new FileReader();
reader.readAsDataURL(file);
reader.onload=()=>resolve(reader.result);
reader.onerror=err=>reject(err);
});
}

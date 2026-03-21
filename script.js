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
convertBtn.onclick = async ()=>{

if(images.length===0){
alert("Select images first");
return;
}

const { jsPDF } = window.jspdf;
const pdf = new jsPDF();

for(let i=0;i<images.length;i++){

const imgData = await toBase64(images[i]);

const img = new Image();
img.src = imgData;

await new Promise(res=>img.onload=res);

const width = pdf.internal.pageSize.getWidth();
const height = (img.height * width) / img.width;

if(i>0) pdf.addPage();

pdf.addImage(imgData,"JPEG",0,0,width,height);
}

pdf.save("Hridoy-PDF.pdf");

};
}

// BASE64
function toBase64(file){
return new Promise((resolve,reject)=>{
const reader = new FileReader();
reader.readAsDataURL(file);
reader.onload=()=>resolve(reader.result);
reader.onerror=err=>reject(err);
});
}

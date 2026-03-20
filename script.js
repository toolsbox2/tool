// ================= SIDEBAR =================

function openLeft(){
document.getElementById("leftMenu").style.transform="translateX(0)";
document.getElementById("overlay").classList.add("show");
}

function closeLeft(){
document.getElementById("leftMenu").style.transform="translateX(-100%)";
document.getElementById("overlay").classList.remove("show");
}

function openRight(){
document.getElementById("rightMenu").style.transform="translateX(0)";
document.getElementById("overlay").classList.add("show");
}

function closeRight(){
document.getElementById("rightMenu").style.transform="translateX(100%)";
document.getElementById("overlay").classList.remove("show");
}

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

// append
box.appendChild(img);
box.appendChild(del);
preview.appendChild(box);

// drag reorder
box.draggable = true;

box.addEventListener("dragstart", () => {
box.classList.add("dragging");
});

box.addEventListener("dragend", () => {
box.classList.remove("dragging");
});

preview.addEventListener("dragover", (e) => {
e.preventDefault();
const dragging = document.querySelector(".dragging");
const after = getDragAfterElement(preview, e.clientY);
if(after == null){
preview.appendChild(dragging);
}else{
preview.insertBefore(dragging, after);
}
});

};


const dropArea = document.getElementById("dropArea");
const imageInput = document.getElementById("imageInput");
const preview = document.getElementById("preview");
const convertBtn = document.getElementById("convertBtn");

const qualitySelect = document.getElementById("quality");
const pageNumberSelect = document.getElementById("pageNumber");
const watermarkInput = document.getElementById("watermark");

let images = [];

// click upload
dropArea.onclick = () => imageInput.click();

// drag drop
dropArea.ondragover = e => {
e.preventDefault();
dropArea.style.background="#222";
};

dropArea.ondragleave = () => {
dropArea.style.background="#111";
};

dropArea.ondrop = e => {
e.preventDefault();
handleFiles(e.dataTransfer.files);
};

// select
imageInput.onchange = e => {
handleFiles(e.target.files);
imageInput.value="";
};

// handle
function handleFiles(files){

for(let file of files){

if(!file.type.startsWith("image/")) continue;

images.push(file);

const reader = new FileReader();

reader.onload = e => {

const box = document.createElement("div");
box.className="imgBox";

const img = document.createElement("img");
img.src = e.target.result;

const del = document.createElement("button");
del.innerText="❌";
del.className="deleteBtn";

del.onclick = () => {
box.remove();
images = images.filter(f => f !== file);
};

box.appendChild(img);
box.appendChild(del);
preview.appendChild(box);

};

reader.readAsDataURL(file);

}

}

// convert
convertBtn.onclick = async () => {

if(images.length===0){
alert("Select images first!");
return;
}

const quality = parseFloat(qualitySelect.value);
const addPageNumber = pageNumberSelect.value === "yes";
const watermark = watermarkInput.value;

const { jsPDF } = window.jspdf;
const pdf = new jsPDF();

for(let i=0;i<images.length;i++){

let imgData = await compressImage(images[i], quality);

const img = new Image();
img.src = imgData;

await new Promise(res => img.onload = res);

const width = pdf.internal.pageSize.getWidth();
const height = (img.height * width) / img.width;

if(i>0) pdf.addPage();

pdf.addImage(imgData,"JPEG",0,0,width,height);

// page number
if(addPageNumber){
pdf.setFontSize(10);
pdf.text(`Page ${i+1}`, width-30, height-10);
}

// watermark
if(watermark){
pdf.setTextColor(150);
pdf.setFontSize(20);
pdf.text(watermark, width/2-20, height/2, {angle:45});
}

}

pdf.save("Hridoy-Pro-PDF.pdf");

};


// compress
function compressImage(file, quality){
return new Promise(resolve => {

const reader = new FileReader();
reader.readAsDataURL(file);

reader.onload = e => {

const img = new Image();
img.src = e.target.result;

img.onload = () => {

const canvas = document.createElement("canvas");
const ctx = canvas.getContext("2d");

canvas.width = img.width;
canvas.height = img.height;

ctx.drawImage(img,0,0);

resolve(canvas.toDataURL("image/jpeg", quality));

};

};

});
}



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

// ================= ELEMENTS =================

const dropArea = document.getElementById("dropArea");
const imageInput = document.getElementById("imageInput");
const preview = document.getElementById("preview");
const convertBtn = document.getElementById("convertBtn");

let images = [];


// ================= CLICK UPLOAD =================

dropArea.addEventListener("click", () => {
imageInput.click();
});


// ================= DRAG & DROP =================

dropArea.addEventListener("dragover", (e) => {
e.preventDefault();
dropArea.style.background = "#222";
});

dropArea.addEventListener("dragleave", () => {
dropArea.style.background = "#111";
});

dropArea.addEventListener("drop", (e) => {
e.preventDefault();
handleFiles(e.dataTransfer.files);
});


// ================= INPUT SELECT =================

imageInput.addEventListener("change", (e) => {
handleFiles(e.target.files);

// reset input (same file fix)
imageInput.value = "";
});


// ================= HANDLE FILES =================

function handleFiles(files){

for(let file of files){

if(!file.type.startsWith("image/")) continue;

images.push(file);

const reader = new FileReader();

reader.onload = function(e){

const box = document.createElement("div");
box.className = "imgBox";

// image
const img = document.createElement("img");
img.src = e.target.result;

// delete button
const del = document.createElement("button");
del.innerText = "❌";
del.className = "deleteBtn";

del.onclick = () => {
box.remove();
images = images.filter(f => f !== file);
};

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

reader.readAsDataURL(file);

}

}


// ================= DRAG HELPER =================

function getDragAfterElement(container, y){
const elements = [...container.querySelectorAll(".imgBox:not(.dragging)")];

return elements.reduce((closest, child) => {
const box = child.getBoundingClientRect();
const offset = y - box.top - box.height / 2;

if(offset < 0 && offset > closest.offset){
return { offset: offset, element: child };
}else{
return closest;
}
}, { offset: Number.NEGATIVE_INFINITY }).element;
}


// ================= CONVERT =================

convertBtn.addEventListener("click", async () => {

if(images.length === 0){
alert("Select images first!");
return;
}

const { jsPDF } = window.jspdf;
const pdf = new jsPDF();

for(let i=0;i<images.length;i++){

const imgData = await toBase64(images[i]);

const img = new Image();
img.src = imgData;

await new Promise(res => img.onload = res);

// REAL SIZE FIX
const width = pdf.internal.pageSize.getWidth();
const height = (img.height * width) / img.width;

if(i > 0) pdf.addPage();

pdf.addImage(imgData, "JPEG", 0, 0, width, height);

}

pdf.save("Hridoy-PDF.pdf");

});


// ================= HELPER =================

function toBase64(file){
return new Promise((resolve,reject)=>{
const reader = new FileReader();
reader.readAsDataURL(file);
reader.onload = () => resolve(reader.result);
reader.onerror = error => reject(error);
});
}

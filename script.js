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


// ================= JPG TO PDF FIX (FINAL) =================

const imageInput = document.getElementById("imageInput");
const preview = document.getElementById("preview");
const convertBtn = document.getElementById("convertBtn");

let images = [];

if(imageInput){

imageInput.addEventListener("change", function(){

const files = imageInput.files;

// ❌ IMPORTANT FIX: previous images remove korbo na
// ✅ new files add hobe previous er sathe

for(let i=0;i<files.length;i++){

const file = files[i];
images.push(file);

const reader = new FileReader();

reader.onload=function(e){
const img=document.createElement("img");
img.src=e.target.result;
preview.appendChild(img);
}

reader.readAsDataURL(file);

}

});
}


// ================= CONVERT =================

if(convertBtn){

convertBtn.addEventListener("click", async function(){

if(images.length===0){
alert("Please select images");
return;
}

const { jsPDF } = window.jspdf;
const pdf = new jsPDF();

for(let i=0;i<images.length;i++){

const imgData = await toBase64(images[i]);

const img = new Image();
img.src = imgData;

await new Promise(resolve=> img.onload = resolve);

const width = pdf.internal.pageSize.getWidth();
const height = (img.height * width) / img.width;

if(i>0) pdf.addPage();

pdf.addImage(imgData,"JPEG",0,0,width,height);

}

pdf.save("Hridoy-PDF.pdf");

});

}


// ================= HELPER =================

function toBase64(file){
return new Promise((resolve,reject)=>{
const reader=new FileReader();
reader.readAsDataURL(file);
reader.onload=()=>resolve(reader.result);
reader.onerror=error=>reject(error);
});
}

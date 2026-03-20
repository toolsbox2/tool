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

/* SEARCH */
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

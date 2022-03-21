var scrollable_main = document.getElementById('main');
var isNavOpen = false;
let cursor = document.getElementById('cursor');
let pointer = document.getElementById('pointer');
let but = document.getElementsByClassName('targetable');

let cursorMoveEnable = true;

if (navigator.userAgent.indexOf("Firefox") > -1) {
    document.body.classList.add('mz');
}

window.addEventListener("contextmenu", resetConsoleClick);
window.addEventListener("keyup", resetConsoleKey);

window.addEventListener("load", load);
function load(){
    document.body.classList.add('loaded');
}

function resetConsoleKey(event){
    if(event.keyCode == 123){
        resetConsole();
    }
}
function resetConsoleClick(event){
    resetConsole();
}

function resetConsole(){
    console.clear();
    console.log('%c Don\'t destroy Me !!!                                         ','font-size:50px;line-height:100px;color:rgba(28, 49, 0, 1);text-shadow: 3px 3px rgba(155, 155, 0, 0.8), 6px 6px rgba(155, 101, 0, 0.6), 9px 9px rgba(155, 49, 0, 0.4);background-color: rgb(30,30,30);');
    //console.log("%c      _____             _____\n    ,ad8PPPP88b,     ,d88PPPP8ba,\n   d8P\"      \"Y8b, ,d8P\"      \"Y8b\n  dP'           \"8a8\"           `Yd\n  8(              \"              )8\n  I8                             8I\n   Yb,                         ,dP\n    \"8a,                     ,a8\"\n      \"8a,                 ,a8\"\n        \"Yba             adP\"\n          `Y8a         a8P'\n            `88,     ,88'\n              \"8b   d8\"\n               \"8b d8\"\n                `888'\n                  \"\n                                                                                                ",'color:rgba(155, 49, 0, 1);text-indent: 150px;');
}

//Navigation between website

var page_number_list = {
    "0":"/",
    "1":"/who",
    "2":"/xp",
    "3":"/project",
    "4":"/skills",
    "5":"/talk"
}

function goto(page_number){
    location.href = page_number_list[page_number];
}

//OPEN/CLOSE NAV
function navigation(){
    if(isNavOpen){
        isNavOpen = false;
        document.body.classList.remove('nav-open');
        document.body.classList.add('nav-close');
    }else{
        isNavOpen = true;
        document.body.classList.remove('nav-close');
        document.body.classList.add('nav-open');
    }
}

//MOUSE


//NOT TOTALLY FROM ME
scrollable_main.addEventListener('touchstart', handleTouchStart, { passive: false });        
scrollable_main.addEventListener('touchmove', handleTouchMove, { passive: false });

var xDown = null;                                                        
var yDown = null;                                                        

function handleTouchStart(evt) {                                       
    xDown = evt.touches[0].clientX;                                      
    yDown = evt.touches[0].clientY;                            
};                                                

function handleTouchMove(evt) {
    //e.preventDefault();
    if ( ! xDown || ! yDown ) {
        return;
    }

    var xUp = evt.touches[0].clientX;                                    
    var yUp = evt.touches[0].clientY;

    var xDiff = xDown - xUp;
    var yDiff = yDown - yUp;

    if ( Math.abs( xDiff ) > Math.abs( yDiff ) ) {/*most significant*/
        if ( xDiff > 0 ) {
            swipe_left(evt);
        } else {
            swipe_right(evt);
        }                       
    } else {
        if ( yDiff > 0 ) {
            swipe_up(evt);
        } else { 
            swipe_down(evt);
        }                                                                 
    }
    xDown = null;
    yDown = null;                                             
};

//magnet mouse init
magnetCurs.init({
    click:700,
    spacing:10,
    pointer:true
});

//Background functions


let logo = document.getElementById('logo');
let stars = document.getElementById('starcontainer');

/*Move Background desktop*/
document.addEventListener('mousemove', moveBackground);
function moveBackground(event){
    logo.style.transform = "translate("+(event.clientX - window.innerHeight/2) / 60 +"px, "+(event.clientY - window.innerWidth/2) / 60 +"px)";
    stars.style.transform = "translate("+(event.clientX - window.innerHeight/2)* -1 / 40 +"px, "+(event.clientY - window.innerWidth/2)* -1 / 40 +"px)";
}
/*Move Background Mobile*/
if(window.DeviceOrientationEvent){
    window.addEventListener("deviceorientation", orientation, false);
}else{
    alert("DeviceOrientationEvent is not supported");
}
function orientation(event) {
    logo.style = "transform: translate("+(event.beta /2) +"px, "+(event.gamma /2)+"px);";
}


/* Star generator */
let container = document.getElementById('starcontainer');
let size = [];
size.x = container.offsetWidth;
size.y = container.offsetHeight;
let count = 30;
for (let index = 0; index < count; index++) {
    let dom = document.createElement('span');
    dom.classList.add('star');
    let l = Math.random();
    dom.style.opacity = l;
    let h = Math.random();
    dom.style.left = l * 70 +'vw';
    dom.style.top = h * 100 +'vh';
    container.appendChild(dom);
}

function random(min,max) {
    return Math.random() * max;
}
var mapstate = false;

var tileLayervar = L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
	attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>',
	subdomains: 'abcd',
	maxZoom: 19
});

var markerIUTLannion = L.marker([48.758, -3.454]);
markerIUTLannion.bindPopup("<b>IUT de lannion</b>",{closeOnClick: false, autoClose: false});
var markerTriskalia = L.marker([48.452, -4.238]);
markerTriskalia.bindPopup("<b>Triskalia</b>",{closeOnClick: false, autoClose: false});
var markerCDG29 = L.marker([48.015, -4.093]);
markerCDG29.bindPopup("<b>Centre de gestion du Finistère</b>",{closeOnClick: false, autoClose: false});
var markerLyceeYvesThepot = L.marker([47.988, -4.090]);
markerLyceeYvesThepot.bindPopup("<b>Lycée Yves Thépot</b>",{closeOnClick: false, autoClose: false});


var map = L.map('map', {
	minZoom: 5,
	zoomControl: false
}).setView([48.575, -3.767], 8);

var zoom = L.control.zoom({
	position:'topleft'
});

zoom.addTo(map);
tileLayervar.addTo(map);
change();

function change() {
	map.removeLayer(markerIUTLannion);
	map.removeLayer(markerTriskalia);
	map.removeLayer(markerCDG29);
	map.removeLayer(markerLyceeYvesThepot);

	if (active_page == 0) {
		markerIUTLannion.addTo(map).openPopup();
		markerTriskalia.addTo(map).openPopup();
	}else if (active_page == 1) {
		markerIUTLannion.addTo(map).openPopup();
		markerCDG29.addTo(map).openPopup();
	}else if (active_page == 2) {
		markerLyceeYvesThepot.addTo(map).openPopup();
	}
}

scrollable_main.addEventListener('pageChange', change, false);

var maptoggle = document.getElementById('maptoggle');

maptoggle.addEventListener("click",function(){
	if(mapstate){
		mapstate = false;
		document.body.classList.remove('map-open');
		document.body.classList.add('map-close');
	}else{
		mapstate = true;
		document.body.classList.remove('map-close');
		document.body.classList.add('map-open');
	}
});


function swipe_up(e){
    e.preventDefault();
    scrollToPage(active_page + 1);
}
function swipe_down(e){
    e.preventDefault();
    scrollToPage(active_page - 1);
}
function swipe_left(e){
    
}
function swipe_right(e){
    
}
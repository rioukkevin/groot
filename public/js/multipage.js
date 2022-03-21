var wait = true;
var wait2 = true;
var number_of_page = document.getElementsByClassName('page').length;
var active_page = 0;

var page_links = document.getElementById('page_links');

var pageChange = new Event('pageChange');


scrollable_main.addEventListener('wheel', computerScroll);

function computerScroll(event) {
    var delta;
    if (event.wheelDelta) {
        delta = event.wheelDelta;
    } else {
        delta = -1 * event.deltaY;
    }
    event.preventDefault();
    if (delta < 0) {
        scrollToPage(active_page + 1);
    } else if (delta > 0) {
        scrollToPage(active_page - 1);
    }
}

function scrollToPageLinks(number){
    var links_list = page_links.getElementsByClassName("page_link");
    for (let i = 0; i < links_list.length; i++) {
        links_list[i].classList.remove("active_page_link");
    }
    page_links.getElementsByClassName("page_link")[number].classList.add("active_page_link");
}
function scrollToPageEffect(number){
    var page_list = scrollable_main.getElementsByClassName("page");
    for (let i = 0; i < page_list.length; i++) {
        page_list[i].classList.remove("active_page");
    }
    scrollable_main.getElementsByClassName("page")[number].classList.add("active_page");
}

function scrollToPage(number){
    if(number >=0 && number < number_of_page && wait){
        wait = false;
        setTimeout(function(){ wait = true; }, 300); 
        for (let i = 0; i < number_of_page; i++) {
            document.body.classList.remove("page-"+i);
        }
        document.body.classList.add('page-'+number);
        var increment = scrollable_main.scrollHeight / number_of_page;

        var delta = increment*active_page - increment*number;

        
        scrollable_main.scroll({
            top: increment*number,
            left: 0,
            behavior : "smooth"
        });

        scrollToPageLinks(number);
        scrollToPageEffect(number);
        active_page = number;
        scrollable_main.dispatchEvent(pageChange);

    }else if(!wait){
        console.log("Jarvis: Be patient");
        scrollable_main.scrollTo({ 
            top: scrollable_main.scrollY,
            left: 0, 
            behavior: 'smooth' 
        });
    }else{
        console.log("Jarvis: I think you make a mistake ?");
    }
    
}

/*
function value(delta,increment,smooth){
    var start = [];
    var middle = [];
    var end = [];
    var temp = 0;

    var pass = Math.abs(delta/increment);
    temp = pass;
    console.log(temp);
    for (let i = 0; i < smooth; i++) {
        temp = Math.round(temp / 2);
        start.push(temp);
    }
    for (let i = 0; i < increment; i++) {
        middle.push(pass);
    }
    temp = pass;
    for (let i = 0; i < smooth; i++) {
        temp = Math.round(temp / 2);
        end.push(temp);
    }
    start = start.reverse();
    var result = start.concat(middle.concat(end));
    return result;
}

function scrooll(delta,array,number){
    if(array.length > 0){
         var dat = array.shift();
        scrollable_main.scrollBy({
            top: dat,
            left: 0
        });
        console.log(array);
        wait2 = true;
        setTimeout(function (){
            scrooll(delta,array,number);
        },100);
    }else{
        scrollable_main.scrollTo({
            top: number,
            left: 0
        });
    }
}
*/
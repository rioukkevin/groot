var who= document.getElementById('who');

var textSave = who.innerHTML;
who.innerHTML = "";
var speed = 10;
var textSize = textSave.length;
var whocurs = "<span class=\"curs\"></span>";
    
var whocursPos = 0;
var letter;
var inSpan = false;
var waiting = 0;

function typewriter()
{
    letter = textSave[whocursPos];
    if(letter[0] == '<'){
        while(letter[letter.length - 1] != '>'){
            whocursPos++;
            letter += textSave[whocursPos];
        }
        if(letter[1] == '/'){
            inSpan = false;
        }else{
            inSpan = true;
            waiting = 1;
        }
    }
    if(inSpan && waiting <= 0){
        who.innerHTML = who.innerHTML.substring(0,who.innerHTML.length - whocurs.length);
        who.lastElementChild.insertAdjacentHTML( 'beforeend', letter);
        who.insertAdjacentHTML( 'beforeend', whocurs );
    }else{
        who.innerHTML = who.innerHTML.substring(0,who.innerHTML.length - whocurs.length);
        who.insertAdjacentHTML( 'beforeend', letter );
        who.insertAdjacentHTML( 'beforeend', whocurs );
    }
    waiting --;
    document.body.scrollTop = document.body.scrollHeight;
    if ( whocursPos++ != textSize - 1 ) {
        setTimeout("typewriter()", speed);
    }else{
        console.log("Jarvis : That's it");
    }
}
    
typewriter();

function swipe_up(e){

}
function swipe_down(e){

}
function swipe_left(e){
    
}
function swipe_right(e){
    
}

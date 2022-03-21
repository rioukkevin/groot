var form = document.forms['contact'];

var name = false;
var mail = false;
var subject = false;
var data = false;
var send = name && mail && subject && data;

form.addEventListener('keyup',function(){
    if (form['name'].value.length >= 2) {
        document.getElementById('mail').classList.remove('mask');
        form['name'].classList.add('done');
        form['mail'].disabled = false;
        //Regex verification
        var regName = new RegExp("^[a-zA-Z ]{2,}$");
        if(!regName.test(form['name'].value)){
            console.log("name need to looks like : ^[a-zA-Z ]{2,}$");
            document.getElementById('name').getElementsByClassName('error')[0].innerHTML = "Did you really think it's look like a name ? is that a pseudo ?";
            name = false;
        }else{
            document.getElementById('name').getElementsByClassName('error')[0].innerHTML = "";
            name = true;
        }
    }else{
        form['name'].classList.remove('done');
    }
    if (form['mail'].value.length >= 4) {
        document.getElementById('subject').classList.remove('mask');
        form['mail'].classList.add('done');
        form['subject'].disabled = false;
        var regResponse1 = new RegExp('^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$');
        var regResponse2 = new RegExp("^[0-9]{10}$");
        if(!regResponse1.test(form['mail'].value) && !regResponse2.test(form['mail'].value)){
            console.log("Jarvis : email/number need to looks like : [A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,} || ^[0-9]{10}$");
            document.getElementById('mail').getElementsByClassName('error')[0].innerHTML = "I don't think it's an email or a phone number ;)";
            mail = false;
        }else{
            document.getElementById('mail').getElementsByClassName('error')[0].innerHTML = "";
            mail = true;
        }
    }else{
        form['mail'].classList.remove('done');
    }
    if (form['subject'].value.length >= 8) {
        document.getElementById('data').classList.remove('mask');
        form['subject'].classList.add('done');
        form['data'].disabled = false;
        subject = true;
    }else{
        form['subject'].classList.remove('done');
        subject = false;
    }
    if (form['data'].value.length >= 10) {
        document.getElementById('subm').classList.remove('mask');
        form['data'].classList.add('done');
        data = true;
    }else{
        form['data'].classList.remove('done');
        data = false;
    }
});

form.addEventListener('submit',function(e){
    e.preventDefault();
    launch();
});

function launch(){
    send = name && mail && subject && data;
    if (send) {
        var xhttp = new XMLHttpRequest();
        xhttp.open("POST", '/sendmail', false);
        xhttp.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
        xhttp.send("name="+form['name'].value+"&mail="+form['mail'].value+"&subject="+form['subject'].value+"&data="+form['data'].value);
        if(xhttp.responseText == 'y'){
            document.getElementById('subm').disabled = true;
            document.getElementById('subm').innerHTML  = 'That\'s all good';
            console.log("Jarvis : send nudes :P");
        }else{
            document.getElementById('subm').innerHTML  = 'Oups, Something went wrong, send me directly an email at riou.kkevin@gmail.com';
            console.log("Jarvis : Errrrroooooooorrrrr, Sendmail isn't available for a moment, send directly at riou.kkevin@gmail.com or call 0618260849");
        } 
    }else{
        document.getElementById('subm').innerHTML = 'Oups, you can\'t send me a message, there are one or more error';
        console.log("Jarvis : Nope this is out of my functions");
    }
}

var textarea = document.querySelector('textarea');

textarea.addEventListener('keydown', autosize);
             
function autosize(){
  var el = this;
  setTimeout(function(){
    el.style.cssText = 'height:' + el.scrollHeight + 'px';
  },0);
}
function swipe_up(e){

}
function swipe_down(e){

}
function swipe_left(e){
    
}
function swipe_right(e){
    
}
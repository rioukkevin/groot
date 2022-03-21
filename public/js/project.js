function swipe_up(e){
}
function swipe_down(e){
}
function swipe_left(e){
}
function swipe_right(e){ 
}
let currentproject = 0;
let nbproject = 2;
if(document.location.hash.length == 0){
    change(0);
}else{
    change(parseInt(document.location.hash.replace('#',''))); 
}


function change(nb){
    document.body.classList.add('masked');
    setTimeout(() => {
        update(nb);
    }, 400);
}
function update(nb){
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            console.warn();
            if(xhttp.responseText.length > 0){
                let data = JSON.parse(xhttp.responseText);
                document.location.hash = nb;
                document.getElementById('name').innerText = data['name'];
                document.getElementById('state').innerText = data['state'];
                document.getElementById('year').innerText = data['year'];
                document.getElementById('introduction').innerText = data['introduction'];
                document.getElementById('content').innerText = data['content'];
                document.getElementById('roles').innerHTML = "";
                document.getElementById('technologies').innerHTML = "";
                document.getElementById('urls').innerHTML = "";
                document.getElementById('imglist').innerHTML = "";
                scrollable_main.style.background = data['background'];
                document.body.style.setProperty('--main-color',data['main']);
                document.body.style.setProperty('--second-color',data['second']);
                document.body.style.setProperty('--third-color',data['third']);
                document.body.style.setProperty('--third-color-7',data['third']);
                document.body.style.setProperty('--third-color-6',data['third']);
                document.body.style.setProperty('--clear-color',data['clear']);
                for (let index = 0; index < data['roles'].length; index++) {
                    document.getElementById('roles').insertAdjacentHTML('beforeend','<li class="roles">'+data['roles'][index]+'</li>');
                }
                for (let index = 0; index < data['technologies'].length; index++) {
                    document.getElementById('technologies').insertAdjacentHTML('beforeend','<li class="tech">'+data['technologies'][index]+'</li>');
                }
                for (let index = 0; index < data['url'].length; index++) {
                    document.getElementById('urls').insertAdjacentHTML('beforeend','<li class="url"><a href="'+data['url'][index].link+'">'+data['url'][index].name+'</a></li>');
                }
                for (let index = 0; index < data['screencapture'].length; index++) {
                    document.getElementById('imglist').insertAdjacentHTML('beforeend','<div class="img" style="background-image:url('+data['screencapture'][index]+');"></div>');
                }
                let imglistdom = document.getElementsByClassName('img');
                for (let index = 0; index < imglistdom.length; index++) {
                    const element = imglistdom[index];
                    element.addEventListener('click',function (e) {
                        let el = e.currentTarget;
                        console.log(el.style.backgroundImage);
                        document.getElementById('imgfullscreen').setAttribute('src',el.style.backgroundImage.substr(5).slice(0,-2));
                        document.getElementById('blurmask').classList.add('show');
                    });
                }
                currentproject = nb;
                document.body.classList.remove('masked');
            }else{
                if(currentproject > 0){
                    update(0);
                }else{
                    update(nbproject);
                }
            }
        }
    };
    xhttp.open("GET", "https://kevin.riou.pro/project/"+nb, true);
    // xhttp.open("GET", "http://localhost:8080/project/"+nb, true);
    xhttp.send();
}


document.getElementById('blurmask').addEventListener('click',function (e) {
    document.getElementById('blurmask').classList.remove('show');
    let imglistdom = document.getElementsByClassName('img');
    for (let index = 0; index < imglistdom.length; index++) {
        const element = imglistdom[index];
    }
});
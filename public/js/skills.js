var keycodes = {
    "8": "backspace",
    "9": "tab",
    "13": "enter",
    "16": "shift",
    "17": "ctrl",
    "18": "alt",
    "19": "pause_break",
    "20": "caps_lock",
    "27": "escape",
    "33": "page_up",
    "34": "page_down",
    "35": "end",
    "36": "home",
    "37": "left_arrow",
    "38": "up_arrow",
    "39": "right_arrow",
    "40": "down_arrow",
    "45": "insert",
    "46": "delete",
    "48": "0",
    "49": "1",
    "50": "2",
    "51": "3",
    "52": "4",
    "53": "5",
    "54": "6",
    "55": "7",
    "56": "8",
    "57": "9",
    "65": "a",
    "66": "b",
    "67": "c",
    "68": "d",
    "69": "e",
    "70": "f",
    "71": "g",
    "72": "h",
    "73": "i",
    "74": "j",
    "75": "k",
    "76": "l",
    "77": "m",
    "78": "n",
    "79": "o",
    "80": "p",
    "81": "q",
    "82": "r",
    "83": "s",
    "84": "t",
    "85": "u",
    "86": "v",
    "87": "w",
    "88": "x",
    "89": "y",
    "90": "z",
    "91": "left_window_key",
    "92": "right_window_key",
    "93": "select_key",
    "96": "numpad_0",
    "97": "numpad_1",
    "98": "numpad_2",
    "99": "numpad_3",
    "100": "numpad_4",
    "101": "numpad_5",
    "102": "numpad_6",
    "103": "numpad_7",
    "104": "numpad_8",
    "105": "numpad_9",
    "106": "multiply",
    "107": "add",
    "109": "subtract",
    "110": "decimal_point",
    "111": "divide",
    "112": "f1",
    "113": "f2",
    "114": "f3",
    "115": "f4",
    "116": "f5",
    "117": "f6",
    "118": "f7",
    "119": "f8",
    "120": "f9",
    "121": "f10",
    "122": "f11",
    "123": "f12",
    "144": "num_lock",
    "145": "scroll_lock",
    "186": "semi_colon",
    "187": "equal_sign",
    "188": "comma",
    "189": "dash",
    "190": "period",
    "191": "forward_slash",
    "192": "grave_accent",
    "219": "open_bracket",
    "220": "back_slash",
    "221": "close_braket",
    "222": "single_quote"
}
let cmdHistory = [""];
let cmdHistoryPos = 0;

var path = "/";
var list = {
    organizational: {
        redmine: {
            classic: "I use redmine to follow project with pseudo-agile method",
            easyredmine: "At Triskalia I use EasyRedmine to send to my superior on which project I work and when"
        },
        svn: "I use SVN in company to store sources of project on which I work",
        git: "On GitLab or GitHub I work on scholl project in team. My portfolio website is on GitLab to follow what I do and When",
        jenkins: "Used to automate task like send sources of one project on the Development or production server"
    },
    beforeall: "I use UML diagrams to prepare technical informations before coding",
    web: {
        front: {
            html: "It's simply XML, I use it everyday",
            css: {
                readme: "a very good language, i love work with it to produce a lot of thing",
                bootstrap: "I work with but the problem is that it's too restrictive for me",
                spectre: "it's a bootstrap ++",
                materialize: "I'm going to discover it"
            },
            js: {
                native: "I use it everyday and love work with and interact with DOM",
                jquery: "I prefer native JS, it simplify a lot of thing but it's a very big library and it cost time on page loading",
                angular: "I discover it and i like it",
                datatable: "nice to use it simplify a lot when I work with table",
                emoji: "I use it on my website, it looks somme better ;)",
                knockout: "a very nice framework but it's easy to be lost when maintains a project",
                leaflet: "As you can see I use it on my website, it's better than GoogleMaps Api ($) on little project"
            }
        },
        back: {
            php: {
                native: "I use it on many project",
                symfony: "I'm currently working with on a schoolar project",
                codeignitier: "I don't like it but I can work with"
            },
            nodejs: {
                express: "I use it a little bit, I am currently working on transferring my website on it",
                "socket.io": "It's very good but is it going to disappear with the mercure protocol ?",
                mongoose: "it's a requirement to work with mongodb's database"
            }
        },
    },
    hybrid:{
        cordova:"I use cordova at Triskalia on a mobile application"
    },
    storage: {
        ai: {
            mapreduce: "I learn how the MapReduce method work and practice with JAVA",
            hive: "I learn how to work with HIVE (Facebook) at school",
            spark: "I start working with at school, I only learn the basics",
            yarn: "It's like hive and spark, just the basics"
        },
        sql: {
            mysql: "The respond to the existential question is: MarriaDB :P",
            pgsql: "I work all days with PostgresSQL, I use it today with PHP",
            mssql: "yes i work with on a project, It is a database for the software EUDOnet"
        },
        nosql: {
            mongodb: "I am currently working on it with NodeJS and Mongoose"
        }
    },
    graphism:{
        twodimensions:{
            vectorial:"I use Gravit Designer to create vectorial images like I use on my website on 404 error page to animate my logo",
            pixelize:"I use GIMP on Linux or Paint.net on Windows to do what I want when I can't do it in vectorial"
        },
        threedimensions:{
            sketchup:"I work with sketchup on building design",
            blender:"I use blender as a beginner to do any object I can use after"
        }
    },
    os: {
        windows: "I can work on windows but I don't really like it, I prefer Linux",
        linux: {
            readme: "Linux is my favorite distribution, I love it more than Windows ;)",
            debian: "I use Debian for two year as my principal OS",
            ubuntu: "I don't use it because debian",
            elementaryos: "I use it just for fun, it's like all linux ;)",
            archlinux: "The best linux distro, <3 I use itsince 11/2018, I love it"
        },
        android: {
            stock: "I use it for 3 year, you say 'Root'? I say yes but I'm waiting the end of my warrantly :P",
            flyme: "That is the Meizu android version, I use it everyday and I can't use an other because it's the best android version"
        },
        macos: "I i become rich I start discovering it, I think it can be good ;)"
    },
    other: {
        languages: {
            java: "I can use it, I already work with it but it's not my favorite language",
            python: "I apply it on mathematics, I search time to discover it in web devlopment",
            c: "Nothing to say, I just already work with it and I can work on"
        }
    }
};
var currentFolder = list;

function keyList(obj) {
    return Object.keys(obj);
}
let ls = function () {
    keys = keyList(currentFolder);
    result = [];
    for (let index = 0; index < keys.length; index++) {
        let e = keys[index];
        if (isfolder(currentFolder[e])) {
            result.push('<span class="folder">' + e + '</span>');
        } else {
            result.push('<span class="file">' + e + '</span>');
        }
    }
    return result.join(' ');
}

function isfile(e) {
    if (typeof e == "string") {
        return true;
    } else {
        return false;
    }
}

function isfolder(e) {
    if (typeof e == "object") {
        return true;
    } else {
        return false;
    }
}

function cdOneDown(el) {
    el = el.replace(/\//, el);
    if (isfolder(currentFolder[el])) {
        currentFolder = currentFolder[el];
        path = path + el + "/";
        return true;
    } else {
        return false;
    }
}

function action(pat, ac) {
    if (ac.length > 0) {
        if (ac == "..") {
            if (pat[pat.length - 1] == "/") {
                pat = pat.slice(0, -1);
            }
            let spl = pat.split("/");
            spl.pop();
            pat = spl.join("/");
            return pat + "/";
        } else if (ac == ".") {
            return pat;
        } else {
            pat = pat + ac;
            return pat + "/";
        }
    } else {
        return pat;
    }
}

function actionMulti(pat, ac) {
    if (ac[ac.length - 1] == "/" && ac.length > 1) {
        ac = ac.substring(0, ac.length - 1);
    }
    if (ac[0].localeCompare("/") == 0) {
        pat = "/";
        ac = ac.substring(1);
    }
    ac = ac.split("/");
    for (let i = 0; i < ac.length; i++) {
        let el = ac[i];
        pat = action(pat, el);
    }
    return pat;
}

function convertPathToFolder(pat) {
    let tempFolder = list;
    let isgood = true;
    if (pat.localeCompare("/") == 0) {} else {
        pat = pat.substring(1);
        pat = pat.substring(0, pat.length - 1);
        l = pat.split("/");
        for (let ind = 0; ind < l.length; ind++) {
            let el = l[ind];
            if (isfolder(tempFolder[el])) {
                tempFolder = tempFolder[el];
            } else {
                isgood = false;
            }
        }
    }
    if (isgood) {
        return tempFolder;
    } else {
        return false;
    }
}

let cd = function (url) {
    if (url != undefined) {
        let tempPath = actionMulti(path, url);
        let folder = convertPathToFolder(tempPath);
        if (folder != false) {
            currentFolder = folder;
            path = tempPath;
            return "Move to " + path;
        } else {
            return "Unavailable folder";
        }
    } else {
        return "Missing params";
    }

}
let help = function () {
    let lis = keyList(cmds);
    return lis.join(' ');
}
let more = function (el) {
    if (isfile(currentFolder[el])) {
        return currentFolder[el];
    } else if (isfolder(currentFolder[el])) {
        return el + " is not a file";
    } else {
        return el + " not found";
    }
}
let history = function () {
    return cmdHistory.join('<br/>');
}

let clear = function () {}









let cmds = {
    "ls": ls,
    "cd": cd,
    "help": help,
    "more": more,
    "clear": clear,
    "history": history
}

function cmd(str) {
    if (str.length > 0) {
        str = str.split(' ');
        if (cmds[str[0]] == undefined) {
            return "Command not found : " + str[0];
        } else {
            return cmds[str[0]](str[1]);
        }
    } else {
        return "";
    }
}

function isMobileCSS() {
    if (window.innerWidth <= 745) {
        return true;
    } else {
        return false;
    }
}

document.getElementById('fakebash').addEventListener('input', function (e) {
    if (isMobileCSS()) {
        let temp = document.getElementById('fakebash');
        let letter = temp.value.substring(1).toLowerCase();
        let cmder = document.getElementById('currentcmd');
        if (letter.localeCompare(' ') == 0) {
            letter = '&nbsp;';
        }
        cmder.innerHTML = cmder.innerText + letter;
        temp.value = 'A';
    }
});

document.addEventListener('keydown', function (e) {
    let cmder = document.getElementById('currentcmd');
    let bsh = document.getElementById('bash');
    //console.log(e.keyCode);
    if ([32, 37, 38, 39, 40].indexOf(e.keyCode) > -1) {
        e.preventDefault();
    }

    if (e.keyCode >= 65 && e.keyCode <= 90) {
        cmder.innerText = cmder.innerText + keycodes[e.keyCode];
    } else if (e.keyCode == 32) {
        cmder.innerHTML = cmder.innerText + "&nbsp;";
    } else if (e.keyCode == 190) {
        cmder.innerHTML = cmder.innerText + ".";
    } else if (e.keyCode == 38) {
        if (cmdHistoryPos < cmdHistory.length - 1) {
            cmdHistoryPos = cmdHistoryPos + 1;
            console.log(cmdHistoryPos);
        }
        cmder.innerText = cmdHistory[cmdHistory.length - 1 - cmdHistoryPos];
    } else if (e.keyCode == 40) {
        if (cmdHistoryPos > 0) {
            cmdHistoryPos = cmdHistoryPos - 1;
            console.log(cmdHistoryPos);
        }
        cmder.innerText = cmdHistory[cmdHistory.length - 1 - cmdHistoryPos];
    } else if (e.keyCode == 191) {
        cmder.innerHTML = cmder.innerText + "/";
    } else if (e.keyCode == 8) {
        if (cmder.innerText.length > 0) {
            cmder.innerText = cmder.innerText.slice(0, -1);
        }
    } else if (e.keyCode == 13) {
        if (cmder.innerText.length > 0) {
            let cmdtemp = cmder.innerHTML.replace(/&nbsp;/g, " ");
            let res = cmd(cmdtemp);
            cmdHistoryPos = 0;
            cmdHistory.pop();
            cmdHistory.push(cmdtemp);
            cmdHistory.push("");
            cmder.id = "";
            cmder.classList.add('oldcmd');
            if (cmdtemp.localeCompare('clear') == 0) {
                bsh.innerHTML = "[groot@skills " + path + "]$ <span id=\"currentcmd\"></span>";
            } else {
                bsh.innerHTML = bsh.innerHTML + "<br/>" + res + "<br/>" + "[groot@skills " + path + "]$ <span id=\"currentcmd\"></span>";
            }
        } else {
            cmder.id = "";
            cmder.classList.add('oldcmd');
            bsh.innerHTML = bsh.innerHTML + "<br/>" + "[groot@skills " + path + "]$ <span id=\"currentcmd\"></span>";
        }
        bsh.scrollTop = bsh.scrollHeight;
    }
});

window.addEventListener('resize', function (event) {
    let bsh = document.getElementById('bash');
    setTimeout(() => {
        bsh.scrollTop = bsh.scrollHeight;
    }, 500);
});

function swipe_up(e){
    
}
function swipe_down(e){

}
function swipe_left(e){

}
function swipe_right(e){
    
}
var video = document.getElementById('video');
var uidiv = document.getElementById('uidiv');
var timerdiv = document.getElementById('timer');
var printdiv = document.getElementById('printdiv');
var dispdiv = document.getElementById('dispdiv');
//printdiv.style.display = "none";
var nastytricz = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAACCAYAAABYBvyLAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAaSURBVHgBrcABAQAAAMEwFHj/tJQwA9VRdDa7aAEw4FDmugAAAABJRU5ErkJggg==";

const backline = 3;
var cbls = [];
var dbls = [];
var selectionExist = false;
selected = 0;

//GENERATE CANVAS STORAGE
for(var i = 0; i < backline; i++){
    var temp = document.createElement("canvas");
    temp.width = "1080";
    temp.height = "1920";
    temp.id = "cbl"+i;
    printdiv.append(temp);
    cbls[i] = document.getElementById("cbl" + i);
}

//GENERATE DISPLAY IMGs
for(var i = 0; i < backline; i++){
    var temp = document.createElement("img");
        temp.classList.add('dbl');
        temp.style.display = "inline-block";
        temp.src = nastytricz;
        temp.onclick = function select(){
            var temp = parseInt(this.id.replace("dbl",""));
            selectionExist = true;
            selected = temp;
            console.log("clicked " + temp);
        };
        temp.id = "dbl"+i;
        dispdiv.append(temp);
        dbls[i] = document.getElementById("dbl" + i);
}


// Get access to the camera!
if(navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
    // Not adding `{ audio: true }` since we only want video now
    var constraints = { 
        video: {
            height: 1920,
            width: 1080,
            deviceId: "5df5c89a26fc6e89aa12ef9e26b2f1e4581851a82edec9ba507cf65017ef8b7e"
        }
    };
    navigator.mediaDevices.getUserMedia(constraints).then(function(stream) {
        //video.src = window.URL.createObjectURL(stream);
        video.srcObject = stream;
        video.play();
    });
}


var x;
function snapVideoToCanvas (i){
    if(x == undefined){
        var delay = 3;
        x = setInterval(function (){
            //console.log("TIMER: " + delay);
            if(delay <= 0) {
                var tempcon = cbls[i].getContext("2d");
                tempcon.drawImage(video, 0, 0, 1080, 1920);
                dbls[i].src = cbls[i].toDataURL();
                clearInterval(x);
                x = undefined;
                timerdiv.textContent = "";
            }else{
                timerdiv.textContent = delay;
                delay--;
            } 
        },1000);
    }
    
}

function capture(){
    if(selectionExist){
        snapVideoToCanvas(selected);
        selectionExist = false;
    }else{
        //autofill
        for(var i = 0; i < backline; i++){
            if(dbls[i].src == nastytricz){
                snapVideoToCanvas(i);
                break;
            }
        }
        //SHIFT CAPTURE
        /*
        for(var i = backline-1; i > 0; i--){
            var tempcon = cbls[i].getContext("2d");
            tempcon.drawImage(cbls[i-1], 0, 0, 640, 460);
            dbls[i].src = cbls[i].toDataURL();
        }
        var tempcon = cbls[0].getContext("2d");
        tempcon.drawImage(video, 0, 0, 640, 460);
        dbls[0].src = cbls[0].toDataURL();*/
    }
}

function printt(){
    /*printdiv.style.display = "block";
    uidiv.style.display = "none";
    cont2.drawImage(canvas1, 0, 0, 640, 460);
    window.print();*/
    var WinPrint = window.open('', '', 'left=0,top=0,width=800,height=900,toolbar=0,scrollbars=0,status=0');
    
    WinPrint.document.write("<canvas id='canvas3' width='1080' height='1920'></canvas>");
    var canvas3 = WinPrint.document.getElementById("canvas3");
    var cont3 = canvas3.getContext("2d");
    
    for(var i = 0; i < backline; i++){
        cont3.drawImage(cbls[i], 0, (460*i));
    }
    
    WinPrint.document.close();
    WinPrint.focus();
    WinPrint.print();
    WinPrint.close();
}  

function back(){
    printdiv.style.display = "none";
    uidiv.style.display = "block";
}  
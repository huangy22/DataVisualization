
var selectX = document.getElementById("selectX");
var optionsX = ["1", "2", "3", "4", "5"];
for(var i = 0; i < optionsX.length; i++) {
    var opt = optionsX[i];
    var el = document.createElement("option");
    el.textContent = opt;
    el.value = opt;
    select.appendChild(el);
}

var selectY = document.getElementById("selectY");
var optionsY = ["1", "2", "3", "4", "5"];
for(var i = 0; i < optionsY.length; i++) {
    var opt = optionsY[i];
    var el = document.createElement("option");
    el.textContent = opt;
    el.value = opt;
    selectY.appendChild(el);

}

// var selectBar = 
var uuids = [];

var currentIndex = 0;

var userChoices = {};
var colors = {
  Power: "#F65314",
  Intermediate: "#FFBB00",
  Precision: "#7CBB00",
};

var metas;

async function loadData() {
  await fetch("./grasps/grasps.json")
    .then((response) => response.json())
    .then((json) => {
      console.log("Loaded " + json.length + " grasp files.");
      uuids = json.map((item) => item.split(".")[0]);
    });

  await fetch("./data/taxo.json")
    .then((response) => response.json())
    .then((json) => {
      metas = json;
      console.log("Loaded " + Object.keys(json).length + " taxonomies.");

      let _n_but = 1;
      metas.forEach(function (meta) {
        n_but = _n_but.toString();
        var taxoButton = document.createElement("button");
        color = colors[meta["Type"]];
        // taxoButton.onclick = function () {
        //   handleButtonClick(_n_but);
        // };
		taxoButton.setAttribute("onclick", "handleButtonClick(" + _n_but + ")");
        taxoButton.style = "background-color:" + color + ";";
        taxoButton.innerHTML = meta["Name"];

        var taxoImage = document.createElement("img");
        taxoImage.src = "data/img/" + n_but + ".png";
        taxoImage.style = "width:100%;display:block;";

        var taxoImageDiv = document.createElement("div");
        taxoImageDiv.id = "grasp-image" + n_but;
        taxoImageDiv.classList.add("place-image");

        taxoImageDiv.appendChild(taxoImage);

        taxoButton.id = "button-" + n_but;
        document.getElementById("button-container").appendChild(taxoButton);
        // document.getElementById("grasp-image-container").appendChild(taxoImageDiv);

        // $("#" + taxoButton.id).hover(
        //   function () {
        //     $("#grasp-image" + n_but).fadeIn("fast");
        //   },
        //   function () {
        //     $("#grasp-image" + n_but).fadeOut("fast");
        //   }
        // );

        _n_but += 1;
      });
    });
}

function showGraspInfo() {
  document.getElementById("info").innerHTML = "Current Grasp: " + uuids[currentIndex];
  document.getElementById("page").innerHTML = currentIndex + 1 + " / " + uuids.length;

  if (uuids[currentIndex] in userChoices) {
    document.getElementById("info").innerHTML += "(" + userChoices[uuids[currentIndex]] + ")";
  }
}

function handleButtonClick(choice) {
	if (choice > 1) {
		userChoices[uuids[currentIndex]] = metas[choice - 1]["Type"] + "/" + metas[choice - 1]["Name"];
	}
	else if (choice == -1) userChoices[uuids[currentIndex]] = "Bad";
	else if (choice == 0) delete userChoices[uuids[currentIndex]];

	console.log("User choice on" + uuids[currentIndex] + ": " + userChoices[uuids[currentIndex]])
	
	showGraspInfo();
	nextPage();
}

function downloadButtonClick() {
  let userChoicesJSON = JSON.stringify(userChoices);
  let blob = new Blob([userChoicesJSON], { type: "application/json" });
  let url = URL.createObjectURL(blob);
  console.log("Downloaded file")
  
  var link = document.createElement('a');
  link.href = url;
  link.download = "user_choices.json";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

function previousPage() {
  index = (currentIndex - 1) % uuids.length;
  if (index < 0) {
    index += uuids.length;
  }
  updateGrasp(index);
}

function nextPage() {
  updateGrasp((currentIndex + 1) % uuids.length);
}

function updateGrasp(targetIndex) {
  currentIndex = targetIndex;
  document.getElementById("grasp_iframe").src = "grasps/" + uuids[targetIndex] + ".html";
  showGraspInfo();
}

async function onLoad() {
  await loadData();
  showGraspInfo();
  updateGrasp(0);
}

var uuids = [];

var currentIndex = 0;

var userChoices = {};
var colors = {
  Power: "#F65314",
  Intermediate: "#FFBB00",
  Precision: "#7CBB00",
};

function generateUUID() {
  let array = new Uint8Array(16);
  window.crypto.getRandomValues(array);
  array[6] = (array[6] & 0x0f) | 0x40;
  array[8] = (array[8] & 0x3f) | 0x80;
  let uuid = [...array].map((b) => b.toString(16).padStart(2, "0")).join("");
  return `${uuid.slice(0, 8)}-${uuid.slice(8, 12)}-${uuid.slice(
    12,
    16
  )}-${uuid.slice(16, 20)}-${uuid.slice(20)}`;
}

var metas;
var userId = generateUUID();

console.log("User ID: " + userId);

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
      let curType= metas[0]["Type"];
      metas.forEach(function (meta) {
        // if (meta["Type"] != curType) {
        //   curType = meta["Type"];
        //   br = document.createElement("br");
        //   taxoImageDiv.appendChild(br);
        // }
        n_but = _n_but.toString();
        var taxoButton = document.createElement("button");
        color = colors[meta["Type"]];
        taxoButton.setAttribute("onclick", "handleButtonClick(" + _n_but + ")");
        taxoButton.style = "background-color:" + color + ";";
        taxoButton.innerHTML = meta["Id"] + ". " + meta["Name"];

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
  document.getElementById("page").innerHTML = (currentIndex + 1) + " / " + uuids.length;

  if (uuids[currentIndex] in userChoices) {
    document.getElementById("info").innerHTML +=
      " (" + userChoices[uuids[currentIndex]] + ")";
  }
}

function handleButtonClick(choice) {
  if (choice > 1) {
    userChoices[uuids[currentIndex]] =
      metas[choice - 1]["Type"] + "/" + metas[choice - 1]["Name"];
  } else if (choice == -1) userChoices[uuids[currentIndex]] = "Bad";
  else if (choice == 0) delete userChoices[uuids[currentIndex]];

  console.log(
    "User choice on" +
      uuids[currentIndex] +
      ": " +
      userChoices[uuids[currentIndex]]
  );

  showGraspInfo();
  nextPage();
}

function downloadButtonClick() {
  let userChoicesJSON = JSON.stringify(userChoices);
  let blob = new Blob([userChoicesJSON], { type: "application/json" });
  let url = URL.createObjectURL(blob);
  console.log("Downloaded file");

  var link = document.createElement("a");
  link.href = url;
  link.download = userId + ".json";
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
  document.getElementById("grasp_iframe").src =
    "grasps/" + uuids[targetIndex] + ".html";
  showGraspInfo();
}

async function onLoad() {
  await loadData();
  showGraspInfo();
  updateGrasp(0);
  document.getElementById("user").innerHTML = "Current Session: " + userId;
}

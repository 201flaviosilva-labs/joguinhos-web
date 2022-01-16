import Assets from "../Assets.js";
import Links from "../Links.js";
import { randomColor, deleteAllChildDom } from "../Scripts/util.js";

let framework = "Todos"; // Todos, Canvas, Phaser, Vanilla, Others, Labs

// Dom
document.getElementById("JoguinhosWebTitle").style.color = randomColor();
const selectFramework = document.getElementById("Framework");
const ulTag = document.getElementById("ul");

selectFramework.addEventListener("change", () => {
  framework = selectFramework.value;
  getLinkInfos();
});

function getLinkInfos() {
  deleteAllChildDom(ulTag);


  Object.keys(Links).map(fwKey => { // fwKey -> framework Key
    Links[fwKey].map(link => {
      if (framework == fwKey || framework == "Todos") printLinks(fwKey, link);
    });
  });
}

function printLinks(fwKey, link) {
  const li = document.createElement("li");
  const gameName = document.createElement("h3");
  const WebLink = document.createElement("a");
  const WebImg = document.createElement("img");

  li.style.borderColor = "white";

  // Framework
  if (fwKey === "Canvas") li.style.background = "red";
  else if (fwKey === "Phaser") li.style.background = "royalblue";
  else if (fwKey === "Vanilla") li.style.background = "orange";
  else if (fwKey === "Externs") li.style.background = "#0da195";
  else if (fwKey === "Others") li.style.background = "gold";
  else if (fwKey === "Labs") li.style.background = "green";
  else li.style.background = "grey";

  let title = link.Name + " - " + fwKey;
  if (fwKey === "Others") title = link.Name + " - " + link.FrameWork + " - " + fwKey;
  li.title = title;


  let linkWeb = link.Web;
  if (fwKey !== "Externs") {
    let linkCompleto = "./Games/" + fwKey + "/";
    if (framework) linkCompleto = "/src/Games/" + fwKey + "/";
    linkWeb = linkCompleto + link.Web + "/index.html";
  }

  gameName.innerHTML = link.Name;
  li.appendChild(gameName);

  const divLinks = document.createElement("div");
  divLinks.classList.add("divLinks");

  WebLink.href = !link.externLink ? linkWeb : link.Web;
  WebLink.title = "Web";
  WebImg.src = Assets.Icons["Web"];

  WebLink.appendChild(WebImg);
  divLinks.appendChild(WebLink);


  // const l = Object.keys(link);
  // for (let i = 0; i < l.length; i++) {
  //   if (l[i] == "Name" || l[i] == "Web" || l[i] == "FrameWork") continue;

  //   console.log(link[l]);

  //   const a = document.createElement("a");
  //   const img = document.createElement("img");

  //   a.href = link[l];
  //   a.title = l;
  //   img.src = Assets.Icons[l];

  //   a.appendChild(img);
  //   divLinks.appendChild(a);
  // }


  li.appendChild(divLinks);
  ulTag.appendChild(li);
}

getLinkInfos();

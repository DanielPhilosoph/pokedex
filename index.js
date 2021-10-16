// ===================================
// ======= API Requests ==============
// ===================================

async function getPokimonsByType(typeUrl) {
  try {
    const response = await axios.get("https://pokeapi.co/api/v2/type/3/");
    return response.data.pokemon;
  } catch (error) {
    errorMassage(error);
  }
}

async function getPokimon(pokimonName) {
  try {
    if (pokimonName === "") {
      throw "Cant be null";
    }
    const response = await axios.get(
      `https://pokeapi.co/api/v2/pokemon/${pokimonName}`
    );
    // 0-name, 1-height, 2-wieght, 3-frontImg, 4-backImg, 5-type
    return [
      response.data.name,
      response.data.height,
      response.data.weight,
      response.data.sprites.front_default,
      response.data.sprites.back_default,
      response.data.abilities,
      response.data.types,
    ];
  } catch (error) {
    errorMassage(`Pokimon '${pokimonName}' could not be found. (${error})`);
  }
}

// ===================================
// ======= Event Handlers ============
// ===================================

function onMouseEnterImg(event, backImgUrl) {
  event.target.src = backImgUrl;
}

function onMouseLeaveImg(event, imgUrl) {
  event.target.src = imgUrl;
}

async function onTypeClick(event, typesUrl) {
  event.preventDefault();
  const typesArray = await getPokimonsByType(typesUrl);
  createTypeList(typesArray);
}

async function searchPokimonInput() {
  let errorMsg = document.getElementById("errorMsg");
  let liveCard = document.getElementById("liveCard");
  if (errorMsg !== null) {
    errorMsg.remove();
  }
  const input = document.querySelector("#search");
  let infoArray = await getPokimon(input.value);
  if (infoArray !== undefined) {
    if (liveCard !== null) {
      liveCard.remove();
    }
    createCard(
      infoArray[0],
      infoArray[1],
      infoArray[2],
      infoArray[3],
      infoArray[4],
      infoArray[5],
      infoArray[6]
    );
  }
}

function onButtonClick(event) {
  event.preventDefault();
  searchPokimonInput();
}

function onLiEnter(event) {
  event.target.classList.add("bg-info", "text-white");
}

function onLiLeave(event) {
  event.target.classList.remove("bg-info", "text-white");
}

function onTypeListClick(event) {
  let searchInput = document.querySelector("#search");
  searchInput.value = event.target.textContent;
  searchPokimonInput();
}

// ===================================
// ======= DOM Functions =============
// ===================================

function errorMassage(massage) {
  let textSpam = createElement("spam", [massage], ["badge", "badge-danger"], {
    id: "errorMsg",
  });
  document.getElementById("errorDiv").append(textSpam);
}

function getLiEventListeners() {
  return {
    mouseenter: (event) => {
      onLiEnter(event);
    },
    mouseleave: (event) => {
      onLiLeave(event);
    },
    click: (event) => {
      onTypeListClick(event);
    },
  };
}

function createTypeList(pokimonsTypesArray) {
  let modalBody = document.querySelector("#modalBody");
  let pokimonsArray = [];
  pokimonsTypesArray.forEach((pokimon) => {
    pokimonsArray.push(
      createElement(
        "li",
        [pokimon.pokemon.name],
        [],
        { style: "cursor:pointer", "data-dismiss": "modal" },
        getLiEventListeners()
      )
    );
  });
  let typesUl = createElement("ul", [...pokimonsArray]);
  modalBody.append(typesUl);
}

function createCard(
  name,
  Hieght,
  Wieght,
  imgUrl,
  backImgUrl,
  abilities,
  types
) {
  // Big Image - can turn on hover
  /////////////////////////////////
  let img = createElement(
    "img",
    [],
    ["card-img-top"],
    {
      id: "pokImg",
      src: imgUrl,
      alt: "Card image cap",
    },
    {
      mouseenter: (event) => {
        onMouseEnterImg(event, backImgUrl);
      },
      mouseleave: (event) => {
        onMouseLeaveImg(event, imgUrl);
      },
    }
  );

  // Card types - first
  ////////////////////////
  let typesArray = [];
  types.forEach((type) => {
    typesArray.push(
      createElement(
        "button",
        [`Type: ${type.type.name}`],
        ["card-text", "btn", "btn-info"],
        {
          type: "button",
          "data-toggle": "modal",
          "data-target": "#Pok",
          style: "margin-left:4px",
        },
        {
          click: (event) => {
            onTypeClick(event, type.type.url);
          },
        }
      )
    );
  });

  let title = createElement(
    "h5",
    [name.charAt(0).toUpperCase() + name.slice(1)],
    ["card-title"]
  );

  let typesDiv = createElement("div", [title, ...typesArray], ["card-body"]);

  // Card info - second
  ////////////////////////
  let li1 = createElement("li", [`Weight: ${Wieght} Kg`], ["list-group-item"]);
  let li2 = createElement("li", [`Height: ${Hieght} m`], ["list-group-item"]);
  let listInfo = createElement(
    "ul",
    [li1, li2],
    ["list-group", "list-group-flush"]
  );

  // Card ability - third
  ////////////////////////////
  let abilityArray = [];
  abilities.forEach((ability) => {
    abilityArray.push(
      createElement("p", [`ability: ${ability.ability.name}`], ["card-text"])
    );
  });
  let abilitiesDiv = createElement("div", [...abilityArray], ["card-body"]);

  // Main div
  //////////////////////
  let mainDiv = createElement(
    "div",
    [img, typesDiv, listInfo, abilitiesDiv],
    ["card", "mt-5"],
    {
      style: "width: 18rem; margin: auto",
      id: "liveCard",
    }
  );

  document.querySelector("body").append(mainDiv);
}

function createElement(
  tagName,
  children = [],
  classes = [],
  attributes = {},
  eventListeners = {}
) {
  const myElement = document.createElement(tagName);

  children.map((child) => {
    myElement.append(child);
    return child;
  });

  classes.map((cls) => {
    myElement.classList.add(cls);
    return cls;
  });

  Object.entries(attributes).map(([attr, value]) => {
    myElement.setAttribute(attr, value);
    return attr;
  });

  Object.entries(eventListeners).map(([listener, handler]) => {
    myElement.addEventListener(listener, handler, true);
    return [listener, handler];
  });

  return myElement;
}

// ===================================
// ========= Main ====================
// ===================================

function main() {
  let button = document.querySelector("#submitButton");
  button.addEventListener("click", onButtonClick);
}

main();

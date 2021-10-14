// ====================
// ==== Imports =======
// ====================

async function getPokimon(pokimonName) {
  try {
    const response = await axios.get(
      `https://pokeapi.co/api/v2/pokemon/${pokimonName}`
    );
    console.log(response);
    // 0-name, 1-height, 2-wieght, 3-frontImg, 4-backImg
    return [
      pokimonName,
      response.data.height,
      response.data.weight,
      response.data.sprites.front_default,
      response.data.sprites.back_default,
    ];
  } catch (error) {
    throw error;
  }
}

async function main() {
  const pokName = document.querySelector("#pokName");
  const pokHeight = document.querySelector("#pokHeight");
  const pokWeight = document.querySelector("#pokWeight");
  const pokImg = document.querySelector("#pokImg");

  let infoArray = await getPokimon("pikachu");
  pokName.textContent = infoArray[0];
  pokHeight.textContent = infoArray[1];
  pokWeight.textContent = infoArray[2];
  pokImg.src = infoArray[3];
}

main();

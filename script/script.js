// @ts-check


async function init() {
    await fetchPokemonTypes();
    await loadAllPokemon();
    createCurrentPokemonArray();
}


/**
 * 
 * @param {number} pokemonId 
 */
async function showPokemon(pokemonId) {
    currentPokemon = await fetchPokemon(pokemonId);
    currentPokemonColors = pokemonAll[currentPokemon.id - 1].color;
    currentPokemonEvolution = await fetchEvolution(pokemonId);
    getElementById('content').style.display = '';
    renderPokemonInfo();
    renderMenuAbout('about');
    setTimeout(() => {
        document.addEventListener("click", handleOutsideClick);
    }, 200);
}


/**
 * Close Pokemon details when clicked outside the details card
 * @param {object} event 
 */
function handleOutsideClick(event) {
    const card = getElementById('card');
    const closeButton = getElementById('close');
    if (!card.contains(event.target) && event.target !== closeButton) {
        document.removeEventListener("click", handleOutsideClick);
        closeDetails();
    }
}


/**
 * Close Pokemon details
 */
function closeDetails() {
    getElementById('content').style.display = 'none';
}


/**
 * @description Create current Pokemon array - either all Pokemon or using the search request
 * @param {string} searchMode 
 */
function createCurrentPokemonArray(searchMode = '') {
    loadedPokemon = 0;
    getElementById('overview').innerHTML = '';
    if (searchMode === 'search') {
        const searchValue = getInputElementById('searchValue').value;
        currentPokemonArray = pokemonAll.filter((v) => v.name.includes(searchValue.toLowerCase()));
        getInputElementById('searchValue').value = '';
    } else {
        currentPokemonArray = pokemonAll;
    }
    showAllPokemons();
}


/**
 * @description Show all Pokemon
 */
function showAllPokemons() {
    currentPokemonArray.forEach((element, index) => {
        const startindex = loadedPokemon;
        const endindex = startindex + chunk;
        const maxindex = currentPokemonArray.length;
        if (index >= startindex && index < endindex && index < maxindex) {
            element.color = settingPokemonTypeColors(element);
            getElementById('overview').innerHTML += pokemonOverviewTemplate(element);
        }
    })
    loadedPokemon += 50;
}


/**
 * @description Loading basic data from a specific pokeman from the API
 * @param {number} pokemon 
 */
async function fetchPokemon(pokemon) {
    const baseUrl = new URL('https://pokeapi.co/api/v2/pokemon/');
    const url = new URL(pokemon, baseUrl);
    const res = await fetch(url.toJSON());
    return await res.json();
}


/**
 * @description Loading species data from a specific pokeman from the API
 * @param {number} pokemon 
 * @returns 
 */
async function fetchEvolution(pokemon) {
    const baseUrl = new URL('https://pokeapi.co/api/v2/pokemon-species/');
    const url = new URL(pokemon, baseUrl);
    const res = await fetch(url.toJSON());
    currentPokemonSpecies = await res.json();
    const evolutionUrl = currentPokemonSpecies.evolution_chain.url;
    const resEvolution = await fetch(evolutionUrl);
    return await resEvolution.json();
}


/**
 * @description Load basic pokemon data from the API
 */
async function loadAllPokemon() {
    const data = await fetchPokemonDetails();
    pokemonAll = data.pokemon_entries.map(entry => {
        return {
            id: entry.entry_number,
            name: entry.pokemon_species.name,
            types: getTypesByPokemonName(entry.pokemon_species.name),
        };
    });
}


/**
 * @description Setting the Pokemon Type Colours
 * @param {object} element 
 */
function settingPokemonTypeColors(element) {
    let colorObject = {};
    pokemonTypes.forEach(v => {
        if (v.type === element.types.primary) {
            colorObject.colorDefault = v.color.default;
            colorObject.lightPrimary = v.color.light;
        }
        if (v.type === element.types.secondary) {
            colorObject.lightSecondary = v.color.light;
        }
    });
    return colorObject;
}


/**
 * @description Loading all pokemon ids and names from the API
 * @returns
 */
async function fetchPokemonDetails() {
    const baseUrl = new URL('https://pokeapi.co/api/v2/pokedex/1');
    const res = await fetch(baseUrl.toJSON());
    return await res.json();
}


/**
 * @description Assign Pokemon Type 
 */
async function fetchPokemonTypes() {
    for (const type of pokemonTypes) {
        const detail = await fetchPokemonTypeDetails(type.id);
        detail.pokemon.forEach(v => {
            v.slot === 2 ? type.pokemons.secondary.push(v.pokemon.name) : type.pokemons.primary.push(v.pokemon.name);
        })

    }
}


/**
 * @description Loading all Pokemon IDs and names from one type
 * @param {number} id 
 * @returns
 */
async function fetchPokemonTypeDetails(id) {
    const res = await fetch(`https://pokeapi.co/api/v2/type/${id}`);
    return await res.json();
}


/**
 * @description Assign Pokemon Type
 * @param {string} name 
 * @returns 
 */
function getTypesByPokemonName(name) {
    const types = {};
    for (const type of pokemonTypes) {
        if (type.pokemons.primary.some(type => type.startsWith(name))) {
            types.primary = type.type;
        } else if (type.pokemons.secondary.some(type => type.startsWith(name))) {
            types.secondary = type.type;
        }
    }
    return types;
}


/**
 * @description Indicate how far the page has been scrolled and whether 80 % has been reached.
 * @returns {boolean} true or false Page 80% scrolled
 */
function hasScrolled80Percent() {
    const windowHeight = window.innerHeight;
    const documentHeight = document.body.clientHeight;
    const scrollY = window.scrollY;
    return (scrollY + windowHeight) / documentHeight >= 0.8;
}


// When 80% of the page has been loaded, more Pokemons are loaded
window.addEventListener('scroll', function () {
    if (hasScrolled80Percent()) {
        showAllPokemons();
    }
});


/**
 * @description Render Pokemon details
 */
function renderPokemonInfo() {
    // Load Pokemon image
    showCurrentPokemonImage();
    // Include navigation
    showCurrentPokemonDetailsNav();
    // Set Pokemon Name in the detail view 
    getCurrentPokemonName();
    // Set background & second color in the detail view 
    setCurrentPokemonColors();
    // Show Pokemon ID formatted in the detail view 
    showCurrentPokemonId();
}


/**
 * @description Include navigation
 */
function showCurrentPokemonDetailsNav() {
    const currentSection = getElementById('pokemonDetailsNav');
    currentSection.innerHTML = '';
    currentSection.innerHTML = detailsNavTemplate();
}


/**
 * @description Load Pokemon Image
 */
function showCurrentPokemonImage() {
    getImageElementById('pokemonImage').src = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${currentPokemon.id}.png`;
}


/**
 * @description Set Pokemon Name in the detail view 
 */
function getCurrentPokemonName() {
    const pokemonName = showFirstLetterUppercase(currentPokemon.name);
    getElementById('pokemonName').innerHTML = pokemonName;
}


/**
 * @description Set background & second color in the detail view 
 */
function setCurrentPokemonColors() {
    getElementById('card').style.backgroundColor = currentPokemonColors.colorDefault;
    mainAndSecondType();
}


/**
 * @description Show Pokemon ID formatted in the detail view 
 */
function showCurrentPokemonId() {
    getElementById('pokemonId').innerHTML = `#${currentPokemon.id.toString().padStart(3, '0')}`;
}


/**
 * @description Returns the main type of the Pokemon
 * @returns {string}
 */
function getPrimaryTypeCurrentPokemon() {
    return currentPokemon.types[0].type['name'];
}


/**
 * @description Show main and second types
 */
function mainAndSecondType() {
    getElementById('pokemonElemente').innerHTML = '';
    const moves = currentPokemon.types.map((v, index) => {
        const type = showFirstLetterUppercase(v.type.name);
        getElementById('pokemonElemente').innerHTML += `<span id="type${index}">${type}</span>`;
        getElementById(`type${index}`).style.backgroundColor = `${index === 0 ? currentPokemonColors.lightPrimary : currentPokemonColors.lightSecondary}`;
    });
}


/**
 * @description Converts the first letter of a word into a capital letter.
 * @param {string} string 
 * @returns {string} 
 */
function showFirstLetterUppercase(string) {
    return string[0].toUpperCase() + string.slice(1)
}


/**
 * @description Show "About" chart on the Pokemon card
 * @param {Menu} menu 
 */
function renderMenuAbout(menu) {
    selectMenuPoint(menu);
    const currentSection = getElementById('pokemonDetailsContent');
    currentSection.innerHTML = aboutTemplate();
    showCurrentPokemonAbilities();
}


/**
 * @description Data for the abilities in the "About" menu item
 */
function showCurrentPokemonAbilities() {
    getElementById('abilities').innerHTML = '';
    const abilityNames = currentPokemon.abilities.map(value => showFirstLetterUppercase(value.ability.name)).join(', ');
    getElementById('abilities').innerHTML += abilityNames;
}


/**
 * @description Show "Base Stats" chart on the Pokemon card (with chart.js)
 * @param {Menu} menu 
 */
function renderBaseStats(menu) {
    selectMenuPoint(menu);
    getElementById('pokemonDetailsContent').innerHTML = baseStatsTemplate();
    const ctx = getElementById('baseStats');
    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['HP', 'Attack', 'Defense', 'Sp.Atk.', 'Sp.Def.', 'Speed'],
            datasets: [{
                barThickness: 8,
                maxBarThickness: 20,
                data: currentPokemon.stats.map(v => v.base_stat),
                borderWidth: 0,
                label: '',
                backgroundColor: [currentPokemonColors.colorDefault, currentPokemonColors.lightPrimary]
            }]
        },
        options: {
            indexAxis: 'y',
            scales: {
                x: {
                    beginAtZero: true,
                }
            },
            plugins: {
                legend: {
                    display: false,
                },
            }
        }
    });
}


/**
 * @description Show "Evolution" menu on the Pokemon card
 * @param {Menu} menu 
 */
function renderEvolution(menu) {
    selectMenuPoint(menu);
    getElementById('pokemonDetailsContent').innerHTML = '';
    const evolutionChain = pokemonEvolutionChain();
    getElementById('pokemonDetailsContent').innerHTML = renderEvolutionTemplate(evolutionChain);
}


/**
 * @description Show "Moves" menu on the Pokemon card
 * @param {Menu} menu 
 */
function renderMoves(menu) {
    selectMenuPoint(menu);
    const currentSection = getElementById('pokemonDetailsContent');
    currentSection.innerHTML = renderMovesTemplate();
    getElementById('pokemonMoves').innerHTML = '';
    currentPokemon.moves.forEach((v) => {
        const move = showFirstLetterUppercase(v.move.name);
        getElementById('pokemonMoves').innerHTML += `<p class="moves">${move}</p>`;
        document.querySelectorAll(".moves").forEach(v => v.style.backgroundColor = currentPokemonColors.colorDefault);
    });
}


/**
 * @description Change menu item to active
 * @param {Menu} menu 
 */
function selectMenuPoint(menu) {
    const allMenuPoints = document.querySelectorAll('.menu_point');
    const selectedMenuPoint = document.querySelector(`.menu_point.menu_${menu}`);
    if (allMenuPoints && selectedMenuPoint) {
        allMenuPoints.forEach(v => v.classList.remove('active'));
        selectedMenuPoint.classList.add('active');
    }
}


/**
 * @description Data for the menu item "Evolution
 * @returns {Object}
 */
function pokemonEvolutionChain() {
    let evolutionChain = {};
    const firstDevelopmentLevel = currentPokemonEvolution.chain;
    if (firstDevelopmentLevel.evolves_to.length) {
        // Basic row of the evolutionary chain
        evolutionChain.level0Name = showFirstLetterUppercase(firstDevelopmentLevel.species.name);
        evolutionChain.level0Id = (firstDevelopmentLevel.species.url).split('/').slice(0, -1).pop();
        // First row of the evolutionary chain
        evolutionChain.level1Name = showFirstLetterUppercase(firstDevelopmentLevel.evolves_to[0].species.name);
        evolutionChain.level1Id = (firstDevelopmentLevel.evolves_to[0].species.url).split('/').slice(0, -1).pop();
        evolutionChain.level1Lvl = firstDevelopmentLevel.evolves_to[0].evolution_details[0].min_level;
        const secondDevelopmentLevel = firstDevelopmentLevel.evolves_to[0];
        if (secondDevelopmentLevel.evolves_to.length) {
            // Second row of the evolutionary chain
            evolutionChain.level2Name = showFirstLetterUppercase(secondDevelopmentLevel.evolves_to[0].species.name);
            evolutionChain.level2Id = (secondDevelopmentLevel.evolves_to[0].species.url).split('/').slice(0, -1).pop();
            evolutionChain.level2Lvl = secondDevelopmentLevel.evolves_to[0].evolution_details[0].min_level;
        }
    }
    return evolutionChain;
}
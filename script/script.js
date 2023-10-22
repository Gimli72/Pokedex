// @ts-check


/** @typedef {'about' | 'baseStats' | 'evolution' | 'moves'} Menu */


let currentPokemon;
let currentPokemonSpecies;
let currentPokemonEvolution;
let pokemonAll = [];


async function init() {
    console.time('Load all Pokemon from API');
    await loadAllPokemon();
    console.timeEnd('Load all Pokemon from API');
    showAllPokemons();
}


/**
 * 
 * @param {number} pokemonId 
 */
async function showPokemon(pokemonId) {
    console.time('Load one Pokemon');
    currentPokemon = await fetchPokemon(pokemonId);
    currentPokemonEvolution = await fetchEvolution(pokemonId);
    console.timeEnd('Load one Pokemon');
    getElementById('content').style.display = '';
    renderPokemonInfo();
    renderAbout('about');
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
 * @description Load basic pokemon data from the API
 */
async function loadAllPokemon() {
    for (let j = 0; j <= 10; j++) {
        for (let i = 1 + (j * 9); i <= ((1 + j) * 9); i++) {
            const baseUrl = new URL('https://pokeapi.co/api/v2/pokemon/');
            const url = new URL(i, baseUrl);
            const res = await fetch(url.toJSON());
            const pokemonData = await res.json();

            const id = pokemonData.id;
            const name = pokemonData.name;
            const types = pokemonData.types.map(type => type.type.name).join(', ');
            const pokemonInfo = { id, name, types };
            pokemonAll.push(pokemonInfo);
        }
    }
}


/**
 * @description Show all Pokemon
 */
function showAllPokemons() {    
    console.time('Show all Pokemons');
    getElementById('overview').innerHTML = '';
    for (let i = 0; i < pokemonAll.length; i++) {
        const element = pokemonAll[i];
        getElementById('overview').innerHTML += pokemonOverviewTemplate(element);
    }
    console.timeEnd('Show all Pokemons');
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
 * @description Render Pokemon details
 */
function renderPokemonInfo() {
    // Load Pokemon image
    pokemonImage();
    // Include navigation
    detailsNav();
    // Set Pokemon Name in the detail view 
    pokemonName();
    // Set background & second color in the detail view 
    pokemonColor();
    // Show Pokemon ID formatted in the detail view 
    pokemonId();
}


/**
 * @description Include navigation
 */
function detailsNav() {
    const currentSection = getElementById('pokemonDetailsNav');
    currentSection.innerHTML = '';
    currentSection.innerHTML = detailsNavTemplate();
}


/**
 * @description Load Pokemon Image
 */
function pokemonImage() {
    getImageElementById('pokemonImage').src = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${currentPokemon.id}.png`;
}


/**
 * @description Set Pokemon Name in the detail view 
 */
function pokemonName() {
    const pokemonName = showFirstLetterUppercase(currentPokemon.name);
    getElementById('pokemonName').innerHTML = pokemonName;
}


/**
 * @description Set background & second color in the detail view 
 */
function pokemonColor() {
    getElementById('card').style.backgroundColor = `var(--bg-color-${pokemonMainType()})`;
    mainAndSecondType();
}


/**
 * @description Show Pokemon ID formatted in the detail view 
 */
function pokemonId() {
    getElementById('pokemonId').innerHTML = `#${currentPokemon.id.toString().padStart(3, '0')}`;
}


/**
 * @description Returns the main type of the Pokemon
 * @returns {string}
 */
function pokemonMainType() {
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
        getElementById(`type${index}`).style.backgroundColor = `var(--bg-color-${v.type.name}-light)`;
    });
}


/**
 * @description Converts the first letter of a word into a capital letter.
 * @param {string} string 
 * @returns {string} 
 */
function showFirstLetterUppercase(string) {
    return string[0].toUpperCase() + string.slice(1);
}


/**
 * @description Show "About" chart on the Pokemon card
 * @param {Menu} menu 
 */
function renderAbout(menu) {
    selectMenuPoint(menu);
    const currentSection = getElementById('pokemonDetailsContent');
    currentSection.innerHTML = aboutTemplate();
    pokemonAbilities();
}


/**
 * @description Data for the abilities in the "About" menu item
 */
function pokemonAbilities() {
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
    const mainStyle = getComputedStyle(document.documentElement);
    const color1 = mainStyle.getPropertyValue(`--bg-color-${pokemonMainType()}`);
    const color2 = mainStyle.getPropertyValue(`--bg-color-${pokemonMainType()}-light`);
    const currentSection = getElementById('pokemonDetailsContent');
    currentSection.innerHTML = baseStatsTemplate();
    const dataArray = [];
    currentPokemon.stats.map(v => dataArray.push(v.base_stat));
    const ctx = getElementById('baseStats');
    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['HP', 'Attack', 'Defense', 'Sp.Atk.', 'Sp.Def.', 'Speed'],
            datasets: [{
                barThickness: 8,
                maxBarThickness: 20,
                data: dataArray,
                borderWidth: 0,
                label: '',
                backgroundColor: [color1, color2, color1, color2, color1, color2]
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
    const moves = currentPokemon.moves.map((v) => {
        const move = showFirstLetterUppercase(v.move.name);
        getElementById('pokemonMoves').innerHTML += `<p class="moves">${move}</p>`;
        document.querySelectorAll(".moves").forEach(v => v.style.backgroundColor = `var(--bg-color-${pokemonMainType()})`);
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
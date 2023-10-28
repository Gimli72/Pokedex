// @ts-check

/**
 * HTML structure for navigation
 * @returns html code
 */
const detailsNavTemplate = () => /*html*/ `
    <span class="menu_point menu_about active" onclick="renderMenuAbout('about')">About</span>
    <span class="menu_point menu_baseStats" onclick="renderBaseStats('baseStats')">Base Stats</span>
    ${currentPokemonEvolution.chain.evolves_to.length ? `<span class="menu_point menu_evolution" onclick="renderEvolution('evolution')">Evolution</span>` : ''}
    <span class="menu_point menu_moves" onclick="renderMoves('moves')">Moves</span>
`;


/**
 * HTML basic structure for chart
 * @returns html code
 */
const baseStatsTemplate = () => /*html*/ `
    <canvas id="baseStats" height="400" width="600">
        <!-- baseStats as Bar Chart.js -->
    </canvas>
`;


/**
 * HTML structure for "About" menu
 * @returns html code
 */
const aboutTemplate = () => /*html*/ `
    <div class="about_section">
        <div class="about_left">
            <span class="about">Height</span>
            <span class="about">Weight</span>
            <span class="about">Abilities</span>
            <span class="breeding">Breeding</span>
            <span class="about">Gender</span>
            <span class="about">Egg Groups</span>
            <span class="about">Habitat</span>
        </div>
        <div class="about_right">
            <span class="about_value">${currentPokemon.height*10} cm</span>
            <span class="about_value">${currentPokemon.weight/10} kg</span>
            <span class="about_value" id="abilities"></span>
            <span><br><br></span>
            <span class="about_value"><span class="male">♂ ${100 - (currentPokemonSpecies.gender_rate * 12.5)}%</span> <span class="female">♀ ${currentPokemonSpecies.gender_rate * 12.5}%</span></span>
            <span class="about_value">${showFirstLetterUppercase(currentPokemonSpecies.egg_groups[0].name)}</span>
            <span class="about_value">${currentPokemonSpecies.habitat ? showFirstLetterUppercase(currentPokemonSpecies.habitat.name) : '-'}</span>
        </div>        
    </div>
`;


/**
 * HTML structure for "Moves" menu
 * @returns html code
 */
const renderMovesTemplate = () => /*html*/ `
    <div class="pokemon_moves" id="pokemonMoves">

    </div>
`;


/**
 * HTML structure for "Evolution" menu // Two levels of evolution
 * @param {Object} evolutionChain 
 * @returns 
 */
const renderEvolutionTemplate = (evolutionChain) => /*html*/ `
    <div id="evolution">
        <h3>Evolution Chain</h3>
        <div class="evolution_header">
            <div class="evolution_header_img_left">
                <img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${evolutionChain.level0Id}.png"
                alt="" onclick="${currentPokemon.id.toString() === evolutionChain.level0Id ? '' : `showPokemon(${evolutionChain.level0Id})`}">
                <p>${evolutionChain.level0Name}</p>
            </div>
            <div class="evolution_arrow">
                <img src="./img/arrow-right-50.png" alt="">
                <p>${evolutionChain.level1Lvl ? 'Lvl ' + evolutionChain.level1Lvl : ''}</p>
            </div>
            <div class="evolution_header_img_right">
                <img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${evolutionChain.level1Id}.png" 
                alt="" onclick="${currentPokemon.id.toString() === evolutionChain.level1Id ? '' : `showPokemon(${evolutionChain.level1Id})`}">
                <p>${evolutionChain.level1Name}</p>
            </div>
        </div>
        ${Object.keys(evolutionChain).length > 5 ? `
        <div class="evolution_footer">
            <div class="evolution_header_img_left">
                <img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${evolutionChain.level1Id}.png"
                    alt="" onclick="${currentPokemon.id.toString() === evolutionChain.level1Id ? '' : `showPokemon(${evolutionChain.level1Id})`}">
                <p>${evolutionChain.level1Name}</p>
            </div>
            <div class="evolution_arrow">
                <img src="./img/arrow-right-50.png" alt="">
                <p>${evolutionChain.level2Lvl ? 'Lvl ' + evolutionChain.level2Lvl : ''}</p>
            </div>
            <div class="evolution_header_img_right">
                <img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${evolutionChain.level2Id}.png"
                    alt="" onclick="${currentPokemon.id.toString() === evolutionChain.level2Id ? '' : `showPokemon(${evolutionChain.level2Id})`}">
                <p>${evolutionChain.level2Name}</p>
            </div>` : ''}
        </div>
    </div>
`;


/**
 * HTML structure for "Evolution" menu // One level of evolution
 * @param {Object} evolutionChain 
 * @returns 
 */
const renderEvolutionTemplateLvl2 = (evolutionChain) => /*html*/ `
    <div id="evolution">
        <h3>Evolution Chain</h3>
        <div class="evolution_header">
            <div class="evolution_header_img_left">
                <img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${evolutionChain.level0Id}.png" 
                    alt="" onclick="${currentPokemon.id.toString() === evolutionChain.level0Id ? '' : `showPokemon(${evolutionChain.level0Id})`}">
                <p>${evolutionChain.level0Name}</p>
            </div>
            <div class="evolution_arrow">
                <img src="./img/arrow-right-50.png" alt="">
                <p>${evolutionChain.level1Lvl ? 'Lvl ' + evolutionChain.level1Lvl : ''}</p>
            </div>
            <div class="evolution_header_img_right">
                <img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${evolutionChain.level1Id}.png" 
                alt="" onclick="${currentPokemon.id.toString() === evolutionChain.level1Id ? '' : `showPokemon(${evolutionChain.level1Id})`}">
                <p>${evolutionChain.level1Name}</p>
            </div>
        </div>
    </div>
`;


/**
 * HTML structure for the complete overview of all Pokemon
 * @param {Object} element 
 * @returns 
 */
const pokemonOverviewTemplate = (element) => /*html*/ `
    <div class="pokemon" style="background-color: ${element.color.colorDefault}">
        <div class="pokemon_overview_header">
            <h2 class="pokemon_overview_name">${showFirstLetterUppercase(element.name)}</h2> <span class="pokemon_overview_id">#${element.id.toString().padStart(3, '0')}</span>
        </div>
        <div class="pokemon_overview_footer">
            <div class="pokemon_overview_types">
                <span style="background-color: ${element.color.lightPrimary}; text-align: center">${showFirstLetterUppercase(element.types.primary)}</span><br>
                ${element.types.secondary ? `<span style="background-color: ${element.color.lightSecondary}; text-align: center">${showFirstLetterUppercase(element.types.secondary)}</span>`: ``}
                
            </div>
            <div class="pokemon_overview_img" >
                <img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${element.id}.png"
                    alt="" onclick="showPokemon(${element.id})">
            </div>
        </div>
    </div>
`;


























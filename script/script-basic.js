// @ts-check


/** @typedef {'about' | 'baseStats' | 'evolution' | 'moves'} Menu */


let currentPokemon = {};
let currentPokemonSpecies = {};
let currentPokemonEvolution = {};
let currentPokemonColors = {};
let currentPokemonArray = [];
let pokemonAll = [];
let loadedPokemon = 0;
let chunk = 50;


/**
* @typedef {Object} Type
* @property {number} id 
* @property {string} type
* @property {{ default: string, light: string }}  color
* @property {{ primary: string[], secondary: string[] }} pokemons
*/


/**
 * @type {Type[]} 
 */
const pokemonTypes = [
    {
        id: 1,
        type: 'normal',
        color: {
            default: '#A8A878',
            light: '#C6C6A7'
        },
        pokemons: {
            primary: [],
            secondary: []
        }
    },
    {
        id: 2,
        type: 'fighting',
        color: {
            default: '#C03028',
            light: '#D67873'
        },
        pokemons: {
            primary: [],
            secondary: []
        }
    },
    {
        id: 3,
        type: 'flying',
        color: {
            default: '#A890EF',
            light: '#A890F0'
        },
        pokemons: {
            primary: [],
            secondary: []
        }
    },
    {
        id: 4,
        type: 'poison',
        color: {
            default: '#A041A0',
            light: '#C183C1'
        },
        pokemons: {
            primary: [],
            secondary: []
        }
    },
    {
        id: 5,
        type: 'ground',
        color: {
            default: '#E3C76A',
            light: '#EAD69D'
        },
        pokemons: {
            primary: [],
            secondary: []
        }
    },
    {
        id: 6,
        type: 'rock',
        color: {
            default: '#B8A038',
            light: '#D1C17C'
        },
        pokemons: {
            primary: [],
            secondary: []
        }
    },
    {
        id: 7,
        type: 'bug',
        color: {
            default: '#A8B820',
            light: '#C6D16E'
        },
        pokemons: {
            primary: [],
            secondary: []
        }
    },
    {
        id: 8,
        type: 'ghost',
        color: {
            default: '#705898',
            light: '#A292B6'
        },
        pokemons: {
            primary: [],
            secondary: []
        }
    },
    {
        id: 9,
        type: 'steel',
        color: {
            default: '#B8B8D0',
            light: '#D1D1E0'
        },
        pokemons: {
            primary: [],
            secondary: []
        }
    },
    {
        id: 10,
        type: 'fire',
        color: {
            default: '#F08031',
            light: '#F5AC78'
        },
        pokemons: {
            primary: [],
            secondary: []
        }
    },
    {
        id: 11,
        type: 'water',
        color: {
            default: '#6890F0',
            light: '#9DB7F5'
        },
        pokemons: {
            primary: [],
            secondary: []
        }
    },
    {
        id: 12,
        type: 'grass',
        color: {
            default: '#78C850',
            light: '#A7DB8D'
        },
        pokemons: {
            primary: [],
            secondary: []
        }
    },
    {
        id: 13,
        type: 'electric',
        color: {
            default: '#F8D031',
            light: '#FAE078'
        },
        pokemons: {
            primary: [],
            secondary: []
        }
    },
    {
        id: 14,
        type: 'psychic',
        color: {
            default: '#F85888',
            light: '#FA92B3'
        },
        pokemons: {
            primary: [],
            secondary: []
        }
    },
    {
        id: 15,
        type: 'ice',
        color: {
            default: '#98D8D8',
            light: '#BCE6E6'
        },
        pokemons: {
            primary: [],
            secondary: []
        }
    },
    {
        id: 16,
        type: 'dragon',
        color: {
            default: '#7038F7',
            light: '#A27DFA'
        },
        pokemons: {
            primary: [],
            secondary: []
        }
    },
    {
        id: 17,
        type: 'dark',
        color: {
            default: '#705848',
            light: '#A29288'
        },
        pokemons: {
            primary: [],
            secondary: []
        }
    },
    {
        id: 18,
        type: 'fairy',
        color: {
            default: '#EE99AC',
            light: '#F4BDC9'
        },
        pokemons: {
            primary: [],
            secondary: []
        }
    }
];
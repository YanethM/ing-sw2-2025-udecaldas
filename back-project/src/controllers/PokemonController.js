const { default: axios } = require("axios");

const getAllPokemonsWithAbilities = async (req, res) => {
    try {
      const response = await axios.get(
        "https://pokeapi.co/api/v2/pokemon?limit=1000",
        { timeout: 10000 }
      );
      
      const pokemons = response.data.results;
      console.log(`Found ${pokemons.length} pokemons, fetching abilities...`);
      
      const batchSize = 50;
      const pokemonAbilities = [];
      
      for (let i = 0; i < pokemons.length; i += batchSize) {
        const batch = pokemons.slice(i, i + batchSize);
        console.log(`Processing batch ${i/batchSize + 1}/${Math.ceil(pokemons.length/batchSize)}`);
        
        const batchResults = await Promise.all(
          batch.map(async (pokemon) => {
            try {
              const pokemonResponse = await axios.get(pokemon.url, { 
                timeout: 5000 
              });
              
              return {
                id: pokemonResponse.data.id,
                name: pokemon.name,
                abilities: pokemonResponse.data.abilities.map(
                  (ability) => ability.ability.name
                ),
              };
            } catch (error) {
              console.error(`Error fetching ${pokemon.name}: ${error.message}`);
              // Return partial data for failed requests instead of failing completely
              return {
                name: pokemon.name,
                abilities: ["fetch_failed"],
                error: error.message
              };
            }
          })
        );
        
        pokemonAbilities.push(...batchResults);
      }
      
      console.log(`Successfully processed ${pokemonAbilities.length} pokemons`);
      res.json(pokemonAbilities);
    } catch (error) {
      console.error("Error fetching pokemons:", error.message);
      res.status(500).json({ 
        error: "Error fetching pokemons", 
        message: error.message,
        stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
      });
    }
  };

module.exports = {
  getAllPokemonsWithAbilities,
};

import type { Request, Response } from 'express';

import { getPokemons, getPokemonById } from '../models/pokemonModel';

// CONTROLLER: LISTAR TODOS OS POKÉMONS

export const listPokemons = async (req: Request, res: Response) => {
    try {
        // chama o model

        const pokemons = await getPokemons();

        // responde para o cliente (browser/thunder client)
        res.json(pokemons);

    } catch (error) {
        res.status(500).json({ error: "Erro ao buscar pokémons." });
        console.log(error);
    }
}

export const getPokemon = async (req: Request, res: Response) => {

    try {
        
        // pega o ID da URL
        const id = Number(req.params.id);

        // chama o model

        const pokemon = await getPokemonById(id);

        // se não encontrar

        if (!pokemon) {
            return res.status(404).json({ message: "Pokémon não encontrado." });
        }

        // responde para o cliente, retornando o pokémon
        res.json(pokemon);

    } catch (error) {
        res.status(500).json({ error: "Erro ao buscar pokémon." });
    }
}
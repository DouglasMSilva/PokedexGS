import { Router } from "express";
import { listPokemons, getPokemon } from "../controllers/pokemonController";

const router = Router();

// ROTA: LISTAR TODOS OS POKÉMONS

// GET /pokemons
router.get("/pokemons", listPokemons);

// ROTA: BUSCAR UM POKÉMON POR ID
// GET /pokemons/1

router.get("/pokemons/:id", getPokemon);

export default router;
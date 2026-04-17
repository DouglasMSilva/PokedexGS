import { Router } from "express";
import { listPokemons, getPokemon } from "../controllers/pokemonController";

const router = Router();

// ROTA: LISTAR TODOS OS POKÉMONS

// GET /pokemons
router.get("/", listPokemons);

// ROTA: BUSCAR UM POKÉMON POR ID
// GET /pokemons/1

router.get("/:id", getPokemon);

export default router;
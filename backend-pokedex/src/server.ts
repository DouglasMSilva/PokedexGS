import express from 'express'; 
import cors from 'cors';
import type { Request, Response } from 'express';
import pokemonRoutes from './routes/pokemonRoutes';

const app = express();

const PORT = process.env.PORT || 3000;
app.use(express.json());
app.use(cors());


// USANDO AS ROTAS

// ROTA TESTE (IMPORTANTE)
app.get("/pokemons", (req: Request, res: Response) => {
  res.send("API rodando");
});

app.use("/pokemons", pokemonRoutes);

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
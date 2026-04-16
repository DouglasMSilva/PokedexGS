import express from 'express'; 
import cors from 'cors';
import type { Request, Response } from 'express';
import pokemonRoutes from './routes/pokemonRoutes';
//import { connection } from './database/connection';

const app = express();

const PORT = process.env.PORT || 3000;
app.use(express.json());
app.use(cors());

//app.get("/", async (req: Request, res: Response) => {
   //try {
  
    

    


    //const result = await connection.execute("SELECT * FROM pokemons");

    //const rows = result[0];
    // é o mesmo que const [rows] = await connection.execute("SELECT * FROM pokemons");

    //console.log(rows);

    //res.json(rows);

//    } catch (error) {
//         res.status(500).json({ error });
//    }
//});

// USANDO AS ROTAS
app.use(pokemonRoutes);

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
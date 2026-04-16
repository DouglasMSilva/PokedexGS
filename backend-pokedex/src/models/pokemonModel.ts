import { connection } from "../database/connection";

// =============================================
// FUNÇÃO AUXILIAR: FORMATAR POKÉMONS
// =============================================
// RESPONSABILIDADE:
// Essa função resolve o problema dos JOINs duplicando dados
//
// O banco retorna algo assim:
// Bulbasaur - Grass
// Bulbasaur - Poison
//
// Então aqui:
// agrupamos por ID
// evitamos duplicação
// montamos estrutura final para o front
//
function formatPokemons(rows: any[]) {

    // =============================================
    // MAP PARA AGRUPAMENTO
    // =============================================
    // chave = id do Pokémon
    // valor = objeto do Pokémon
    //
    const pokemonsMap: any = {};

    // =============================================
    // PERCORRE TODAS AS LINHAS DO BANCO
    // =============================================
    rows.forEach((row: any) => {

        // =============================================
        // CRIA O POKEMON (SE NÃO EXISTIR)
        // =============================================
        // Como o JOIN duplica linhas,
        // precisamos garantir que criamos apenas UMA vez
        //
        if (!pokemonsMap[row.id]) {
            pokemonsMap[row.id] = {
                id: row.id,

                // usamos os nomes vindos do AS da query
                name: row.pokemon_name,
                image: row.pokemon_image,

                types: [],        // lista de tipos
                evolutions: []    // lista de evoluções
            };
        }

        // =============================================
        // ADICIONA TIPOS
        // =============================================
        // row.type_name vem do SQL (AS type_name)
        //
        // includes evita duplicar tipo
        //
        if (
            row.type_name &&
            !pokemonsMap[row.id].types.includes(row.type_name)
        ) {
            pokemonsMap[row.id].types.push(row.type_name);
        }

        // =============================================
        // ADICIONA EVOLUÇÕES
        // =============================================
        // row.evolution_name vem do SQL
        //
        if (row.evolution_name) {

            // verifica se já adicionamos essa evolução
            const exists = pokemonsMap[row.id].evolutions.some(
                (e: any) => e.name === row.evolution_name
            );

            // se não existir, adiciona
            if (!exists) {
                pokemonsMap[row.id].evolutions.push({
                    name: row.evolution_name,
                    image: row.evolution_image
                });
            }
        }

    });

    // =============================================
    // RETORNO
    // =============================================
    // Converte o objeto em array
    //
    // Antes:
    // { 1: {...}, 2: {...} }
    //
    // Depois:
    // [ {...}, {...} ]
    //
    return Object.values(pokemonsMap);
}

// =============================================
// FUNÇÃO: Buscar todos os Pokémons
// =============================================
export const getPokemons = async () => {

    // =============================================
    // QUERY SQL
    // =============================================
    // COMO PENSAR:
    //
    // 1. Começo pela tabela principal → pokemons (p)
    // 2. Trago os tipos → (via tabela intermediária)
    // 3. Trago as evoluções → (autorrelacionamento)
    // 4. Uso LEFT JOIN para NÃO perder pokémons sem tipo ou evolução
    // 5. Uso AS para evitar conflito de nomes e dar significado aos dados
    //
    const query = `
        SELECT 
            p.id,                      -- ID do Pokémon (vem direto do banco)

            p.name AS pokemon_name,    -- Nome do Pokémon
            -- usamos AS porque existem vários "name" (tipo, evolução...)

            p.image AS pokemon_image,  -- Imagem do Pokémon

            t.name AS type_name,       
            -- Nome do tipo (ex: Grass, Fire)
            -- sem AS, viria como "name" e causaria confusão

            evo.name AS evolution_name,       
            evo.image AS evolution_image
            -- Nome e imagem da evolução

        FROM pokemons p
        -- "p" é um APELIDO (alias) da tabela pokemons

        -- =========================
        -- RELAÇÃO COM TIPOS
        -- =========================
        -- pokemons → pokemon_types → types

        LEFT JOIN pokemon_types pt 
            ON p.id = pt.pokemon_id
        -- Liga o Pokémon à tabela intermediária

        LEFT JOIN types t 
            ON pt.type_id = t.id
        -- Agora temos acesso ao tipo (t.name)

        -- =========================
        -- RELAÇÃO COM EVOLUÇÕES
        -- =========================
        -- pokemons → evolutions → pokemons (de novo)

        LEFT JOIN evolutions e 
            ON p.id = e.pokemon_id
        -- Verifica para quem o Pokémon evolui

        LEFT JOIN pokemons evo 
            ON e.evolves_to = evo.id
        -- Aqui acontece algo IMPORTANTE:
        --
        -- Estamos usando a tabela pokemons DE NOVO,
        -- mas com outro nome: "evo"
        --
        -- p   → Pokémon atual
        -- evo → Pokémon da evolução
    `;

    // executa a query
    const [rows]: any = await connection.execute(query);

    console.log(rows);

    if (!rows.length) {
        return null;
    }

    // agora usamos a função reutilizável
    return formatPokemons(rows);
};



// =============================================
// FUNÇÃO: Buscar UM Pokémon por ID
// =============================================
export const getPokemonById = async (id: number) => {

    // MESMA QUERY + FILTRO
    const query = `
        SELECT 
            p.id,

            p.name AS pokemon_name,
            p.image AS pokemon_image,

            t.name AS type_name,

            evo.name AS evolution_name,
            evo.image AS evolution_image

        FROM pokemons p

        LEFT JOIN pokemon_types pt 
            ON p.id = pt.pokemon_id

        LEFT JOIN types t 
            ON pt.type_id = t.id

        LEFT JOIN evolutions e 
            ON p.id = e.pokemon_id

        LEFT JOIN pokemons evo 
            ON e.evolves_to = evo.id

        WHERE p.id = ?
    `;

    const [rows]: any = await connection.execute(query, [id]);

    if (!rows.length) {
        return null;
    }
    
    console.log(rows);
    // usa a mesma função de formatação
    const result = formatPokemons(rows);

    // =============================================
    // DIFERENÇA PRINCIPAL
    // =============================================
    // retorna apenas UM objeto
    //
    // mesmo com WHERE, o JOIN ainda duplica linhas
    //
    return result[0] || null;
};
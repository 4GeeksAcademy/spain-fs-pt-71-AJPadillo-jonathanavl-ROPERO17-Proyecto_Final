from fastapi import FastAPI, HTTPException
import httpx

app = FastAPI

RAWG_API_URL = "https://api.rawg.io/api"

RAWG_API_KEY = si quieren la podemos cambiar

@app.get("/games")
async def get_games(page: int = 1, page_size: int = 10):
    try :
         url = f"{RAWG_API_URL}/games?page={page}&page_size={page_size}&key={RAWG_API_KEY}"
        # Hace la solicitud a la API externa
         async with httpx.AsyncClient() as client:
              response = await client.get(url)
              response.raise_for_status() # Esto tira una excepcion por si la solicitud falla
              data = response. json()
         return data # Devuelve la respuesta de la API externa

    except httpx.HTTPStatusError as e:
      raise HTTPException (status_code=e.response.status_code, detail = "Error al obtener los datos de RAWG API")   

@app.get("/games/{game_id}") 
async def get_game_by_id(game_id: int):
    try:
        url = f"{RAWG_API_URL}/games/{game_id}?key={RAWG_API_KEY}"
        async with httpx.AsyncClient() as client:
            response = await client.get(url)
            response.raise_for_status()
            data = response.json()
        return data
     
    except httpx.HTTPStatusError as e:
        raise HTTPException(estatus_code=e.response.status_code, detail="Error al obtener el juego")

@app.get("/genres") 
async def get_genres():
    try:
        url = f"{RAWG_API_URL}/genres?key={RAWG_API_KEY}"
        async with httpx.AsyncClient() as client:
            response = await client.get(url)   
            response.raise_for_status()
            data = response.json()
        return data

    except httpx.HTTPStatusError as e:
        raise HTTPException(status_code=e.response.status_code, detail="Error al obtener los generos")

from fastapi import FastAPI, HTTPException
import httpx
import os
from dotenv import dotenv_values

secrets = dotenv_values(".env")

app = FastAPI()

RAWG_API_URL = "https://api.rawg.io/api"

# Obtén la clave API de los secretos
RAWG_API_KEY = secrets.get("RAWG_API_KEY")


@app.get("/games")
async def get_games(page: int = 1, page_size: int = 10):
    if not RAWG_API_KEY:
        raise HTTPException(status_code=500, detail="La clave API no está configurada.")

    try:
        url = f"{RAWG_API_URL}/games?page={page}&page_size={page_size}&key={RAWG_API_KEY}"
        async with httpx.AsyncClient() as client:
            response = await client.get(url)
            response.raise_for_status()
            data = response.json()

        return data

    except httpx.HTTPStatusError as e:
        raise HTTPException(status_code=e.response.status_code, detail="Error al obtener los datos de RAWG API")

@app.get("/games/{game_id}")
async def get_game_by_id(game_id: int):
    if not RAWG_API_KEY:
        raise HTTPException(status_code=500, detail="La clave API no está configurada.")
    
    try:
        url = f"{RAWG_API_URL}/games/{game_id}?key={RAWG_API_KEY}"
        async with httpx.AsyncClient() as client:
            response = await client.get(url)
            response.raise_for_status()
            data = response.json()

        return data

    except httpx.HTTPStatusError as e:
        raise HTTPException(status_code=e.response.status_code, detail="Error al obtener el juego")

@app.get("/genres")
async def get_genres():
    if not RAWG_API_KEY:
        raise HTTPException(status_code=500, detail="La clave API no está configurada.")
    
    try:
        url = f"{RAWG_API_URL}/genres?key={RAWG_API_KEY}"
        async with httpx.AsyncClient() as client:
            response = await client.get(url)
            response.raise_for_status()
            data = response.json()

        return data

    except httpx.HTTPStatusError as e:
        raise HTTPException(status_code=e.response.status_code, detail="Error al obtener los géneros")

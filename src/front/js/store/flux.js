const getState = ({ getStore, getActions, setStore }) => {
	return {
		store: {
			message: "",
			token: "",
			currentUser: null,
			isLoggedIn: false,
			users: [],
			games: [],
			genres: [],
			gameDetails: null,// Aqui almacenamos los detalles del juego selecionado
			searchResults: [],
			reviews: [],// Almacena las reseñas
			currentPage: 1, // Almacena la página actual para la paginación
			totalPages: 1, // Almacena el número total de páginas disponibles
		},
		actions: {
			login: async (email, password) => {
				try {
					const response = await fetch(process.env.BACKEND_URL + "/api/login", {
						method: "POST",
						headers: {
							"Content-Type": "application/json"
						},
						body: JSON.stringify({ email, password }) // Envía el email y el password como un objeto JSON en el cuerpo de la solicitud
					});
					if (response.status === 200) { // Verifica si la respuesta de la API fue exitosa (código 200)
						const data = await response.json(); // Convierte la respuesta en formato JSON
						const accessToken = data.access_token;
						if (accessToken) {
							localStorage.setItem("accessToken", accessToken); // Guarda el token recibido en el localStorage del navegador
							await getActions().getCurrentUser(); // Obtiene la información del usuario actual
							console.log("Login successful"); // Mensaje de éxito en la consola
							console.log("Token:", data.access_token); // Muestra el token en la consola
							return true;
						}
						return false;
					}
				} catch (error) {
					console.error("Error al logear (flux.js):", error); // Captura y muestra cualquier error que ocurra durante el proceso
				}
			},

			logout: () => {
				localStorage.removeItem("accessToken");
				setStore({
					currentUser: null,
					isLoggedIn: false,
				});
			},

			createUser: async (email, password) => {
				try {
					const response = await fetch(process.env.BACKEND_URL + "/api/signup", {
						method: "POST",
						headers: {
							"Content-Type": "application/json",
						},
						body: JSON.stringify({ email, password }),
					});
					if (response.status === 200) {
						const data = await response.json();
						console.log("Usuario creado:", data);
						return true;
					} else {
						const errorData = await response.json();
						console.error("Error al crear usuario:", errorData.message);
						return false;
					}
				} catch (error) {
					console.error("Error al crear usuario:", error);
					return false;
				}
			},

			getCurrentUser: async () => {
				try {
					const accessToken = localStorage.getItem("accessToken");
					const response = await fetch(process.env.BACKEND_URL + "/api/current-user", {
						method: "GET",
						headers: {
							Authorization: `Bearer ${accessToken}`,
							"Content-Type": "application/json"
						}
					});
					if (response.status === 200) {
						const data = await response.json();
						const currentUser = data.current_user;
						setStore({ currentUser, isLoggedIn: true });
					} else {
						throw new Error("Failed to fetch current user");
					}
				} catch (error) {
					console.log("Error loading message from backend", error);
					localStorage.removeItem("accessToken");
					setStore({
						currentUser: null,
						isLoggedIn: false,
					});
				}
			},

			searchGames: async (query) => {
				try {
					const response = await fetch(process.env.API_RAWG_GET_URL + `/games?key=` + process.env.API_RAWG_KEY + `&search=${query}` //PENDIENTE SABER MODIFICACION ARCHIVO ENV
					);
					const data = await response.json();
					// Formatear los resultados para que solo incluyan el ID y el nombre del juego
					const formattedResults = data.results.map((game) => ({
						id: game.id,
						name: game.name
					}));
					// Actualizar el store con los resultados de búsqueda
					setStore({ searchResults: formattedResults });
				} catch (error) {
					console.error("Error fetching games:", error);
				}
			},

			updateProfileImage: async (newImage) => {
				try {
					const accessToken = localStorage.getItem("accessToken");
					const response = await fetch(process.env.BACKEND_URL + "/api/update-avatar", {
						method: "PUT",
						headers: {
							Authorization: `Bearer ${accessToken}`,
							"Content-Type": "application/json"
						},
						body: JSON.stringify({ avatar: newImage })
					});

					if (response.status === 200) {
						const updatedUser = await response.json();
						setStore({ currentUser: updatedUser });
						console.log("Imagen de perfil actualizada con éxito");
					} else {
						console.error("Error al actualizar la imagen de perfil");
					}
				} catch (error) {
					console.error("Error al actualizar la imagen de perfil:", error);
				}
			},

			//Accion para obtener Juegos
			getGames: async () => {
				try {
					const response = await fetch(process.env.API_RAWG_GET_URL + `/games?key=` + process.env.API_RAWG_KEY)
					if (response.ok) {
						const data = await response.json();
						setStore({ games: data.results })//Actualizamos el store con los juegos

					}
					else {
						console.error("Error fetching games:", response.statusText);
					}
				}
				catch (error) {
					console.error("Error fetching games:", error)
				}
			},
			
			loadMoreGames: async () => {
				try {
					const store = getStore();
					const currentLength = store.games.length;
					const response = await fetch(process.env.API_RAWG_GET_URL + `/games?key=` + process.env.API_RAWG_KEY + `&page=${Math.floor(currentLength / 20) + 1}`);
					
					if (response.ok) {
						const data = await response.json();
						setStore({ games: [...store.games, ...data.results] }); // Añadir nuevos juegos a los ya existentes
					} else {
						console.error("Error fetching more games:", response.statusText);
					}
				} catch (error) {
					console.error("Error fetching more games:", error);
				}
			},

			//Accion para obtener generos
			getGenres: async () => {
				try {
					const response = await fetch(process.env.API_RAWG_GET_URL + "/genres?key=" + process.env.API_RAWG_KEY)
					if (response.ok) {
						const data = await response.json();
						setStore({ genres: data.results });//Actualizamos el store con los generos
					}
					else {
						console.error("Error fetching genres:", response.statusText);
					}
				} catch (error) {
					console.error("Error fetching genres:", error);
				}
			},

			//Accion para obtener juegos por id
			getGameById: async (gameId) => {
				try {
					const response = await fetch(process.env.API_RAWG_GET_URL + `/games/${gameId}?key=` + process.env.API_RAWG_KEY)
					if (response.ok) {
						const data = await response.json();
						setStore({ gameDetails: data }); // Actualizamos el store con los detalles del juego
					}
					else {
						console.error("Error fetching game by ID:", response.statusText);
					}
				} catch (error) {
					console.error("Error fetching game by ID:", error);
				}
			},
			// Acción para obtener las reseñas 
			fetchReviews: async (page = 1) => {
				try {
					const response = await fetch(`${process.env.BACKEND_URL}/api/reviews?page=${page}`);
					if (response.ok) {
						const data = await response.json();
						setStore({
							reviews: data.reviews,
							currentPage: data.page,
							totalPages: data.total_pages,
						});
					} else {
						console.error("Error al cargar las reseñas");
					}
				} catch (error) {
					console.error("Error en fetchReviews:", error);
				}
			},

			// Acción para agregar una nueva reseña
			addReview: async (review) => {
				try {
					const response = await fetch(`${process.env.BACKEND_URL}/api/reviews`, {
						method: "POST",
						headers: {
							"Content-Type": "application/json",
						},
						body: JSON.stringify(review),
					});
					if (response.ok) {
						// Si la reseña se ha añadido correctamente, recarga las reseñas
						getActions().fetchReviews(getStore().currentPage);
					} else {
						console.error("Error al agregar la reseña");
					}
				} catch (error) {
					console.error("Error en addReview:", error);
				}
			},

			// Acción para cambiar de página en la paginación
			changePage: (page) => {
				const { fetchReviews } = getActions();
				fetchReviews(page); // Llama a fetchReviews con la nueva página
			},
		},
	

			/////////////////////////////////////////////////////////////////////////////////////////
			// Acción para obtener un mensaje (ejemplo de backend)
			getMessage: async () => {
				try {
					// fetching data from the backend
					const resp = await fetch(process.env.BACKEND_URL + "/api/hello")
					const data = await resp.json()
					setStore({ message: data.message })
					// don't forget to return something, that is how the async resolves
					return data;
				} catch (error) {
					console.log("Error loading message from backend", error)
				}
			},
		
	};

};

export default getState;

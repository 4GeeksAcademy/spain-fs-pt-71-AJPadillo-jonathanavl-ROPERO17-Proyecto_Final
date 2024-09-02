import axios from 'axios';

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
			gameDetails: null, // Aquí almacenamos los detalles del juego seleccionado
			searchResults: [],
			reviews: [], // Almacena las reseñas
			currentPage: 1, // Almacena la página actual para la paginación
			totalPages: 1, // Almacena el número total de páginas disponibles
		},
		actions: {
			login: async (email, password) => {
				try {
					const response = await axios.post(`${process.env.BACKEND_URL}/api/login`, { email, password });
					const { access_token } = response.data;
					if (access_token) {
						localStorage.setItem("accessToken", access_token);
						await getActions().getCurrentUser();
						console.log("Login successful");
						console.log("Token:", access_token);
						return true;
					}
					return false;
				} catch (error) {
					console.error("Error al logear (flux.js):", error.response?.data?.message || error.message);
					return false;
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
					const response = await axios.post(`${process.env.BACKEND_URL}/api/signup`, { email, password });
					console.log("Usuario creado:", response.data);
					return true;
				} catch (error) {
					console.error("Error al crear usuario:", error.response?.data?.message || error.message);
					return false;
				}
			},

			getCurrentUser: async () => {
				try {
					const accessToken = localStorage.getItem("accessToken");
					const response = await axios.get(`${process.env.BACKEND_URL}/api/current-user`, {
						headers: {
							Authorization: `Bearer ${accessToken}`,
						}
					});
					setStore({ currentUser: response.data.current_user, isLoggedIn: true });
				} catch (error) {
					console.error("Error loading current user from backend:", error.response?.data?.message || error.message);
					localStorage.removeItem("accessToken");
					setStore({
						currentUser: null,
						isLoggedIn: false,
					});
				}
			},

			searchGames: async (query) => {
				try {
					const response = await axios.get(`${process.env.API_RAWG_GET_URL}/games`, {
						params: {
							key: process.env.API_RAWG_KEY,
							search: query
						}
					});
					const formattedResults = response.data.results.map((game) => ({
						id: game.id,
						name: game.name
					}));
					setStore({ searchResults: formattedResults });
				} catch (error) {
					console.error("Error fetching games:", error.response?.data?.message || error.message);
				}
			},

			updateProfileImage: async (newImage) => {
				try {
					const accessToken = localStorage.getItem("accessToken");
					const response = await axios.put(`${process.env.BACKEND_URL}/api/update-avatar`, { avatar: newImage }, {
						headers: {
							Authorization: `Bearer ${accessToken}`,
						}
					});
					setStore({ currentUser: response.data });
					console.log("Imagen de perfil actualizada con éxito");
				} catch (error) {
					console.error("Error al actualizar la imagen de perfil:", error.response?.data?.message || error.message);
				}
			},

			getGames: async () => {
				try {
					const response = await axios.get(`${process.env.API_RAWG_GET_URL}/games`, {
						params: {
							key: process.env.API_RAWG_KEY
						}
					});
					setStore({ games: response.data.results });
				} catch (error) {
					console.error("Error fetching games:", error.response?.data?.message || error.message);
				}
			},

			loadMoreGames: async () => {
				try {
					const store = getStore();
					const currentLength = store.games.length;
					const response = await axios.get(`${process.env.API_RAWG_GET_URL}/games`, {
						params: {
							key: process.env.API_RAWG_KEY,
							page: Math.floor(currentLength / 20) + 1
						}
					});
					setStore({ games: [...store.games, ...response.data.results] });
				} catch (error) {
					console.error("Error fetching more games:", error.response?.data?.message || error.message);
				}
			},

			getGenres: async () => {
				try {
					const response = await axios.get(`${process.env.API_RAWG_GET_URL}/genres`, {
						params: {
							key: process.env.API_RAWG_KEY
						}
					});
					setStore({ genres: response.data.results });
				} catch (error) {
					console.error("Error fetching genres:", error.response?.data?.message || error.message);
				}
			},

			getGameById: async (gameId) => {
				try {
					const response = await axios.get(`${process.env.API_RAWG_GET_URL}/games/${gameId}`, {
						params: {
							key: process.env.API_RAWG_KEY
						}
					});
					setStore({ gameDetails: response.data });
				} catch (error) {
					console.error("Error fetching game by ID:", error.response?.data?.message || error.message);
				}
			},

			fetchReviews: async (page = 1) => {
				try {
					const response = await axios.get(`${process.env.BACKEND_URL}/api/reviews`, {
						params: {
							page
						}
					});
					setStore({
						reviews: response.data.reviews,
						currentPage: response.data.page,
						totalPages: response.data.total_pages,
					});
				} catch (error) {
					console.error("Error fetching reviews:", error.response?.data?.message || error.message);
				}
			},

			addReview: async (review) => {
				try {
					// Asegúrate de que el objeto review contiene todos los campos necesarios
					const response = await axios.post(`${process.env.BACKEND_URL}/api/reviews`, {
						game_id: review.game_id,  // ID del juego de la API RAWG
						user_id: review.user_id,  // ID del usuario autenticado
						title: review.title,      // Título de la reseña
						comment: review.comment   // Comentario de la reseña
					},
					{
						headers: {
							"Content-Type": "application/json",
						},
					});
					if (response.status === 201) {
						// Si la reseña se ha añadido correctamente, recarga las reseñas
						getActions().fetchReviews(getStore().currentPage);
					} else {
						console.error("Error al agregar la reseña");
					}
				} catch (error) {
					console.error("Error en addReview:", error.response?.data || error.message);
				}
			},
			
			

			changePage: (page) => {
				const { fetchReviews } = getActions();
				fetchReviews(page);
			},

			getReviewsForGame: async (gameId) => {
				try {
					const response = await axios.get(`${process.env.BACKEND_URL}/api/reviews/${gameId}`);
					setStore({ reviews: response.data });
				} catch (error) {
					console.error("Error fetching reviews:", error);
				}
			},

			updateReview: async (reviewId, updatedComment) => {
				try {
					const response = await axios.put(`${process.env.BACKEND_URL}/api/reviews/${reviewId}`, { comment: updatedComment });
					if (response.status === 200) {
						const updatedReview = response.data;
						const store = getStore();
						const updatedReviews = store.reviews.map(review =>
							review.id === reviewId ? updatedReview : review
						);
						setStore({ reviews: updatedReviews });
					}
				} catch (error) {
					console.error("Error updating review:", error);
				}
			},

			deleteReview: async (reviewId) => {
				try {
					const response = await axios.delete(`${process.env.BACKEND_URL}/api/reviews/${reviewId}`);
					if (response.status === 200) {
						const store = getStore();
						const updatedReviews = store.reviews.filter(review => review.id !== reviewId);
						setStore({ reviews: updatedReviews });
					}
				} catch (error) {
					console.error("Error deleting review:", error);
				}
			}
			,

			getMessage: async () => {
				try {
					const response = await axios.get(`${process.env.BACKEND_URL}/api/hello`);
					setStore({ message: response.data.message });
					return response.data;
				} catch (error) {
					console.error("Error loading message from backend:", error.response?.data?.message || error.message);
				}
			},
		}
	};
};

export default getState;

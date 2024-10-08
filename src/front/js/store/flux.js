import axios from 'axios';
import Cookies from 'js-cookie';

const getState = ({ getStore, getActions, setStore }) => {
	return {
		store: {
			message: "",
			token: "",
			currentUser: null,
			isLoadingUser: true,
			isLoggedIn: false,
			users: [],
			games: [],
			genres: [],
			gameDetails: null,
			searchResults: [],
			reviews: [],
			events: [],
			posts: [],
			comments: []
		},
		actions: {
			login: async (username, password) => {
				try {
					const response = await axios.post(`${process.env.BACKEND_URL}/api/login`, { username, password });
					const { access_token } = response.data;
					if (access_token) {
						Cookies.set('accessToken', access_token, { expires: 7 });
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
				Cookies.remove('accessToken');
				setStore({
					currentUser: null,
					isLoggedIn: false,
				});
			},

			createUser: async (username, email, password) => {
				try {
					const response = await axios.post(`${process.env.BACKEND_URL}/api/signup`, { username, email, password });
					console.log("Usuario creado:", response.data);
					return true;
				} catch (error) {
					console.error("Error al crear usuario:", error.response?.data?.message || error.message);
					return false;
				}
			},

			getCurrentUser: async () => {
				try {
					const accessToken = Cookies.get('accessToken');
					if (!accessToken) throw new Error("No token found");
					const response = await axios.get(`${process.env.BACKEND_URL}/api/current-user`, {
						headers: {
							Authorization: `Bearer ${accessToken}`,
						}
					});
					setStore({ currentUser: response.data.current_user, isLoggedIn: true, isLoadingUser: false });
				} catch (error) {
					console.error("Error loading current user from backend:", error.response?.data?.message || error.message);
					Cookies.remove('accessToken');
					setStore({
						currentUser: null,
						isLoggedIn: false,
						isLoadingUser: false,
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
					const accessToken = Cookies.get('accessToken');
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

			fetchReviews: async () => {
				try {
					const accessToken = Cookies.get('accessToken');
					const response = await axios.get(`${process.env.BACKEND_URL}/api/reviews`, {
						headers: {
							'Authorization': `Bearer ${accessToken}`
						}
					});
					if (response.data && Array.isArray(response.data)) {
						setStore({
							reviews: response.data
						});
					} else {
						throw new Error('Unexpected response format');
					}
				} catch (error) {
					console.error("Error fetching reviews:", error.response?.data?.msg || error.message || error.toString());
				}
			},

			addReview: async (review) => {
				try {
					const accessToken = Cookies.get('accessToken');
					const response = await axios.post(`${process.env.BACKEND_URL}/api/reviews/${review.game_id}`, {
						title: review.title,
						comment: review.comment
					}, {
						headers: {
							Authorization: `Bearer ${accessToken}`,
							"Content-Type": "application/json",
						},
					});
					if (response.status === 201) {
						getActions().getReviewsForGame(review.game_id);
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

			updateReview: async (reviewId, updatedTitle, updatedComment) => {
				try {
					const response = await axios.put(`${process.env.BACKEND_URL}/api/reviews/${reviewId}`, {
						title: updatedTitle,
						comment: updatedComment
					});
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
			},

			getEvents: async () => {
				try {
					const response = await axios.get(`${process.env.BACKEND_URL}/api/events`);
					setStore({ events: response.data });
				} catch (error) {
					console.error("Error fetching events:", error.response?.data?.message || error.message);
				}
			},

			createEvent: async (event) => {
				try {
					const accessToken = Cookies.get('accessToken');
					const response = await axios.post(
						process.env.BACKEND_URL + "/api/events",
						event,
						{
							headers: {
								"Authorization": `Bearer ${accessToken}`,
								"Content-Type": "application/json"
							}
						}
					);
					const store = getStore();
					setStore({ events: [...store.events, response.data] });
				} catch (error) {
					console.error("Error en createEvent:", error);
				}
			},

			updateEvent: async (eventId, updatedEvent) => {
				try {
					const accessToken = Cookies.get('accessToken');
					const response = await axios.put(
						`${process.env.BACKEND_URL}/api/events/${eventId}`,
						updatedEvent,
						{
							headers: {
								"Authorization": `Bearer ${accessToken}`,
								"Content-Type": "application/json"
							}
						}
					);
					const store = getStore();
					const updatedEvents = store.events.map(event => event.id === eventId ? response.data : event);
					setStore({ events: updatedEvents });
				} catch (error) {
					console.error("Error en updateEvent:", error);
				}
			},

			deleteEvent: async (eventId) => {
				try {
					const accessToken = Cookies.get('accessToken');

					await axios.delete(`${process.env.BACKEND_URL}/api/events/${eventId}`, {
						headers: {
							"Authorization": `Bearer ${accessToken}`
						}
					});
					const store = getStore();
					const updatedEvents = store.events.filter(event => event.id !== eventId);
					setStore({ events: updatedEvents });
				} catch (error) {
					console.error("Error en deleteEvent:", error);
				}
			},

			attendEvent: async (eventId) => {
				try {
					const accessToken = Cookies.get('accessToken');
					if (!accessToken) {
						console.error("Debes estar registrado para asistir a un evento.");
						window.location.href = "/login";
						return;
					}
					await axios.post(`${process.env.BACKEND_URL}/api/events/${eventId}/attend`, null, {
						headers: {
							"Authorization": `Bearer ${accessToken}`
						}
					});
					console.log("Asistencia registrada correctamente");
				} catch (error) {
					console.error("Error en attendEvent:", error);
				}
			},

			createPost: async (title, content, imageUrl) => {
				try {
					const token = Cookies.get('accessToken');
					const response = await axios.post(`${process.env.BACKEND_URL}/api/posts`, {
						title,
						content,
						image_url: imageUrl
					}, {
						headers: {
							'Authorization': `Bearer ${token}`,
							'Content-Type': 'application/json'
						}
					});
					console.log('Post creado:', response.data);
				} catch (error) {
					console.error('Error al crear el post:', error.response?.data?.message || error.message);
				}
			},

			updatePost: async (postId, title, content, imageUrl) => {
				try {
					const token = Cookies.get('accessToken');
					const response = await axios.put(`${process.env.BACKEND_URL}/api/posts/${postId}`, {
						title,
						content,
						image_url: imageUrl
					}, {
						headers: {
							'Authorization': `Bearer ${token}`,
							'Content-Type': 'application/json'
						}
					});
					console.log('Post actualizado:', response.data);
				} catch (error) {
					console.error('Error al actualizar el post:', error.response?.data?.message || error.message);
				}
			},

			deletePost: async (postId) => {
				try {
					const token = Cookies.get('accessToken');
					const response = await axios.delete(`${process.env.BACKEND_URL}/api/posts/${postId}`, {
						headers: {
							'Authorization': `Bearer ${token}`
						}
					});
					console.log('Post eliminado:', response.data);
				} catch (error) {
					console.error('Error al eliminar el post:', error.response?.data?.message || error.message);
				}
			},

			getPostById: async (postId) => {
				try {
					const token = Cookies.get('accessToken');
					const response = await axios.get(`${process.env.BACKEND_URL}/api/posts/${postId}`, {
						headers: {
							'Authorization': `Bearer ${token}`
						}
					});
					setStore({ currentPost: response.data });
				} catch (error) {
					console.error("Error al cargar el post:", error.response?.data?.message || error.message);
				}
			},

			getAllPost: async () => {
				try {
					const response = await axios.get(`${process.env.BACKEND_URL}/api/posts`);
					if (response.status === 200) {
						console.log("Posts obtenidos correctamente:", response.data);
						setStore({ posts: response.data });
					}
				} catch (error) {
					console.error("Error al obtener los posts:", error);
				}
			},

			createComment: async (postId, content) => {
				try {
					const token = Cookies.get('accessToken');
					const response = await axios.post(`${process.env.BACKEND_URL}/api/posts/${postId}/comments`, {
						content
					}, {
						headers: {
							'Authorization': `Bearer ${token}`
						}
					});
					console.log('Comentario creado:', response.data);
				} catch (error) {
					console.error('Error al crear el comentario:', error.response?.data?.message || error.message);
				}
			},

			updateComment: async (commentId, content) => {
				try {
					const token = Cookies.get('accessToken');
					const response = await axios.put(`${process.env.BACKEND_URL}/api/comments/${commentId}`, {
						content
					}, {
						headers: {
							'Authorization': `Bearer ${token}`
						}
					});
					console.log('Comentario actualizado:', response.data);
				} catch (error) {
					console.error('Error al actualizar el comentario:', error.response?.data?.message || error.message);
				}
			},

			deleteComment: async (commentId) => {
				try {
					const token = Cookies.get('accessToken');
					const response = await axios.delete(`${process.env.BACKEND_URL}/api/comments/${commentId}`, {
						headers: {
							'Authorization': `Bearer ${token}`
						}
					});
					console.log('Comentario eliminado:', response.data);
				} catch (error) {
					console.error('Error al eliminar el comentario:', error.response?.data?.message || error.message);
				}
			},

			getCommentsByPost: async (postId) => {
				try {
					const response = await fetch(`/api/posts/${postId}/comments`);
					const data = await response.json();
					setStore({ comments: data });
					return data;
				} catch (error) {
					console.error('Error fetching comments:', error);
				}
			},

			getCommentById: async (commentId) => {
				try {
					const token = Cookies.get('accessToken');
					const response = await axios.get(`${process.env.BACKEND_URL}/api/comments/${commentId}`, {
						headers: {
							'Authorization': `Bearer ${token}`
						}
					});
					setStore({ currentComment: response.data });
				} catch (error) {
					console.error("Error al cargar el comentario:", error.response?.data?.message || error.message);
				}
			},

			requestPasswordReset: async (email) => {
				try {
					const res = await axios.post(`${process.env.BACKEND_URL}/api/password-reset`, {
						email
					});
					console.log(res.data.msg);
				} catch (error) {
					console.error("Error al solicitar la recuperación de contraseña:", error.response ? error.response.data : error.message);
				}
			},

			resetPassword: async (email, resetCode, newPassword) => {
				try {
					const res = await axios.post(`${process.env.BACKEND_URL}/api/reset-password`, {
						email,
						reset_code: resetCode,
						new_password: newPassword
					});
					if (!res.data) throw new Error("Error al restablecer la contraseña");
					console.log(res.data.msg);
				} catch (error) {
					console.error("Error al restablecer la contraseña:", error.response ? error.response.data : error.message);
				}
			},

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
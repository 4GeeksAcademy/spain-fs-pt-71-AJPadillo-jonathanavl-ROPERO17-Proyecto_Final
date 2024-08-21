const getState = ({ getStore, getActions, setStore }) => {
	return {
		store: {
			message: "",
			token: "",
			currentUser: null,
			isLoggedIn: false,
			users: [],
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

			// Acción para cerrar sesión
			logout: () => {
				localStorage.removeItem("accessToken"); // Elimina el token del localStorage
				setStore({
					currentUser: null, // Establece el usuario actual como nulo en el store
					isLoggedIn: false, // Marcar como no logueado
				});
			},

			createUser: async (email, password) => {
				try {
					const response = await fetch(process.env.BACKEND_URL + "/api/signup", {
						method: "POST", // Especifica que la solicitud es de tipo POST
						headers: {
							"Content-Type": "application/json", // Especifica que el contenido es JSON
						},
						body: JSON.stringify({
							email, // Incluye el email en el cuerpo de la solicitud
							password // Incluye la contraseña en el cuerpo de la solicitud
						}),
					});
					if (response.status === 200) { // Verifica si la respuesta es exitosa
						const data = await response.json(); // Transformar la respuesta como JSON
						console.log("Usuario creado:", data);
						return true; // Retorna true si la creación fue exitosa
					} else {
						// Si la respuesta no es exitosa, lanza un error
						const errorData = await response.json(); // Transformar la respuesta como JSON
						console.error("Error al crear usuario:", errorData.message);
						return false; // Retorna false si hubo un error
					}
				} catch (error) {
					console.error("Error al crear usuario:", error); // Captura y muestra errores en la consola
					return false; // Retorna false si hubo un error durante la solicitud
				}
			},

			/////////////////////////////////////////////////////////////////////////////////////////
			getMessage: async () => {
				try{
					// fetching data from the backend
					const resp = await fetch(process.env.BACKEND_URL + "/api/hello")
					const data = await resp.json()
					setStore({ message: data.message })
					// don't forget to return something, that is how the async resolves
					return data;
				}catch(error){
					console.log("Error loading message from backend", error)
				}
			},
		}
	};
};

export default getState;

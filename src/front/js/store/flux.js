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
                        body: JSON.stringify({ email, password })
                    });
                    if (response.status === 200) {
                        const data = await response.json();
                        const accessToken = data.access_token;
                        if (accessToken) {
                            localStorage.setItem("accessToken", accessToken);
                            await getActions().getCurrentUser();
                            console.log("Login successful");
                            return true;
                        }
                        return false;
                    }
                } catch (error) {
                    console.error("Error al logear (flux.js):", error);
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

            getMessage: async () => {
                try {
                    const resp = await fetch(process.env.BACKEND_URL + "/api/hello");
                    const data = await resp.json();
                    setStore({ message: data.message });
                    return data;
                } catch (error) {
                    console.log("Error loading message from backend", error);
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
        }
    };
};

export default getState;

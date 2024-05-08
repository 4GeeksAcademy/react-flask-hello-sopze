const getState = ({ getStore, getActions, setStore }) => {
	return {
		store: {
			message: null
		},
		actions: {

			signup: async (formData)=>{
				console.log("signin", formData)
				try{
					route= formData.login ? `/signup?login=${formData.login}` : "/signup"
					const res = await fetch(process.env.BACKEND_URL + route, {
						method: 'POST',
						headers: {
							"Content-Type": "application/json"
						},
						body: JSON.stringify({
							"username": formData.username,
							"displayname": formData.displayname,
							"email": formData.email,
							"password": formData.password
						})
					})
					console.log("status", res.status)
					const data = await res.json()
					setStore({ message: data.msg })
					console.log("response", data)
					return data;
				}catch(error){
					let msg= "Error loading message from backend"
					console.log(msg, error)
					setStore({ message: msg })
				}
			},

			login: async (formData)=>{
				console.log("login", formData)
				try{
					const res = await fetch(process.env.BACKEND_URL + "/login", {
						method: 'POST',
						headers: {
							"Content-Type": "application/json"
						},
						body: JSON.stringify({
							"account": formData.email,
							"password": formData.password
						})
					})
					const data = await res.json()
					if(data.msg == "ok"){
						setStore({
							refresh_token: data.res.refresh_token,
							access_token: data.res.access_token 
						})
					}
					console.log("response", data)
					return data;
				}catch(error){
					console.log("ERROR", error)
					setStore({ message: msg })
				}
			}
		}
	}
}

export default getState

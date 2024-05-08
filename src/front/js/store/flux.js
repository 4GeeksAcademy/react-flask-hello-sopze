const getState = ({ getStore, getActions, setStore }) => {
	return {
		store: {
			localUser: null,
			userlist: {},
			redirect: {}
		},
		actions: {

			// creates a new user account
			signup: async (formData)=>{
				try{
					const res = await fetch(process.env.BACKEND_URL + "/signup?login=" + formData.login, {
						method: 'POST',
						headers: {
							"Content-Type": "application/json"
						},
						body: JSON.stringify(formData)
					})
					if(res.status==201){
						if(formData.login!="0"){
							const data = (await res.json()).res
							window.sessionStorage.setItem("refresh_token", data.refresh_token)
							window.sessionStorage.setItem("access_token", data.access_token)
							setStore({localUser:{data:data}, redirect:{path:"/", timestamp:Date.now()}})
						}
						else setStore({ redirect:{ path:"/", timestamp:Date.now() }})
						return true;
					}
				}catch(e){ console.error("signup errored: ", e)}
				return false;
			},

			// grants access to your account, stores the tokens in sessionStorage
			login: async (formData)=>{
				try{
					const res = await fetch(process.env.BACKEND_URL + "/login", {
						method: 'POST',
						headers: { "Content-Type": "application/json" },
						body: JSON.stringify(formData)
					})
					if(res.status==200){
						const data = (await res.json()).res
						window.sessionStorage.setItem("refresh_token", data.refresh_token)
						window.sessionStorage.setItem("access_token", data.access_token)
						setStore({localUser:{data:data}, redirect:{path:"/", timestamp:Date.now()}})
						return true;
					}
				}catch(e){ console.error("login errored: ", e)}
				return false;
			},

			// the opposite of login
			logout: async ()=>{
				try{
					const res = await fetch(process.env.BACKEND_URL + "/logout", {
						method: 'POST',
						headers: { "Auth-Token": "Bearer " + window.sessionStorage.getItem("access_token")}
					})
					if(res.status==200) {
						if(window.sessionStorage.getItem("access_token") != null){
							window.sessionStorage.removeItem("refresh_token")
							window.sessionStorage.removeItem("access_token")
							setStore({localUser:{data:null}, redirect:{path:"/logout", timestamp: Date.now()}})
							return true
						}
					}
				}catch(e){ console.error("logout errored: ", e)}
				return false;
			},

			// deletes current user account
			unsign: async ()=>{
				try{
					const res = await fetch(process.env.BACKEND_URL + "/unsign", {
						method: 'POST',
						headers: { "Auth-Token": "Bearer " + window.sessionStorage.getItem("access_token")}
					})
					if(res.status==200) {
						if(window.sessionStorage.getItem("access_token") != null){
							window.sessionStorage.removeItem("refresh_token")
							window.sessionStorage.removeItem("access_token")
							setStore({localUser:{data:null}, redirect:{path:"/logout", timestamp: Date.now()}})
							return true
						}
					}
				}catch(e){ console.error("login errored: ", e)}
				return false;
			},

			// updates the store with current user from sessionStorage token, if any
			updateUser: async()=>{
				setStore({localUser: {data:await getActions().getCurrentUser()} })
			},

			// get current user instance
			getCurrentUser: async()=>{
				if(window.sessionStorage.getItem("access_token") == null) return null
				try{
					const res= await fetch(process.env.BACKEND_URL + "/me", {
						method: "GET",
						headers: { "Auth-Token": "Bearer " + window.sessionStorage.getItem("access_token")}
					})
					if(res.status==200){
						const json= await res.json()
						return json.res
					}
				}catch(e){ console.error("getCurrentUser errored: ", e)}
				return null // any weird behaviour results in FORBID the access
			},

			// -1 is forbidden (auth but permissions deny the access), 0 is not auth, 1 is auth
			checkAuth: async (level)=>{
				if(window.sessionStorage.getItem("access_token") == null) return 0
				try{
					const res= await fetch(process.env.BACKEND_URL + "/auth?level=" + level, {
						method: "GET",
						headers: { "Auth-Token": "Bearer " + window.sessionStorage.getItem("access_token")}
					})
					return res.status==200 ? 1 : res.status==403 ? -1 : 0
				}catch(e){ console.error("checkAuth errored: ", e) }
				return -1 // any weird behaviour results in FORBID the access
			},

			// consume the redirect and remove it without triggering useEffect again
			consumeRedirect: ()=> {
				const
					{redirect} = getStore(),
					path= redirect.path

				redirect.path= null
				setStore({redirect})
				return path 
			},

			// clears storage, also do logout
			clearStorage: ()=> {
				if(window.sessionStorage.getItem("access_token") != null){
					setStore({localUser:null, redirect:{path:"/logout", timestamp: Date.now()}})
				}
				window.sessionStorage.removeItem("refresh_token")
				window.sessionStorage.removeItem("access_token")
			},

			// DEV-ONLY fetch all users to be listed on login screen (just to test them)
			refreshUsers: async()=> {
				const res= await fetch(process.env.BACKEND_URL + "/api/users")
				if(res.status==200) {
					const users= (await res.json()).res
					setStore({ userlist: { users: users, timestamp:Date.now()} })
					return true
				}
				else if(res.status==204) {
					setStore({ userlist: { users: [], timestamp:Date.now()} })
					return false
				}
				else {
					setStore({ userlist: { timestamp:Date.now()} })
					throw new Exception(res)
				}
			},

			// DEV-ONLY delete all users
			clearUsers: async ()=> {
				const res= fetch(process.env.BACKEND_URL + "/api/clear")
				if(res.status==200) {
					if(window.sessionStorage.getItem("access_token") != null){
						setStore({localUser:null, redirect:{path:"/logout", timestamp: Date.now()}})
					}
					window.sessionStorage.removeItem("refresh_token")
					window.sessionStorage.removeItem("access_token")
				}
			},

			// i've used 3rd party API for this, its easier than a random generator xd
			getRandomUser: async()=> (await (await fetch("https://randomuser.me/api/?nat=us,fr,gb,es,au,de")).json()).results[0] // straigth to data like a kamikaze
		}
	}
}

export default getState

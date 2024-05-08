import React from "react"
import { Context } from "../store/appContext"

const Navbar = () => {
	const
		{ store, actions } = React.useContext(Context),
		[ userReady, set_userReady ]= React.useState(false),
		[ frontUser, set_frontUser ]= React.useState(null)

	React.useEffect(()=>{
		if(store.localUser) {
			set_frontUser(store.localUser.data)
			if(!userReady) set_userReady(true)
		}
		else if(userReady) set_userReady(false)
	},[store.localUser])

	return (
		<nav className="navbar bg-body-tertiary">
			<div className="container">
				<span className="navbar-brand mb-0 h1">React+Flask Auth</span>
				<div className="ml-auto">
					{ userReady &&
						<>
						{ frontUser ?
							<p>Logged in as: {frontUser.username}</p>
							:
							<p>Please Login or SignUp</p>
						}
						</>
					}
				</div>
			</div>
		</nav>
	)
}

export default Navbar

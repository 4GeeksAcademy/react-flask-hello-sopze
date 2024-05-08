import React from "react"
import { useNavigate } from "react-router-dom"
import { Context } from "../store/appContext"

// this just listens for "redirects" then consume them and navigate
const Listener = () => {
	const 
		{ store, actions } = React.useContext(Context),
		nav = useNavigate()

	React.useEffect(()=>{
		const path= actions.consumeRedirect()
		if(path) nav(path)
	},[store.redirect])
	
	return null
}

export default Listener

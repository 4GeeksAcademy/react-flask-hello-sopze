import React from "react"
import { Context } from "../store/appContext"

const resultMessage= [
	"You're NOT logged in",
	"Successfully logged out"
]

const SessionLogout= ({ _onNavigate, _onChange, feedback })=>{
	const
		{ store, actions } = React.useContext(Context),
		[ result, set_result]= React.useState(0)

	React.useEffect(()=>{
		if(store.localUser){
			const _logout= async()=> {
				res= await actions.logout()
				set_result(res? 1 : 0)
			}
			_logout()
		}
		else set_result(0)
	},[])

	return (
		<section className="col-8 d-flex flex-column mx-auto px-1 py-3 bg-secondary-subtle rounded-4 border border-warning-subtle" >
			{result != null &&
				<h3 className={"m-0 py-0 px-4 w-100 text-center " + feedback.color}>{resultMessage[result]}</h3>
			}
			<div className="d-flex justify-content-evenly py-1 gap-3 px-4">
				<a type="button" className="btn btn-primary w-100" href="/signup" onClick={e=>{_onNavigate(e, "/signup")}}>Switch to Sign Up</a>
				<a type="button" className="btn btn-primary w-100" href="/login" onClick={e=>{_onNavigate(e, "/signup")}}>Switch to Login</a>
			</div>
			<div className="d-flex justify-content-evenly mt-2 py-2">
				<a type="button" className="btn btn-secondary w-75" href="/" onClick={e=>{_onNavigate(e, "/")}}>Back Home</a>
			</div>
		</section>
	)
}

export default SessionLogout
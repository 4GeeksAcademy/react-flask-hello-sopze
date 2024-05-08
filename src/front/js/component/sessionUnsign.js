import React from "react"
import { Context } from "../store/appContext"

const SessionUnsign= ({ _onNavigate, _onChange, feedback })=>{
	const
		{ store, actions } = React.useContext(Context)

	React.useEffect(()=>{
		actions.unsign()
	},[])

	return (
		<section className="col-8 d-flex flex-column-reverse mx-auto px-1 py-3 bg-secondary-subtle rounded-4 border border-warning-subtle" >
			<p className={"m-0 py-0 px-4 w-100 text-end " + feedback.color} style={{"minHeight":"1.5em", "whiteSpace":"pre"}}>{feedback.text}</p>
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

export default SessionUnsign
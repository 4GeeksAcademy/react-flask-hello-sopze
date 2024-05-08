import React from "react"
import { Context } from "../store/appContext.js"

import LoginUserlist from "../component/loginUserlist.js"

const SessionLogin= ({ _onNavigate, _onChange, feedback })=>{
	const
		{ store, actions } = React.useContext(Context),
		[ showPassword, set_showPassword ]= React.useState(false),
		[ showUserlist, set_showUserlist ]= React.useState(-1),
		[ localUsers, set_localUsers ]= React.useState([]),
		formElement= React.useRef(null)

	const _passDisplay= {
		type: showPassword ? "text" : "password",
		color: showPassword ? "btn-warning" : "btn-secondary",
		icon: showPassword ? "fa-eye-slash" : "fa-eye"
	}

	React.useEffect(()=>{
		if(showUserlist<0) { set_showUserlist(0); return }
		else {
			if(showUserlist==0) set_showUserlist(1)
			const users= store.userlist.users
			console.log(users)
			set_localUsers(users)
		}
	},[store.userlist])

	function handleFormSubmit(e){
		e.preventDefault();e.stopPropagation()
		if(!formElement.current) return
		const f= formElement.current.elements
		actions.login({
			"account": f.account.value,
			"password": f.password.value
		})
	}

	function handleUserSelection(u){
		if(!formElement.current) return
		const f= formElement.current.elements
		f.account.value= u.username
		f.password.value= u.password
	}

	return (
		<>
		<section className="col-8 d-flex flex-column-reverse mx-auto px-1 py-3 bg-secondary-subtle rounded-4 border border-warning-subtle" >
			<form ref={formElement} noValidate className="d-flex flex-column gap-3" onChange={_onChange}>
				<div className="d-flex px-4 gap-4">
					<label className="w-50 text-end" htmlFor="account">Email/Username</label>
					<input className="w-100"name="account" type="account"/>
				</div>
				<div className="d-flex m-0 p-0 position-relative">
					<div className="d-flex flex-column m-0 p-0 w-100 gap-3">
						<div className="d-flex px-4 gap-4">
							<label className="w-50 text-end" htmlFor="password">Password</label>
							<input type={_passDisplay.mode} className="w-100" name="password"/>
						</div>
					</div>
					<button type="button" className={"btn position-absolute pw-btn " + _passDisplay.color} onClick={()=>{set_showPassword(!showPassword)}}>
						<i className={"pw-icon m-0 p-0 fs-3 fa " + _passDisplay.icon}/>
					</button>
				</div>
				<p className={"m-0 py-0 px-4 w-100 text-end " + feedback.color} style={{"minHeight":"1.5em", "whiteSpace":"pre"}}>{feedback.text}</p>
				<div className="d-flex justify-content-evenly py-1 gap-3 px-4">
					<a type="button" className="btn btn-primary w-100" href="/signup" onClick={e=>{_onNavigate(e, "/signup")}}>Switch to Sign Up</a>
					<a type="button" className="btn btn-secondary w-100 cbtn-purple" onClick={actions.refreshUsers}>Dev-ListUsers</a>
					<a type="button" className="btn btn-secondary w-100" href="/" onClick={e=>{_onNavigate(e, "/")}}>Back Home</a>
				</div>
				<div className="d-flex justify-content-evenly mt-2 py-2">
					<a type="submit" className="btn btn-success w-75" onClick={handleFormSubmit}>Login</a>
				</div>
			</form>
		</section>
		{ showUserlist==1 && 
			<LoginUserlist users={localUsers} selectUserCallback={handleUserSelection}/>
		}
		</>
	)
}

export default SessionLogin
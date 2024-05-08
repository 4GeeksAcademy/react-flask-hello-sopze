import React from "react"
import { Context } from "../store/appContext.js"
import Utils from "../core/utils.js"

const SessionSignup= ({ _onNavigate, _onChange, feedback })=>{
	const
		{ store, actions } = React.useContext(Context),
		[ showPassword, set_showPassword ]= React.useState(false),
		formElement= React.useRef(null)

	const _passDisplay= {
		type: showPassword ? "text" : "password",
		color: showPassword ? "btn-warning" : "btn-secondary",
		icon: showPassword ? "fa-eye-slash" : "fa-eye"
	}

	function handleFormSubmit(e){
		e.preventDefault();e.stopPropagation()
		if(!formElement.current) return
		const f= formElement.current.elements
		actions.signup({
			"login": f.login.checked ? "1" : "0",
			"username": f.username.value,
			"displayname": f.displayname.value,
			"email": f.email.value,
			"avatar": f.avatar.value,
			"password": f.pass_0.value,
			"admin": f.admin.checked ? "1" : "0"
		})
	}

	function randomizeForm(e){
		e.preventDefault();e.stopPropagation()
		if(!formElement.current) return
		const f= formElement.current.elements

		actions.getRandomUser()
		.then(data => {
				console.log(data)
				f.email.value= data.email
				f.username.value= data.login.username
				f.displayname.value= data.name.first + " " + data.name.last
				f.avatar.value= data.picture.large
				f.pass_0.value= f.pass_1.value= data.login.password
			}
		)
		.catch(e=>{
			// fail silently and generate one with some basic methods i wrote
			f.email.value= Utils.randomEmail(6, 12)
			f.username.value= Utils.randomStr(4, 12)
			f.displayname.value= Utils.randomNick(6, 16)
			f.avatar.value= ""
			f.pass_0.value= f.pass_1.value= Utils.randomPin(4, 6)
			}
		)
		if(!showPassword) set_showPassword(true) // so we can see it to note it somewhere
	}

	return (
		<section className="col-8 d-flex flex-column-reverse mx-auto px-1 py-3 bg-secondary-subtle rounded-4 border border-warning-subtle" >
			<form ref={formElement} noValidate className="d-flex flex-column gap-3" onChange={_onChange}>
				<div className="d-flex px-4 gap-4">
					<label className="w-50 text-end" htmlFor="username">Username</label>
					<input type="text" className="w-100"name="username"/>
				</div>
				<div className="d-flex px-4 gap-4">
					<label className="w-50 text-end" htmlFor="email">Email</label>
					<input className="w-100"name="email" type="email"/>
				</div>
				<div className="d-flex px-4 gap-4">
					<label className="w-50 text-end" htmlFor="displayname">Public name</label>
					<input type="text" className="w-100"name="displayname"/>
				</div>
				<div className="d-flex px-4 gap-4">
					<label className="w-50 text-end" htmlFor="avatar">Avatar URL</label>
					<input type="text" className="w-100"name="avatar"/>
				</div>
				<div className="d-flex m-0 p-0 position-relative">
					<div className="d-flex flex-column m-0 p-0 w-100 gap-3">
						<div className="d-flex px-4 gap-4">
							<label className="w-50 text-end" htmlFor="pass_0">Password</label>
							<input type={_passDisplay.mode} className="w-100" name="pass_0"/>
						</div>
						<div className="d-flex px-4 gap-4">
							<label className="w-50 text-end" htmlFor="pass_1">Repeat password</label>
							<input type={_passDisplay.mode} className="w-100" name="pass_1"/>
						</div>
					</div>
					<button type="button" className={"btn position-absolute pw-btn pw-sign " + _passDisplay.color} onClick={()=>{set_showPassword(!showPassword)}}>
						<i className={"pw-icon m-0 p-0 fs-3 fa " + _passDisplay.icon}/>
					</button>
				</div>
				<div className="d-flex m-0 p-0 position-relative">
					<div className="d-flex justify-content-center m-0 p-0 w-100 gap-3">
						<label className="w-100 text-end" htmlFor="login">Login after</label>
						<input type="checkbox" defaultChecked className="w-25" name="login"/>
					</div>
					<div className="d-flex m-0 p-0 w-100 gap-3">
						<label className="w-100 text-end" htmlFor="admin">Site Admin</label>
						<input type="checkbox" className="w-25" name="admin"/>
					</div>
				</div>
				<p className={"m-0 py-0 px-4 w-100 text-end " + feedback.color} style={{"minHeight":"1.5em", "whiteSpace":"pre"}}>{feedback.text}</p>
				<div className="d-flex justify-content-evenly py-1 gap-3 px-4">
					<a type="button" className="btn btn-primary w-100" href="/login" onClick={e=>{_onNavigate(e, "/login")}}>Switch to Login</a>
					<a type="button" className="btn btn-secondary w-100 cbtn-purple" onClick={randomizeForm}>Dev-Randomize</a>
					<a type="button" className="btn btn-secondary w-100" href="/" onClick={e=>{_onNavigate(e, "/")}}>Back Home</a>
				</div>
				<div className="d-flex justify-content-evenly mt-2 py-2">
					<a type="submit" className="btn btn-success w-75" onClick={handleFormSubmit}>Sign Up</a>
				</div>
			</form>
		</section>
	)
}

export default SessionSignup
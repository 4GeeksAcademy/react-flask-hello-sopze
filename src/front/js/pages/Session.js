import React, { useState, useEffect, useContext } from "react"
import { useNavigate } from "react-router-dom"

import { Context } from "../store/appContext"

const SessionSignup= ({ _onNavigate, _onChange })=>{
	const
		{ store, actions } = useContext(Context),
		[ showPassword, set_showPassword ]= React.useState(false),
		formElement= React.useRef(null)

	const _passMode= showPassword ? "text" : "password"

	function handleFormSubmit(e){
		e.preventDefault();e.stopPropagation()
		if(!formElement.current) return
		const f= formElement.current.elements
		actions.signup({
			"login": f.login.checked ? 1 : 0,
			"username": f.username.value,
			"displayname": f.displayname.value,
			"email": f.email.value,
			"password": f.pass_0.value
		})
	}

	function randomizeForm(e){
		e.preventDefault();e.stopPropagation()
		console.log("randomize")
	}

	return (
		<section className="col-8 mx-auto d-flex flex-column px-1 py-3 bg-secondary-subtle rounded-4 border border-warning-subtle">
			<form ref={formElement} noValidate className="d-flex flex-column gap-3" onChange={_onChange}>
				<div className="d-flex px-4 gap-4">
					<label className="w-50 text-end" htmlFor="email">email</label>
					<input className="w-100"name="email" type="email"/>
				</div>
				<div className="d-flex px-4 gap-4">
					<label className="w-50 text-end" htmlFor="username">Username</label>
					<input type="text" className="w-100"name="username"/>
				</div>
				<div className="d-flex px-4 gap-4">
					<label className="w-50 text-end" htmlFor="displayname">Public name</label>
					<input type="text" className="w-100"name="displayname"/>
				</div>
				<div className="d-flex m-0 p-0 position-relative">
					<div className="d-flex flex-column m-0 p-0 w-100 gap-3">
						<div className="d-flex px-4 gap-4">
							<label className="w-50 text-end" htmlFor="pass_0">Password</label>
							<input type={_passMode} className="w-100" name="pass_0"/>
						</div>
						<div className="d-flex px-4 gap-4">
							<label className="w-50 text-end" htmlFor="pass_1">Repeat password</label>
							<input type={_passMode} className="w-100" name="pass_1"/>
						</div>
					</div>
					<button type="button" className={"btn btn-secondary position-absolute pw-btn pw-sign"} onClick={()=>{set_showPassword(!showPassword)}}>
						<i className={"pw-icon fa fa-eye m-0 p-0 fs-3 " + showPassword ? "fa-eye-slash" : "fa-eye"}/>
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
				<div className="d-flex justify-content-evenly mt-4 py-2">
					<a type="submit" className="btn btn-success" style={{"width":"128px"}} onClick={handleFormSubmit}>Sign Up</a>
					<a type="button" className="btn btn-primary" style={{"width":"128px"}} href="/login" onClick={e=>{_onNavigate(e, "/login")}}>Go to login</a>
					<a type="button" className="btn btn-secondary" style={{"width":"128px"}} href="/" onClick={e=>{_onNavigate(e, "/")}}>Back home</a>
				</div>
				<div className="d-flex justify-content-evenly mt-2 py-2">
					<a type="button" className="btn btn-secondary" style={{"width":"256px"}} onClick={randomizeForm}>Dev-Randomize</a>
				</div>
			</form>
		</section>
	)
}

const SessionLogin= ({ _onNavigate, _onChange })=>{
	const
		{ store, actions } = useContext(Context),
		[ showPassword, set_showPassword ]= React.useState(false),
		formElement= React.useRef(null)

	const _passMode= showPassword ? "text" : "password"

	function handleFormSubmit(e){
		e.preventDefault();e.stopPropagation()
		if(!formElement.current) return
		const f= formElement.current.elements
		actions.login({
			"account": f.username.value,
			"password": f.pass_0.value
		})
	}

	function listUsers(){
		console.log("TODO: write actions.getusers and do the job")
	}

	return (
		<section className="col-8 mx-auto d-flex flex-column px-1 py-3 bg-secondary-subtle rounded-4 border border-warning-subtle">
			<form ref={formElement} noValidate className="d-flex flex-column gap-3" onChange={_onChange}>
				<div className="d-flex px-4 gap-4">
					<label className="w-50 text-end" htmlFor="account">Username or Email</label>
					<input className="w-100"name="account" type="account"/>
				</div>
				<div className="d-flex m-0 p-0 position-relative">
					<div className="d-flex flex-column m-0 p-0 w-100 gap-3">
						<div className="d-flex px-4 gap-4">
							<label className="w-50 text-end" htmlFor="pass_0">Password</label>
							<input type={_passMode} className="w-100" name="pass_0"/>
						</div>
					</div>
					<button type="button" className={"btn btn-secondary position-absolute pw-btn"} onClick={()=>{set_showPassword(!showPassword)}}>
						<i className={"pw-icon fa fa-eye m-0 p-0 fs-3 " + showPassword ? "fa-eye-slash" : "fa-eye"}/>
					</button>
				</div>
				<div className="d-flex justify-content-evenly mt-4 py-2">
					<a type="submit" className="btn btn-success" style={{"width":"128px"}} onClick={handleFormSubmit}>Login</a>
					<a type="button" className="btn btn-primary" style={{"width":"128px"}} href="/signup" onClick={e=>{_onNavigate(e, "/signup")}}>Go to Sign Up</a>
					<a type="button" className="btn btn-secondary" style={{"width":"128px"}} href="/" onClick={e=>{_onNavigate(e, "/")}}>Back home</a>
				</div>
				<div className="d-flex justify-content-evenly mt-2 py-2">
					<a type="button" className="btn btn-secondary" style={{"width":"256px"}} onClick={listUsers}>Dev-ListUsers</a>
				</div>
			</form>
		</section>
	)
}

const 
	SIGN_MODE= Object.freeze({ signup:0, login:1, logout:2, unsign:3 }),
	SIGN_COMPONENT= Object.freeze([SessionSignup, SessionLogin])

const Session = ({ mode="signup" }) => {
	const 
		{ store, actions } = useContext(Context),
		[ sessionComponent, set_sessionComponent ]= React.useState(_getSessionMode(mode)),
		nav = useNavigate()

	const AssignedComponent= sessionComponent

	React.useEffect(()=>{ set_sessionComponent(_getSessionMode(mode)) },[mode]) // change between modes on url changes with useNavigate()
	function _getSessionMode(_mode){ return ()=>SIGN_COMPONENT[SIGN_MODE[_mode]] }

	function handleButtonNav(e, url){
		e.preventDefault();e.stopPropagation()
		nav(url)
	}

	function handleFormChange(e){
		if(!e.target) return
		const t= e.target
		if(e.target.type!=="checkbox"){
			e.preventDefault();e.stopPropagation()
			console.log("handleFormChange():", t)
			if(t.name=="username" && t.value.length > 6) {
				console.log("check availability")
			}
		}
	}
	
	return (
		<div className="d-flex flex-column my-auto text-center pb-5">
			<div className="col-11 col-xl-6 mx-auto d-flex flex-column gap-4">
				{ AssignedComponent &&
					<AssignedComponent _onNavigate={handleButtonNav} _onChange={handleFormChange} />
				}
			</div>
		</div>
	)
}

export default Session
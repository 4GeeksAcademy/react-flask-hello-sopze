import React, { useState, useEffect, useContext } from "react"
import { useNavigate } from "react-router-dom"

import { Context } from "../store/appContext"

// all the user sign modes are handled by this component
export const SIGN_MODE= Object.freeze({ signup:0, login:1, signed_up:2, logged_in:3, logged_out:4, unsigned:5 }) 

const Signin = ({ signmode=SIGN_MODE.signup }) => {
	const 
		{ store, actions } = useContext(Context),
		[ signMode, set_signMode ]= React.useState(signmode),
		[ showPassword, set_showPassword ]= React.useState(false),
		[ formData, set_formData ]= React.useState(null),
		formElement= React.useRef(null),
		nav = useNavigate()

	React.useEffect(()=>{ set_signMode(signmode) },[signmode]) // change between modes on url changes with useNavigate()

	React.useEffect(()=>{
		if(formData){
			const effect= async()=>{
				const result= formData.mode == SIGN_MODE.signup ? await actions.signup(formData.data) :  await actions.login(formData.data)
				console.log("do something with result", result)
			}
			effect()
		}
	}, [formData])

	function handleFormSubmit(e){
		e.preventDefault();e.stopPropagation()
		if(!formElement.current) return
		const f= formElement.current.elements
		set_formData({
			mode: signMode,
			data: {
				"username": f.username? f.username.value : "",
				"displayname": f.displayname? f.displayname.value : "",
				"email": f.email.value,
				"password": f.pass_0.value
				// pass_1 not needed
			}
		})
	}

	function handleFormChange(e){
		e.preventDefault();e.stopPropagation()
		if(!e.target) return
		const t= e.target
		console.log("handleFormChange():", t)
		if(t.name=="username" && t.value.length > 6) {
			console.log("check availability")
		}
	}

	function handleButtonNav(e, url){
		e.preventDefault();e.stopPropagation()
		nav(url)
	}

	function randomizeForm(e){
		e.preventDefault();e.stopPropagation()
		console.log("randomize")
	}

	const _passMode= showPassword ? "text" : "password"
	const _passClass= signMode == 0 ? "pw-btn pw-sign" : "pw-btn"
	
	return (
		<div className="text-center mt-5">
			{ signMode < 2 &&
				<h3 className="fw-bold p-4">{signMode== 0 ? "Sign-up" : "Login"}</h3>
			}
			{ signMode== 2 && <p>Your account was created</p> }
			{ signMode== 3 && <p>Succesfully logged in, enjoy the stance!</p> }
			{ signMode== 4 && <p>Succesfully logged out, come back soon!</p> }
			{ signMode== 5 && <p>Your account was deleted... it's so sad you've gone...</p> }
			<div className="col-11 col-xl-6 mx-auto d-flex flex-column gap-4">
				<section className="col-8 mx-auto d-flex flex-column px-1 py-3 bg-secondary-subtle rounded-4 border border-warning-subtle">
					{ signMode < 2 &&
						<form ref={formElement} noValidate className="d-flex flex-column gap-3" onChange={handleFormChange}>
							<div className="d-flex px-4 gap-4">
								<label className="w-50 text-end" htmlFor="email">{signMode== 0 ? "Email" : "Username or Email"}</label>
								<input className="w-100"name="email" type="email"/>
							</div>
							{ signMode == 0 && 
								<>
								<div className="d-flex px-4 gap-4">
									<label className="w-50 text-end" htmlFor="username">Username</label>
									<input type="text" className="w-100"name="username"/>
								</div>
								<div className="d-flex px-4 gap-4">
									<label className="w-50 text-end" htmlFor="displayname">Public name</label>
									<input type="text" className="w-100"name="displayname"/>
								</div>
								</>
							}
							<div className="d-flex m-0 p-0 position-relative">
								<div className="d-flex flex-column m-0 p-0 w-100 gap-3">
									<div className="d-flex px-4 gap-4">
										<label className="w-50 text-end" htmlFor="pass_0">Password</label>
										<input type={_passMode} className="w-100" name="pass_0"/>
									</div>
									{ signMode == 0 && 
										<div className="d-flex px-4 gap-4">
											<label className="w-50 text-end" htmlFor="pass_1">Repeat password</label>
											<input type={_passMode} className="w-100" name="pass_1"/>
										</div>
									}
								</div>
								<button type="button" className={"btn btn-secondary position-absolute " + _passClass} onClick={()=>{set_showPassword(!showPassword)}}>
									{ showPassword ?
										<i className="pw-icon fa fa-eye-slash m-0 p-0 fs-3"/>
										:
										<i className="pw-icon fa fa-eye m-0 p-0 fs-3"/>
									}
								</button>
							</div>
							<div className="d-flex justify-content-evenly mt-4 py-2">
								{ signMode== 0 &&
									<>
									<a type="submit" className="btn btn-success" style={{"width":"128px"}} onClick={handleFormSubmit}>Sign Up</a>
									<a type="button" className="btn btn-primary" style={{"width":"128px"}} href="/login" onClick={e=>{handleButtonNav(e, "/login")}}>Go to login</a>
									</>
								}
								{ signMode== 1 &&
									<>
									<a type="submit" className="btn btn-success" style={{"width":"128px"}} onClick={handleFormSubmit}>Login</a>
									<a type="button" className="btn btn-primary" style={{"width":"128px"}} href="/signup" onClick={e=>{handleButtonNav(e, "/signup")}}>Go to sign-up</a>
									</>
								}
								<a type="button" className="btn btn-secondary" style={{"width":"128px"}} href="/" onClick={e=>{handleButtonNav(e, "/")}}>Back home</a>
							</div>
							<div className="d-flex justify-content-evenly mt-2 py-2">
								{ signMode == 0 ?
									<a type="button" className="btn btn-secondary" style={{"width":"256px"}} onClick={randomizeForm}>Dev-Randomize</a>
								:
									<a type="button" className="btn btn-secondary" style={{"width":"256px"}} onClick={randomizeForm}>Dev-ListUsers</a>
								}
							</div>
						</form>
					}
				</section>
			</div>
		</div>
	);
};

export default Signin
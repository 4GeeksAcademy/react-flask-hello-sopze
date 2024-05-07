import React from "react"
import { useNavigate } from "react-router-dom"
import { Context } from "../store/appContext"

export const Home = () => {
	const 
		{ store, actions } = React.useContext(Context),
		nav = useNavigate()

	function handleButtonNav(e, url){
		e.preventDefault();e.stopPropagation()
		nav(url)
	}

	return (
		<div className="text-center mt-5">
			<h3 className="fw-bold p-4">I made all buttons visible at all times so you can see how they actually change behaviour based on user login state</h3>
			<div className="col-11 col-6-xl mx-auto d-flex flex-column gap-4">
				<section className="col-10 col-md-8 col-xl-5 mx-auto d-flex flex-column px-1 py-3 bg-secondary-subtle rounded-4 border border-warning-subtle">
					<p className="fw-bold fs-5 text-warning m-0">These are only enabled if you're NOT logged in</p>
					<div className="d-flex justify-content-evenly mt-4 py-2">
						<a style={{"width":"128px"}} type="button" className="btn btn-primary" onClick={e=>{handleButtonNav(e, "/signup")}}>Sign-up</a>
						<a style={{"width":"128px"}} type="button" className="btn btn-success" onClick={e=>{handleButtonNav(e, "/login")}}>Login</a>
					</div>
				</section>
				<section className="col-10 col-md-8 col-xl-5 mx-auto d-flex flex-column px-1 py-3 bg-secondary-subtle rounded-4 border border-warning-subtle">
					<p className="fw-bold fs-5 text-warning m-0">These are only enabled if you're logged in</p>
					<div className="d-flex justify-content-evenly mt-4 py-2">
						<a style={{"width":"128px"}} type="button" className="btn btn-primary" onClick={e=>{handleButtonNav(e, "/logout")}}>Logout</a>
						<a style={{"width":"128px"}} type="button" className="btn btn-danger" onClick={e=>{handleButtonNav(e, "/unsign")}}>Delete account</a>
					</div>
				</section>
				<section className="col-10 col-lg-9 col-xl-8 mx-auto d-flex flex-column px-1 py-3 bg-secondary-subtle rounded-4 border border-warning-subtle">
					<p className="fw-bold fs-5 text-warning m-0">Left buttons checks for auth once you nav to the page</p>
					<p className="fw-bold fs-5 text-warning m-0">Right ones already checked the auth and has been disabled/enabled accordly</p>
					<p className="fs-5 text-secondary m-0">*You can only navigate to the Staff ones with an user registered as admin</p>
					<div className="d-flex justify-content-evenly mt-4 py-2">
						<a style={{"width":"128px"}} type="button" className="btn btn-secondary" onClick={e=>{handleButtonNav(e, "/staff")}}>Private</a>
						<a style={{"width":"128px"}} type="button" className="btn btn-secondary" onClick={e=>{handleButtonNav(e, "/staff")}}>Private (pre-auth)</a>
					</div>
					<div className="d-flex justify-content-evenly mt-4 py-2">
						<a style={{"width":"128px"}} type="button" className="btn btn-secondary" onClick={e=>{handleButtonNav(e, "/staff")}}>Staff only</a>
						<a style={{"width":"128px"}} type="button" className="btn btn-secondary" onClick={e=>{handleButtonNav(e, "/staff")}}>Staff only (pre-auth)</a>
					</div>
				</section>
			</div>
		</div>
	);
};

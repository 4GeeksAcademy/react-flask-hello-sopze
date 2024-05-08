import React from "react"
import { useNavigate } from "react-router-dom"
import { Context } from "../store/appContext"

import rigobaby from "../../img/rigo-baby-rl.jpg"

const Home = () => {
	const 
		{ store, actions } = React.useContext(Context),
		[ userReady, set_userReady ]= React.useState(false),
		[ frontUser, set_frontUser ]= React.useState(null),
		nav = useNavigate()

	React.useEffect(()=>{ 
		if(store.localUser) {
			set_frontUser(store.localUser.data)
			if(!userReady) set_userReady(true)
		}
		else if(userReady) set_userReady(false)
	},[store.localUser])

	// <a> with href needs this to cancel navigator behavior (still wanted an <a> so the explorer shows the href at the bottom-left corner)
	function handleButtonNav(e, url){ e.preventDefault();e.stopPropagation();nav(url) }
	
	function handleButtonDev(e, func){ e.preventDefault();e.stopPropagation();func() }
	return (
		<div className="d-flex flex-column my-auto text-center pb-5">
			{ userReady &&
				<>
					<img src={frontUser != null ? frontUser.avatarurl : rigobaby} className="mx-auto pb-2 rounded-circle" style={{"width": "256px"}} />
					<h3 className="fw-bold fs-3 mb-5">{frontUser != null ? frontUser.displayname : "yo man that mf rigobaby is gettin too real"}</h3>
				</>
			}
			<div className="col-11 col-6-xl mx-auto d-flex flex-column gap-4 pb-5">
				<section className="col-10 col-md-8 col-xl-5 mx-auto d-flex flex-column px-1 py-3 bg-secondary-subtle rounded-4 border border-warning-subtle">
					<p className="fw-bold fs-5 text-warning m-0">These are only enabled if you're NOT logged in</p>
					<div className="d-flex justify-content-evenly mt-4 py-2">
						<a style={{"width":"128px"}} type="button" className="btn btn-primary" href="/signup" onClick={e=>{handleButtonNav(e, "/signup")}}>Sign-up</a>
						<a style={{"width":"128px"}} type="button" className="btn btn-success" href="/login" onClick={e=>{handleButtonNav(e, "/login")}}>Login</a>
					</div>
				</section>
				<section className="col-10 col-md-8 col-xl-5 mx-auto d-flex flex-column px-1 py-3 bg-secondary-subtle rounded-4 border border-warning-subtle">
					<p className="fw-bold fs-5 text-warning m-0">These are only enabled if you're logged in</p>
					<div className="d-flex justify-content-evenly mt-4 py-2">
						<a style={{"width":"128px"}} type="button" className="btn btn-secondary" href="/logout" onClick={e=>{handleButtonNav(e, "/logout")}}>Logout</a>
						<a style={{"width":"128px"}} type="button" className="btn btn-danger" href="/unsign" onClick={e=>{handleButtonNav(e, "/unsign")}}>Delete account</a>
					</div>
				</section>
				<section className="col-10 col-md-8 col-xl-5 mx-auto d-flex flex-column px-1 py-3 bg-secondary-subtle rounded-4 border border-warning-subtle">
					<p className="fw-bold fs-5 text-warning m-0">Here you test the Authentication things</p>
					<p className="fs-5 text-secondary m-0">*The Staff one is only accesible with an user registered as admin</p>
					<div className="d-flex justify-content-evenly mt-4 py-2">
						<a style={{"width":"128px"}} type="button" className="btn btn-secondary cbtn-pink" href="/private" onClick={e=>{handleButtonNav(e, "/private")}}>Private</a>
						<a style={{"width":"128px"}} type="button" className="btn btn-secondary cbtn-purple" href="/admin" onClick={e=>{handleButtonNav(e, "/admin")}}>Staff only</a>
					</div>
				</section>
				<section className="col-10 col-md-8 col-xl-5 mx-auto d-flex flex-column px-1 py-3 bg-secondary-subtle rounded-4 border border-warning-subtle">
					<p className="fw-bold fs-5 text-warning m-0">Some internal utils</p>
					<div className="d-flex justify-content-evenly mt-4 py-2">
						<a style={{"width":"192px"}} type="button" className="btn btn-dark" onClick={e=>{handleButtonDev(e, actions.clearUsers)}}>Clear all users</a>
						<a style={{"width":"192px"}} type="button" className="btn btn-dark" onClick={e=>{handleButtonDev(e, actions.clearStorage)}}>Clear sessionStorage</a>
					</div>
				</section>
			</div>
		</div>
	)
}

export default Home

import React from "react"
import { useNavigate } from "react-router-dom"
import { Context } from "../store/appContext"

import UserCardStupidWawa from "../component/userCardStupidWawa.js"

import privateimage from "../../img/privateimage.jpg"

const authMessages= [
	"Please login to see this",
	"Here's your private shit"
]

const Private = () => {
	const
		{ store, actions } = React.useContext(Context),
		[ authResult, set_authResult ]= React.useState(null),
		[ userReady, set_userReady ]= React.useState(false),
		[ frontUser, set_frontUser ]= React.useState(null),
		nav = useNavigate()

	React.useEffect(()=>{
		const _userCheck= async()=>{
			if(store.localUser) {
				set_frontUser(store.localUser.data)
				if(!userReady) set_userReady(true)
			}
			else set_userReady(false)
			set_authResult(await actions.checkAuth(0))
		}
		_userCheck()
	},[])
	
	// <a> with href needs this to cancel navigator behavior (still wanted an <a> so the explorer shows the href at the bottom-left corner)
	function handleButtonNav(e, url){ e.preventDefault();e.stopPropagation();nav(url) }

	return (
		<div className="d-flex flex-column my-auto text-center pb-5">
			<div className="col-11 col-xl-6 mx-auto d-flex flex-column gap-4">
				{ authResult != null &&
					<section className="col-8 d-flex flex-column mx-auto px-1 py-3 bg-secondary-subtle rounded-4 border border-warning-subtle" >
						<h3 className="fw-bold fs-3 mb-5">{authMessages[authResult]}</h3>
						{ authResult == 1 &&
							<>
							<UserCardStupidWawa user={frontUser}/>
							<img className="mx-auto my-4"src={privateimage} style={{"width":"256px"}}/>
							</>
						}
						<div className="d-flex justify-content-evenly py-1 gap-3 px-4">
							<a type="button" className="btn btn-secondary w-100" href="/" onClick={e=>{handleButtonNav(e, "/")}}>Back Home</a>
						</div>
					</section>
				}
			</div>
		</div>
	)
}

export default Private

import React from "react"
import { useNavigate } from "react-router-dom"
import { Context } from "../store/appContext.js"

import SessionSignup from "../component/sessionSignup.js"
import SessionLogin from "../component/sessionLogin.js"
import SessionLogout from "../component/sessionLogout.js"
import SessionUnsign from "../component/sessionUnsign.js"

const 
	SIGN_MODE= Object.freeze({ signup:0, login:1, logout:2, unsign:3 }),
	MODE_COMPONENT= Object.freeze([SessionSignup, SessionLogin, SessionLogout, SessionUnsign])

const Session = ({ mode="signup" }) => {
	const 
		{ store, actions } = React.useContext(Context),
		[ sessionComponent, set_sessionComponent ]= React.useState(_getModeComponent(mode)),
		 // unused, planned to give feedback about bad formatted inputs and things like that but i just want to finish this and go for the final project
		[ feedbackData, set_feedbackData]= React.useState({text:" ", color:""}),
		nav = useNavigate()

	const AssignedComponent= sessionComponent

	React.useEffect(()=>{ set_sessionComponent(_getModeComponent(mode)) },[mode]) // change between modes on url changes with useNavigate()
	function _getModeComponent(_mode){ return ()=>MODE_COMPONENT[SIGN_MODE[_mode]] }

	React.useEffect(()=>{
	},[mode])

	// <a> with href needs this to cancel navigator behavior (still wanted an <a> so the explorer shows the href at the bottom-left corner)
	function handleButtonNav(e, url){ e.preventDefault();e.stopPropagation();nav(url) }

	function handleFormChange(e){
		if(!e.target) return
		const t= e.target
		if(e.target.type!=="checkbox"){
			e.preventDefault();e.stopPropagation()
			if(t.name=="username" && t.value.length > 6) {
			}
		}

		// update feedback in realtime, update: NAAHHHH im out of this, lets gooooo to final project!!!
	}
	
	return (
		<div className="d-flex flex-column my-auto text-center pb-5">
			<div className="col-11 col-xl-6 mx-auto d-flex flex-column gap-4">
				{ AssignedComponent &&
					<AssignedComponent _onNavigate={handleButtonNav} _onChange={handleFormChange} feedback={feedbackData} />
				}
			</div>
		</div>
	)
}

export default Session
import React from "react"

const UserCardStupidWawa= ({ user })=>{
	return (
		<li className="list-group-item w-100">
            <div className="row d-flex w-100">
                <div className="col-2">
                    <img src={user.avatarurl} className="userlist-avatar"/>
                </div>
                <div className="col-4 d-flex flex-column my-auto">
                    <p className="m-0 p-0">{user.displayname}</p>
                    <p className="m-0 p-0"><span className="text-secondary">{user.username}</span></p>
                </div>
                <div className="col-6 d-flex flex-column my-auto">
                    <p className="m-0 p-0">{user.email}</p>
                </div>
            </div>
        </li>
	)
}

export default UserCardStupidWawa
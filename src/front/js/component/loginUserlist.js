import React from "react"

const UserLoginElement= ({ user, _onclick })=>{

	return (
		<li className="list-group-item w-100 userlist-element" onClick={_onclick}>
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

const LoginUserList= ({ users, selectUserCallback })=>{

    const infotext= {
        color: users ? users.length > 0 ? "text-success" : "text-warning" : "text-danger",
        text: users ? users.length > 0 ? `${users.length} ${users.length> 1 ? "users" : "user"} registered` : "No users registered" : "Error retrieving users list"
    }

	function handleUserClick(e, u){
        if(u){
            e.preventDefault();e.stopPropagation()
            selectUserCallback(u)
        }
	}

    return (
		<section className="col-8 d-flex flex-column mx-auto px-1 py-3 bg-secondary-subtle rounded-4 border border-warning-subtle" >
            <p className={"m-0 py-0 px-4 w-100 text-center fs-3 " + infotext.color}>{infotext.text}</p>
            <div className="d-flex py-1 gap-3 px-4 w-100">
                { users && users.length > 0 &&
                    <ul className="list-group w-100">
                        { users.map((e,i)=>
                            <UserLoginElement key={`user-${i}`} user={e} _onclick={e2=>{handleUserClick(e2, e)}}/>
                        )}
                    </ul>
                }
            </div>
		</section>
    )
}

export default LoginUserList
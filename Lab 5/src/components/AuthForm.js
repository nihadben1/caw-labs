import React, { useState } from "react";

function AuthForm() {
  var usersState = useState([]);
  var users = usersState[0];
  var setUsers = usersState[1];

  var usernameState = useState("");
  var username = usernameState[0];
  var setUsername = usernameState[1];

  var passwordState = useState("");
  var password = passwordState[0];
  var setPassword = passwordState[1];

  function submit(e) {
    e.preventDefault();
    var newUsers = [];
    for (var i = 0; i < users.length; i++) {
      newUsers.push(users[i]);
    }
    newUsers.push({username: username, password: password});
    setUsers(newUsers);
    setUsername("");
    setPassword("");
  }

  function deleteUser(index) {
    var newUsers = [];
    for (var i = 0; i < users.length; i++) {
      if (i !== index) {
        newUsers.push(users[i]);
      }
    }
    setUsers(newUsers);
  }

  return (
    <div>
      <form onSubmit={submit}>
        <input placeholder="username" value={username} onChange={function(e){setUsername(e.target.value)}}/>
        <input placeholder="password" value={password} onChange={function(e){setPassword(e.target.value)}}/>
        <button type="submit">add user</button>
      </form>

      {users.map(function(u, i){
        return <div key={i}>
          {u.username} - {u.password}
          <button onClick={function(){deleteUser(i)}}>delete</button>
        </div>
      })}
    </div>
  );
}

export default AuthForm;

import React from 'react'

function SignOut() {
    localStorage.clear();
  return (
    <div><h1>Signed Out</h1>
    <br></br>
    <a href='/signin'>click here to log in</a></div>
  )
}

export default SignOut
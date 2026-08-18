import React, { useContext } from "react";
import { useState } from "react";
import { GlobalContext } from "./main";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

import { useEffect } from "react";
const Login = () => {
  const navigate = useNavigate();
  const [log, setLog] = useState("log");

  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const {setCurrentAccount,currentAccount} =
    useContext(GlobalContext);
  const [showPassword, setShowPassword] = useState(false);
  useEffect(()=>{
    if(currentAccount)
      navigate('/')
  },[])
  const createAccount = () => {
    console.log(email, password, name);
    const nameErr = document.getElementById("name_err");
    if (name && email && password) {
      nameErr.innerHTML = "";
        let newAcc = {
          name: name,
          password: password,
          email: email,
          blacklist:[],
          whitelist:[]
        };
        console.log(newAcc);
        console.log(JSON.stringify(newAcc));
        fetch("http://localhost:3000/api/data/accounts", {
          method: "POST", // Specifies that this is a POST request
          headers: {
            "Content-Type": "application/json", // Indicate the type of data being sent
          },
          body: JSON.stringify(newAcc), // Send the new account object as JSON
        })
          .then((response) => response.json()) // Convert the response to JSON
          .then((data) => {
            console.log("User created:", data); // Log the updated list of accounts (from POST response)
          })
          .then(() => handleLogin())
          .catch((error) => {
            console.error("Error:", error); // Catch and log any errors
          });
    
    } else if (!name) nameErr.innerHTML = "Input name";
    if (!(email && password)) console.log("woi");
  };
  const checkEmail = async (e) => {
    let mail = e.target.value;
    let emailErr = document.getElementById("login_error");
    if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(mail)) {
      
      setEmail(mail);
      emailErr.innerHTML = "";
      return true
    } else{
      emailErr.innerHTML = "Must be a valid email";
      return false
    } 
  };
  const checkNewEmail = async (e) => {
    let check=false
        let mail = e.target.value;
    let emailErr = document.getElementById("email_err");
    if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(mail)) {
      emailErr.innerHTML = "";
      check=true
    } else{
      emailErr.innerHTML = "Must be a valid email";
    } 
    if(check){
      console.log(email)
   
    let err = document.getElementById("email_err");
try {
      const response = await fetch(`http://localhost:3000/api/data/accounts/${mail}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (!response.ok) throw new Error(response.status);
      err.innerHTML = "Account of same email already exists";
    } catch (error) {

      //error 404 means not found. if not found 404 is sent as status by the server
      
      if (error.message=="404"){
      err.innerHTML = "";
      setEmail(mail);
    }else err.innerHTML="failed to connect to server"
    }
    }
  
  
  
  };

  const checkpassword = () => {
    let pass1 = document.getElementById("password").value;
    let pass2 = document.getElementById("password2").value;
    const passError = document.getElementById("passerror");
    if (pass1 == pass2 && pass1 != "" && pass2 != "") {
      setPassword(pass1);
      passError.innerHTML = "";
      console.log(password);
    } else {
      () => setPassword("");
      console.log("weee");
      passError.innerHTML = "Passwords must match";
    }
  };

  const handleLogin = async () => {

    console.log(password);
    let loginError;
    console.log(email)
    if (log == "log") loginError = document.getElementById("login_error");
    try {
      const response = await fetch(`http://localhost:3000/api/data/accounts/${email}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const account = await response.json();
      if (!response.ok)throw new Error(response.status)
      console.log(account);
      if (account.password === password) {
  
          localStorage.setItem("currentAccount", JSON.stringify(account));
          setCurrentAccount(account);
       
          

          navigate("/");
        
      } else if (log == "log") loginError.innerHTML = "Incorrect Password";
    } catch (err) {
      console.log(err);
      if(err.message=='404') if (log == "log") loginError.innerHTML = "Account does not exist";
      else if(log=='log') loginError.innerHTML="Failed to connect to server, try again later"
    }
  };


  const handleEnter = (e) => {
    e.key == "Enter" ? handleLogin() : null;
  };

  //bootstrap

  return log == "log" ? (
    <div className="container mt-5">
      <div className="loginprompt">
        <h1>Login</h1>
        <input
          type="text"
          className="form-control"
          id="email"
          placeholder="Email"
          onChange={(e) => checkEmail(e)}
        ></input>
        <br />
        <input
          type={showPassword ? "text" : "password"}
          className="form-control"
          id="password"
          placeholder="Password"
          onChange={(e) => setPassword(e.target.value)}
          onKeyDown={(e) => handleEnter(e)}
        ></input>
        <label>
          <input
            type="checkbox"
            checked={showPassword}
            onChange={() => setShowPassword((prev) => !prev)}
            className="mt-3 "
          />
          <> Show Password</>
        </label>
        <p id="login_error" className="text-danger"></p>
        <button className="btn btn-primary" onClick={() => handleLogin()}>
          {" "}
          Login{" "}
        </button>

        <p>Dont have an account? </p>
        <p
          onClick={() => {
            setLog("sign");
            setShowPassword(false);
          }}
        >
          Create Account
        </p>
      </div>
    </div>
  ) : (
    <div className="container mt-5">
      <div className="loginprompt">
        <h1>Create Account</h1>
        <input
          type="text"
          className="form-control"
          id="name"
          placeholder="Name"
          onChange={(e) => setName(e.target.value)}
        ></input>
        <p id="name_err" className="text-danger"></p>


        <input
          type="text"
          className="form-control"
          id="email"
          placeholder="Email"
          onChange={(e) => checkNewEmail(e)}
        ></input>
        <p id="email_err" className="text-danger"></p>
        <input
          type={showPassword ? "text" : "password"}
          className="form-control"
          id="password"
          placeholder="Password"
          onChange={() => checkpassword()}
        ></input>
        <br />
        <input
          type={showPassword ? "text" : "password"}
          id="password2"
          className="form-control"
          placeholder="Re-enter Password"
          onChange={() => checkpassword()}
        ></input>
        <label>
          <input
            type="checkbox"
            checked={showPassword}
            onChange={() => setShowPassword((prev) => !prev)}
          />
          Show Password
        </label>
        <p id="passerror" className="text-danger">
          -
        </p>
        <button onClick={() => createAccount()} className="btn btn-primary">
          Sign up
        </button>
      </div>
    </div>
  );
};

export default Login;

import React, { Component } from "react";
import {
    Route,
    NavLink,
    HashRouter
} from "react-router-dom";
import Home from "../src/Home";
import Free from "../src/Free";
import Stuff from "./Stuff";
import App from "./App";
import App_signup from "./App_signup";

class Main extends Component{
    render(){
        return(
            <HashRouter>
                <div>
                    <header className="top">
                        <h1>졸작</h1>
                    </header>
                    <ul className="header">
                        <li><NavLink to="/Home">홈</NavLink></li>
                        <li><NavLink to="/Free">자유게시판</NavLink></li>
                        <li><NavLink to="/Stuff">해야 할일</NavLink></li>
                        <li><NavLink to="/App">로그인</NavLink></li>
                        <li><NavLink to="/App_signup">회원가입</NavLink></li>
                    </ul>
                    <div className="content">
                        <Route path="/Home" component={Home}/>
                        <Route path="/Free" component={Free}/>
                        <Route path="/Stuff" component={Stuff}/>
                        <Route path="/App" component={App}/>
                        <Route path="/App_signup" component={App_signup}/>
                    </div>
                </div>
            </HashRouter>
        );
    }
}

export default Main;
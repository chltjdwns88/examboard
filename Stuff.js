import React, { Component } from "react";
import Todolist from "../src/Todolist";
import "./index.css";

class Stuff extends Component{
    render(){
        return(
            <div>
                <Todolist/>
            </div>
        );
    }
}

export default Stuff;
import React, { Component } from "react";
import TodoItems from "./TodoItems";
import "./index.css";

class Todolist extends Component{
    constructor(props){
        super(props);
        
        this.state = {
            items:[]
        };
        this.addItem = this.addItem.bind(this);
        this.deleteItem = this.deleteItem.bind(this);
    }
    deleteItem(key){
        var filteredItems = this.state.items.filter(function(item){
            return(item.key !== key);
        });
        this.setState({
            items:filteredItems
        });
    }

    addItem(e){
        var itemArray = this.state.items;

        if(this._inputElement !== ""){
            itemArray.unshift({
                text: this._inputElement.value,
                key: Date.now()
            });
            this.setState({
                items: itemArray
            });
            this._inputElement.value = "";
        }
        console.log(itemArray);

        e.preventDefault(); //이벤트의 기본 동작을 막는다  submit을 누르면 페이지가 새로 로딩되는것을 막아준다
    }
    render(){
        return(
            <div className="todoListMain">
                <div className="header">
                    <form onSubmit={this.addItem}>
                        <input ref={(a) => this._inputElement = a}placeholder="enter task"></input>
                        <button type="submit">add</button>
                    </form>
                </div>
                <TodoItems entries={this.state.items} delete={this.deleteItem}/>
            </div>
        );
    }
}

export default Todolist;
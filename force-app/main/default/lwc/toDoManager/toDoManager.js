import { LightningElement, track } from 'lwc';
import addTodo from "@salesforce/apex/TodoController.addTodo";
import getCurrentTodos from '@salesforce/apex/ToDoController.getCurrentTodos';

export default class ToDoManager extends LightningElement {
    time = "ciesta";
    greeting = "fiesta";
    @track todos = [];

    connectedCallback() {
        this.getTime();
        // this.populateTodos();
        this.fetchTodos();
        setInterval(() => {
            this.getTime();
        }, 1000 * 60);
    }

    getTime() {
        const date = new Date();
        const hour = date.getHours();
        const min = date.getMinutes();
        this.time = `${this.getHour(hour)}:${this.getDoubleDigit(min)} ${this.getMidDay(hour)}`;
        this.setGreeting(hour);
    }

    getHour(hour) {
        return hour === 0 ? 12 : hour > 12 ? (hour - 12) : hour;
    }

    getMidDay(hour) {
        return hour >=12 ? "PM" : "AM";
    }

    getDoubleDigit(digit) {
        return digit < 10 ? "0" + digit: digit;
    }

    setGreeting (hour) {
        if( hour < 12) {
            this.greeting = "Good Morning";
        }else if (hour >= 12 && hour < 17) {
            this.greeting = "Good Afternoon";
        } else {
            this.greeting = "Good Evening";
        }
    }

    addTodoHandler() {
        const inputBox = this.template.querySelector('lightning-input');
        const todo = {
            todoName: inputBox.value,
            done: false,
        }

        addTodo({payload: JSON.stringify(todo)}).then(response => {
            console.log('Item inserted Successfully');
            this.fetchTodos();
        }).catch(error => {
            console.error('error inserting todo item: ', error);
        });

        // this.todos.push(todo);
        inputBox.value = '';
    }

    get upcomingTasks() {
        return this.todos && this.todos.length ? this.todos.filter(todo => !todo.done) : [];
    }

    get completedTasks() {
        return this.todos && this.todos.length ? this.todos.filter(todo => todo.done) : [];
    }

    fetchTodos() {
        getCurrentTodos().then(result => {
            if(result) {
                console.log('retrieved todos: ', result.lenghth);
                this.todos = result;
            }
        }).catch(err => console.log(err));
    }

    updateHandler() {
        this.fetchTodos();
    }

    deleteHandler() {
        this.fetchTodos();
    }
}
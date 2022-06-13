import { LightningElement, api } from 'lwc';
import deleteTodo from '@salesforce/apex/ToDoController.deleteTodo';
import updateTodo from '@salesforce/apex/ToDoController.updateTodo';

export default class TodoItem extends LightningElement {
    @api todoId;
    @api todoName;
    @api done = false;

    updateHandler() {
        const todo = {
            todoId: this.todoId,
            todoName: this.todoName,
            done: !this.done
        };

        updateTodo({payload: JSON.stringify(todo)}).then(result => {
            console.log('item updated successfully');
            const updateEvent = new CustomEvent('update', {detail: 'information'});
            this.dispatchEvent(updateEvent);
            
        }).catch(err => console.error(err));
    }

    deleteHandler() {
        deleteTodo({todoId: this.todoId}).then(result => {
            console.log('item deleted successfully');
            const deleteEvent = new CustomEvent('delete');
            this.dispatchEvent(deleteEvent);
        }).catch(err => console.error(err));
    }
    get containerClass() {
        return this.done ? "todo completed" : "todo upcoming"; 
    }

    get iconName() {
        return this.done ? "utility:check" : "utility:add";
    }
}
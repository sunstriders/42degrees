import { Todo } from './todos';

export class MyTodo extends Todo {
    public minutes: number;
    public sumWatts: number;

    constructor(todo: Todo, minutes: number) {
        super(todo.name, todo.watts);
        this.minutes = minutes;
        this.sumWatts = todo.watts / 60 * minutes;
    }
}

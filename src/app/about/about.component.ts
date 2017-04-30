import {
  Component,
  OnInit
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import {Todo} from '../todos';
import {MyTodo} from '../mytodos';
import {MdDialog, MdDialogRef} from '@angular/material';

@Component({
  selector: 'about',
  styles: [`
  `],
    templateUrl: './about.component.html'
})
export class AboutComponent implements OnInit {

    public toDos: Todo[] = [
        new Todo('fen', 30),
        new Todo('plita', 50),
        new Todo('fen', 30),
        new Todo('plita', 50),
        new Todo('fen', 30),
        new Todo('plita', 50),
        new Todo('fen', 30),
        new Todo('plita', 50),
        new Todo('fen', 30),
        new Todo('plita', 50),
    ];
    public myTodos: MyTodo[] = new Array(0);
    public usedEnergy: number = 0;
    public remainEnergy: number = 1500;

  constructor(
    public route: ActivatedRoute,
    public dialog: MdDialog
  ) {}

    public ngOnInit() {
      // ignored
    };

    public addTodo(todo: Todo) {
        let myTodo = new MyTodo(todo, 10);
        this.myTodos.push(myTodo);
        this.usedEnergy = myTodo.sumWatts + this.usedEnergy;
        this.remainEnergy = this.remainEnergy - myTodo.sumWatts;
  }

    public deleteTodo(todo: MyTodo) {
        let index: number = this.myTodos.indexOf(todo);
        if (index !== -1) {
            this.myTodos.splice(index, 1);
        }
        this.usedEnergy = this.usedEnergy - todo.sumWatts;
        this.remainEnergy = this.remainEnergy + todo.sumWatts;
    }

    public changeMyTodo(todo: MyTodo) {
        let index: number = this.myTodos.indexOf(todo);
        this.usedEnergy = this.usedEnergy - todo.sumWatts;
        this.remainEnergy = this.remainEnergy + todo.sumWatts;
        todo.sumWatts = todo.watts / 60 * todo.minutes;
        this.myTodos[index] = todo;
        this.usedEnergy = this.usedEnergy + todo.sumWatts;
        this.remainEnergy = this.remainEnergy - todo.sumWatts;
    }
}

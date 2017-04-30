import {
    Component,
    OnInit
} from '@angular/core';
import { MdDialog, MdSnackBarModule } from '@angular/material';
import { AppState } from '../app.service';
import { Title } from './title';
import { XLargeDirective } from './x-large';
import { PVService } from '../apiService';
import { SelectModule } from './solarModule';
import { AboutUsDialogComponent } from '../about-us/about-us.component';
import { Todo } from '../todos';
import { MyTodo } from '../mytodos';

@Component({
    // The selector is what angular internally uses
    // for `document.querySelectorAll(selector)` in our index.html
    // where, in this case, selector is the string 'home'
    selector: 'home',  // <home></home>
    // We need to tell Angular's Dependency Injection which providers are in our app.
    providers: [
        Title
    ],
    // Our list of styles in our component. We may add more to compose many styles together
    styleUrls: ['./home.component.css'],
    // Every Angular template is first compiled by the browser before Angular runs it's compiler
    templateUrl: './home.component.html'
})
export class HomeComponent implements OnInit {
    public lat: number = 53.66670708625179;
    public lng: number = 23.895263671875;
    public planet: String = 'earth';
    public collectorType: number = 0;
    public azimuth: number = 42;
    public attitude: number = 42;
    public date: Date = new Date();
    public square: number = 1;
    public moduleNumber = 0;
    public selectModule: SelectModule = new SelectModule();
    public energy: number = null;
    public loading: boolean = false;

    public toDos: Todo[] = [
        new Todo('Hugs with a robot', 300),
        new Todo('Invent a cure for cancer', 500),
        new Todo('Watch cartoons', 80),
        new Todo('Destroy humanity', 240000),
        new Todo('Play with Useless Box', 26),
        new Todo('Quick grow potato (1 kg)', 600),
        new Todo('Find sense of a life', 2500),
        new Todo('Play XBox 42', 650),
        new Todo('Play PS7', 680)
    ];
    public myTodos: MyTodo[] = new Array(0);
    public usedEnergy: number = 0;
    public remainEnergy: number = 1500;

    // Set our default values
    public localState = {value: ''};
    // TypeScript public modifiers
    constructor(public appState: AppState,
                public title: Title,
                private pvService: PVService,
                private snackbar: MdSnackBarModule,
                private dialog: MdDialog) {
    }

    public ngOnInit() {
        // ignored
    }

    public submitState(value: string) {
        console.log('submitState', value);
        this.appState.set('value', value);
        this.localState.value = '';
    }

    public useItClick() {
        // ignored
    }

    public aboutUsClick() {
        let dialogRef = this.dialog.open(AboutUsDialogComponent);
        dialogRef.afterClosed().subscribe( () => {
           // ignored
        });

    }

    public calculate() {
        this.loading = true;
        const result = this.pvService.getPv(this.lat,
            this.lng,
            20,
            this.attitude,
            this.azimuth,
            this.moduleNumber,
            this.collectorType);
        if (!this.validateInput()) {
            return;
        }
        result.subscribe((response: any) => {
            this.energy = this.pvService.getEnergyForDay(response, this.date) * this.square;
            this.loading = false;
            this.remainEnergy = this.energy;
            setTimeout( () => {
                const element = document.querySelector('#result');
                if (element) {
                    element.scrollIntoView(element);
                }
            }, 100);
        });
    }

    public choosedAngles(azimuth: number, attitude: number) {
        this.azimuth = azimuth;
        this.attitude = attitude;
    }

    public mapClicked($event: any) {
        this.lat = $event.coords.lat;
        this.lng = $event.coords.lng;
    }

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

    private validateInput() {
        if (!this.date) {
            alert('Choose correct date');
            return false;
        }
        return true;
    }
}

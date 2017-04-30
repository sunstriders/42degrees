import {
    Component, Inject,
    OnInit
} from '@angular/core';
import { AppState } from '../app.service';
import { Title } from './title';
import { XLargeDirective } from './x-large';
import { PVService } from '../apiService';

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
    public planet: String;
    public collectorType: number = 0;
    public azimuth: number = 45;
    public attitude: number = 45;
    public date: Date = new Date();
    public energy: number = null;

    // Set our default values
    public localState = {value: ''};
    // TypeScript public modifiers
    constructor(public appState: AppState,
                public title: Title,
                private pvService: PVService) {
    }

    public ngOnInit() {
        // ignored
    }

    public submitState(value: string) {
        console.log('submitState', value);
        this.appState.set('value', value);
        this.localState.value = '';
    }

    public calculate() {
        const result = this.pvService.getPv(this.lat,
            this.lng,
            20,
            this.attitude,
            this.azimuth,
            1,
            this.collectorType);
        if (!this.validateInput()) {
            return;
        }
        result.subscribe((response: any) => {
            console.log(response);
            this.energy = this.pvService.getEnergyForDay(response, this.date);
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

    private validateInput() {
        if (!this.date) {
            alert('Choose correct date');
            return false;
        }
        return true;
    }
}

import {
  Component, Inject,
  OnInit
} from '@angular/core';
import { AppState } from '../app.service';
import { Title } from './title';
import { XLargeDirective } from './x-large';
import {PVService} from "../apiService";

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
  styleUrls: [ './home.component.css' ],
  // Every Angular template is first compiled by the browser before Angular runs it's compiler
  templateUrl: './home.component.html'
})
export class HomeComponent implements OnInit {
  public lat: number = 53.66670708625179;
  public lng: number = 23.895263671875;
  public planet: String;
  public collectorType: String;

    // Set our default values
  public localState = { value: '' };
  // TypeScript public modifiers
  constructor(
    public appState: AppState,
    public title: Title,
    private pvService: PVService,
  ) {}

  public ngOnInit() {
    console.log('hello `Home` component');
    // this.title.getData().subscribe(data => this.data = data);
  }

  public submitState(value: string) {
    console.log('submitState', value);
    this.appState.set('value', value);
    this.localState.value = '';
  }

  public calculate() {
    const result = this.pvService.getPv(this.lat, this.lng, 20, 20, 20, 1, 1);
    result.subscribe((response: any) => {
      console.log(response);
    });
  }

  public mapClicked($event: any ) {
      this.lat = $event.coords.lat;
      this.lng = $event.coords.lng;
}
}

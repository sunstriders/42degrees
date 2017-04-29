/**
 * Created by nikita.tkachuk on 4/29/2017.
 */


import { Injectable } from '@angular/core';
import {Http, Response, URLSearchParams} from '@angular/http';
import 'rxjs/add/operator/map';

const API_KEY = 'NN7p73olrvB26HFbw4Jq3FdSuA7nTW2DoQH1OLhM';

@Injectable()
export class PVService {
    constructor (
        private http: Http
    ) {}

    getPv(lat:number, lon:number, system_capacity:number, tilt: number, azimuth: number){

        let params: URLSearchParams = URLSearchParams();
        params.set("format", "json");
        params.set("api_key", API_KEY);
        params.set("lat", lat.toString());
        params.set("lon", lon.toString());
        params.set("timeframe", "hourly");
        //TODO: fix it
        params.set("module_type", "0");
        //TODO: fix it
        params.set("losses", "10");
        params.set("tilt", tilt.toString());
        params.set("azimuth", azimuth.toString());
        params.set("system_capacity", system_capacity.toString());
        return this.http.get('https://developer.nrel.gov/api/pvwatts/v5.json', )
            .map((res:Response) => res.json());
    }

}
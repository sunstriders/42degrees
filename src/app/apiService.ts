/**
 * Created by nikita.tkachuk on 4/29/2017.
 */


import {Component, Injectable} from '@angular/core';
import {Http, Response, URLSearchParams, RequestOptions} from '@angular/http';
import 'rxjs/add/operator/map';

const API_KEY = 'NN7p73olrvB26HFbw4Jq3FdSuA7nTW2DoQH1OLhM';

@Injectable()
export class PVService {
    constructor (
        private http: Http
    ) {}

    /**
     *
     * @param lat Latitude
     * @param lon longitude
     * @param system_capacity Nameplate capacity (kW).
     * @param tilt Tilt angle (degrees). (0 - 90)
     * @param azimuth Azimuth angle (degrees) (0 - 360)
     * @param module_type Module type  0-Standard, 1-Premium, 2-Thin film
     * @param array_type Array type (0, 1, 2, 3, 4)
     * @returns {Osebrvable<R>}
     */

    getPv(lat:number, lon:number, system_capacity:number, tilt: number, azimuth: number, module_type: number, array_type:number ){

        let params: URLSearchParams = new URLSearchParams();
        params.set("format", "json");
        params.set("api_key", API_KEY);
        params.set("lat", lat.toString());
        params.set("lon", lon.toString());
        params.set("timeframe", "hourly");
        //TODO: fix it
        params.set("module_type", module_type.toString());
        params.set("array_type", array_type.toString());
        //TODO: fix it
        params.set("losses", "10");
        params.set("tilt", tilt.toString());
        params.set("azimuth", azimuth.toString());
        params.set("dataset", "intl");
        params.set("system_capacity", system_capacity.toString());
        let requestOptions = new RequestOptions();
        return this.http.get('https://developer.nrel.gov/api/pvwatts/v5.json', {search:params} )
            .map((res:Response) => res.json());
    }

    getEnergyForDay(response:String, day:Date) {
        // let response = '{ "outputs": { "poa": [0, 0, 0, 0, 0, 0, 0, 54.228, 249.063, 297.984, 234.743, 412.297, 439.443, 855.346, 507.062, 379.984, 108.253, 0, 0, 0, 0, 0, 0, 0, 0]}}';
        let json = JSON.parse(response);
        let radiance = json.outputs.poa;
        let days = this.chunkArray(radiance, 24);
        let dayNumber = this.getDayOfYear(day);
        return this.calculateDayEnergy(days[dayNumber]);
    }


    getDayOfYear(date: Date):number{
        let start = new Date(date.getFullYear(), 0, 0);
        let diff = date - start;
        let oneDay = 1000 * 60 * 60 * 24;
        return Math.floor(diff / oneDay);
    }

    calculateDayEnergy(energyPerHours:String):number{
        let numbersArray = JSON.parse(energyPerHours);
        let convertedToNumbers = numbersArray.map(Number);
        return convertedToNumbers.reduce((a, b) => a + b, 0)
    }

    chunkArray(arr, chunkSize):Array {
        let groups = [], i;
        for (i = 0; i < arr.length; i += chunkSize) {
            groups.push(arr.slice(i, i + chunkSize));
        }
        return groups;
    }
}
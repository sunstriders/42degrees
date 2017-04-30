/**
 * Created by nikita.tkachuk on 4/29/2017.
 */

import { Component, Injectable } from '@angular/core';
import { Http, Response, URLSearchParams, RequestOptions } from '@angular/http';
import 'rxjs/add/operator/map';
import moment from 'moment';

const API_KEY = 'NN7p73olrvB26HFbw4Jq3FdSuA7nTW2DoQH1OLhM';

@Injectable()
export class PVService {
    constructor(private http: Http) {
    }

    /**
     *
     * @param lat Latitude
     * @param lon longitude
     * @param systemCapacity Nameplate capacity (kW).
     * @param tilt Tilt angle (degrees). (0 - 90)
     * @param azimuth Azimuth angle (degrees) (0 - 360)
     * @param moduleTypes Module type  0-Standard, 1-Premium, 2-Thin film
     * @param arrayType Array type (0, 1, 2, 3, 4)
     * @returns {Osebrvable<R>}
     */

    public getPv(lat: number,
                 lon: number,
                 systemCapacity: number,
                 tilt: number,
                 azimuth: number,
                 moduleTypes: number,
                 arrayType: number) {

        let params: URLSearchParams = new URLSearchParams();
        params.set('format', 'json');
        params.set('api_key', API_KEY);
        params.set('lat', lat.toString());
        params.set('lon', lon.toString());
        params.set('timeframe', 'hourly');
        // TODO: fix it
        params.set('module_type', moduleTypes.toString());
        params.set('array_type', arrayType.toString());
        // TODO: fix it
        params.set('losses', '10');
        params.set('tilt', tilt.toString());
        params.set('azimuth', azimuth.toString());
        params.set('dataset', 'intl');
        params.set('system_capacity', systemCapacity.toString());
        let requestOptions = new RequestOptions();
        return this.http.get('https://developer.nrel.gov/api/pvwatts/v5.json', {search: params})
            .map((res: Response) => res.json());
    }

    public getEnergyForDay(response: any, day: Date) {
        const radiance = response.outputs.poa;
        const days = this.chunkArray(radiance, 24);
        const dayNumber = this.getDayOfYear(day);
        return this.calculateDayEnergy(days[dayNumber]);
    }

    private getDayOfYear(date: Date): number {
        return moment(date).dayOfYear();
    }

    private calculateDayEnergy(energyPerHours: string[]): number {
        return energyPerHours.map(Number).reduce((a, b) => a + b, 0);
    }

    private chunkArray(arr, chunkSize): any[] {
        const groups = [];
        for (let i = 0; i < arr.length; i += chunkSize) {
            groups.push(arr.slice(i, i + chunkSize));
        }
        return groups;
    }
}

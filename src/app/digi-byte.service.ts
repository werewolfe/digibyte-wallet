import { Injectable } from '@angular/core';
import { Http } from "@angular/http";
import { Observable } from 'rxjs';
import 'rxjs/add/observable/from';
import { map, switchMap } from 'rxjs/operators';

declare var electron: any;

@Injectable()
export class DigiByteService {

    private explorerUrl: string;
    private marketUrl: string;
    private mainProcess: any;

    public constructor(private http: Http) {
        this.explorerUrl = "https://digiexplorer.info";
        this.marketUrl = "https://api.coinmarketcap.com/v1/ticker";
        this.mainProcess = electron.remote.require('./electron.js');
    }

    public getMarketValue() {
        return this.http.get(this.marketUrl + "/digibyte/")
            .pipe(map(result => result.json()))
            .pipe(map(result => result[0]));
    }

    public getWalletValue(address) {
        return this.http.get(this.explorerUrl + "/api/addr/" + address)
            .pipe(map(result => result.json()));
    }

    public getUnspentTransactionOutput(address) {
        return this.http.get(this.explorerUrl + "/api/addr/" + address + "/utxo")
            .pipe(map(result => result.json()));
    }

    public createTransaction(sourcePrivateKey, sourceAddress, destinationAddress, changeAddress, satoshis) {
        return this.getUnspentTransactionOutput(sourceAddress)
            .pipe(switchMap(utxos => Observable.from(this.mainProcess.createTransaction(utxos, sourcePrivateKey, sourceAddress, destinationAddress, changeAddress, satoshis))))
            .pipe(map(result => <string> result));
    }

    public getAddress(privateKey) {
        return this.mainProcess.getAddress(privateKey);
    }

}
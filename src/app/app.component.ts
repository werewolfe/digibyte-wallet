import { Component, OnInit } from '@angular/core';
import { DigiByteService } from "./digi-byte.service";

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

    public marketValue: any;
    public walletValue: any;
    public input: any;
    public transaction: string;

    public constructor(private digibyte: DigiByteService) {
        this.marketValue = {};
        this.walletValue = {
            balance: "0.00",
            usd: "0.00"
        };
        this.input = {
            privateKey: "",
            recipient: "DJMczFzdq2NeBPhBxrFbMJxg98mgWeRWyo",
            changeAddress: "DNRrvQ2nKm87icwgKrP1U1UjNXrdumdDkC",
            amount: 1000
        }
        this.transaction = "";
    }

    public ngOnInit() {}

    public loadWallet(privateKey) {
        this.digibyte.getMarketValue()
            .subscribe(result => {
                this.marketValue = result;
                this.digibyte.getWalletValue(this.digibyte.getAddress(privateKey))
                    .subscribe(result => {
                        this.walletValue.balance = result.balance;
                        this.walletValue.usd = (this.marketValue.price_usd * result.balance).toFixed(2);
                    });
            });
    }

    public createTransaction(privateKey) {
        this.digibyte.createTransaction(privateKey, this.digibyte.getAddress(privateKey), this.input.recipient, this.input.changeAddress, this.input.amount)
            .subscribe(result => {
                this.transaction = result;
            }, error => {
                console.error(error);
            })
    }

}
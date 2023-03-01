import { Component, Input, OnInit } from '@angular/core';

@Component({
    selector: 'bt-card-plains',
    templateUrl: './bt-card-plains.component.html'
})
export class BtCardPlainsComponent implements OnInit {
    @Input() data!: any;
    seeDetail = false;

    constructor() {}

    ngOnInit(): void {}

    get img(){
        return 'assets/img/' + this.data?.img;
    }

}

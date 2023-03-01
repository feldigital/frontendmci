import { Component, Input, OnInit } from '@angular/core';

@Component({
    selector: 'bt-badge-counter',
    templateUrl: './bt-badge-counter.component.html'
})
export class BtBadgeCounterComponent implements OnInit {
    @Input() counter: number = 0;

    constructor() {}

    ngOnInit(): void {}

}

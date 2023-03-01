import { Component, Input, OnInit } from '@angular/core';

@Component({
    selector: 'bt-alert',
    templateUrl: './bt-alert.component.html'
})
export class BtAlertComponent implements OnInit {
    @Input() icon = '';
    @Input() theme = 'primary';
    @Input() btnClosed = false;

    constructor() {}

    ngOnInit(): void {}

}

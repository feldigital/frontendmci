import { Component, Input, OnInit } from '@angular/core';

@Component({
    selector: 'bt-table-small',
    templateUrl: './bt-table-small.component.html'
})
export class BtTableSmallComponent implements OnInit {
    @Input() title: string = '';
    @Input() icon: string = '';

    constructor() {}

    ngOnInit(): void {}

}

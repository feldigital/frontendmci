import { Component, Input, OnInit } from '@angular/core';

@Component({
    selector: 'bt-card-icon-text',
    templateUrl: './bt-card-icon-text.component.html'
})
export class BtCardIconTextComponent implements OnInit {
    @Input() date!: any;

    constructor() {}

    ngOnInit(): void {}

}

import { Component, Input, OnInit } from '@angular/core';

@Component({
    selector: 'bt-title-border-color',
    templateUrl: './bt-title-border-color.component.html'
})
export class BtTitleBorderColorComponent implements OnInit {
    @Input() title: string = '';

    constructor() {}

    ngOnInit(): void {}

}

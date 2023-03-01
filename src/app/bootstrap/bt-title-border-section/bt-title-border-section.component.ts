import { Component, Input, OnInit } from '@angular/core';

@Component({
    selector: 'bt-title-border-section',
    templateUrl: './bt-title-border-section.component.html'
})
export class BtTitleBorderSectionComponent implements OnInit {
    @Input() title: string = '';

    constructor() {}

    ngOnInit(): void {}

}

import { Component, Input, OnInit } from '@angular/core';

@Component({
    selector: 'bt-item-service',
    templateUrl: './bt-item-service.component.html'
})
export class BtItemServiceComponent implements OnInit {
    @Input() data!: any;

    constructor() {}

    ngOnInit(): void {}

}

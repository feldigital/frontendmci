import { Component, Input, OnInit, OnChanges } from '@angular/core';

@Component({
    selector: 'bt-carousel',
    templateUrl: './bt-carousel.component.html'
})
export class BtCarouselComponent implements OnInit, OnChanges {
    @Input() idCarousel: string = 'id-carousel';
    @Input() cant!: number;
    @Input() active: number = 1;
    items: number[] = [];

    constructor() {}
    ngOnChanges(): void {
        for(let i = 0; i < this.cant; i++) {
            this.items.push(i);
        }
    }
    get itemActive(){
        return this.active - 1;
    }

    ngOnInit(): void {}

}

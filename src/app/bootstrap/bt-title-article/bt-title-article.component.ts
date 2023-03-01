import { Component, Input, OnInit } from '@angular/core';

@Component({
    selector: 'bt-title-article',
    templateUrl: './bt-title-article.component.html'
})
export class BtTitleArticleComponent implements OnInit {
    @Input() color: string = 'primary';
    @Input() title: string = 'title';
    @Input() subtitleColor: string = 'white';
    @Input() subtitle: string = 'sub-title';
    @Input() aling: string = 'start';

    constructor() {}

    ngOnInit(): void {}

}

import { Component, Input, OnChanges } from '@angular/core';

@Component({
    selector: 'bt-breadcrumb',
    templateUrl: './bt-breadcrumb.component.html'
})
export class BtBreadcrumbComponent {
    @Input() breadcrumb: Breadcrumb[] = [];
    breadcrumbEnd: Breadcrumb | undefined;

    constructor() {}
    ngOnChanges(): void {
        let end = this.breadcrumb.pop();
        this.breadcrumbEnd = end;
    }

}

interface Breadcrumb {
    name: string;
    path: string;
}

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PipesModule } from '@pipes/module';
import { RouterModule } from '@angular/router';

import { BtAlertComponent } from './bt-alert/bt-alert.component';
import { BtCarouselComponent } from './bt-carousel/bt-carousel.component';
import { BtCardIconTextComponent } from './bt-card-icon-text/bt-card-icon-text.component';
import { BtCardPlainsComponent } from './bt-card-plains/bt-card-plains.component';
import { BtTitleBorderColorComponent } from './bt-title-border-color/bt-title-border-color.component';
import { BtTitleArticleComponent } from './bt-title-article/bt-title-article.component';
import { BtTitleBorderSectionComponent } from './bt-title-border-section/bt-title-border-section.component';
import { BtItemServiceComponent } from './bt-item-service/bt-item-service.component';
import { BtBadgeCounterComponent } from './bt-badge-counter/bt-badge-counter.component';
import { BtCardNotifyComponent } from './bt-card-notify/bt-card-notify.component';
import { BtDropdownNotifyComponent } from './bt-dropdown-notify/bt-dropdown-notify.component';
import { BtBreadcrumbComponent } from './bt-breadcrumb/bt-breadcrumb.component';
import { BtTableSmallComponent } from './bt-table-small/bt-table-small.component';
import { BtTableLargeComponent } from './bt-table-large/bt-table-large.component';
import { BtItemCarouselCurtainComponent } from './bt-item-carousel-curtain/bt-item-carousel-curtain.component';

const shared = [
    BtAlertComponent,
    BtCardIconTextComponent,
    BtCarouselComponent,
    BtTitleBorderColorComponent,
    BtTitleArticleComponent,
    BtTitleBorderSectionComponent,
    BtCardPlainsComponent,
    BtItemServiceComponent,
    BtBadgeCounterComponent,
    BtCardNotifyComponent,
    BtDropdownNotifyComponent,
    BtBreadcrumbComponent,
    BtTableSmallComponent,
    BtTableLargeComponent,
    BtItemCarouselCurtainComponent
]


@NgModule({
    imports: [
        CommonModule,
        RouterModule,
        PipesModule
    ],
    declarations: [
        ...shared
    ],
    exports: [
        ...shared
    ]
})
export class BootstrapModule {}

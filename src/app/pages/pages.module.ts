import { NgModule } from "@angular/core";

import { FormsModule } from "@angular/forms";

// Modules
import { SharedModule } from "../shared/shared.module";

// components
import { PagesComponent } from "./pages.component";

import { DashboardComponent } from "./dashboard/dashboard.component";
import { ProgressComponent } from "./progress/progress.component";
import { Graficas1Component } from "./graficas1/graficas1.component";

// routes
import { PAGES_ROUTES } from "./pages.routes";

// graficos ng2-charts
import { ChartsModule } from 'ng2-charts';


import { IncrementadorComponent } from "../components/incrementador/incrementador.component";
import { GraficoDonaComponent } from '../components/grafico-dona/grafico-dona.component';

@NgModule({
    declarations: [
        PagesComponent,
        DashboardComponent,
        ProgressComponent,
        Graficas1Component,
        IncrementadorComponent,
        GraficoDonaComponent
    ],
    exports: [
        PagesComponent,
        DashboardComponent,
        ProgressComponent,
        Graficas1Component
    ],
    imports: [
        SharedModule,
        PAGES_ROUTES,
        FormsModule,
        ChartsModule


    ]
})
export class PagesModule { }
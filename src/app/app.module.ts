import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

// temporal
import { FormsModule } from "@angular/forms";

// Rutas
import { APP_ROUTES } from './app.routes';

// Modules
import { PagesModule } from './pages/pages.module';

// Services
import { ServiceModule } from './services/service.module';

// Components
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './login/register.component';


@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RegisterComponent
  ],
  imports: [
    BrowserModule,
    APP_ROUTES,
    PagesModule,
    FormsModule,
    ServiceModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }

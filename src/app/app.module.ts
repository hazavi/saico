import { LOCALE_ID, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import { RouterModule } from '@angular/router'; // Import RouterModule
import { routes } from './app.routes'; // Import routes from app.routes.ts
import { FormsModule } from '@angular/forms'; // Import FormsModule
import { LoadingComponent } from './components/loading/loading.component';
import { CommonModule } from '@angular/common';


@NgModule({
  declarations: [],
  imports: [BrowserModule, RouterModule.forRoot(routes), CommonModule, FormsModule, LoadingComponent],
  providers: [ 
    
  ],
  // exports: [RouterModule],
})
export class AppModule {}
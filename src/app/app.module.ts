import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

// Angular Material
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatBadgeModule } from '@angular/material/badge';
import { MatChipsModule } from '@angular/material/chips';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSnackBarModule } from '@angular/material/snackbar';
import { MatTableModule } from '@angular/material/table';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatRadioModule } from '@angular/material/radio';
import { MatDividerModule } from '@angular/material/divider';
import { MatTooltipModule } from '@angular/material/tooltip';

// Routing
import { AppRoutingModule } from './app-routing.module';

// Components
import { AppComponent } from './app.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { MenuListComponent } from './components/menu-list/menu-list.component';
import { MenuDetailComponent } from './components/menu-detail/menu-detail.component';
import { CartComponent } from './components/cart/cart.component';
import { OrderFormComponent } from './components/order-form/order-form.component';
import { OrderConfirmationComponent } from './components/order-confirmation/order-confirmation.component';

// Services
import { MenuService } from './services/menu.service';
import { CartService } from './services/cart.service';
import { OrderService } from './services/order.service';

// Pipes
import { MenuFilterPipe } from './pipes/menu-filter.pipe';
import { DiscountPricePipe } from './pipes/discount-price.pipe';

// Directives
import { HighlightRecommendedDirective } from './directives/highlight-recommended.directive';
import { DiscountHighlightDirective } from './directives/discount-highlight.directive';

// Interceptors
import { ErrorInterceptor } from './interceptors/error.interceptor';
import { LoggingInterceptor } from './interceptors/logging.interceptor';

// Guards
import { CartGuard } from './guards/cart.guard';

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    MenuListComponent,
    MenuDetailComponent,
    CartComponent,
    OrderFormComponent,
    OrderConfirmationComponent,
    MenuFilterPipe,
    DiscountPricePipe,
    HighlightRecommendedDirective,
    DiscountHighlightDirective
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    AppRoutingModule,
    // Angular Material
    MatToolbarModule,
    MatButtonModule,
    MatCardModule,
    MatIconModule,
    MatBadgeModule,
    MatChipsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatDialogModule,
    MatSnackBarModule,
    MatTableModule,
    MatProgressSpinnerModule,
    MatRadioModule,
    MatDividerModule,
    MatTooltipModule
  ],
  providers: [
    MenuService,
    CartService,
    OrderService,
    CartGuard,
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: LoggingInterceptor, multi: true }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}

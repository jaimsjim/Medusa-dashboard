import { Component } from '@angular/core';
import { Router, ActivatedRoute, RouterOutlet } from '@angular/router';
import { provideRoutes } from '@angular/router';
import { RouterModule } from '@angular/router'; // Add this import
import { routes } from './app.routes';
import 'bootstrap/dist/js/bootstrap.min.js';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterModule, FormsModule], // Add RouterModule to imports
  providers: [provideRoutes(routes), HttpClient],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  constructor(private router: Router, private activatedRoute: ActivatedRoute) {}

  isActive(url: string): boolean {
    return this.router.url === url;
  }

  title = 'dashboard-app';
}

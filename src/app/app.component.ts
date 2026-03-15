import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { environment } from '../environments/environment';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  template: `<router-outlet />`
})
export class AppComponent implements OnInit {
  constructor(private http: HttpClient) {}

  ngOnInit() {
    // Load theme from backend and inject CSS variables globally
    this.http.get<any>(`${environment.apiUrl}/theme`).subscribe({
      next: (res) => {
        if (res?.data?.cssVariables) {
          this.injectTheme(res.data.cssVariables);
        }
      },
      error: () => {} // fail silently, fallback to scss defaults
    });
  }

  private injectTheme(css: string) {
    let style = document.getElementById('elitenest-theme');
    if (!style) {
      style = document.createElement('style');
      style.id = 'elitenest-theme';
      document.head.appendChild(style);
    }
    style.textContent = css;
  }
}

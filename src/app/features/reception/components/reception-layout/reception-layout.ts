import { Component, HostListener, signal } from '@angular/core';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { AuthService } from '../../../auth/services/auth';

@Component({
  selector: 'app-reception-layout',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, RouterOutlet],
  templateUrl: './reception-layout.html',
  styleUrl: './reception-layout.scss',
})
export class ReceptionLayout {

  // Controls the sidebar on small / mobile screens (off-canvas drawer)
  isSidebarOpen = signal<boolean>(false);

  constructor(private authService: AuthService, private router: Router) {}

  toggleSidebar(): void {
    this.isSidebarOpen.update(open => !open);
  }

  closeSidebar(): void {
    this.isSidebarOpen.set(false);
  }

  // Auto-close the mobile drawer if the viewport is resized back to desktop
  @HostListener('window:resize')
  onResize(): void {
    if (window.innerWidth > 992) {
      this.isSidebarOpen.set(false);
    }
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}

import { Component, OnInit } from '@angular/core';
import { faBars, IconDefinition } from '@fortawesome/free-solid-svg-icons';
import { Router } from '@angular/router';

@Component({
  selector: 'garage-nav-bar',
  templateUrl: './nav-bar.component.pug',
  styleUrls: ['./nav-bar.component.scss']
})
export class NavBarComponent implements OnInit {

  constructor(private router: Router) { }
  public menuIcon: IconDefinition = faBars;
  public routeViews: {url: string, title: string}[] = [{
    url: '/new-ticket',
    title: 'Assign slot'
  }, {
    url: '/garage',
    title: 'Vehicles'
  }];

  get currentRouteTitle(): string {
    const routeStateUrl = this.router.routerState.snapshot.url;
    const currentRoute = this.routeViews.find(route => new RegExp(`^${route.url}`).test(routeStateUrl));
    return currentRoute ? currentRoute.title : null;
  }

  ngOnInit() {
  }

}

import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'garage-root',
  templateUrl: './garage.component.pug',
  styleUrls: ['./garage.component.scss']
})
export class AppComponent implements OnInit {
  private searchCriteria: string;
  public searchVehicle(searchCriteria: string) {
    this.updateQueryParams(searchCriteria);
  }

  private updateQueryParams(searchCriteria) {
    this.router.navigate(['garage'], {
      queryParams: {
        filter: searchCriteria
      },
      skipLocationChange: this.activatedRoute.routeConfig.path !== 'garage'
    });
  }

  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit() {
    this.searchCriteria = this.activatedRoute.snapshot.queryParams.filter;
  }
}

import {Component, OnInit, Input} from '@angular/core';
import {JobsService} from "../jobs.service";

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.less']
})
export class DashboardComponent implements OnInit {
  private jobsMetadata;
  public dashboardWidgets = [];

  constructor(private jobsSvc: JobsService) {
    this.jobsMetadata = jobsSvc.jobsMetadata;

    // todo: not update metadata in real time

    jobsSvc.jobDashboardMapSubject.subscribe(jobDashboardMap => {
      this.dashboardWidgets = [];
      Object.keys(jobDashboardMap).forEach(key => {
        this.dashboardWidgets.push(this.jobsMetadata[key]);
      });
      console.log(this.dashboardWidgets);
    })
  }

  ngOnInit() {

  }
}

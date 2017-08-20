import { Component } from '@angular/core';
import {JobsService} from "./jobs.service";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.less']
})
export class AppComponent {
  title = 'app works!';
  public ready: boolean = false;
  public metadataHidden = false;

  constructor(private jobsSvc: JobsService) {
    this.jobsSvc.getJobsMetaData().subscribe(metadata => {
      this.ready = true;
    });
  }

  toggleMetadata() {
    this.metadataHidden = !this.metadataHidden;
  }
}

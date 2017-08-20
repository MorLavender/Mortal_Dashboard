import {Component, OnInit, Input} from '@angular/core';
import {JobsService} from "../jobs.service";

@Component({
  selector: 'app-metadata',
  templateUrl: 'metadata.component.html'
})
export class MetadataComponent implements OnInit {
  public products;
  public metadata;

  constructor(private jobsSvc: JobsService) {
    this.jobsSvc.getJobsMetaData().subscribe(metadata => {
      this.metadata = metadata;
      this.products = Object.keys(this.metadata);
    });
  }

  ngOnInit() {
  }

  cbClicked() {
    this.jobsSvc.jobToggled(this.metadata);
  }
}

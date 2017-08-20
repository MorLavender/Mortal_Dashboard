import {Component, OnInit, Input} from '@angular/core';
import {JobsService} from "../jobs.service";

@Component({
  selector: 'app-hosts',
  templateUrl: './hosts.component.html',
  styleUrls: ['./hosts.component.less']
})
export class HostsComponent implements OnInit {
  @Input() hosts;
  public cols = [];
  public visibleStatusCols = [
    {
      key: 'ipAddress',
      displayName: 'IP'
    },
    {
      key: 'productInstalled',
      displayName: 'Product'
    },
    {
      key: 'BuildVersion',
      displayName: 'Version'
    },
    {
      key: 'LanguagePackValue',
      displayName: 'LP'
    },
    {
      key: 'userConnected',
      displayName: 'Users Connected'
    },
    {
      key: 'machineLastUpdate',
      displayName: 'Last Update'
    }
  ];

  constructor(private jobsSvc: JobsService) {
    jobsSvc.getJobsMachineStatus().subscribe(machineStatus => {
      this.hosts.forEach(host => {
        this.visibleStatusCols.forEach(col => {
          host[col.displayName] = machineStatus[host.name][col.key] || 'N/A';
          host.extendedData = machineStatus[host.name] || {};
          host.up = machineStatus[host.name].vmStatus && machineStatus[host.name].vmStatus.toLowerCase() == 'up';
        });
      });

    });
  }

  ngOnInit() {
    if (this.hosts.length > 0) {
      this.cols = [];
      Object.keys(this.hosts[0]).forEach(colHeader => {
        this.cols.push(colHeader);
      });
      this.visibleStatusCols.forEach(col => {
        this.cols.push(col.displayName);
      });
    }
  }
}

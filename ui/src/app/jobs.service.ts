import {Injectable} from '@angular/core';
import {Http} from "@angular/http";
import 'rxjs/Rx';
import {Observable, BehaviorSubject} from "rxjs";


// todo: fix bug on job hosts list | when adding new job hosts columns  'bla'


// todo: make polling calls private instances, and create public Observables


@Injectable()
export class JobsService {
  private _jobDashboardMap = {};
  // example of local Observables
  public jobDashboardMapSubject: BehaviorSubject<any> = new BehaviorSubject({});
  private metaDataInterval: number = 30000;//60000 * 5;
  private machineStatusInterval: number = 30000;
  private _jobsMetadata = {};

  constructor(private http: Http) {
    let jobDashboardMap = localStorage.getItem('_jobDashboardMap');
    this._jobDashboardMap = jobDashboardMap ? JSON.parse(jobDashboardMap) : {};
    this.jobDashboardMapSubjectNext();

    // init 2 polling Observables, and update local vars
    // create

  }

  getJobsMetaData() {
    let self = this;
    return Observable.interval(this.metaDataInterval)
      .startWith(0)
      .switchMap(() => this.http.get('/api/jobs'))
      .map(res => {
        let products = res.json();
        let productsArray = [];
        Object.keys(products).forEach(productName => {
          productsArray.push(productName);
          products[productName].forEach(job => {
            job.id = productName + '_' + job.name;
            job.selected = !!self._jobDashboardMap[job.id];
            self._jobsMetadata[job.id] = job;
            self._jobsMetadata[job.id].productName = productName;
          });
        });

        // sort data to keep it in the same order
        productsArray.sort();
        let sortedProducts = {};
        productsArray.forEach(productKey => {
          sortedProducts[productKey] = products[productKey];
        });
        //self.jobsMetadataNext();
        return sortedProducts;
      })
      .catch(this.handleError);
  }

  getJobsMachineStatus() {
    return Observable.interval(this.machineStatusInterval)
      .startWith(0)
      .switchMap(() => this.http.get('/api/machine-status'))
      .map(res => {
        const statuses = res.json();
        let machines = {};
        statuses.forEach(machineStatus => {
          machines[machineStatus.vmName] = machineStatus;
        });
        return machines;
      })
      .catch(this.handleError);
  }

  private jobDashboardMapSubjectNext() {
    // notify to subscribes
    this.jobDashboardMapSubject.next(this._jobDashboardMap);
  }

  private updatePersistence() {
    localStorage.setItem('_jobDashboardMap', JSON.stringify(this._jobDashboardMap));
  }

  public jobToggled(products) {
    this._jobDashboardMap = {};
    Object.keys(products).forEach(productName => {
      products[productName].forEach(job => {
        if (job.selected) {
          this._jobDashboardMap[job.id] = job.environmentName.split(' ').join('__');
        }
      });
    });
    this.jobDashboardMapSubjectNext();
    this.updatePersistence();
  }

  get jobsMetadata(): {} {
    return this._jobsMetadata;
  }

  private handleError(error: Response | any) {
    // In a real world app, you might use a remote logging infrastructure
    let errMsg: string;
    if (error instanceof Response) {
      const body = error.json() || '';
      const err = JSON.stringify(body);
      errMsg = `${error.status} - ${error.statusText || ''} ${err}`;
    } else {
      errMsg = error.message ? error.message : error.toString();
    }
    console.error(errMsg);
    return Observable.throw(errMsg);
  }

}

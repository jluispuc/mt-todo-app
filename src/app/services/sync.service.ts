import { Injectable } from '@angular/core';
import { DbService } from './db.service';
import { environment } from 'src/environments/environment';
import { Task } from '../models/task.model';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, catchError, map, throwError } from 'rxjs';
import { HttpErrorHandler } from '../models/error.model';

@Injectable({
  providedIn: 'root'
})
export class SyncService {
  readonly worker: Worker | undefined;

  readonly endpoint = "/tasks"

  constructor(
    private db: DbService,
    private http: HttpClient
  ) {
    if ( typeof Worker !== 'undefined' ){
      this.worker = new Worker(new URL('../workers/sync.worker', import.meta.url), { type: 'module' });
    
      this.worker.onmessage = ({data}) => {
        if (data === 'sync-tasks'){
          this.sync();
        }
      }
    } else {
      console.error('Web Workers are not supported in this environment.');
    }
  }

  requestSync(command: 'sync-tasks'){
    this.worker?.postMessage(command);
  }

  private async sync() {
    console.info("Syncing...");
    let tasks: Array<Task> | undefined = [];

    const query = (await this.db.find('Task')) as Array<Task>;
    
    tasks = query.filter(t => !t.isSync);

    if (typeof tasks !== 'undefined'){
      for(let task of tasks){
        this.http.post<Task>(`${environment.baseUrl}${this.endpoint}`, task)
                 .pipe(
                  map((res: Task) => {
                    let _task = {...task, _id: res.id, isAsync: true};
  
                    this.db.update('Task', _task.id, task);
                  }),
                  catchError(this.handleError));
      }
    }
  }

  private handleError(err: HttpErrorResponse){
    // in a real world app, we may send the server to some remote logging infrastructure
    // instead of just logging it to the console
    let errorHandler: HttpErrorHandler = {
      type: 'on-server',
    };
    let errorMessage: string;
    if (err.error instanceof ErrorEvent) {
        // A client-side or network error occurred. Handle it accordingly.
        errorHandler.type = 'on-client';
        errorMessage = `An error occurred: ${err.error.message}`;
    } else {
        // The backend returned an unsuccessful response code.
        // The response body may contain clues as to what went wrong,
        errorMessage = `Server returned code: ${err.status}, error message is: ${err.message}`;
    }
    errorHandler.errorMessage = errorMessage;
    console.error(errorMessage);
    return throwError(errorMessage);
  }
}

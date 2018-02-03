import { Injectable } from '@angular/core';
import { CanDeactivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs/Observable';
// import { CustomerDetailComponent } from '../customer-detail/customer-detail.component';

export interface CanComponentDeactivate {
  canDeactivate: () => Observable<boolean> | Promise<boolean> | boolean;
}

@Injectable()
export class UnsavedchangesGuardService implements CanDeactivate<CanComponentDeactivate> {
// use candeactiavte for unsaved changes check
  canDeactivate(
    component: CanComponentDeactivate,
      currentRoute: ActivatedRouteSnapshot,
        currentState: RouterStateSnapshot,
          nextState ?: RouterStateSnapshot
  ): boolean | Observable<boolean> | Promise < boolean > {
      console.log('CanDeactivateGuard.canDeactivate() invoked.');
      return component.canDeactivate();
    }
}

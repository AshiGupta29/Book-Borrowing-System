import {inject} from '@angular/core';
import { Router } from '@angular/router';
import { map } from 'rxjs';

import { AccountService } from 'src/app/core/services/account.service';

export const AuthGuard = () => {
  const accountService = inject(AccountService);
  const router = inject(Router);

  return accountService.currentUser$.pipe(
    map(auth => {
      if (auth) return true;
      else {
        router.navigate(['/account/login'], {queryParams: {returnUrl: router.url}});
        return false
      }
    })
  );
};

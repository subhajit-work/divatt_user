import { TestBed } from '@angular/core/testing';

import { LoginNavService } from './login-nav.service';

describe('LoginNavService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: LoginNavService = TestBed.get(LoginNavService);
    expect(service).toBeTruthy();
  });
});

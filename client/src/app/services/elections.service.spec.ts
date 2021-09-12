import { TestBed } from '@angular/core/testing';

import { ElectionsService } from './elections.service';

describe('ElectionsService', () => {
  let service: ElectionsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ElectionsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

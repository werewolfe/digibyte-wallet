import { TestBed, inject } from '@angular/core/testing';

import { DigiByteService } from './digi-byte.service';

describe('DigiByteService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [DigiByteService]
    });
  });

  it('should be created', inject([DigiByteService], (service: DigiByteService) => {
    expect(service).toBeTruthy();
  }));
});

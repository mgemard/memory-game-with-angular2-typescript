import {Logo} from './logo';
import {LOGOS} from './mock-logos';
import {Injectable} from 'angular2/core';

@Injectable()
export class LogoService {
  getLogos() {
    return Promise.resolve(LOGOS);
  }
  // See the "Take it slow" appendix
  getLogosSlowly() {
    return new Promise<Logo[]>(resolve =>
      setTimeout(()=>resolve(LOGOS), 2000) // 2 seconds
    );
  }
}

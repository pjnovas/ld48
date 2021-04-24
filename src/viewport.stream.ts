import { BehaviorSubject, fromEvent } from 'rxjs'
import { debounceTime, filter, map, pluck, share, tap } from 'rxjs/operators'
import { Size } from './types'

const viewportState$ = new BehaviorSubject<Size>({
  width: window.innerWidth,
  height: window.innerHeight
})

fromEvent(window, 'resize')
  .pipe(
    debounceTime(50),
    map<Event, Size>((e) => ({
      width: window.innerWidth,
      height: window.innerHeight
    }))
  )
  .subscribe((size) => viewportState$.next(size))

export default viewportState$

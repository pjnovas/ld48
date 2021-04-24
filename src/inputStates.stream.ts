import { BehaviorSubject, fromEvent } from 'rxjs'
import { filter, map, pluck, tap } from 'rxjs/operators'

const EmptyValue = ''
const inputState$ = new BehaviorSubject(EmptyValue)

fromEvent(document, 'keyup')
  .pipe(
    pluck<Event, string>('key'),
    map((key) => key.toLowerCase())
    // filter((key) => key.length === 1 && /[a-z1-9]/.test(key))
  )
  .subscribe((key) => inputState$.next(key))

export const clearInput = () => inputState$.next(EmptyValue)

export default inputState$

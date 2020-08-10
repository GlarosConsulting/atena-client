import { format } from 'date-fns';
import { utcToZonedTime } from 'date-fns-tz';

import getTimeZone from './getTimeZone';

export default function formatDate(value?: string | number | Date): string {
  return value
    ? format(utcToZonedTime(value, getTimeZone()), 'dd/MM/yyyy')
    : '';
}

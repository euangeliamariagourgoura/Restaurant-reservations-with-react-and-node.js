// utils/dayjsConfig.js
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';

dayjs.extend(utc);
dayjs.extend(timezone);

// Set default to Europe/Athens (GMT+3)
dayjs.tz.setDefault('Europe/Athens');

export default dayjs;

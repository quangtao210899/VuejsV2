import dayjs from 'dayjs';

const locale = {
    name: 'vi',
    relativeTime: {
        future: '%s sau',
        past: '%s trước',
        s: 'vài giây',
        m: '1 phút',
        mm: '%d phút',
        h: '1 giờ',
        hh: '%d giờ',
        d: '1 ngày',
        dd: '%d ngày',
        M: '1 tháng',
        MM: '%d tháng',
        y: '1 năm',
        yy: '%d năm'
    }
};

dayjs.locale(locale, null, true);

export default locale;
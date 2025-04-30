import moment from 'moment'
import momentTz from 'moment-timezone'

export const parseDate = (dateString: any) => {
     const formats = [
          'DD-MM-YYYY',
          'DD/MM/YYYY',
          // 'MM-DD-YYYY',
          // 'DD/MM/YYYY',
          // 'DD MM YYYY',
          // 'YYYYMMDD',
          'YYYY-MM-DD',
          'YYYY/MM/DD',
     ]

     return dateString.toString().includes('-') || dateString.toString().includes('/')
          ? momentTz
                 .utc(dateString, formats, true)
                 .tz('Asia/Ho_Chi_Minh')
                 .toDate()
          : moment.utc(dateString).local().toDate()
}

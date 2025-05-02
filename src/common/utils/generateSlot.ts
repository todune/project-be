interface TimeSlot {
     start_time: string
     end_time: string
     price: number
     is_peak_hour: boolean
}

interface DailySchedule {
     date: Date
     timeSlots: TimeSlot[]
     isOperational: boolean
}

interface WeeklySettings {
     basePrice: number
     peakHourMultiplier: number
     weekendMultiplier: number
     peakHours: {
          weekdays: Array<{ start: string; end: string }>
          weekends: Array<{ start: string; end: string }>
     }
     nonOperationalDays: number[]
}

interface ScheduleConfig {
     slotDuration: number
     openingHours: Record<number, { start: string; end: string }>
     blockedDates: Date[]
     recurringBlocks: Array<{ weekday: number; start: string; end: string }>
     weeklySettings: WeeklySettings
}

// Utility functions
const parseTime = (timeStr: string): number => {
     const [hours, minutes] = timeStr.split(':').map(Number)
     return hours * 60 + minutes
}

const formatTime = (minutes: number): string => {
     const hours = Math.floor(minutes / 60)
     const mins = minutes % 60
     return `${String(hours).padStart(2, '0')}:${String(mins).padStart(2, '0')}`
}

const isSameDate = (d1: Date, d2: Date): boolean => {
     return (
          d1.getUTCFullYear() === d2.getUTCFullYear() &&
          d1.getUTCMonth() === d2.getUTCMonth() &&
          d1.getUTCDate() === d2.getUTCDate()
     )
}

const isWeekend = (date: Date): boolean => {
     const day = date.getUTCDay()
     return day === 0 || day === 6
}

const getWeekdayIndex = (date: Date): number => {
     return (date.getUTCDay() + 6) % 7 // Convert to Monday-based week (0-6)
}

// Price calculation
const calculateSlotPrice = (
     slotStart: string,
     date: Date,
     config: ScheduleConfig
): { price: number; isPeak: boolean } => {
     const { basePrice, peakHourMultiplier, weekendMultiplier, peakHours } = config.weeklySettings
     let price = basePrice
     let isPeak = false

     const slotTime = parseTime(slotStart)
     const isWeekendDay = isWeekend(date)
     const peakConfig = isWeekendDay ? peakHours.weekends : peakHours.weekdays

     // Check peak hours
     for (const { start, end } of peakConfig) {
          const peakStart = parseTime(start)
          const peakEnd = parseTime(end)

          if (slotTime >= peakStart && slotTime < peakEnd) {
               price *= peakHourMultiplier
               isPeak = true
               break
          }
     }

     // Apply weekend multiplier
     if (isWeekendDay) {
          price *= weekendMultiplier
     }

     return { price: Math.round(price), isPeak }
}

// Main schedule generator
export const generateWeeklySchedule = (baseDate: Date, config: ScheduleConfig): DailySchedule[] => {
     const schedule: DailySchedule[] = []
     const startDate = new Date(
          Date.UTC(baseDate.getUTCFullYear(), baseDate.getUTCMonth(), baseDate.getUTCDate())
     )

     for (let i = 0; i < 7; i++) {
          const currentDate = new Date(startDate)
          currentDate.setUTCDate(startDate.getUTCDate() + i)

          const dailySchedule: DailySchedule = {
               date: currentDate,
               timeSlots: [],
               isOperational: true,
          }

          // Check blocked dates
          if ((config?.blockedDates || []).some((d) => isSameDate(d, currentDate))) {
               dailySchedule.isOperational = false
               schedule.push(dailySchedule)
               continue
          }

          const weekday = getWeekdayIndex(currentDate)
          const opening = config.openingHours[weekday]

          // Check non-operational days
          if (!opening || (config.weeklySettings.nonOperationalDays || []).includes(weekday)) {
               dailySchedule.isOperational = false
               schedule.push(dailySchedule)
               continue
          }

          let currentSlot = parseTime(opening.start)
          const closingTime = parseTime(opening.end)

          while (currentSlot + config.slotDuration <= closingTime) {
               const slotEnd = currentSlot + config.slotDuration
               const slotStartStr = formatTime(currentSlot)
               const slotEndStr = formatTime(slotEnd)

               // Check recurring blocks
               const isBlocked = (config?.recurringBlocks || []).some((block) => {
                    if (block.weekday !== weekday) return false
                    const blockStart = parseTime(block.start)
                    const blockEnd = parseTime(block.end)
                    return currentSlot >= blockStart && slotEnd <= blockEnd
               })

               // Calculate price
               const { price, isPeak } = calculateSlotPrice(slotStartStr, currentDate, config)

               dailySchedule.timeSlots.push({
                    start_time: slotStartStr,
                    end_time: slotEndStr,
                    price,
                    is_peak_hour: isPeak,
               })

               currentSlot = slotEnd
          }

          schedule.push(dailySchedule)
     }

     return schedule
}

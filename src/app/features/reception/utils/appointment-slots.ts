export type Session = 'FN' | 'AN';

export const SESSION_TIMES: Record<Session, { start: string; end: string }> = {
    FN: { start: '09:00', end: '13:00' },   // 9:00 AM - 12:45 PM (last slot starts 12:45)
    AN: { start: '14:00', end: '18:15' },   // 2:00 PM - 6:00 PM
};

export const SLOT_INTERVAL_MINUTES = 15;

// Generates 15-minute slot labels like "09:00 AM", "09:15 AM", ... matching the
// old MVC Appointments/Create.cshtml fnSlots/anSlots arrays.
export function generateTimeSlots(start: string, end: string, intervalMinutes: number = SLOT_INTERVAL_MINUTES): string[] {
    const slots: string[] = [];
    const [startHour, startMin] = start.split(':').map(Number);
    const [endHour, endMin] = end.split(':').map(Number);

    let current = startHour * 60 + startMin;
    const endTotal = endHour * 60 + endMin;

    while (current < endTotal) {
        slots.push(formatTo12Hour(current));
        current += intervalMinutes;
    }
    return slots;
}

function formatTo12Hour(totalMinutes: number): string {
    let hour = Math.floor(totalMinutes / 60);
    const minute = totalMinutes % 60;
    const period = hour >= 12 ? 'PM' : 'AM';
    hour = hour % 12;
    if (hour === 0) hour = 12;
    return `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')} ${period}`;
}

export function getSlotsForSession(session: Session): string[] {
    const { start, end } = SESSION_TIMES[session];
    return generateTimeSlots(start, end);
}

// Parses a "hh:mm AM/PM" label into a Date on the given yyyy-MM-dd date string.
export function slotToDate(dateStr: string, slot: string): Date {
    const [timePart, ampm] = slot.split(' ');
    let [h, m] = timePart.split(':').map(Number);
    if (ampm === 'PM' && h !== 12) h += 12;
    if (ampm === 'AM' && h === 12) h = 0;

    const d = new Date(dateStr + 'T00:00:00');
    d.setHours(h, m, 0, 0);
    return d;
}

export function todayStr(): string {
    return new Date().toISOString().split('T')[0];
}

export function tomorrowStr(): string {
    const d = new Date();
    d.setDate(d.getDate() + 1);
    return d.toISOString().split('T')[0];
}
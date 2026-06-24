// WhatsApp deep-link builders (SPEC §5.2).
import type { Dive } from './types';
import { DEFAULT_WHATSAPP } from './constants';

export function waLink(number: string, text: string): string {
  const n = (number || DEFAULT_WHATSAPP).replace(/[^\d]/g, '');
  return `https://wa.me/${n}?text=${encodeURIComponent(text)}`;
}

export function waBookDive(dive: Dive, number = DEFAULT_WHATSAPP): string {
  // "Hi Scuba India, I'd like to book [PACKAGE] at [SITE]"
  return waLink(
    number,
    `Hi Scuba India, I'd like to book ${dive.name} at ${dive.site}`,
  );
}

export function waGeneral(number = DEFAULT_WHATSAPP): string {
  return waLink(number, 'Hi Scuba India, I have a question about diving in Havelock.');
}

export function waTryDive(number = DEFAULT_WHATSAPP): string {
  return waLink(
    number,
    "Hi Scuba India, I'm new to diving and would like to book a Try Scuba Dive.",
  );
}

export function waCoursesGeneral(number = DEFAULT_WHATSAPP): string {
  return waLink(number, "Hi Scuba India, I'd like to ask about your PADI courses.");
}

export function waCourse(courseName: string, number = DEFAULT_WHATSAPP): string {
  return waLink(number, `Hi Scuba India, I'd like to ask about the ${courseName} course.`);
}

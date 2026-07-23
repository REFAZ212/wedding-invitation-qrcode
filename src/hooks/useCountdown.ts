import { useEffect, useState } from "react";
import dayjs from "dayjs";

export interface CountdownValue {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  isComplete: boolean;
}

/** Menghitung mundur realtime menuju sebuah tanggal ISO. */
export function useCountdown(targetISO: string): CountdownValue {
  const calculate = (): CountdownValue => {
    const target = dayjs(targetISO);
    const now = dayjs();
    const diff = target.diff(now);

    if (diff <= 0) {
      return { days: 0, hours: 0, minutes: 0, seconds: 0, isComplete: true };
    }

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
    const minutes = Math.floor((diff / (1000 * 60)) % 60);
    const seconds = Math.floor((diff / 1000) % 60);

    return { days, hours, minutes, seconds, isComplete: false };
  };

  const [value, setValue] = useState<CountdownValue>(calculate);

  useEffect(() => {
    const interval = setInterval(() => setValue(calculate()), 1000);
    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [targetISO]);

  return value;
}

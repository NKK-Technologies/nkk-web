import { useState, useEffect } from 'react';

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

export const CountdownTimer = () => {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    // Target date: April 9, 2026
    const targetDate = new Date('2026-04-09T00:00:00').getTime();

    const updateTimer = () => {
      const now = new Date().getTime();
      const difference = targetDate - now;

      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((difference % (1000 * 60)) / 1000),
        });
      }
    };

    updateTimer();
    const intervalId = setInterval(updateTimer, 1000);

    return () => clearInterval(intervalId);
  }, []);

  const timeUnits = [
    { label: 'Days', value: timeLeft.days, delay: '0s' },
    { label: 'Hours', value: timeLeft.hours, delay: '0.2s' },
    { label: 'Minutes', value: timeLeft.minutes, delay: '0.4s' },
    { label: 'Seconds', value: timeLeft.seconds, delay: '0.6s' },
  ];

  return (
    <div className="flex flex-wrap justify-center gap-4 sm:gap-6 md:gap-8 mt-12 mb-16">
      {timeUnits.map((unit) => (
        <div 
          key={unit.label} 
          className="glass-panel w-28 h-32 sm:w-36 sm:h-40 flex flex-col items-center justify-center animate-[float_6s_ease-in-out_infinite]" 
          style={{ animationDelay: unit.delay }}
        >
          <span className="text-4xl sm:text-6xl font-bold text-gradient mb-2">{unit.value.toString().padStart(2, '0')}</span>
          <span className="text-xs sm:text-sm text-gray-400 font-medium tracking-widest uppercase">{unit.label}</span>
        </div>
      ))}
    </div>
  );
};

import { useState, useEffect } from 'react';

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

export default function Countdown() {
  const weddingDate = new Date('2025-12-21T10:00:00').getTime();

  const calculateTimeLeft = (): TimeLeft => {
    const now = new Date().getTime();
    const difference = weddingDate - now;

    if (difference > 0) {
      return {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60)
      };
    }

    return { days: 0, hours: 0, minutes: 0, seconds: 0 };
  };

  const [timeLeft, setTimeLeft] = useState<TimeLeft>(calculateTimeLeft());

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="flex gap-4 justify-center mt-8">
      <div className="text-center">
        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 min-w-[80px]">
          <div className="text-4xl font-serif text-white">{timeLeft.days}</div>
          <div className="text-sm text-white/80 mt-1">Dias</div>
        </div>
      </div>
      <div className="text-center">
        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 min-w-[80px]">
          <div className="text-4xl font-serif text-white">{timeLeft.hours}</div>
          <div className="text-sm text-white/80 mt-1">Horas</div>
        </div>
      </div>
      <div className="text-center">
        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 min-w-[80px]">
          <div className="text-4xl font-serif text-white">{timeLeft.minutes}</div>
          <div className="text-sm text-white/80 mt-1">Min</div>
        </div>
      </div>
      <div className="text-center">
        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 min-w-[80px]">
          <div className="text-4xl font-serif text-white">{timeLeft.seconds}</div>
          <div className="text-sm text-white/80 mt-1">Seg</div>
        </div>
      </div>
    </div>
  );
}

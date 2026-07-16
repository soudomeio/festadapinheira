import { useEffect, useState } from 'react';

interface PineLogoProps {
  onComplete?: () => void;
  small?: boolean;
}

export default function PineLogo({ onComplete, small = false }: PineLogoProps) {
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setFadeOut(true);
      setTimeout(() => onComplete?.(), 500);
    }, 2500);
    return () => clearTimeout(timer);
  }, [onComplete]);

  const scale = small ? 0.5 : 1;

  return (
    <div
      style={{
        opacity: fadeOut ? 0 : 1,
        transition: 'opacity 0.5s ease',
        transform: `scale(${scale})`,
      }}
      className="flex flex-col items-center justify-center"
    >
      <div className="relative flex flex-col items-center justify-end"
        style={{ width: 100, height: 160 }}
      >
        {/* Layer 3 - Bottom */}
        <div
          className="absolute"
          style={{
            width: 0,
            height: 0,
            borderLeft: '40px solid transparent',
            borderRight: '40px solid transparent',
            borderBottom: '50px solid #ecc94b',
            animation: 'draw-border 0.5s ease 0.8s forwards',
            transform: 'scale(0)',
            transformOrigin: '50% 100%',
            opacity: 0,
            filter: 'drop-shadow(0 0 2px rgba(236, 201, 75, 0.5))',
            zIndex: 1,
          }}
        />
        {/* Layer 2 - Middle */}
        <div
          className="absolute"
          style={{
            width: 0,
            height: 0,
            borderLeft: '30px solid transparent',
            borderRight: '30px solid transparent',
            borderBottom: '40px solid #ecc94b',
            marginBottom: -15,
            animation: 'draw-border 0.5s ease 0.5s forwards',
            transform: 'scale(0)',
            transformOrigin: '50% 100%',
            opacity: 0,
            filter: 'drop-shadow(0 0 2px rgba(236, 201, 75, 0.5))',
            zIndex: 2,
          }}
        />
        {/* Layer 1 - Top */}
        <div
          className="absolute"
          style={{
            width: 0,
            height: 0,
            borderLeft: '20px solid transparent',
            borderRight: '20px solid transparent',
            borderBottom: '30px solid #ecc94b',
            marginBottom: -15,
            animation: 'draw-border 0.5s ease 0.2s forwards',
            transform: 'scale(0)',
            transformOrigin: '50% 100%',
            opacity: 0,
            filter: 'drop-shadow(0 0 2px rgba(236, 201, 75, 0.5))',
            zIndex: 3,
          }}
        />
        {/* Trunk */}
        <div
          className="absolute"
          style={{
            width: 12,
            height: 25,
            background: '#ecc94b',
            marginTop: -1,
            zIndex: 0,
            animation: 'draw-border 0.5s ease 1.2s forwards',
            transform: 'scale(0)',
            transformOrigin: '50% 100%',
            opacity: 0,
            filter: 'drop-shadow(0 0 2px rgba(236, 201, 75, 0.5))',
          }}
        />
      </div>
      {!small && (
        <h1
          className="text-2xl font-bold tracking-tight mt-4"
          style={{
            color: '#ecc94b',
            animation: 'fade-in-up 0.6s ease 1.5s forwards',
            opacity: 0,
            transform: 'translateY(10px)',
          }}
        >
          FESTA DA PINHEIRA
        </h1>
      )}
      <style>{`
        @keyframes draw-border {
          0% { transform: scale(0); opacity: 0; }
          100% { transform: scale(1); opacity: 1; }
        }
        @keyframes fade-in-up {
          0% { opacity: 0; transform: translateY(10px); }
          100% { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}

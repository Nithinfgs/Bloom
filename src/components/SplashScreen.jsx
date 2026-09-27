import React, { useState, useEffect } from 'react';
import { Sparkles, Sprout } from 'lucide-react';

export default function SplashScreen({ onFinish, duration = 1800 }) {
  const [isExiting, setIsExiting] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Progress animation
    const interval = 20;
    const step = 100 / (duration / interval);
    const progressTimer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(progressTimer);
          return 100;
        }
        return Math.min(prev + step, 100);
      });
    }, interval);

    // Fade out trigger
    const exitTimer = setTimeout(() => {
      setIsExiting(true);
    }, duration);

    // Final unmount trigger
    const doneTimer = setTimeout(() => {
      if (onFinish) onFinish();
    }, duration + 450);

    return () => {
      clearInterval(progressTimer);
      clearTimeout(exitTimer);
      clearTimeout(doneTimer);
    };
  }, [duration, onFinish]);

  const handleSkip = () => {
    if (!isExiting) {
      setIsExiting(true);
      setTimeout(() => {
        if (onFinish) onFinish();
      }, 300);
    }
  };

  return (
    <div
      onClick={handleSkip}
      style={{
        ...styles.overlay,
        opacity: isExiting ? 0 : 1,
        transform: isExiting ? 'scale(1.03)' : 'scale(1)',
        filter: isExiting ? 'blur(6px)' : 'none',
        pointerEvents: isExiting ? 'none' : 'auto'
      }}
    >
      {/* Ambient background glow orbs */}
      <div style={styles.glowOrbTop} />
      <div style={styles.glowOrbBottom} />

      <div style={styles.content}>
        {/* Animated Badge Container */}
        <div style={styles.badgeWrapper}>
          <div style={styles.pulseRing} />
          <div style={styles.pulseRingOuter} />
          
          <div style={styles.logoBadge}>
            <div style={styles.iconLayer}>
              <Sprout size={40} color="#FFFFFF" strokeWidth={2.2} />
              <Sparkles 
                size={18} 
                color="#EBF2EC" 
                style={styles.sparkleIcon} 
              />
            </div>
          </div>
        </div>

        {/* Brand Typography */}
        <div style={styles.textGroup}>
          <h1 style={styles.brandTitle}>IDEX</h1>
          <div style={styles.pillBadge}>
            <span>AGRICULTURAL & SURPLUS EXCHANGE</span>
          </div>
          <p style={styles.tagline}>
            Connecting local food surplus with farmers & composters in Coimbatore
          </p>
        </div>

        {/* Dynamic Loading Meter */}
        <div style={styles.loadingContainer}>
          <div style={styles.progressBarTrack}>
            <div 
              style={{
                ...styles.progressBarFill,
                width: `${progress}%`
              }} 
            />
          </div>
          <div style={styles.loadingFooter}>
            <span style={styles.loadingLabel}>Initializing exchange hub...</span>
            <span style={styles.skipHint}>Tap to skip</span>
          </div>
        </div>
      </div>

      {/* Embedded CSS animations for high-performance GPU execution */}
      <style>{`
        @keyframes idexPulseGlow {
          0% {
            transform: scale(0.95);
            opacity: 0.6;
          }
          50% {
            transform: scale(1.15);
            opacity: 0.2;
          }
          100% {
            transform: scale(0.95);
            opacity: 0.6;
          }
        }

        @keyframes idexPulseRingOuter {
          0% {
            transform: scale(1);
            opacity: 0.4;
          }
          50% {
            transform: scale(1.35);
            opacity: 0.05;
          }
          100% {
            transform: scale(1);
            opacity: 0.4;
          }
        }

        @keyframes idexSparkleFloat {
          0%, 100% {
            transform: translate(0, 0) rotate(0deg);
          }
          50% {
            transform: translate(2px, -3px) rotate(12deg);
          }
        }

        @keyframes idexLogoEntrance {
          0% {
            transform: scale(0.75) translateY(12px);
            opacity: 0;
          }
          100% {
            transform: scale(1) translateY(0);
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
}

const styles = {
  overlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 99999,
    backgroundColor: '#DBEAD0',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '24px 20px',
    transition: 'opacity 400ms cubic-bezier(0.16, 1, 0.3, 1), transform 400ms cubic-bezier(0.16, 1, 0.3, 1), filter 400ms ease',
    cursor: 'pointer',
    userSelect: 'none',
    overflow: 'hidden'
  },
  glowOrbTop: {
    position: 'absolute',
    top: '-15%',
    right: '-10%',
    width: '320px',
    height: '320px',
    borderRadius: '50%',
    background: 'radial-gradient(circle, rgba(92, 140, 126, 0.22) 0%, rgba(219, 234, 208, 0) 70%)',
    pointerEvents: 'none'
  },
  glowOrbBottom: {
    position: 'absolute',
    bottom: '-10%',
    left: '-10%',
    width: '300px',
    height: '300px',
    borderRadius: '50%',
    background: 'radial-gradient(circle, rgba(62, 107, 95, 0.18) 0%, rgba(219, 234, 208, 0) 70%)',
    pointerEvents: 'none'
  },
  content: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    textAlign: 'center',
    width: '100%',
    maxWidth: '360px',
    position: 'relative',
    zIndex: 2,
    animation: 'idexLogoEntrance 550ms cubic-bezier(0.16, 1, 0.3, 1) forwards'
  },
  badgeWrapper: {
    position: 'relative',
    width: '104px',
    height: '104px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: '22px'
  },
  pulseRing: {
    position: 'absolute',
    width: '96px',
    height: '96px',
    borderRadius: '28px',
    backgroundColor: '#3E6B5F',
    animation: 'idexPulseGlow 2.2s infinite ease-in-out'
  },
  pulseRingOuter: {
    position: 'absolute',
    width: '104px',
    height: '104px',
    borderRadius: '32px',
    border: '2px solid #5C8C7E',
    animation: 'idexPulseRingOuter 2.2s infinite ease-in-out'
  },
  logoBadge: {
    position: 'relative',
    width: '84px',
    height: '84px',
    borderRadius: '24px',
    backgroundColor: '#3E6B5F',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0 12px 28px rgba(30, 50, 44, 0.22), inset 0 1px 1px rgba(255, 255, 255, 0.35)',
    border: '1.5px solid rgba(255, 255, 255, 0.25)'
  },
  iconLayer: {
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  sparkleIcon: {
    position: 'absolute',
    top: '-8px',
    right: '-10px',
    animation: 'idexSparkleFloat 2s ease-in-out infinite'
  },
  textGroup: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    marginBottom: '28px'
  },
  brandTitle: {
    fontFamily: 'Inter, -apple-system, sans-serif',
    fontSize: '2.8rem',
    fontWeight: 800,
    color: '#172320',
    letterSpacing: '-0.035em',
    lineHeight: 1,
    margin: '0 0 8px 0'
  },
  pillBadge: {
    display: 'inline-flex',
    alignItems: 'center',
    padding: '4px 10px',
    backgroundColor: 'rgba(62, 107, 95, 0.12)',
    border: '1px solid rgba(62, 107, 95, 0.25)',
    borderRadius: '20px',
    fontSize: '0.66rem',
    fontWeight: 700,
    color: '#3E6B5F',
    letterSpacing: '0.06em',
    marginBottom: '10px'
  },
  tagline: {
    fontSize: '0.84rem',
    color: '#455853',
    fontWeight: 500,
    lineHeight: 1.4,
    maxWidth: '300px',
    margin: 0
  },
  loadingContainer: {
    width: '100%',
    maxWidth: '240px',
    display: 'flex',
    flexDirection: 'column',
    gap: '8px'
  },
  progressBarTrack: {
    width: '100%',
    height: '4px',
    backgroundColor: 'rgba(62, 107, 95, 0.15)',
    borderRadius: '4px',
    overflow: 'hidden'
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#3E6B5F',
    borderRadius: '4px',
    transition: 'width 60ms linear'
  },
  loadingFooter: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%'
  },
  loadingLabel: {
    fontSize: '0.68rem',
    color: '#71847F',
    fontWeight: 500
  },
  skipHint: {
    fontSize: '0.68rem',
    color: '#3E6B5F',
    fontWeight: 600,
    opacity: 0.85
  }
};

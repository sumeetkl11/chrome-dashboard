import confetti from 'canvas-confetti';
import { animateSpring } from './spring.js';
import { CONFIG } from '../config.js';

export class GestureEffects {
  // Success animation
  static celebrate(element) {
    if (CONFIG.animation.reducedMotion) {
      return;
    }

    // Canvas confetti
    const rect = element.getBoundingClientRect();
    confetti({
      particleCount: 100,
      spread: 70,
      origin: {
        x: (rect.left + rect.width / 2) / window.innerWidth,
        y: (rect.top + rect.height / 2) / window.innerHeight
      },
      colors: ['#7C3AED', '#06B6D4', '#EC4899', '#22c55e']
    });

    // Element bounce
    element.animate([
      { transform: 'scale(1) translateY(0)' },
      { transform: 'scale(1.05) translateY(-10px)' },
      { transform: 'scale(1) translateY(0)' }
    ], {
      duration: 500,
      easing: 'cubic-bezier(0.16, 1, 0.3, 1)'
    });
  }

  // Error shake animation
  static shake(element) {
    if (CONFIG.animation.reducedMotion) {
      return;
    }

    const keyframes = [
      { transform: 'translateX(0)' },
      { transform: 'translateX(-10px)' },
      { transform: 'translateX(10px)' },
      { transform: 'translateX(-10px)' },
      { transform: 'translateX(10px)' },
      { transform: 'translateX(0)' }
    ];

    element.animate(keyframes, {
      duration: 400,
      easing: 'ease-in-out'
    });
  }

  // Press feedback
  static press(element) {
    if (CONFIG.animation.reducedMotion) {
      return;
    }

    element.animate(
      [
        { transform: 'scale(1)' },
        { transform: 'scale(0.95)' },
        { transform: 'scale(1)' }
      ],
      {
        duration: 150,
        easing: 'ease-out'
      }
    );
  }

  // Ripple effect
  static ripple(element, event) {
    if (CONFIG.animation.reducedMotion) {
      return;
    }

    const rect = element.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    const ripple = document.createElement('span');
    ripple.className = 'ripple';
    ripple.style.left = `${x}px`;
    ripple.style.top = `${y}px`;

    element.style.position = 'relative';
    element.style.overflow = 'hidden';
    element.appendChild(ripple);

    ripple.addEventListener('animationend', () => {
      ripple.remove();
    });
  }

  // Pulse effect for notifications
  static pulse(element, color = 'var(--accent-cyan)') {
    if (CONFIG.animation.reducedMotion) {
      return;
    }

    element.animate([
      { boxShadow: `0 0 0 0 ${color}` },
      { boxShadow: `0 0 0 10px transparent` }
    ], {
      duration: 800,
      iterations: 2,
      easing: 'ease-out'
    });
  }

  // Glow effect
  static glow(element) {
    if (CONFIG.animation.reducedMotion) {
      return;
    }

    element.animate([
      { filter: 'brightness(1)' },
      { filter: 'brightness(1.2)' },
      { filter: 'brightness(1)' }
    ], {
      duration: 600,
      easing: 'ease-in-out'
    });
  }
}

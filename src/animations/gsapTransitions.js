import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Register plugins once in browser environment
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

/**
 * Checks if the user prefers reduced motion
 * @returns {boolean}
 */
export const prefersReducedMotion = () => {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
};

/**
 * Creates a standard staggered reveal for editorial landing sections
 * @param {HTMLElement|string} target
 * @param {Object} [options]
 * @returns {gsap.core.Tween|null}
 */
export const createScrollReveal = (target, options = {}) => {
  if (prefersReducedMotion() || !target) return null;

  return gsap.fromTo(
    target,
    {
      opacity: 0,
      y: options.y || 40,
    },
    {
      opacity: 1,
      y: 0,
      duration: options.duration || 1,
      ease: options.ease || 'power3.out',
      stagger: options.stagger || 0.15,
      scrollTrigger: {
        trigger: target,
        start: options.start || 'top 85%',
        toggleActions: 'play none none none',
        once: true,
      },
    }
  );
};

/**
 * Creates a subtle parallax effect on photography
 * @param {HTMLElement} imageElement
 * @param {HTMLElement} containerElement
 * @returns {gsap.core.Tween|null}
 */
export const createParallaxEffect = (imageElement, containerElement) => {
  if (prefersReducedMotion() || !imageElement || !containerElement) return null;

  return gsap.fromTo(
    imageElement,
    { y: '-10%' },
    {
      y: '10%',
      ease: 'none',
      scrollTrigger: {
        trigger: containerElement,
        start: 'top bottom',
        end: 'bottom top',
        scrub: true,
      },
    }
  );
};

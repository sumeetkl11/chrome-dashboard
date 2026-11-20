import { CONFIG } from '../config.js';

export class Spring {
  constructor(options = {}) {
    this.stiffness = options.stiffness || CONFIG.animation.spring.stiffness;
    this.damping = options.damping || CONFIG.animation.spring.damping;
    this.mass = options.mass || CONFIG.animation.spring.mass;
    this.velocity = 0;
    this.position = options.from || 0;
    this.target = options.to || 0;
  }

  update(deltaTime = 16) {
    if (CONFIG.animation.reducedMotion) {
      this.position = this.target;
      this.velocity = 0;
      return this.position;
    }

    const spring = -this.stiffness * (this.position - this.target);
    const damper = -this.damping * this.velocity;
    const acceleration = (spring + damper) / this.mass;

    this.velocity += acceleration * (deltaTime / 1000);
    this.position += this.velocity * (deltaTime / 1000);

    return this.position;
  }

  isAtRest(threshold = 0.01) {
    return Math.abs(this.velocity) < threshold &&
           Math.abs(this.position - this.target) < threshold;
  }

  setTarget(target) {
    this.target = target;
  }
}

// Animate element with spring physics
export function animateSpring(element, property, from, to, options = {}) {
  const spring = new Spring({ from, to, ...options });
  let lastTime = performance.now();

  function animate() {
    const currentTime = performance.now();
    const deltaTime = currentTime - lastTime;
    lastTime = currentTime;

    const value = spring.update(deltaTime);

    if (property === 'transform') {
      element.style.transform = `translateY(${value}${options.unit || 'px'})`;
    } else {
      element.style[property] = `${value}${options.unit || 'px'}`;
    }

    if (!spring.isAtRest()) {
      requestAnimationFrame(animate);
    } else if (options.onComplete) {
      options.onComplete();
    }
  }

  requestAnimationFrame(animate);
}

// Staggered animation for lists
export function staggeredEntrance(elements, options = {}) {
  const delay = options.delay || 50; // ms between each element

  elements.forEach((element, index) => {
    setTimeout(() => {
      element.style.opacity = '0';
      element.style.transform = 'translateY(20px)';

      requestAnimationFrame(() => {
        element.style.transition = `opacity ${CONFIG.animation.duration.normal}ms ${CONFIG.animation.ease}, transform ${CONFIG.animation.duration.normal}ms ${CONFIG.animation.ease}`;
        element.style.opacity = '1';
        element.style.transform = 'translateY(0)';
      });
    }, index * delay);
  });
}

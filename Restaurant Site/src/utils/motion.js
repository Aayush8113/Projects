export const easings = {
  luxury: [0.16, 1, 0.3, 1],
  smooth: [0.43, 0.13, 0.23, 0.96],
};

export const transitions = {
  fast: { duration: 0.4, ease: easings.smooth },
  smooth: { duration: 0.8, ease: easings.smooth },
  slow: { duration: 1.2, ease: easings.luxury },
  spring: {
    type: "spring",
    stiffness: 120,
    damping: 18,
    mass: 0.7,
  },
};

export const variants = {
  fadeUp: {
    hidden: { opacity: 0, y: 80 },
    show: {
      opacity: 1,
      y: 0,
      transition: transitions.slow,
    },
  },

  scaleReveal: {
    hidden: { scale: 0.92, opacity: 0 },
    show: {
      scale: 1,
      opacity: 1,
      transition: transitions.smooth,
    },
  },

  stagger: {
    show: {
      transition: {
        staggerChildren: 0.12,
        delayChildren: 0.3,
      },
    },
  },

  slideMask: {
    hidden: { y: "110%" },
    show: {
      y: 0,
      transition: transitions.slow,
    },
  },
};

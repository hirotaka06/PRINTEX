'use client';

import { HTMLAttributes, forwardRef } from 'react';
import { tv, type VariantProps } from 'tailwind-variants';

const cardVariants = tv({
  base: 'rounded-2xl transition-all duration-200 bg-white',
  variants: {
    variant: {
      default: 'border border-gray-200',
      outlined: 'border-2 border-gray-200',
      elevated: 'border border-gray-200',
    },
    hover: {
      true: 'cursor-pointer',
      false: '',
    },
  },
  compoundVariants: [
    {
      hover: false,
      variant: 'default',
      class: 'shadow-xl',
    },
    {
      hover: false,
      variant: 'outlined',
      class: 'shadow-sm',
    },
    {
      hover: false,
      variant: 'elevated',
      class: 'shadow-md',
    },
    {
      hover: true,
      variant: 'default',
      class: 'shadow-lg hover:border-gray-300 [&:hover]:shadow-none!',
    },
    {
      hover: true,
      variant: 'outlined',
      class: 'shadow-sm hover:border-gray-300 [&:hover]:shadow-none!',
    },
    {
      hover: true,
      variant: 'elevated',
      class: 'shadow-md hover:border-gray-300 [&:hover]:shadow-none!',
    },
  ],
});

export interface CardProps
  extends HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof cardVariants> {}

export const Card = forwardRef<HTMLDivElement, CardProps>(
  (
    {
      children,
      variant = 'default',
      hover = false,
      className = '',
      ...props
    },
    ref
  ) => {
    return (
      <div
        ref={ref}
        className={cardVariants({ variant, hover, className })}
        {...props}
      >
        {children}
      </div>
    );
  }
);

Card.displayName = 'Card';

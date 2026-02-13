import 'react';
import type { IconifyIconHTMLElement } from 'iconify-icon';

declare module 'react' {
  namespace JSX {
    interface IntrinsicElements {
      'iconify-icon': React.DetailedHTMLProps<
        React.HTMLAttributes<IconifyIconHTMLElement> & {
          icon?: string;
          width?: string | number;
          height?: string | number;
        },
        IconifyIconHTMLElement
      >;
    }
  }
}

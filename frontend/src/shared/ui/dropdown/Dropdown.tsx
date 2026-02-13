'use client';

import { ReactNode, useState, useRef, useEffect } from 'react';
import { Icon } from '@iconify/react';

export interface DropdownItem {
  label: string;
  icon?: string;
  onClick: () => void;
  danger?: boolean;
}

export interface DropdownProps {
  trigger: ReactNode;
  items: DropdownItem[];
  align?: 'left' | 'right';
}

export function Dropdown({ trigger, items, align = 'right' }: DropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const alignStyles = {
    left: 'left-0',
    right: 'right-0',
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <div onClick={() => setIsOpen(!isOpen)} className="cursor-pointer">{trigger}</div>

      {isOpen && (
        <>
          {/* Overlay */}
          <div
            className="fixed inset-0 z-10"
            onClick={() => setIsOpen(false)}
          />
          {/* Dropdown Menu */}
          <div
            className={`absolute ${alignStyles[align]} mt-1 w-56 bg-white border border-gray-200 rounded-md shadow-lg z-20`}
          >
            <div className="py-1">
              {items.map((item, index) => (
                <button
                  key={index}
                  onClick={() => {
                    item.onClick();
                    setIsOpen(false);
                  }}
                  className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-50 transition-colors flex items-center gap-2 ${
                    item.danger ? 'text-red-600 hover:bg-red-50' : 'text-gray-700'
                  }`}
                >
                  {item.icon && <Icon icon={item.icon} width={16} />}
                  <span>{item.label}</span>
                </button>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

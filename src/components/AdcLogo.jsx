import React from 'react';

export function AdcLogo({
  className = 'h-9 w-auto',
  showText = true,
  height,
  onClick,
  id = 'adc-logo',
}) {
  return (
    <div
      id={id}
      onClick={onClick}
      className={`inline-flex items-center select-none ${onClick ? 'cursor-pointer' : ''} ${className}`}
      style={height ? { height } : undefined}
      title="African Diaspora Channels (ADC)"
      role={onClick ? 'button' : undefined}
    >
      <img
        src="/images/adc-white-logo.png"
        alt="African Diaspora Channels"
        className="h-full w-auto max-h-full object-contain drop-shadow"
        referrerPolicy="no-referrer"
        onError={(e) => {
          e.currentTarget.onerror = null;
          e.currentTarget.src = '/adc-white-logo.png';
        }}
      />
    </div>
  );
}


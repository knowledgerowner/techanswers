'use client';

import { Suspense } from 'react';
import PaymentStatus from './payment-status';

export default function PaymentStatusWrapper() {
  return (
    <Suspense fallback={null}>
      <PaymentStatus />
    </Suspense>
  );
} 
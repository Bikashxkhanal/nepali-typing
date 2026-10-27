'use client';
import {useReportWebVitals} from 'next/web-vitals';import {trackEvent} from '@/lib/analytics-client';
export function WebVitalsReporter(){useReportWebVitals(metric=>trackEvent('Web Vital',{name:metric.name,value:Math.round(metric.value),rating:metric.rating}));return null}

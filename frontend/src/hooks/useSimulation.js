import { useCallback, useEffect, useRef, useState } from 'react';

function toRadians(degrees) {
  return (degrees * Math.PI) / 180;
}

function calculateBearing(start, end) {
  const startLat = toRadians(start.lat);
  const endLat = toRadians(end.lat);
  const deltaLng = toRadians(end.lng - start.lng);
  const y = Math.sin(deltaLng) * Math.cos(endLat);
  const x =
    Math.cos(startLat) * Math.sin(endLat) -
    Math.sin(startLat) * Math.cos(endLat) * Math.cos(deltaLng);

  return ((Math.atan2(y, x) * 180) / Math.PI + 360) % 360;
}

function useSimulation(route, tickCallback) {
  const intervalRef = useRef(null);
  const routeRef = useRef(route);
  const callbackRef = useRef(tickCallback);
  const indexRef = useRef(0);
  const [isRunning, setIsRunning] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [currentPosition, setCurrentPosition] = useState(route[0] ?? null);
  const [currentHeading, setCurrentHeading] = useState(null);

  routeRef.current = route;
  callbackRef.current = tickCallback;

  const stop = useCallback(() => {
    if (intervalRef.current !== null) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    setIsRunning(false);
  }, []);

  const tick = useCallback(() => {
    const activeRoute = routeRef.current;
    if (!activeRoute || activeRoute.length === 0) return;

    const index = indexRef.current;
    const current = activeRoute[index];
    const nextIndex = (index + 1) % activeRoute.length;
    const heading = calculateBearing(current, activeRoute[nextIndex]);

    setCurrentPosition(current);
    setCurrentHeading(heading);
    indexRef.current = nextIndex;
    setCurrentIndex(nextIndex);
    callbackRef.current(current, heading, index);
  }, []);

  const start = useCallback(() => {
    if (!routeRef.current?.length || intervalRef.current !== null) return;
    setIsRunning(true);
    intervalRef.current = setInterval(tick, 1000);
  }, [tick]);

  useEffect(() => {
    stop();
    indexRef.current = 0;
    setCurrentIndex(0);
    setCurrentPosition(route[0] ?? null);
    setCurrentHeading(null);
  }, [route, stop]);

  useEffect(() => stop, [stop]);

  return { isRunning, start, stop, currentIndex, currentPosition, currentHeading };
}

export default useSimulation;

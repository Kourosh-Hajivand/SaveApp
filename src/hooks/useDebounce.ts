import { useEffect, useState } from "react";

interface UseDebounceProps<T> {
   value: T;
   delay?: number; // Optional delay
}

function useDebounce<T>({ value, delay = 400 }: UseDebounceProps<T>): T {
   const [debouncedValue, setDebouncedValue] = useState<T>(value);

   useEffect(() => {
      const timer = setTimeout(() => {
         setDebouncedValue(value);
      }, delay);

      return () => {
         clearTimeout(timer);
      };
   }, [value, delay]);

   return debouncedValue;
}

export default useDebounce;

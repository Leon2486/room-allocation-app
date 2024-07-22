import {
  ChangeEventHandler,
  FocusEventHandler,
  MouseEventHandler,
  useCallback,
  useEffect,
  useMemo,
  useRef,
} from "react";

interface CustomInputNumberProps {
  min: number;
  max: number;
  step: number;
  value: number;
  name: string;
  onBlur?: FocusEventHandler<HTMLInputElement>;
  onChange?: ChangeEventHandler<HTMLInputElement>;
  disabled?: boolean;
}

const CLICK_DURATION = 100;

const CustomInputNumber: React.FC<CustomInputNumberProps> = (props) => {
  const { min, max, step, disabled, value, onBlur, onChange, name } = props;
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const triggerInput = useCallback((val: number) => {
    Object.getOwnPropertyDescriptor(
      window.HTMLInputElement.prototype,
      "value"
    )?.set?.call(inputRef.current, val);
  }, []);

  const onPlusClick = useContinuousClick(
    () => {
      if (inputRef.current) {
        const num = parseInt(inputRef.current.value);
        num < max && triggerInput(num + step);
        inputRef.current.focus();
      }
    },
    () => {
      inputRef.current?.dispatchEvent(new Event("input", { bubbles: true }));
    }
  );
  const onMinusClick = useContinuousClick(
    () => {
      if (inputRef.current) {
        const num = parseInt(inputRef.current.value);
        num > min && triggerInput(num - step);
        inputRef.current.focus();
      }
    },
    () => {
      inputRef.current?.dispatchEvent(new Event("input", { bubbles: true }));
    }
  );

  return (
    <div className="flex gap-2" ref={containerRef}>
      <button
        className="number-input-block"
        {...onMinusClick}
        disabled={disabled || value <= min}
      >
        -
      </button>
      <input
        name={name}
        max={max}
        min={min}
        value={value}
        ref={inputRef}
        className="number-input-block"
        disabled={disabled}
        onBlur={(e) => {
          if (containerRef.current?.contains(e.relatedTarget))
            return inputRef.current?.focus();
          onBlur?.(e);
        }}
        onChange={(e) => {
          const num = parseInt(e.target.value) || 0;
          if (num > max || num < min) return;
          onChange?.(e);
        }}
        type="number"
      />
      <button
        disabled={disabled || value >= max}
        {...onPlusClick}
        className="number-input-block"
      >
        +
      </button>
    </div>
  );
};

function useContinuousClick(callback: () => void, onEndCallback: () => void) {
  const intervalRef = useRef(0);

  useEffect(function clearInterval() {
    return () => window.clearInterval(intervalRef.current);
  });

  const onMouseDown: MouseEventHandler<HTMLButtonElement> = useCallback(() => {
    callback();
    intervalRef.current = window.setInterval(callback, CLICK_DURATION);
  }, [callback]);

  const onMouseUp: MouseEventHandler<HTMLButtonElement> = useCallback(() => {
    window.clearInterval(intervalRef.current);
    onEndCallback();
  }, [onEndCallback]);

  return useMemo(() => ({ onMouseDown, onMouseUp }), [onMouseDown, onMouseUp]);
}

export default CustomInputNumber;

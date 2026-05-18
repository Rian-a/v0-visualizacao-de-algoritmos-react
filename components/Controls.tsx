'use client';

import { Play, Pause, SkipForward, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';

interface ControlsProps {
  isPlaying: boolean;
  isComplete: boolean;
  speed: number;
  onPlay: () => void;
  onPause: () => void;
  onStep: () => void;
  onReset: () => void;
  onSpeedChange: (speed: number) => void;
  disabled?: boolean;
}

export function Controls({
  isPlaying,
  isComplete,
  speed,
  onPlay,
  onPause,
  onStep,
  onReset,
  onSpeedChange,
  disabled = false,
}: ControlsProps) {
  return (
    <div className="flex flex-col gap-4 p-4 bg-card rounded-lg border">
      <div className="flex items-center gap-2 flex-wrap justify-center">
        {isPlaying ? (
          <Button
            onClick={onPause}
            variant="outline"
            size="sm"
            disabled={disabled}
          >
            <Pause className="h-4 w-4 mr-2" />
            Pausar
          </Button>
        ) : (
          <Button
            onClick={onPlay}
            variant="default"
            size="sm"
            disabled={disabled || isComplete}
          >
            <Play className="h-4 w-4 mr-2" />
            {isComplete ? 'Concluído' : 'Executar'}
          </Button>
        )}
        
        <Button
          onClick={onStep}
          variant="outline"
          size="sm"
          disabled={disabled || isPlaying || isComplete}
        >
          <SkipForward className="h-4 w-4 mr-2" />
          Passo
        </Button>
        
        <Button
          onClick={onReset}
          variant="outline"
          size="sm"
          disabled={disabled}
        >
          <RotateCcw className="h-4 w-4 mr-2" />
          Reiniciar
        </Button>
      </div>

      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <Label className="text-sm">Velocidade</Label>
          <span className="text-sm text-muted-foreground font-mono">
            {speed}ms
          </span>
        </div>
        <Slider
          value={[2010 - speed]}
          min={10}
          max={2000}
          step={10}
          onValueChange={([value]) => onSpeedChange(2010 - value)}
          disabled={disabled}
          className="w-full"
        />
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>Lento</span>
          <span>Rápido</span>
        </div>
      </div>
    </div>
  );
}

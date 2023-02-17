import {
  AppContainer,
  Button,
  CanvasContainer,
  Color,
  ColorPicker,
  ColorsGroup,
  GroupOptions,
  Label,
  Option,
  SliderRange,
  ToolBar,
  Wrapper,
} from "./styles/global";
import {
  BsSquare,
  BsCircle,
  BsTriangle,
  BsBrush,
  BsEraser,
} from "react-icons/bs";
import { useState, useRef, useEffect, useCallback, useMemo } from "react";

const shapesIcons = {
  rectangle: <BsSquare />,
  circle: <BsCircle />,
  triangle: <BsTriangle />,
};

const optionsIcons = {
  brush: <BsBrush />,
  eraser: <BsEraser />,
};

type Shape = keyof typeof shapesIcons;
type OptionType = keyof typeof optionsIcons;

type HandleFn = (ctx: CanvasRenderingContext2D, x0: number, y0: number) => void;

type Mouse = {
  x?: number;
  y?: number;
};

const colors = ["white", "black", "red", "green"];
const shapes: Shape[] = ["rectangle", "circle", "triangle"];
const options: OptionType[] = ["brush", "eraser"];

function App() {
  const [currentColor, setCurrentColor] = useState<string>("black");
  const [optionSelected, setOptionSelected] = useState<string>("brush");
  const [ctx, setCtx] = useState<CanvasRenderingContext2D | null>(null);
  const [prevDimensions, setPrevDimensions] = useState<Mouse>({});
  const [isDrawing, setIsDrawing] = useState<boolean>(false);
  const [snapshot, setSnapshot] = useState<ImageData | null>(null);
  const [currentSize, setCurrentSize] = useState<number>(2);
  const [isFilled, setIsFilled] = useState<boolean>(false);

  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!canvasRef.current) return;
    const canvas = canvasRef.current;
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
    setCtx(canvas.getContext("2d"));
  }, [canvasRef]);

  const drawLine = useCallback(
    (ctx: CanvasRenderingContext2D, x0: number, y0: number) => {
      ctx.lineTo(x0, y0);
      ctx.stroke();
    },
    []
  );

  const drawRectangle = useCallback(
    (ctx: CanvasRenderingContext2D, x0: number, y0: number) => {
      if (!prevDimensions.x || !prevDimensions.y) return;
      ctx.beginPath();
      if (isFilled) {
        ctx.fillRect(
          prevDimensions.x,
          prevDimensions.y,
          x0 - prevDimensions.x,
          y0 - prevDimensions.y
        );
      } else {
        ctx.rect(
          prevDimensions.x,
          prevDimensions.y,
          x0 - prevDimensions.x,
          y0 - prevDimensions.y
        );
      }
      ctx.stroke();
    },
    [prevDimensions, isFilled]
  );

  const drawCircle = useCallback(
    (ctx: CanvasRenderingContext2D, x0: number, y0: number) => {
      if (!prevDimensions.x || !prevDimensions.y) return;
      ctx.beginPath();
      ctx.arc(
        prevDimensions.x,
        prevDimensions.y,
        Math.sqrt(
          Math.pow(x0 - prevDimensions.x, 2) +
            Math.pow(y0 - prevDimensions.y, 2)
        ),
        0,
        2 * Math.PI
      );
      ctx.stroke();
    },
    [prevDimensions]
  );

  const drawTriangle = useCallback(
    (ctx: CanvasRenderingContext2D, x0: number, y0: number) => {
      if (!prevDimensions.x || !prevDimensions.y) return;
      ctx.beginPath();
      ctx.moveTo(prevDimensions.x, prevDimensions.y);
      ctx.lineTo(x0, y0);
      ctx.lineTo(prevDimensions.x * 2 - x0, y0);
      ctx.closePath();
      if (isFilled) {
        ctx.fill();
      } else {
        ctx.stroke();
      }
    },
    [prevDimensions, isFilled]
  );

  const handleClear = useCallback((ctx: CanvasRenderingContext2D | null) => {
    if (!ctx) return;
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
  }, []);

  const handleSaveToImage = useCallback(
    (ctx: CanvasRenderingContext2D | null) => {
      if (!ctx) return;
      const image = canvasRef.current?.toDataURL("image/png");
      const link = document.createElement("a");
      link.download = "image.png";
      if (image) {
        link.href = image;
      }
      link.click();
    },
    []
  );

  const handler: { [key: string]: HandleFn } = useMemo(() => {
    return {
      brush: drawLine,
      erase: drawLine,
      rectangle: drawRectangle,
      circle: drawCircle,
      triangle: drawTriangle,
    };
  }, [drawLine, drawRectangle, drawCircle, drawTriangle]);

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!ctx || !isDrawing) return;
      if (snapshot) {
        ctx.putImageData(snapshot, 0, 0);
      }
      ctx.strokeStyle = optionSelected === "eraser" ? "white" : currentColor;
      ctx.lineWidth = currentSize;
      handler[optionSelected]?.(ctx, e.offsetX, e.offsetY);
    },
    [
      ctx,
      currentColor,
      isDrawing,
      snapshot,
      currentSize,
      handler,
      optionSelected,
    ]
  );

  const handleMouseDown = useCallback(
    (e: MouseEvent) => {
      if (!ctx) return;

      ctx.beginPath();
      setIsDrawing(true);
      setPrevDimensions({ x: e.offsetX, y: e.offsetY });
      const snapshot = ctx.getImageData(
        0,
        0,
        canvasRef.current?.width || 500,
        canvasRef.current?.height || 500
      );
      setSnapshot(snapshot);
    },
    [ctx]
  );

  useEffect(() => {
    const canvas = canvasRef.current;
    canvas?.addEventListener("mousemove", handleMouseMove);

    return () => {
      canvas?.removeEventListener("mousemove", handleMouseMove);
    };
  }, [handleMouseMove]);

  useEffect(() => {
    const canvas = canvasRef.current;
    canvas?.addEventListener("mousedown", handleMouseDown);

    return () => {
      canvas?.removeEventListener("mousedown", handleMouseDown);
    };
  }, [handleMouseDown]);

  useEffect(() => {
    const handleMouseUp = () => {
      setIsDrawing(false);
    };

    canvasRef.current?.addEventListener("mouseup", handleMouseUp);
  }, []);

  return (
    <Wrapper>
      <AppContainer>
        <ToolBar>
          <Label>Shapes</Label>
          <GroupOptions>
            {shapes.map((shape: Shape) => (
              <Option
                key={shape}
                active={optionSelected === shape}
                onClick={() => setOptionSelected(shape)}
              >
                <>
                  {shapesIcons[shape]}
                  <span>{shape}</span>
                </>
              </Option>
            ))}
            <Option>
              <input
                type="checkbox"
                checked={isFilled}
                id="filled"
                onChange={(e) => setIsFilled(e.target.checked)}
              />
              <label htmlFor="filled">
                <span>Fill color</span>
              </label>
            </Option>
          </GroupOptions>

          <Label>Options</Label>
          <GroupOptions>
            {options.map((op) => (
              <Option
                key={op}
                active={optionSelected === op}
                onClick={() => setOptionSelected(op)}
              >
                {optionsIcons[op]}
                <span>{op}</span>
              </Option>
            ))}
          </GroupOptions>

          <SliderRange
            type={"range"}
            min={1}
            max={30}
            value={currentSize}
            onChange={(e) => setCurrentSize(Number(e.target.value))}
          />

          <ColorsGroup>
            {colors.map((color) => (
              <Color
                key={color}
                color={color}
                active={currentColor === color}
                onClick={() => setCurrentColor(color)}
              />
            ))}
            <ColorPicker
              type="color"
              onChange={(e) => setCurrentColor(e.target.value)}
              color={currentColor}
            />
          </ColorsGroup>

          <Button onClick={() => handleClear(ctx)}>Clear</Button>
          <Button onClick={() => handleSaveToImage(ctx)}>Save to image</Button>
        </ToolBar>
        <CanvasContainer>
          <canvas ref={canvasRef}></canvas>
        </CanvasContainer>
      </AppContainer>
    </Wrapper>
  );
}

export default App;

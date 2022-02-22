interface Position {
  x: number;
  y: number;
}

interface NativePosition {
  x: number;
  y: number;
}

interface DrawablePrimitives {
  vertices: NativePosition[];
  type: number;
  colorVector: Vec4;
  shape: string;
}

type Vec2 = [number, number];

type Vec3 = [number, number, number];

type Vec4 = [number, number, number, number];

export { Position, NativePosition, Vec2, Vec3, Vec4, DrawablePrimitives };

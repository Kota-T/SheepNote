class Canvas {
  cvs: HTMLCanvasElement
  ctx: CanvasRenderingContext2D

  constructor(cvs: HTMLCanvasElement | null, parent: HTMLElement, options: any){
    this.cvs = cvs || document.createElement('canvas');

    this.addChildTo(parent);

    this.width  = options?.width  || 0;
    this.height = options?.height || 0;

    this.style.position = "absolute";

    this.x = options?.x || 0;
    this.y = options?.y || 0;

    this.style.zIndex = options?.zIndex || 0;

    this.ctx = this.cvs.getContext('2d') as CanvasRenderingContext2D;
  }

  addChildTo(parent: HTMLElement): Canvas {
    parent.appendChild(this.cvs);
    return this;
  }

  get style(){
    return this.cvs.style;
  }

  get width(): number {
    return this.cvs.width;
  }

  set width(_width: number){
    this.cvs.width = _width;
  }

  get height(): number {
    return this.cvs.height;
  }

  set height(_height: number){
    this.cvs.height = _height;
  }

  get x(): number {
    return Number(this.cvs.style.left.slice(0, -2));
  }

  set x(_x: number){
    this.cvs.style.left = _x + "px";
  }

  get y(): number{
    return Number(this.cvs.style.top.slice(0, -2));
  }

  set y(_y: number){
    this.cvs.style.top = _y + "px";
  }
}

export class FrameCanvas extends Canvas {
  constructor(parent: HTMLElement){
    super(
      null,
      parent,
      {
        width  : Math.min(window.innerWidth * 0.8, 400) - 30,
        height : Math.min(window.innerWidth * 0.8, 400) - 30,
        x : 15,
        y : 15,
        zIndex: 300
      }
    );

    this.ctx.strokeStyle = "red";
    this.ctx.lineWidth = 1;

    this.ctx.strokeRect(0, 0, this.width, this.height);
  }
}

export class ImageCanvas extends Canvas {
  img: HTMLImageElement
  ratio: number = 0
  originalWidth: number = 0
  originalHeight: number = 0

  constructor(url: string, parent: HTMLElement, slider: HTMLInputElement){
    super(null, parent, null);
    const FRAME_SIZE = Math.min(window.innerWidth * 0.8, 400) - 30;
    this.img = new Image();
    this.img.src = url;
    this.img.onload = ()=>{
      this.ratio = this.img.naturalHeight / this.img.naturalWidth;
      if(this.img.naturalWidth < FRAME_SIZE || this.img.naturalHeight < FRAME_SIZE){
        slider.min = "0";
        if(this.ratio > 1){
          this.width  = FRAME_SIZE;
          this.height = FRAME_SIZE * this.ratio;
          slider.max = String(FRAME_SIZE);
        }else{
          this.width  = FRAME_SIZE / this.ratio;
          this.height = FRAME_SIZE;
          slider.max = String(FRAME_SIZE / this.ratio);
        }
      }else{
        this.width  = this.img.naturalWidth;
        this.height = this.img.naturalHeight;
        if(this.ratio > 1){
          slider.min = String(FRAME_SIZE - this.width);
        }else{
          slider.min = String((FRAME_SIZE - this.height) / this.ratio);
        }
        slider.max = String(-slider.min);
      }

      slider.oninput = ()=>this.resize(Number(slider.value));

      this.originalWidth  = this.width;
      this.originalHeight = this.height;
      this.x = (parent.clientWidth  - this.originalWidth)/2;
      this.y = (parent.clientHeight - this.originalHeight)/2;

      this.draw();

      parent.onpointerdown = outerE=>{
        const initXY = this.getPointerXYOnCvs(outerE);

        if(this.isOnCvs(initXY.x, initXY.y)){
          parent.onpointermove = innerE=>{
            innerE.preventDefault();
            innerE.stopPropagation();
            const currentXY = this.getPointerXYOnCvs(innerE);

            this.x += currentXY.x - initXY.x;
            this.y += currentXY.y - initXY.y;
          }
        }
      }
      const reset = ()=>{
        parent.onpointermove = null;
      }
      parent.onpointerup  = reset;
      parent.onpointerout = reset;
    }
  }

  isOnCvs(x: number, y: number): boolean {
    return (
      0 <= x && x <= this.width
                   &&
      0 <= y && y <= this.height
    );
  }

  getPointerXYOnCvs(event: PointerEvent): { x: number, y: number } {
    const cvs_rect = this.cvs.getBoundingClientRect();
    const x = event.clientX - cvs_rect.left;
    const y = event.clientY - cvs_rect.top;
    return Object.freeze({x: x, y: y});
  }

  draw(): void {
    this.ctx.drawImage(this.img, 0, 0, this.width, this.height);
  }

  resize(valueX: number): void {
    const valueY = valueX * this.ratio;
    const beforeWidth  = this.width;
    const beforeHeight = this.height;
    this.width  = this.originalWidth  + valueX;
    this.height = this.originalHeight + valueY;
    this.x -= (this.width  - beforeWidth ) / 2;
    this.y -= (this.height - beforeHeight) / 2;
    this.draw();
  }
}

export function trim(imgCvs: ImageCanvas, frameCvs: FrameCanvas): HTMLCanvasElement | undefined {
  //画像canvasの画像canvasの中の切り取る座標
  let imgTop, imgRight, imgBottom, imgLeft
  //フレームcanvasの中の描画する座標
  let frameTop, frameRight, frameBottom, frameLeft

  //画像canvasの左端とフレームの位置関係
  if(imgCvs.x < frameCvs.x){//画像canvasの左端がフレームの左にある時
    imgLeft = frameCvs.x - imgCvs.x
    frameLeft = 0
  }else if(imgCvs.x < frameCvs.x + frameCvs.width){//画像canvasの左端がフレームの中にある時
    imgLeft = 0
    frameLeft = imgCvs.x - frameCvs.x
  }else{//画像canvasの左端がフレームの右にある時
    alert("画像がフレームの外にあります。")
    return
  }

  //画像canvasの上端とフレームの位置関係
  if(imgCvs.y < frameCvs.y){//画像canvasの上端がフレームの上にある時
    imgTop = frameCvs.y - imgCvs.y
    frameTop = 0
  }else if(imgCvs.y < frameCvs.y + frameCvs.width){//画像canvasの上端がフレームの中にある時
    imgTop = 0
    frameTop = imgCvs.y - frameCvs.y
  }else{//画像canvasの上端がフレームの下にある時
    alert("画像がフレームの外にあります。")
    return
  }

  //画像canvasの右端とフレームの位置関係
  if(imgCvs.x + imgCvs.width < frameCvs.x){//画像canvasの右端がフレームの左にある時
    alert("画像がフレームの外にあります。")
    return
  }else if(imgCvs.x + imgCvs.width < frameCvs.x + frameCvs.width){//画像canvasの右端がフレームの中にある時
    imgRight = imgCvs.width
    frameRight = imgCvs.x + imgCvs.width - frameCvs.x
  }else{//画像canvasの右端がフレームの右にある時
    imgRight = imgCvs.width - (imgCvs.x + imgCvs.width - frameCvs.x - frameCvs.width)
    frameRight = frameCvs.width
  }

  //画像canvasの下端とフレームの位置関係
  if(imgCvs.y + imgCvs.height < frameCvs.y){//画像canvasの下端がフレームの上にある時
    alert("画像がフレームの外にあります。")
    return
  }else if(imgCvs.y + imgCvs.height < frameCvs.y + frameCvs.width){//画像canvasの下端がフレームの中にある時
    imgBottom = imgCvs.height
    frameBottom = imgCvs.y + imgCvs.height - frameCvs.y
  }else{//画像canvasの下端がフレームの下にある時
    imgBottom = imgCvs.height - (imgCvs.y + imgCvs.height - frameCvs.y - frameCvs.height)
    frameBottom = frameCvs.height
  }

  const resultCvs = document.createElement('canvas')
  resultCvs.width  = frameCvs.width
  resultCvs.height = frameCvs.height
  const resultCtx = resultCvs.getContext('2d')
  if(!resultCtx) return
  resultCtx.fillStyle = "white"
  resultCtx.fillRect(0, 0, resultCvs.width, resultCvs.height)
  resultCtx.drawImage(
    imgCvs.cvs,
    imgLeft,
    imgTop,
    imgRight - imgLeft,
    imgBottom - imgTop,
    frameLeft,
    frameTop,
    frameRight- frameLeft,
    frameBottom - frameTop
  )
  return resultCvs
}

import { defineComponent, h, onMounted, ref } from 'vue'

export const Canvas = defineComponent({
  props: {
    width: Number,
    height: Number,
    x: Number,
    y: Number
  },
  setup(props, { expose }){
    const canvas = ref<HTMLCanvasElement>()
    const ctx = ref<CanvasRenderingContext2D>()

    onMounted(()=>{
      ctx.value = (canvas.value!).getContext('2d')!
    })

    expose({ canvas, ctx })

    return () => h(
      'canvas',
      {
        width: props.width,
        height: props.height,
        style: {
          position: "absolute",
          left: props.x + 'px',
          top: props.y + 'px'
        },
        ref: canvas
      }
    )
  }
})

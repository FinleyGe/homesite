import { defineComponent, h, ref } from "vue";

export default defineComponent(
  (props, { slots }) => {
    const hover = ref(false);
    return () =>
      h(
        "span",
        {
          class: "relative w-min",
          onMouseover: () => (hover.value = true),
          onMouseleave: () => (hover.value = false),
        },
        [
          h("u", [slots.default?.()]),
          h(
            "span",
            {
              class:
                "absolute bg-pink-100 dark:bg-pink-800 rounded-md justify-center align-middle text-center w-max px-4 z-50",
              style: {
                display: hover.value ? "inline-flex" : "none",
                animation: "fadeIn 0.3s",
              },
            },
            [props.comment?.trim()]
          ),
        ]
      );
  },
  {
    props: {
      comment: {
        type: String,
        default: "",
      },
    },
  }
);

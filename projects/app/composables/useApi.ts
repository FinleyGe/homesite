import { toast } from "vue3-toastify";
import useStore from "~/stores";

export default () => $fetch.create({
  async onRequest({ options }) {
    const store = useStore();
    if (!store.token) {
      const router = useRouter();
      router.push("/admin/login");
    }
    options.headers = {
      ...options.headers,
      Authorization: `Bearer ${store.token}`
    }
  },
  onRequestError({ error }) {
    console.error(error);
    toast.error("Error: " + error.message)
  }
})

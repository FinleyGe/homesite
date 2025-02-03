import { toast } from "vue3-toastify";
import useStore from "~/stores";

type Props =
  | {
      auth?: boolean;
    }
  | undefined;

export default (props: Props = { auth: true }) =>
  $fetch.create({
    async onRequest({ options }) {
      if (!props?.auth) return;
      const store = useStore();
      if (!store.token) {
        const router = useRouter();
        toast.warn("Please login first");
        router.push("/admin/login");
      }
      options.headers.append("Authorization", `Bearer ${store.token}`);
    },
    onRequestError({ error }) {
      console.error(error);
      toast.error("Error: " + error.message);
    },
  });

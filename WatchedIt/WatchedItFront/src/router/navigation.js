import { useRouter } from "vue-router";

export function useNavigation() {
  const router = useRouter();

  const NavigateAuth = () =>
    router.push({ path: "/Auth", query: { mode: "login" } });

  const NavigateAuthSignUp = () =>
    router.push({ path: "/Auth", query: { mode: "signup" } });

  const NavigateHome = () => router.push("/");
  const NavigateFilms = () => router.push("/library/films");
  const NavigateSerials = () => router.push("/library/serials");
  const NavigateAnime = () => router.push("/library/anime");
  const NavigateCartoons = () => router.push("/library/cartoons");

  return {
    NavigateAuth,
    NavigateAuthSignUp,
    NavigateHome,
    NavigateFilms,
    NavigateSerials,
    NavigateAnime,
    NavigateCartoons,
  };
}

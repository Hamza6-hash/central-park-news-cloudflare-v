import Logo from '@/assets/logo.webp';

export const routes = {
  home: "/",
  articles: "/articles",
  blogs: "/blogs",
  contact: "/contact",
  news: "/news"
}

export const navbarLinks = [
  {
    imgURL: "",
    route: routes.home,
    label: "Home",
  },
  {
    imgURL: "",
    route: routes.news,
    label: "News",
  },
  {
    imgURL: Logo,
    route: routes.home,
    label: "logo",
  },
  // {
  //   imgURL: "",
  //   route: routes.articles,
  //   label: "Article",
  // },
  {
    imgURL: "",
    route: routes.contact,
    label: "Contact",
  },
];

export const defultImage = "/CN-Default.png";

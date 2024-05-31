import Logo from '@/assets/logo.png';

export const routes = {
  home: "/",
  articles: "/articles",
  blogs: "/blogs",
  contact: "/contact",
}

export const navbarLinks = [
  {
    imgURL: "",
    route: routes.home,
    label: "Home",
  },
  {
    imgURL: "",
    route: routes.articles,
    label: "Articles",
  },
  {
    imgURL: Logo,
    route: routes.home,
    label: "logo",
  },
  {
    imgURL: "",
    route: routes.blogs,
    label: "Blogs",
  },
  {
    imgURL: "",
    route: routes.contact,
    label: "Contact",
  },
];


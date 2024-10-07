declare type AppDownloadButton = {
  icon: any;
  subHeading: any;
  heading: any;
};

declare type SocialMedia = {
  icon: any;
  link: string;
};

declare type TopStories = {
  showViewMore?: boolean;
};

declare type DynamicBlog = {
  showWritter?: boolean;
  mainHeading: string;
  title: string;
  imageURL: string | StaticImport;
  authorName: string;
  publishDate: PublishDateType;
  content: string;
};

declare type BlogsCard = {
  showDateTimeInRow?: boolean;
};

type PublishDateType =
  | { seconds: number; nanoseconds: number } // Firestore timestamp
  | Date
  | string
  | null;

declare type HorizontalCard = {
  title: string;
  imageURL: string | StaticImport;
  authorName: string;
  publishDate: PublishDateType;
  content: string;
};

declare type VerticalCard = {
  title: string;
  imageURL: string | StaticImport;
  authorName: string;
  publishDate: PublishDateType;
  articleId: string;
};

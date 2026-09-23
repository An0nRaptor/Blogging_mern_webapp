import { Link } from "react-router-dom";
import { getDay } from "../common/date";
import { Avatar, AvatarImage, AvatarFallback } from "./ui/avatar";

const MinimalBlogPost = ({ blog, index }) => {
  let {title,blog_id: id,author: {personal_info: { fullName, username, profile_img }},publishedAt} = blog;

  return (
    <Link to={`/blog/${id}`} className="group flex gap-5 mb-6 rounded-lg -mx-2 px-2 py-2 transition-colors hover:bg-accent/40">
      <h1 className="blog-index">{index < 10 ? "0" + (index + 1) : index}</h1>
      <div>
        <div className="flex gap-2 items-center mb-4">
            <Avatar className="h-6 w-6">
              <AvatarImage src={profile_img} />
              <AvatarFallback className="text-xs">{fullName?.[0]}</AvatarFallback>
            </Avatar>
            <p className="line-clamp-1 text-sm text-muted-foreground">{fullName} @{username}</p>
            <p className="min-w-fit text-sm text-muted-foreground">{getDay(publishedAt)}</p>
        </div>
        <h1 className="blog-title group-hover:text-primary transition-colors">{title}</h1>
      </div>
    </Link>
  );
};

export default MinimalBlogPost;

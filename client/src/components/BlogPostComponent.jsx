import { getDay } from "../common/date";
import {Link} from "react-router-dom";
import { Heart } from "lucide-react";
import { Badge } from "./ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "./ui/avatar";

const BlogPostCard = ({ content, author }) => {
  let {
    publishedAt,
    tags,
    title,
    desc,
    banner,
    activity: { total_likes },
    blog_id: id,
  } = content;

  let { fullName, profile_img, username } = author;

  return (
    <Link to={`/blog/${id}`} className="group flex gap-6 items-center border-b border-border py-5 -mx-2 px-2 rounded-lg transition-colors hover:bg-accent/40">
      <div className="w-full">
        <div className="flex gap-2 items-center mb-4">
          <Avatar className="h-6 w-6">
            <AvatarImage src={profile_img} />
            <AvatarFallback className="text-xs">{fullName?.[0]}</AvatarFallback>
          </Avatar>
          <p className="line-clamp-1 text-sm text-muted-foreground">
            {fullName} @{username}
          </p>
          <p className="min-w-fit text-sm text-muted-foreground">{getDay(publishedAt)}</p>
        </div>
        <h1 className="blog-title group-hover:text-primary transition-colors">{title}</h1>
        <p className="my-3 text-xl font-gelasio leading-7 max-sm:hidden md:max-[110px]:hidden line-clamp-2 text-foreground/80">
          {desc}
        </p>
        <div className="flex gap-3 items-center mt-5">
          <Badge>{tags[0]}</Badge>
          <span className="flex items-center gap-1.5 text-muted-foreground text-sm">
            <Heart className="h-4 w-4" />
            {total_likes}
          </span>
        </div>
      </div>
      <div className="h-28 aspect-square rounded-lg overflow-hidden bg-secondary flex-none">
        <img src={banner} className="w-full h-full aspect-square object-cover"/>
      </div>
    </Link>
  );
};

export default BlogPostCard;

import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Divider,
  Image,
  Button,
} from "@heroui/react";

export default function PostCard({ post }) {
  return (
    <Card className="max-w-xl">
      <CardHeader className="flex gap-3">
        <Image
          alt="user avatar"
          radius="sm"
          src={post.user.photo}
          className="rounded-full"
          height={30}
          width={30}
        />
        <div className="flex flex-col">
          <p className="text-md">{post.user.name}</p>
          <p className="text-small text-default-500">{post.uploadedFrom}</p>
        </div>
      </CardHeader>
      <Divider />
      <CardBody className="flex flex-col gap-3 items-center justify-center">
        <p className="self-start">{post.body}</p>
        {post.image && (
          <Image
            alt="Card background"
            className="object-cover rounded-xl w-full mx-auto"
            src={post.image}
          />
        )}
      </CardBody>
      <Divider />
      <CardFooter className="flex items-center justify-around">
        <Button variant="light" className="flex w-full items-center gap-2">
          <i className="fa-regular fa-heart"></i> Love
        </Button>
        <Divider orientation="vertical" />
        <Button variant="light" className="flex w-full items-center gap-2">
          <i className="fa-regular fa-comment"></i> Comment
        </Button>
        <Divider orientation="vertical" />
        <Button variant="light" className="flex  w-full items-center gap-2">
          <i className="fa-solid fa-share"></i> Share
        </Button>
      </CardFooter>
    </Card>
  );
}
